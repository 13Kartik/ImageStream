import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
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
export class TextBoxComponent implements AfterViewInit {

  @Input() fontControls!: any;
  @Input() aspectRatio!: number;
  @Output() onDelete:EventEmitter<void>=new EventEmitter;

  @ViewChild('textBox') textBox!: ElementRef;

  someNativeElement: any;
  isActive:boolean = false;

  handleIcon = faArrowsUpDownLeftRight;

  constructor(
    private el: ElementRef
  ) {
  }

  ngAfterViewInit(): void {
    this.fontControls['fontSize'].valueChanges.subscribe(() => {
      this.resizeTextarea();
    });
  }

  //width
  maxWidth:string='100%';
  getMaxWidth(){
    const textBox_left = this.el.nativeElement.
    querySelector(`textarea`)
    ?.getBoundingClientRect().left;

    const imgContainer_right = document
    .querySelector('.img-container')
    ?.getBoundingClientRect().right ?? 1200;

    this.maxWidth= (imgContainer_right - textBox_left)+'px';
  }

  //height
  maxHeight:string='100%';
  getMaxHeight(){
    const textBox_top = this.el.nativeElement.
    querySelector(`textarea`)
    ?.getBoundingClientRect().top;

    const imgContainer_bottom = document
    .querySelector('.img-container')
    ?.getBoundingClientRect().bottom ?? 1200;

    this.maxHeight = (imgContainer_bottom - textBox_top)+'px';
  }

  get text() {
    return this.fontControls['text']?.value ?? '';
  }

  get fontSize() {
    // //resize textarea
    // const textarea = this.textBox?.nativeElement;
    // if(textarea){
    //   textarea.style.height = 'auto';
    //   textarea.style.height = textarea.scrollHeight + 'px';
    // }
    return (this.fontControls['fontSize']?.value ?? 36);
  }

  get fontFamily() {
    return this.fontControls['fontFamily']?.value ?? 'Courier New';
  }

  get fontColor() {
    return this.fontControls['fontColor']?.value ?? '#3B71CA';
  }
  get textAlignment() {
    return this.fontControls['textAlignment']?.value ?? 'left';
  }

  adjustTextareaHeight(event: any): void {
    this.getMaxHeight();
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Delete' && this.isActive) {
      this.onDelete.emit();
    }
  }

  resizeTextarea(): void {
    this.getMaxHeight();
    const textarea = this.textBox?.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }


}
