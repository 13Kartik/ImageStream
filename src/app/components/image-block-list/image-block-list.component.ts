import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// fontawesome import
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import {ClipboardModule, Clipboard} from '@angular/cdk/clipboard'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DbServiceService } from '../../services/db-service.service';
import { PaginationService } from '../../services/pagination.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-image-block-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FontAwesomeModule, ClipboardModule, RouterModule, NgbPaginationModule, ReactiveFormsModule],
  templateUrl: './image-block-list.component.html',
  styleUrl: './image-block-list.component.css'
})
export class ImageBlockListComponent implements OnInit {

  // injecting NgbModel
  private modalService = inject(NgbModal);
  
  // Variable declaration
  copyImageLinkIcon = faCopy;
  editImageIcon = faPenToSquare;
  imageBlocks: any[] = [];
  imageUrl: string = "";
  imageName: string = "";
  page = 1;
  pageSize = 10;
  totalImageBlocks:number = 0;

  // create image form submission
  createNewImgForm !: FormGroup; 

  constructor(private clipboard: Clipboard, private dbService: DbServiceService, private router: Router, private paginationService: PaginationService) {}
  
  ngOnInit(): void {
    this.page = this.paginationService.currentPage;
    this.dbService.getLoggedUserImageBlockes().subscribe({
      next: (data)=>{
        this.imageBlocks = data;
        this.totalImageBlocks = data.length;
        console.log('Inside Subscribe: ', this.totalImageBlocks);
        console.log(this.imageBlocks);
      },
      error: (err)=>{
        console.log(err);
      }
    });

    this.createNewImgForm = new FormGroup({
      imageName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      imageCategory: new FormControl('', [Validators.required]),
    });

    this.totalImageBlocks = 123;
    console.log('Outside subscribe',this.totalImageBlocks);
  } 

  copyImageSrc(imageUrl: string, id: number){
    console.log(`${id},${imageUrl}`);
    this.clipboard.copy(imageUrl);
  }

  onPageChange(pageNumber: number) {
    console.log("Current Page is: ",pageNumber);
  }
  
  // Function to edit the image
  editGeneratedImage(generationId: string){
    this.paginationService.storeCurrentPage(this.page);
    this.router.navigate(['/user/ImageGenerator'],{queryParams:{imageBlockId:generationId}});
  }

  // function for new image generation
  createNewImage(){
    this.router.navigate(['/user/ImageGenerator'],{queryParams:{name: this.createNewImgForm.get('imageName')?.value, category: this.createNewImgForm.get('imageCategory')?.value}});
    console.log(this.createNewImgForm);
  }

  // Function for model opening
  openVerticallyCentered(content: TemplateRef<any>) {
		this.modalService.open(content, { centered: true });
	}

  openFullscreen(content: TemplateRef<any>, url: string, imgName: string) {
		this.modalService.open(content, { fullscreen: true });
    this.imageUrl = url;
    this.imageName = imgName
	}
}
