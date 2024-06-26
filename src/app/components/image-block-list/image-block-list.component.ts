import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule,DatePipe } from '@angular/common';

// fontawesome import
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import {ClipboardModule, Clipboard} from '@angular/cdk/clipboard'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DbServiceService } from '../../services/db-service.service';
import { PaginationService } from '../../services/pagination.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

//Date Picker
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {provideNativeDateAdapter} from '@angular/material/core';

// Material Imports 
import { MatButtonModule } from '@angular/material/button';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-image-block-list',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FontAwesomeModule,
    ClipboardModule,
    RouterModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSidenavModule
  ],
  templateUrl: './image-block-list.component.html',
  styleUrl: './image-block-list.component.css',
  providers: [provideNativeDateAdapter(), DatePipe, DbServiceService],
})
export class ImageBlockListComponent implements OnInit {
  // injecting NgbModel
  private modalService = inject(NgbModal);

  //icons
  deleteIcon = faTrash;
  copyImageLinkIcon = faCopy;
  editImageIcon = faPenToSquare;

  // Variable declaration
  userName!:string | null;
  imageBlocks: any[] = [];
  imageUrl: string = '';
  imageName: string = '';
  page = 1;
  pageSize = 10;
  totalImageBlocks: number = 0;

  // create image form submission
  createNewImgForm!: FormGroup;

  // Variable declaration for sidebar 
  @ViewChild('drawer') drawer!: MatDrawer;

  //datePicker
  @ViewChild('content') content!: TemplateRef<any>;
  @ViewChild('datePicker') datePicker!: TemplateRef<any>;
  selected: Date | null = null;
  minDate!: Date;
  maxDate!: Date;

  constructor(
    private clipboard: Clipboard,
    private dbService: DbServiceService,
    private router: Router,
    private paginationService: PaginationService,
    private datePipe: DatePipe,
    private db: DbServiceService,
    private sidebarService: SidebarService
  ) {
    this.userName=localStorage.getItem("userName");
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.page = this.paginationService.currentPage;
    this.dbService.getLoggedUserImageBlockes().subscribe({
      next: (data) => {
        this.imageBlocks = data;
        this.totalImageBlocks = data.length;
        console.log('Inside Subscribe: ', this.totalImageBlocks);
        console.log(this.imageBlocks);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.createNewImgForm = new FormGroup({
      imageName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      imageCategory: new FormControl('', [Validators.required]),
    });

    this.totalImageBlocks = 123;
    console.log('Outside subscribe', this.totalImageBlocks);
  }

  ngAfterViewInit() {
    this.sidebarService.setDrawer(this.drawer);
  }

  copyImageSrc(event: MouseEvent,imageUrl: string, id: number) {
    event.stopPropagation();
    console.log(`${id},${imageUrl}`);
    this.clipboard.copy(imageUrl);
  }

  onPageChange(pageNumber: number) {
    console.log('Current Page is: ', pageNumber);
  }

  // Function to edit the image
  editGeneratedImage(event: MouseEvent,generationId: string) {
    event.stopPropagation();
    this.paginationService.storeCurrentPage(this.page);
    this.router.navigate(['/imageGenerator'], {
      queryParams: { imageBlockId: generationId },
    });
  }

  // function for new image generation
  createNewModal!: any;
  createNewImage() {
    if (this.createNewImgForm.get('imageCategory')?.value === 'counter') {
      this.createNewModal = this.openVerticallyCentered(this.datePicker);
    } else {
      this.router.navigate(['/imageGenerator'], {
        queryParams: {
          name: this.createNewImgForm.get('imageName')?.value,
          category: this.createNewImgForm.get('imageCategory')?.value,
        },
      });
      console.log(this.createNewImgForm);
    }
  }

  // Function for model opening
  openVerticallyCentered(content: TemplateRef<any>) {
    return this.modalService.open(content, { centered: true });
  }

  openFullscreen(content: TemplateRef<any>, url: string, imgName: string) {
    this.modalService.open(content, { fullscreen: true });
    this.imageUrl = url;
    this.imageName = imgName;
  }

  deleteImageBlock(event: MouseEvent,imageBlockId:string){
    event.stopPropagation();
    this.db.deleteImageBlock(imageBlockId).subscribe(
      {
        next:(res: any) => {
          console.log(res);
          this.imageBlocks=this.imageBlocks.filter(block=>block.generationId!==imageBlockId);
        },
      error:(error) => {
          console.error(error);
        }
      }
    );
  }

  generateCounter() {
    const date = this.datePipe
      .transform(this.selected, 'MM%2Fdd%2Fyyyy')
      ?.toString();
    const name = this.createNewImgForm.get('imageName')?.value;
    if (date !== undefined) {
      this.openFullscreen(this.content, this.db.getCounter(date), name);
      this.createNewModal.close();
    }
  }

  // Function for logout button click
  logout() {
    // this.dbService.logout();
    // remove the useid from the local storage
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}
