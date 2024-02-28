import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateImageBlockComponent } from './create-image-block.component';

describe('CreateImageBlockComponent', () => {
  let component: CreateImageBlockComponent;
  let fixture: ComponentFixture<CreateImageBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateImageBlockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateImageBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
