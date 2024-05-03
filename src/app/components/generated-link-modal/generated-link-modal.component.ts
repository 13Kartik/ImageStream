import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

//icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-generated-link-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule,ClipboardModule],
  templateUrl: './generated-link-modal.component.html',
  styleUrl: './generated-link-modal.component.css',
})
export class GeneratedLinkModalComponent {
  @ViewChild('modalRef') modal!: TemplateRef<any>;
  
  generatedLink: string = '';
  showAlert = false;

  //icons
  copyIcon = faCopy;

  constructor(
    private clipboard: Clipboard,
  ){}

  copyLink() {
    this.clipboard.copy(this.generatedLink);

    //show Alert
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false; // Clear the message to hide the alert
    }, 3000);
  }
}
