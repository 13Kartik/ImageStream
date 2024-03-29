import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageBlockListComponent } from './image-block-list.component';

describe('ImageBlockListComponent', () => {
  let component: ImageBlockListComponent;
  let fixture: ComponentFixture<ImageBlockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageBlockListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageBlockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
