import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';

//components
import { DynamicTextInputComponent } from '../../dynamic-text-input/dynamic-text-input.component';
import { SelectImageComponent } from '../../select-image/select-image.component';


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

//tooltip
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-image-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTextInputComponent,
    ReactiveFormsModule,
    ClipboardModule,
    FontAwesomeModule,
    NgbAlertModule,
    RouterModule,
    HttpClientModule,
    NgbTooltipModule,
    SelectImageComponent,
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
 

  constructor(
    private clipboard: Clipboard,
    private modalService: NgbModal,
    private db: DbServiceService
  ) {}

  // img_src = "http://192.168.1.94:8032/api/DynamicImage";
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
    img_height: new FormControl(600),
    img_width: new FormControl(800),
    img_opacity: new FormControl(1),
    headerFontSize: new FormControl(44),
    descriptionFontSize: new FormControl(32),
    headerFontWeight: new FormControl(700),
    descriptionFontWeight: new FormControl(700),
    headerFontColor: new FormControl('#3B71CA'),
    descriptionFontColor: new FormControl('#000000'),
    headerFontFamily: new FormControl('Courier New'),
    descriptionFontFamily: new FormControl('Courier New'),
  });

  blockData = new FormData();

  get img_height() {
    return this.options.get('img_height')?.value;
  }
  get img_width() {
    return this.options.get('img_width')?.value;
  }
  get img_opacity() {
    return this.options.get('img_opacity')?.value ?? 1;
  }
  get descriptionFontSize() {
    return this.options.get('descriptionFontSize')?.value;
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
    return this.options.get('headerFontSize')?.value ?? 44;
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

  onSubmit() {}

  async generateLink() {

    if(this.img_file!==null){
      console.log('uploading file');

      const fileData = new FormData();
      fileData.append('file',this.img_file);

      const uploadImageResponse: any = await this.db.uploadImage(fileData).toPromise();
      this.imageId = uploadImageResponse.imageId;
      console.log(this.imageId);
    }

    this.generatedLink = 'http://192.168.1.94:8032/api/NewStaticImages';

    //test
    this.modalService.open(this.generatedLinkModal, { centered: true });

    //upload Block
    this.blockData.append('Header', this.header);
    this.blockData.append('Description', this.description);

    this.db.uploadImageBlock(this.imageId,'9e051ee3-4858-428d-a98b-d5baad632110',{
      header:this.header,
      description:this.description,
      fontFamily:this.descriptionFontFamily,
      fontSize:this.descriptionFontSize,
      opacity:this.img_opacity,
      fontColor:'blue'
    }).subscribe({
      next: (res) => {
        this.generatedLink += '?' + res.imageId;
        //open modal
        this.modalService.open(this.generatedLinkModal, { centered: true });
      },
      error: (err) => {
        console.error(err);
      },
    });
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
    this.img_src=image.url;
    this.setImageModalRef.close();

    // After the image has loaded, you can access its width and height
    img.onload = () => {
      this.portrait = img.height > img.width ? true : false;
      this.aspectRatio = img.width / img.height;
    };
  }
}
