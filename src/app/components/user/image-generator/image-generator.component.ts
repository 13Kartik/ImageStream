import {
  Component,
  ViewChild,
  TemplateRef,
  ElementRef,
  Renderer2,
  ViewContainerRef,
  EventEmitter,
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
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { TextBoxComponent } from '../../text-box/text-box.component';

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

  @ViewChild('textBoxContainer', { read: ViewContainerRef })
  textBoxContainer!: ViewContainerRef;

  @ViewChild('imgContainer') imgContainer!: ElementRef;
  @ViewChild('headerTextarea') headerTextarea!: ElementRef;

  constructor(
    private clipboard: Clipboard,
    private modalService: NgbModal,
    private db: DbServiceService,
    private el: ElementRef
  ) {
    this.addTextBox();
  }

  //icons
  copyIcon = faCopy;
  changeImgIcon = faRotate;
  uploadIcon = faCloudArrowUp;

  img_src!: string;
  img_file: File | null = null;
  imageId!: string;
  real_height!: number;
  real_width!: number;

  generatedLink: string = 'http://192.168.1.94:8032/api/DynamicImage';
  showAlert = false;
  portrait = false;
  aspectRatio = 4 / 3;

  //coordinates

  //modal
  private setImageModalRef!: NgbModalRef;

  //dynamic Form Group
  activeFontProperties: FormGroup = new FormGroup({});
  imageOpacity: number = 1;
  fontProperties: FormGroup[] = [];

  addTextBox() {
    const textBox = new FormGroup({
      text: new FormControl('Enter text'),
      fontSize: new FormControl(36),
      fontColor: new FormControl('#3B71CA'),
      fontFamily: new FormControl('Courier New'),
      textAlignment: new FormControl('left'),
    });

    // Push a new object into the array
    this.fontProperties.push(textBox);
  }

  blockData = new FormData();

  changeTextBox(i: number) {
    this.activeFontProperties = this.fontProperties[i];
  }

  onSubmit() {
    this.generateLink();
  }

  convertProperties(x: number, y: number, height: number, width: number) {
    const imgContainerReact = this.el.nativeElement
      .querySelector('.img-container')
      .getBoundingClientRect();

    const scaleHeight = this.real_height / imgContainerReact.height;
    const scaleWidth = this.real_width / imgContainerReact.width;

    const newX = (x - imgContainerReact.x) * scaleWidth;
    const newY = (y - imgContainerReact.y) * scaleHeight;
    const newHeight = height * scaleHeight;
    const newWidth = width * scaleWidth;

    return [newX, newY, newHeight, newWidth];
  }

  async generateLink() {
    if (this.img_file !== null) {
      console.log('uploading file');

      const fileData = new FormData();
      fileData.append('file', this.img_file);

      const uploadImageResponse: any = await firstValueFrom(
        this.db.uploadImage(fileData)
      );
      this.imageId = uploadImageResponse.imageId;
    }

    this.generatedLink = this.db.api;
    this.generatedLink += 'SPStaticImage/fetch/';

    //create req Data:
    const textBoxes = [];
    for (const [i, properties] of this.fontProperties.entries()) {
      const textBox = this.el.nativeElement
        .querySelector(`#textBox_${i} textarea`)
        ?.getBoundingClientRect();
      const [x, y, height, width] = this.convertProperties(
        textBox.x,
        textBox.y,
        textBox.height,
        textBox.width
      );
      textBoxes.push({
        x,
        y,
        height,
        width,
        ...properties.value,
      });
    }

    //converting fontSize to px for all boxes
    let scale:number=this.real_width / window.innerWidth;

    // if(this.portrait) scale = (this.real_height+this.real_width) / (window.innerHeight+window.innerWidth);

    for (let box of textBoxes) {
      box.fontSize = box.fontSize * scale;
    }

    const blockData = {
      createdBy: 'bd2dba6f-c8b8-48c9-bdf0-d793c128e338',
      imageId: this.imageId,
      generationName: 'testGenerations',
      imageProperty: {
        backgroundImageOpacity: this.imageOpacity * 100,
        textBoxes: textBoxes,
      },
    };

    console.log(blockData);

    const uploadImageBlockResponse = await firstValueFrom(
      this.db.uploadImageBlock(blockData)
    );
    console.log(uploadImageBlockResponse);
    this.generatedLink += uploadImageBlockResponse.generationId;

    // open modal
    this.modalService.open(this.generatedLinkModal, { centered: true });
  }

  copyLink() {
    this.clipboard.copy(this.generatedLink);

    //show Alert
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false; // Clear the message to hide the alert
    }, 3000);
  }

  openSetImageModal() {
    //open modal
    this.setImageModalRef = this.modalService.open(
      this.appSelectImageRef.setImageModal,
      { centered: true, size: 'xl' }
    );
  }

  handleImageUrl(image: { imageId?: string; url: string; file?: File }) {
    if (image.file) this.img_file = image.file;
    else if (image.imageId) this.imageId = image.imageId;

    // Get the dimensions using an Image element
    const img = new Image();
    img.src = image.url;
    this.img_src = image.url;
    this.setImageModalRef.close();

    // After the image has loaded, you can access its width and height
    img.onload = () => {
      this.real_height = img.height;
      this.real_width = img.width;
      this.portrait = img.height > img.width;
      this.aspectRatio = img.width / img.height;
    };
  }

  setOpacity(opacity: number) {
    this.imageOpacity = opacity;
  }

  deleteTextBox(i:number){
    console.log('I am working');
    this.activeFontProperties = new FormGroup({});
    this.fontProperties.splice(i,1);
  }
}
