import { Component, Input, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-text-input',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './dynamic-text-input.component.html',
  styleUrl: './dynamic-text-input.component.css'
})
export class DynamicTextInputComponent implements OnChanges {
@Input() text!:FormControl;
@Input() fontSize!:number;
@Input() fontWeight!:number;
@Input() fontFamily!:string;
@Input() fontColor!:string;

width:number = 0;

constructor(private renderer: Renderer2) {
}

ngAfterContentInit(){
  this.resize();
}

getWidthOfText(text: string): number {
  const measureDiv = this.renderer.createElement('div');

  this.renderer.addClass(measureDiv, 'measureDiv');

    // Set the desired font properties
    this.renderer.setStyle(measureDiv, 'font-size', this.fontSize+'px');
    this.renderer.setStyle(measureDiv, 'font-weight', this.fontWeight);
    this.renderer.setStyle(measureDiv, 'font-family', this.fontFamily);

    // Set the text content
    this.renderer.appendChild(measureDiv, this.renderer.createText(text+'0'));

    // Append the element to the DOM (necessary for measuring its width)
    this.renderer.appendChild(document.body, measureDiv);

    // Get the width of the element
    const width = measureDiv.offsetWidth;

    // Remove the element from the DOM (optional, depending on your use case)
    this.renderer.removeChild(document.body, measureDiv);

    return width;
}

resize(){
  this.width=this.getWidthOfText(this.text.value);
}

ngOnChanges(changes: SimpleChanges) {
  if (changes['fontSize']) {
    this.resize();
  }
}

}
