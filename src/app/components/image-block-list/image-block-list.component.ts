import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// fontawesome import
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import {ClipboardModule, Clipboard} from '@angular/cdk/clipboard'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DbServiceService } from '../../services/db-service.service';

@Component({
  selector: 'app-image-block-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FontAwesomeModule, ClipboardModule, RouterModule, NgbPaginationModule],
  templateUrl: './image-block-list.component.html',
  styleUrl: './image-block-list.component.css'
})
export class ImageBlockListComponent implements OnInit {

  // injecting NgbModel
  private modalService = inject(NgbModal);
  
  // Variable declaration
  copyImageLink = faCopy;
  imageBlocks: any[] = [];
  imageUrl: string = "";
  imageName: string = "";
  page = 1;
  pageSize = 10;
  totalImageBlocks:number = 123;

  constructor(private clipboard: Clipboard, private dbService: DbServiceService) {}
  
  ngOnInit(): void {
    this.dbService.getLoggedUserImageBlockes().subscribe({
      next: (data)=>{
        this.imageBlocks = data;
        this.totalImageBlocks = data.length;
        console.log(this.imageBlocks);
      },
      error: (err)=>{
        console.log(err);
      }
    });
  } 
  
  copyImageSrc(imageUrl: string, id: number){
    console.log(`${id},${imageUrl}`);
    this.clipboard.copy(imageUrl);
  }

  // Fucntion for model opening
  openVerticallyCentered(content: TemplateRef<any>) {
		this.modalService.open(content, { centered: true });
	}

  openFullscreen(content: TemplateRef<any>, url: string, imgName: string) {
		this.modalService.open(content, { fullscreen: true });
    this.imageUrl = url;
    this.imageName = imgName
	}
}
