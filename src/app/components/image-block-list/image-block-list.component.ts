import { Component, TemplateRef, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';

// fontawesome import
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import {ClipboardModule, Clipboard} from '@angular/cdk/clipboard'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-image-block-list',
  standalone: true,
  imports: [NavbarComponent, FontAwesomeModule, ClipboardModule, RouterModule],
  templateUrl: './image-block-list.component.html',
  styleUrl: './image-block-list.component.css'
})
export class ImageBlockListComponent {

  // injecting NgbModel
  private modalService = inject(NgbModal);
  
  // Variable declaration
  copyImageLink = faCopy;

  constructor(private clipboard: Clipboard) {}
  
  copyImageSrc(){
    console.log("copied!!!");
    this.clipboard.copy("Image Link is copied!!!");
  }

  // Fucntion for model opening
  openVerticallyCentered(content: TemplateRef<any>) {
		this.modalService.open(content, { centered: true });
	}
}
