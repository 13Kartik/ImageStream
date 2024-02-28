import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

// fontawesome import
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import {ClipboardModule, Clipboard} from '@angular/cdk/clipboard'

@Component({
  selector: 'app-image-block-list',
  standalone: true,
  imports: [NavbarComponent, FontAwesomeModule, ClipboardModule],
  templateUrl: './image-block-list.component.html',
  styleUrl: './image-block-list.component.css'
})
export class ImageBlockListComponent {
  // Variable declaration
  copyImageLink = faCopy;

  constructor(private clipboard: Clipboard) {}
  
  copyImageSrc(){
    console.log("copied!!!");
    this.clipboard.copy("Image Link is copied!!!");
  }
}
