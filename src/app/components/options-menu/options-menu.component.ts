import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

//icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

//components
import { TextBoxComponent } from '../text-box/text-box.component';

@Component({
  selector: 'app-options-menu',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,FontAwesomeModule],
  templateUrl: './options-menu.component.html',
  styleUrls: ['./options-menu.component.css'],
})

export class OptionsMenuComponent  {
  @Input() options!:any;
  @Input() placeHolders!:string[];
  @Input() imageOpacity:number = 1;
  @Input() imageBlockName!:string;

  @Output() onOpacityChange:EventEmitter<number> = new EventEmitter;
  @Output() onNameChange:EventEmitter<string> = new EventEmitter;
  @Output() onAddTextBox:EventEmitter<void> = new EventEmitter;
  @Output() onPlaceHolderDrag:EventEmitter<object> = new EventEmitter;

  //dropDown
  showImageOptions:boolean=true;
  showFontProperties:boolean=true;
  showPlaceHolders:boolean=false;

  //icons
  dropUpIcon = faCaretUp;
  dropDownIcon = faCaretDown;

  fonts = [
    "Times New Roman",
    "Georgia",
    "Arial",
    "Verdana",
    "Courier New",
    "Monaco",
    "Brush Script MT",
    "Lucida Handwriting",
    "Papyrus",
  ];

  constructor(){}

  onDragStart(placeHolder:string){
    this.onPlaceHolderDrag.emit({
      placeHolder,
    });
  }

}
