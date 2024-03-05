import { Component,EventEmitter,Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

//icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

//pagination
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

//database
import { DbServiceService } from '../../services/db-service.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-select-image',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule,NgbPaginationModule],
  templateUrl: './select-image.component.html',
  styleUrl: './select-image.component.css'
})
export class SelectImageComponent {

  //events
  @Output() onSetImage:EventEmitter<{imageId?:string,url:string,file?:File}> = new EventEmitter();
  @ViewChild('setImageModal') setImageModal!: TemplateRef<any>;

  imgIcon = faImage;
  page=1;

  storagePath = 'http://192.168.1.5:8033/images/';

  imgLinkList:any[]=[];
  img_row_1:any[]=[];
  imgLinkList_2d:any[][]=[]

  constructor(private db: DbServiceService) {
    // for(let i=0;i<99;i++){
    //   this.imgLinkList.push('https://images.pexels.com/photos/19845798/pexels-photo-19845798/free-photo-of-cube-of-ice-beside-ocean.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
    // }
    this.getImageList();
  }

  async getImageList(){
    this.imgLinkList = await firstValueFrom(this.db.getUploadedImages());
    console.log(this.imgLinkList);
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

  setImage(id:string,link:string){
    this.onSetImage.emit({
      imageId:id,
      url:link
    });
  }

}
