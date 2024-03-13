import {
  Component,
  ViewChild,
  TemplateRef,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';

//components
import { DynamicTextInputComponent } from '../../dynamic-text-input/dynamic-text-input.component';
import { SelectImageComponent } from '../../select-image/select-image.component';
import { OptionsMenuComponent } from '../../options-menu/options-menu.component';

//modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';

//icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faRotate } from '@fortawesome/free-solid-svg-icons';

//Alert
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

//database
import { RouterModule } from '@angular/router';
import { DbServiceService } from '../../../services/db-service.service';
import { HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

//tooltip
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

//drag and drop
import { TextBoxComponent } from '../../text-box/text-box.component';

//test
import { GeneratedLinkModalComponent } from '../../generated-link-modal/generated-link-modal.component';

@Component({
  selector: 'app-image-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicTextInputComponent,
    ClipboardModule,
    FontAwesomeModule,
    NgbAlertModule,
    RouterModule,
    HttpClientModule,
    NgbTooltipModule,
    SelectImageComponent,
    OptionsMenuComponent,
    TextBoxComponent,
    GeneratedLinkModalComponent
  ],
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.css'],
  providers: [Clipboard, DbServiceService],
})
export class ImageGeneratorComponent {
  @ViewChild('headerInputRef') headerInputRef!: DynamicTextInputComponent;
  @ViewChild('nameInputRef') nameInputRef!: DynamicTextInputComponent;
  @ViewChild('appSelectImageRef') appSelectImageRef!: SelectImageComponent;
  @ViewChild('generatedLinkModal') generatedLinkModal!: TemplateRef<any>;
  @ViewChild('generatedLinkModalRef') generatedLinkModalRef!: GeneratedLinkModalComponent;
  @ViewChild('imgContainer') imgContainer!: ElementRef;
  @ViewChild('headerTextarea') headerTextarea!: ElementRef;

  constructor(
    private clipboard: Clipboard,
    private modalService: NgbModal,
    private db: DbServiceService,
    private el: ElementRef
  ) {}

  //icons
  copyIcon = faCopy;
  changeImgIcon = faRotate;
  uploadIcon = faCloudArrowUp;

  //background Image
  img_src!: string;
  img_file: File | null = null;
  imageId!: string;
  real_height!: number;
  real_width!: number;
  aspectRatio:number = 4/3;

  //Generated Link modal
  generatedLink: string = 'http://192.168.1.94:8032/api/DynamicImage';
  showAlert = false;

  //modal
  private selectImageModalRef!: NgbModalRef;

  //Dynamic TextBoxes
  textBoxes: FormGroup[] = [];
  activeTextBox: FormGroup = new FormGroup({});

  imageOpacity: number = 1;

  addTextBox() {
    const textBox = new FormGroup({
      text: new FormControl('Enter text'),
      fontSize: new FormControl(34),
      fontColor: new FormControl('#3B71CA'),
      fontFamily: new FormControl('Courier New'),
      textAlignment: new FormControl('left'),
    });

    // Push a new object into the array
    this.textBoxes.push(textBox);
  }

  
  changeTextBox(i: number) {
    this.activeTextBox = this.textBoxes[i];
  }
  
  onSubmit() {
    this.generateLink();
  }

  //Converting coordinates relative to screen to coordinated relative to Image
  convertProperties(x: number, y: number, height: number, width: number) {
    const imgContainerReact = this.el.nativeElement
      .querySelector('.img-container')
      .getBoundingClientRect();
      
      const scaleHeight = this.real_height / imgContainerReact.height;
      const scaleWidth = this.real_width / imgContainerReact.width;
      
      const newX = (x - imgContainerReact.x) * scaleWidth;
      const newY = (y - imgContainerReact.y) * scaleHeight;
      const newHeight = height * scaleHeight;
      const newWidth = width * scaleWidth*1.04;

    return [newX, newY, newHeight, newWidth];
  }
  
  async generateLink() {
    if (this.img_file !== null) {
      const fileData = new FormData();
      fileData.append('file', this.img_file);

      const uploadImageResponse: any = await firstValueFrom(
        this.db.uploadImage(fileData)
      );
      this.imageId = uploadImageResponse.imageId;
    }

    this.generatedLink = this.db.api;
    this.generatedLink += 'DynamicImage/fetch/';
    
    //create req Data:
    const textBoxesData = [];
    for (const [i, properties] of this.textBoxes.entries()) {
      const textBoxRef = this.el.nativeElement
        .querySelector(`#textBox_${i} textarea`)
        ?.getBoundingClientRect();
      const [x, y, height, width] = this.convertProperties(
        textBoxRef.x,
        textBoxRef.y,
        textBoxRef.height,
        textBoxRef.width
        );
        textBoxesData.push({
        x,
        y,
        height,
        width,
        ...properties.value,
      });
    }
    
    //scaling fontSize for original Image resolution
    let containerWidth = this.imgContainer.nativeElement.getBoundingClientRect().width;
    let scale:number=this.real_width / containerWidth;
    for (const textBox of textBoxesData) {
      textBox.fontSize = textBox.fontSize * scale * 3/4.15;
    }
    
    const blockData = {
      createdBy: 'bd2dba6f-c8b8-48c9-bdf0-d793c128e338',
      imageId: this.imageId,
      generationName: 'testGenerations',
      imageProperty: {
        backgroundImageOpacity: this.imageOpacity * 100,
        textBoxes: textBoxesData,
      },
    };
    
    console.log(blockData);
    
    const uploadImageBlockResponse = await firstValueFrom(
      this.db.uploadImageBlock(blockData)
    );

    console.log(uploadImageBlockResponse);

    // open modal to Display and access generated Link
    this.generatedLinkModalRef.generatedLink = uploadImageBlockResponse.path;
    this.modalService.open(this.generatedLinkModalRef.modal, { centered: true });
  }

  openSelectImageModal() {
    //open modal
    this.selectImageModalRef = this.modalService.open(
      this.appSelectImageRef.selectImageModal,
      { centered: true, size: 'xl' }
    );
    this.appSelectImageRef.getImageList();
  }

  handleImageUrl(image: { imageId?: string; url: string; file?: File }) {

    //clearing textBoxes of previous image
    this.textBoxes=[];

    //handling 2 cases
    //case 1: Local Image
    //case 2: Database Image
    if (image.file) this.img_file = image.file;             //case 1
    else if (image.imageId) this.imageId = image.imageId;   //case 2

    // Get the dimensions using an Image element
    const img = new Image();
    img.src = image.url;
    this.img_src = image.url;
    this.selectImageModalRef.close();

    //getting original height and width of Image
    img.onload = () => {
      this.real_height = img.height;
      this.real_width = img.width;
      this.aspectRatio = img.width / img.height;
    };

    //adding defalult textBox
    this.addTextBox();
  }

  setOpacity(opacity: number) {
    this.imageOpacity = opacity;
  }

  deleteTextBox(i:number){
    this.activeTextBox = new FormGroup({});
    this.textBoxes.splice(i,1);
  }
}