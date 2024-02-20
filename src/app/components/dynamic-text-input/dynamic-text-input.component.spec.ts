import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTextInputComponent } from './dynamic-text-input.component';

describe('DynamicTextInputComponent', () => {
  let component: DynamicTextInputComponent;
  let fixture: ComponentFixture<DynamicTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTextInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamicTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
