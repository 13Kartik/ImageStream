import { Component, ViewChild, inject, TemplateRef, OnDestroy } from '@angular/core';
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

//Alert
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

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
    NgbAlertModule
  ],
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.css'],
  providers:[Clipboard]
})
export class ImageGeneratorComponent {

  @ViewChild('headerInputRef') headerInputRef!: DynamicTextInputComponent;
  @ViewChild('nameInputRef') nameInputRef!: DynamicTextInputComponent;
  @ViewChild('modalRef') modalRef!: TemplateRef<any>;

  constructor(private clipboard: Clipboard, private modalService: NgbModal) {}

  img_url = "http://192.168.1.94:8032/api/DynamicImage";
  generatedLink:string = "http://192.168.1.94:8032/api/DynamicImage";
  copyIcon = faCopy;
  showAlert = false;

  options = new FormGroup({
    img_height:new FormControl(600),
    img_width:new FormControl(800),
    header: new FormControl('Hey'),
    name: new FormControl('Kartik'),
    description: new FormControl('Hello, I am Here!!!!'),
    fontFamily: new FormControl('monospace'),
    headerFontSize: new FormControl(44),
    descriptionFontSize: new FormControl(32)
  });

  get img_height(){
    return this.options.get('img_height')?.value;
  }
  get img_width(){
    return this.options.get('img_width')?.value;
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
  get fontFamily(){
    return this.options.get('fontFamily')?.value;
  }
  get headerFontSize(){
    return this.options.get('headerFontSize')?.value;
  }

  onSubmit(){

  }

  resizeInput(){
    this.headerInputRef.resize();
    this.nameInputRef.resize();
  }

  generateLink(){

    this.generatedLink = this.img_url;
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
}
