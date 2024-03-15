import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

//component
import { DynamicTextInputComponent } from '../dynamic-text-input/dynamic-text-input.component';

//drag and drop

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
  @Output() onDrag:EventEmitter<object> = new EventEmitter;

  imageOpacity:number = 1;
  showFontProperties:boolean=false;
  showImageOptions:boolean=false;

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

  placeHolders:string[]=['name'];

  constructor(){}

  ngAfterViewInit(): void {
  }

  convertCoordinates(x:number,y:number){  

    const imgContainerReact = document.querySelector('.img-container')
    ?.getBoundingClientRect();

    if(imgContainerReact){
      if(x<imgContainerReact.x || y<imgContainerReact.y) return null;

      const newX = x - imgContainerReact.x;
      const newY = y - imgContainerReact.y;
      return [newX,newY];
    }
    return null;
  }

  onDragEnd(event:any,placeHolder:string){
    console.log(event);
    const coordinates=this.convertCoordinates(event.pageX,event.pageY);
    console.log(coordinates);
    if(coordinates!==null)
    this.onDrag.emit({
      placeHolder,
      coordinates
    });
  }

}
