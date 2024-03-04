import { Component, ViewChild, TemplateRef, ElementRef, AfterViewChecked, AfterContentInit, AfterContentChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';

//components
import { DynamicTextInputComponent } from '../../dynamic-text-input/dynamic-text-input.component';
import { SelectImageComponent } from '../../select-image/select-image.component';
import { OptionsMenuComponent } from '../../options-menu/options-menu.component';

//modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Clipboard,ClipboardModule } from '@angular/cdk/clipboard';

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
    OptionsMenuComponent
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
  @ViewChild('imgContainer') imgContainer!: ElementRef;
  @ViewChild('headerTextarea') headerTextarea!: ElementRef;
 
  constructor(
    private clipboard: Clipboard,
    private modalService: NgbModal,
    private db: DbServiceService,
    private el: ElementRef
  ) {}

  img_src!: string;
  img_file: File | null = null;
  imageId!:string;

  generatedLink: string = 'http://192.168.1.94:8032/api/DynamicImage';
  showAlert = false;
  copyIcon = faCopy;
  changeImgIcon = faRotate;
  uploadIcon = faCloudArrowUp;
  portrait = false;
  aspectRatio = 4 / 3;

  //coordinates

  //modal
  private setImageModalRef!: NgbModalRef;

  fonts = [
    'Times New Roman',
    'Georgia',
    'Garamond',
    'Arial',
    'Verdana',
    'Helvetica',
    'Courier New',
    'Lucida Console',
    'Monaco',
    'Brush Script MT',
    'Lucida Handwriting',
    'Copperplate',
    'Papyrus',
  ];

  options = new FormGroup({
    header: new FormControl('Hey'),
    name: new FormControl('Kartik'),
    description: new FormControl('Hello, I am Here!!!!'),
    img_opacity: new FormControl(1),
    headerFontSize: new FormControl(8),
    descriptionFontSize: new FormControl(4),
    headerFontWeight: new FormControl(100),
    descriptionFontWeight: new FormControl(100),
    headerFontColor: new FormControl('#3B71CA'),
    descriptionFontColor: new FormControl('#000000'),
    headerFontFamily: new FormControl('Courier New'),
    descriptionFontFamily: new FormControl('Courier New'),
  });

  blockData = new FormData();

  get img_opacity() {
    return this.options.get('img_opacity')?.value ?? 1;
  }
  get descriptionFontSize() {
    const height = this.el.nativeElement.querySelector('.img-container').getBoundingClientRect().height;
    return (this.options.get('descriptionFontSize')?.value ?? 7)*height/100;
  }
  get header() {
    return this.options.get('header')?.value ?? '';
  }
  get name() {
    return this.options.get('name')?.value;
  }
  get description() {
    return this.options.get('description')?.value ?? '';
  }
  get headerFontFamily() {
    return this.options.get('headerFontFamily')?.value ?? 'Courier New';
  }
  get descriptionFontFamily() {
    return this.options.get('descriptionFontFamily')?.value ?? 'Courier New';
  }
  get headerFontSize() {
    const height = this.el.nativeElement.querySelector('.img-container').getBoundingClientRect().height;
    return (this.options.get('headerFontSize')?.value ?? 10)*height/100;
  }
  get headerFontColor() {
    return this.options.get('headerFontColor')?.value ?? '#3B71CA';
  }
  get descriptionFontColor() {
    return this.options.get('descriptionFontColor')?.value;
  }
  get headerFontWeight() {
    return this.options.get('headerFontWeight')?.value ?? 700;
  }
  get descriptionFontWeight() {
    return this.options.get('descriptionFontWeight')?.value ?? 700;
  }

  onSubmit() {
    //coordinates
    const imgContainer = this.el.nativeElement.querySelector('.img-container').getBoundingClientRect();
    const headerTextarea = this.el.nativeElement.querySelector('.descriptionTextarea').getBoundingClientRect();
    const x = headerTextarea.x-imgContainer.x;
    const y = headerTextarea.y-imgContainer.y;
    console.log(headerTextarea);
    // this.generateLink();
  }

  getCoordinates(){

  }

  async generateLink() {
    if(this.img_file!==null){
      console.log('uploading file');

      const fileData = new FormData();
      fileData.append('file',this.img_file);

      const uploadImageResponse: any = await firstValueFrom(this.db.uploadImage(fileData));
      this.imageId = uploadImageResponse.imageId;
      console.log(this.imageId);
    }

    this.generatedLink = 'http://192.168.1.5:8033/api/SPStaticImage/fetch/';

    //upload Block
    // this.blockData.append('Header', this.header);
    // this.blockData.append('Description', this.description);

    const blockData = {
      userId:'9e051ee3-4858-428d-a98b-d5baad632110',
      imageId:this.imageId,
      'generationName':'testGenerations',
      'imageProperty':{...this.options.value,backgroundImageOpacity: this.img_opacity*100}
    }
    delete blockData.imageProperty.img_opacity

    const uploadImageBlockResponse = await firstValueFrom(this.db.uploadImageBlock(blockData));
    console.log(uploadImageBlockResponse);
    this.generatedLink += uploadImageBlockResponse.generationId;

    //open modal
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

  adjustTextareaHeight(event: any): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  openSetImageModal() {
    //open modal
    this.setImageModalRef=this.modalService.open(this.appSelectImageRef.setImageModal, { centered: true, size: 'xl' });
  }

  handleImageUrl(image: {url:string,file?:File}) {
    if(image.file) this.img_file = image.file;

    // Get the dimensions using an Image element
    const img = new Image();
    img.src = image.url;
    this.img_src = image.url;
    this.setImageModalRef.close();

    // After the image has loaded, you can access its width and height
    img.onload = () => {
        this.portrait = img.height > img.width;
        this.aspectRatio = img.width / img.height;
    };
  }

  //drag and drop
  headerX:number=0;
  headerY:number=44;

  initialMouseX!:number;
  initialMouseY!:number;
  ondragStart(event:any){
    this.initialMouseX=event.pageX;
    this.initialMouseY=event.pageY;
  }

  onDragover(event:any){
    event.preventDefault(true);
  }

  onDrop(event:any){
    event.preventDefault(true);
  }

  onDragend(event:any){
    // Set the new position of the element
    console.log(event);

    const deltaX = (event.pageX-this.initialMouseX);
    const deltaY = (event.pageY-this.initialMouseY);
    this.headerX+=deltaX;
    this.headerY+=deltaY;
  }

  

}
