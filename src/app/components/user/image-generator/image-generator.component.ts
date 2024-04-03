import {
  Component,
  ViewChild,
  TemplateRef,
  ElementRef,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';

//components
import { DynamicTextInputComponent } from '../../dynamic-text-input/dynamic-text-input.component';
import { SelectImageComponent } from '../../select-image/select-image.component';
import { OptionsMenuComponent } from '../../options-menu/options-menu.component';

//modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

//icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faRotate } from '@fortawesome/free-solid-svg-icons';

//Alert
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

//database
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DbServiceService } from '../../../services/db-service.service';
import { HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

//tooltip
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

//drag and drop
import { TextBoxComponent } from '../../text-box/text-box.component';
import { CdkDrag,CdkDropListGroup } from '@angular/cdk/drag-drop';

//test
import { GeneratedLinkModalComponent } from '../../generated-link-modal/generated-link-modal.component';

@Component({
  selector: 'app-image-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicTextInputComponent,
    FontAwesomeModule,
    NgbAlertModule,
    RouterModule,
    HttpClientModule,
    NgbTooltipModule,
    SelectImageComponent,
    OptionsMenuComponent,
    TextBoxComponent,
    GeneratedLinkModalComponent,
    CdkDrag,
    CdkDropListGroup
  ],
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.css'],
  providers: [DbServiceService],
})
export class ImageGeneratorComponent implements AfterViewInit {
  @ViewChild('appSelectImageRef') appSelectImageRef!: SelectImageComponent;
  @ViewChild('generatedLinkModal') generatedLinkModal!: TemplateRef<any>;
  @ViewChild('generatedLinkModalRef') generatedLinkModalRef!: GeneratedLinkModalComponent;
  @ViewChild('imgContainer') imgContainer!: ElementRef;

  constructor(
    private modalService: NgbModal,
    private db: DbServiceService,
    private el: ElementRef,
    private route: ActivatedRoute,
    private router:Router
  ) {
      this.db.getPlaceHolders().subscribe(res=>{
        this.placeHolders=res;
      });
  }

  ngAfterViewInit(){
    this.route.queryParams.subscribe(params => {
      // Access individual query parameters
      if(params['imageBlockId']){
        this.imageBlockId=params['imageBlockId'];
        this.getImageBlock(params['imageBlockId']);
      }
      else{
        this.imageBlockId=null;
        if(this.imageBlockName)
        this.imageBlockName = params['name'];
      }
    });
  }

  //icons
  copyIcon = faCopy;
  changeImgIcon = faRotate;
  uploadIcon = faCloudArrowUp;

  //background Image
  img_src!: string;
  img_file: File | null = null;
  imageId!: string;
  real_height!: number;
  real_width!: number;
  aspectRatio:number = 4/3;
  portrait:boolean = false;

  //modal
  private selectImageModalRef!: NgbModalRef;

  //Dynamic TextBoxes
  textBoxes: FormGroup[] = [];
  activeTextBox: FormGroup = new FormGroup({});

  //placeHolder
  placeHolders:string[]=[];
  placeHolder:string|null = null;

  //validation
  previousBlockData:null|object = null;
  isModalActive:boolean = false;

  //update
  imageBlockId:string|null = null;
  imageBlockName:string = 'testGenerations';

  imageOpacity: number = 1;

  addTextBox(text:string='Enter text',size:number=34,color:string='#3B71CA',family:string='Courier New',alignment:string='left') {
    const textBox = new FormGroup({
      text: new FormControl(text),
      fontSize: new FormControl(size),
      fontColor: new FormControl(color),
      fontFamily: new FormControl(family),
      textAlignment: new FormControl(alignment),
    });

    // Push a new object into the array
    this.textBoxes.push(textBox);
  }

  
  changeTextBox(i: number) {
    this.activeTextBox = this.textBoxes[i];
  }
  
  onSubmit() {
    console.log('submitted');
    this.generateLink();
  }

  //Converting coordinates relative to screen to coordinated relative to Image
  convertProperties(x: number, y: number, height: number, width: number,incoming:boolean=false) {
    const imgContainerReact = this.el.nativeElement
      .querySelector('.img-container')
      .getBoundingClientRect();
      console.log(imgContainerReact);
      
      const scaleHeight = this.real_height / imgContainerReact.height;
      const scaleWidth = this.real_width / imgContainerReact.width;

      let newX,newY,newHeight,newWidth;

      if(incoming){
        newX = x/scaleWidth+imgContainerReact.x;
        newY = y/scaleHeight+imgContainerReact.y;
        newHeight = height / scaleHeight;
        newWidth = width / scaleWidth/(this.portrait?1.015:1.008);
      }
      else{
        newX = (x - imgContainerReact.x) * scaleWidth;
        newY = (y - imgContainerReact.y) * scaleHeight;
        newHeight = height * scaleHeight;
        newWidth = width * scaleWidth*(this.portrait?1.015:1.008);
      }

    return [newX, newY, newHeight, newWidth];
  }
  
  async generateLink() {
    console.log('inside generate link')
    if (this.img_file !== null) {
      const fileData = new FormData();
      fileData.append('file', this.img_file);

      const uploadImageResponse: any = await firstValueFrom(
        this.db.uploadImage(fileData)
      );
      this.imageId = uploadImageResponse.imageId;
      this.img_file = null;
    }

    //create req Data:
    const textBoxesData = [];
    for (const [i, properties] of this.textBoxes.entries()) {
      console.log(properties);
      const textBoxRef = this.el.nativeElement
        .querySelector(`#textBox_${i} textarea`)
        ?.getBoundingClientRect();

      console.log(textBoxRef);

      const [x, y, height, width] = this.convertProperties(
        textBoxRef.x,
        textBoxRef.y,
        textBoxRef.height,
        textBoxRef.width
        );

        textBoxesData.push({
        x,
        y,
        height,
        width,
        ...properties.value,
      });
    }
    
    //scaling fontSize for original Image resolution
    let containerWidth = this.imgContainer.nativeElement.getBoundingClientRect().width;
    let scale:number=this.real_width / containerWidth;
    for (const textBox of textBoxesData) {
      textBox.fontSize = textBox.fontSize * scale * 3/4.15;
    }
    
    // const blockData = {
    //   createdBy: localStorage.getItem("userId"),
    //   imageId: this.imageId,
    //   generationName: 'testGenerations',
    //   imageProperty: {
    //     backgroundImageOpacity: this.imageOpacity * 100,
    //     textBoxes: textBoxesData,
    //   },
    // };

    let blockData:object;
    if(this.imageBlockId){
      console.log(this.imageBlockName);
      blockData = {
        generationId:this.imageBlockId,
        imageID: this.imageId,
        GenerationName: this.imageBlockName,
        imageProperty: {
          backgroundImageOpacity: this.imageOpacity * 100,
          textBoxes: textBoxesData,
        },
      };
      if(blockData!==this.previousBlockData){
        const uploadImageBlockResponse = await firstValueFrom(
          this.db.updateImageBlock(blockData)
          );
          this.generatedLinkModalRef.generatedLink = uploadImageBlockResponse.imageURL;
          this.previousBlockData=blockData;
      }
    }
    else{
      blockData = {
        createdBy: localStorage.getItem("userId"),
        imageId: this.imageId,
        GenerationName: this.imageBlockName,
        imageProperty: {
          backgroundImageOpacity: this.imageOpacity * 100,
          textBoxes: textBoxesData,
        }
      };
      if(blockData!==this.previousBlockData){
        const uploadImageBlockResponse = await firstValueFrom(
          this.db.uploadImageBlock(blockData)
          );
          console.log(uploadImageBlockResponse);
          this.generatedLinkModalRef.generatedLink = uploadImageBlockResponse.path;
          this.previousBlockData=blockData;
          this.imageBlockId=uploadImageBlockResponse.generationId;
          this.router.navigate([],{ queryParams: { imageBlockId: uploadImageBlockResponse.generationId } });
      }
    }
  
    // open modal to Display and access generated Link
    if(!this.isModalActive){
      this.isModalActive = true;
      const modalRef = this.modalService.open(this.generatedLinkModalRef.modal, { centered: true });
      modalRef.result.then(
        () => this.isModalActive = false,
        () => this.isModalActive = false
      );
    }
    
  }

  openSelectImageModal() {
    //open modal
    this.selectImageModalRef = this.modalService.open(
      this.appSelectImageRef.selectImageModal,
      { centered: true, size: 'xl' }
    );
    this.appSelectImageRef.getImageList();
  }

  handleImageUrl(image: { imageId?: string; url: string; file?: File }) {
    return new Promise<void>((resolve, reject) => {
      // Clear textBoxes of the previous image
      this.textBoxes = [];
  
      // Handling 2 cases: Local Image and Database Image
      if (image.file) {
        this.img_file = image.file; // Case 1: Local Image
      } else if (image.imageId) {
        this.imageId = image.imageId; // Case 2: Database Image
      }
  
      // Get the dimensions using an Image element
      const img = new Image();
      img.src = image.url;
      this.img_src = image.url;
  
      if (this.selectImageModalRef) {
        this.selectImageModalRef.close();
      }
  
      // Event listener for image load
      img.onload = () => {
        this.real_height = img.height;
        this.real_width = img.width;
        this.aspectRatio = img.width / img.height;
        if (this.aspectRatio <= 1) {
          this.portrait = true;
        }
        resolve(); // Resolve the Promise when the image is loaded
      };
  
      // Event listener for image error
      img.onerror = (error) => {
        reject(error); // Reject the Promise if there's an error loading the image
      };
    });
  }

  setOpacity(opacity: number) {
    this.imageOpacity = opacity;
  }

  setName(name: string) {
    this.imageBlockName = name;
  }

  deleteTextBox(i:number){
    this.activeTextBox = new FormGroup({});
    this.textBoxes.splice(i,1);
  }

  onPlaceHolderDrag(event:any){
    this.placeHolder=event.placeHolder;
  }
  
  onDragOver(event:any){
    event.preventDefault();
  }

  onPlaceHolderDrop(i:number){
    if(this.placeHolder!==null){
      const text = this.textBoxes[i].controls['text'].value;
      this.textBoxes[i].controls['text'].setValue(text+' {'+this.placeHolder+'}');
    }
  }

  onDrop(){
    this.placeHolder=null;
  }

  //update imageBlock
  async getImageBlock(id:string){
    const res = await firstValueFrom(
      this.db.getImageBlock(id)
    );

    this.imageOpacity = res.imageBlock.imageProperty.backgroundImageOpacity/100;
    this.imageId = res.imageBlock.imageID;
    this.imageBlockName=res.imageBlock.generationName;

   await this.handleImageUrl({
      url:'http://192.168.1.17:8056/images/'+res.imageBlock.imagePath
    });

    const textBoxesData = res.imageBlock.imageProperty.textBoxes;
    for(const [i, textBox] of textBoxesData.entries()){
      this.addTextBox(
        textBox.text,
        textBox.fontSize,
        textBox.fontColor,
        textBox.fontFamily,
        textBox.textAlignment
      );

      // Wait for the next tick to ensure the DOM is updated
      setTimeout(()=>{
        const textBoxRef = this.el.nativeElement.querySelector(`#textBox_${i}`);
        const textareaRef = textBoxRef.querySelector(`textarea`);
        if (textBoxRef) {
          const [x, y, height, width] = this.convertProperties(
            textBox.x,
            textBox.y,
            textBox.height,
            textBox.width,
            true
          );
          textBoxRef.style.left=x+'px';
          textBoxRef.style.top=y+'px';
          textareaRef.style.height=height+'px';
          textareaRef.style.width=width+'px';
        } else {
          console.error(`Textarea with ID textBox_${i} not found.`);
        }
      });
    }

    //changing fontsize
    setTimeout(()=>{
      //scaling fontSize for Image resolution
      let containerWidth = this.imgContainer.nativeElement.getBoundingClientRect().width;
      let scale:number=this.real_width / containerWidth;
      for(const textBox of this.textBoxes){
        const fontSize = textBox.get('fontSize');
        const newFontSize = (fontSize?.value/scale*4.15/3).toFixed(2);
        fontSize?.setValue(newFontSize);
      }
    });
  }

}