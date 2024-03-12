import { Component, ViewChild, TemplateRef, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';

//component
import { DynamicTextInputComponent } from '../dynamic-text-input/dynamic-text-input.component';

@Component({
  selector: 'app-options-menu',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './options-menu.component.html',
  styleUrls: ['./options-menu.component.css'],
})

export class OptionsMenuComponent implements AfterViewInit {
  @Input() options!:any;
  @Input() headerInputRef!:DynamicTextInputComponent;
  @Output() onOpacityChange:EventEmitter<number> = new EventEmitter;
  @Output() onAddTextBox:EventEmitter<void> = new EventEmitter;

  imageOpacity:number = 1;

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

  constructor(){
  
  }

  ngAfterViewInit(): void {
  }

}
