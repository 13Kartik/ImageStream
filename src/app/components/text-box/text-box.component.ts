import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

//drag and drop
import {CdkDrag,CdkDragHandle} from '@angular/cdk/drag-drop';

//icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowsUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-text-box',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,CdkDrag,CdkDragHandle,FontAwesomeModule],
  templateUrl: './text-box.component.html',
  styleUrl: './text-box.component.css'
})
export class TextBoxComponent {

  @Input() fontControls!: any;
  @Input() imgContainerHeight!: number;
  @Output() onBlur:EventEmitter<void>=new EventEmitter;

  someNativeElement: any;
  isActive:boolean = false;

  handleIcon = faArrowsUpDownLeftRight;

  get text() {
    return this.fontControls['text']?.value ?? '';
  }

  get fontSize() {
    return (this.fontControls['fontSize']?.value ?? 7)*this.imgContainerHeight/100;
  }

  get fontFamily() {
    return this.fontControls['fontFamily']?.value ?? 'Courier New';
  }

  get fontColor() {
    return this.fontControls['fontColor']?.value ?? '#3B71CA';
  }

  adjustTextareaHeight(event: any): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  disableOptions(){
    this.isActive=false;
    // this.onBlur.emit();
  }

}
