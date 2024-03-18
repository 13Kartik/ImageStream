import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

//component
import { DynamicTextInputComponent } from '../dynamic-text-input/dynamic-text-input.component';

//icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-options-menu',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,FontAwesomeModule],
  templateUrl: './options-menu.component.html',
  styleUrls: ['./options-menu.component.css'],
})

export class OptionsMenuComponent implements AfterViewInit {
  @Input() options!:any;
  @Input() headerInputRef!:DynamicTextInputComponent;
  @Input() placeHolders!:string[];
  @Output() onOpacityChange:EventEmitter<number> = new EventEmitter;
  @Output() onAddTextBox:EventEmitter<void> = new EventEmitter;
  @Output() onPlaceHolderDrag:EventEmitter<object> = new EventEmitter;

  imageOpacity:number = 1;

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

  ngAfterViewInit(): void {
  }


  onDragStart(placeHolder:string){
    this.onPlaceHolderDrag.emit({
      placeHolder,
    });
  }

}
