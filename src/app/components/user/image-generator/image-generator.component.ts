import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-generator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './image-generator.component.html',
  styleUrl: './image-generator.component.css'
})
export class ImageGeneratorComponent {
    //options
    img_height:number = 600;
    img_width:number= 800;

    onDragStart(){

    }

    onDragOver(event:any){
      event.preventDefault();
    }

    onDrop(event:any){
      console.log(event);
      
    }
}
