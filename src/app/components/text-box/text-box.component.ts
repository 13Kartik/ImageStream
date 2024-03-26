import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
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
  @Output() onDelete:EventEmitter<void>=new EventEmitter;
  @Output() onPlaceHolderDrop:EventEmitter<void>=new EventEmitter;

  @ViewChild('textBox') textBox!: ElementRef;

  someNativeElement: any;
  isActive:boolean = false;

  handleIcon = faArrowsUpDownLeftRight;

  constructor(
    private el: ElementRef
  ) {}

  private resizeObserver!: ResizeObserver;
  ngAfterViewInit(): void {
    this.fontControls['fontSize'].valueChanges.subscribe(() => {
      setTimeout(()=>this.resizeTextarea(), 10);
    });

    this.resizeObserver = new ResizeObserver(()=>this.resizeTextarea());
    this.resizeObserver.observe(this.textBox.nativeElement);
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
    return (this.fontControls['fontSize']?.value ?? 0);
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
    // this.getMaxHeight();
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

  onDrop(){
    this.onPlaceHolderDrop.emit();
    this.resizeTextarea();
  }
}
