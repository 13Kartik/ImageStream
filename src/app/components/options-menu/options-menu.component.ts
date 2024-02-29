import { Component, ViewChild, TemplateRef, Input, Output } from '@angular/core';
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

export class OptionsMenuComponent {
  @Input() options!:any;
  @Input() headerInputRef!:DynamicTextInputComponent;

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

  constructor(){}

  onSubmit() {}

}
