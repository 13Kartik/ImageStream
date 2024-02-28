import { Component,EventEmitter,Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

//icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

//pagination
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-select-image',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule,NgbPaginationModule],
  templateUrl: './select-image.component.html',
  styleUrl: './select-image.component.css'
})
export class SelectImageComponent {

  //events
  @Output() onSetImage:EventEmitter<{url:string,file?:File}> = new EventEmitter();
  @ViewChild('setImageModal') setImageModal!: TemplateRef<any>;

  imgIcon = faImage;
  page=1;

  imgLinkList:string[]=['https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg',
    'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D'];
  img_row_1:string[]=[];
  imgLinkList_2d:string[][]=[]

  constructor(){
    for(let i=0;i<99;i++){
      this.imgLinkList.push('https://images.pexels.com/photos/19845798/pexels-photo-19845798/free-photo-of-cube-of-ice-beside-ocean.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
    }
    this.img_row_1=this.imgLinkList.splice(0,4);
    this.imgLinkList_2d = this.convert_to_2d(this.imgLinkList);
  }

  convert_to_2d(arr_1d:any[]){
    const res:any[][]=[];
    for(let i=0;i<arr_1d.length;i++){
      if(i%5===0) res.push([]);
      res[res.length-1].push(arr_1d[i]);
    }
    return res;
  }

  uploadImage(event:any){
    const imageFile = event.target.files[0];
    if (imageFile) {
      const reader = new FileReader();
        reader.onload = (e: any) => {
        this.onSetImage.emit({
          url:e.target.result,
          file:imageFile
        });
      }
      reader.readAsDataURL(imageFile);
    }
  }

  setImage(link:string){
    this.onSetImage.emit({
      url:link
    });
  }

}
