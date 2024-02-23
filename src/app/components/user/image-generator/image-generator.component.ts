import { Component, ViewChild, inject, TemplateRef, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DynamicTextInputComponent } from '../../dynamic-text-input/dynamic-text-input.component';

import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';

//modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    NgbTooltipModule 
  ],
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.css'],
  providers:[Clipboard,DbServiceService]
})
export class ImageGeneratorComponent {

  @ViewChild('headerInputRef') headerInputRef!: DynamicTextInputComponent;
  @ViewChild('nameInputRef') nameInputRef!: DynamicTextInputComponent;
  @ViewChild('modalRef') modalRef!: TemplateRef<any>;

  constructor(private clipboard: Clipboard, private modalService: NgbModal,private db:DbServiceService) {}

  // img_src = "http://192.168.1.94:8032/api/DynamicImage";
  img_src!:string;

  generatedLink:string = "http://192.168.1.94:8032/api/DynamicImage";
  showAlert = false;
  copyIcon = faCopy;
  changeImgIcon= faRotate;
  uploadIcon = faCloudArrowUp;

  fonts=['Times New Roman','Georgia','Garamond','Arial','Verdana','Helvetica','Courier New','Lucida Console','Monaco','Brush Script MT','Lucida Handwriting','Copperplate','Papyrus'];

  options = new FormGroup({
    header: new FormControl('Hey'),
    name: new FormControl('Kartik'),
    description: new FormControl('Hello, I am Here!!!!'),
    img_height:new FormControl(600),
    img_width:new FormControl(800),
    img_opacity:new FormControl(1),
    headerFontSize: new FormControl(44),
    descriptionFontSize: new FormControl(32),
    headerFontWeight: new FormControl(700),
    descriptionFontWeight: new FormControl(700),
    headerFontColor: new FormControl('#3B71CA'),
    descriptionFontColor: new FormControl('#000000'),
    headerFontFamily: new FormControl('Courier New'),
    descriptionFontFamily: new FormControl('Courier New'),
  });

  get img_height(){
    return this.options.get('img_height')?.value;
  }
  get img_width(){
    return this.options.get('img_width')?.value;
  }
  get img_opacity(){
    return this.options.get('img_opacity')?.value ?? 1;
  }
  get descriptionFontSize(){
    return this.options.get('descriptionFontSize')?.value;
  }
  get header(){
    return this.options.get('header')?.value;
  }
  get name(){
    return this.options.get('name')?.value;
  }
  get description(){
    return this.options.get('description')?.value;
  }
  get headerFontFamily(){
    return this.options.get('headerFontFamily')?.value ?? 'Courier New';
  }
  get descriptionFontFamily(){
    return this.options.get('descriptionFontFamily')?.value ?? 'Courier New';
  }
  get headerFontSize(){
    return this.options.get('headerFontSize')?.value ?? 44;
  }
  get headerFontColor(){
    return this.options.get('headerFontColor')?.value ?? '#3B71CA';
  }
  get descriptionFontColor(){
    return this.options.get('descriptionFontColor')?.value;
  }

  get headerFontWeight(){
    return this.options.get('headerFontWeight')?.value ?? 700;
  }
  get descriptionFontWeight(){
    return this.options.get('descriptionFontWeight')?.value ?? 700;
  }

  onSubmit(){

  }

  resizeInput(){
    this.headerInputRef.resize();
    // this.nameInputRef.resize();
  }

  generateLink(){

    //upload Block
    const blockData={
      'File':this.img_src,
      'ImageId':'idk',
      'Header':this.header,
      'Description':this.description
    }

    console.log(blockData);

    this.db.uploadImageBlock(blockData).subscribe({
      'next':res=>{
        console.log(res);
      },
      'error':err=>{
        console.error(err);
      }
    });

    this.generatedLink = "http://192.168.1.94:8032/api/DynamicImage";
    this.generatedLink+='?name=Name';

    //open modal
		this.modalService.open(this.modalRef, { centered: true });
	}

  copyLink() {
    this.clipboard.copy(this.generatedLink);

    //show Alert
    this.showAlert=true;
    setTimeout(() => {
      this.showAlert = false; // Clear the message to hide the alert
    }, 3000);
  }

  uploadImage(event:any){
    const file = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append('file', file);
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        this.img_src=e.target.result;
      };
      reader.readAsDataURL(file);
    }
    // this.db.upload(formData).subscribe({
    //   next:(res:any)=>{
    //     console.log('successfully uploaded image');
    //     console.log(res);
    //   },
    //   error:(error:any)=>{
    //     console.error(error);
    //   }
    // });
  }

  adjustTextareaHeight(event: any): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
  }

}
