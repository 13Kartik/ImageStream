import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedLinkModalComponent } from './generated-link-modal.component';

describe('GeneratedLinkModalComponent', () => {
  let component: GeneratedLinkModalComponent;
  let fixture: ComponentFixture<GeneratedLinkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratedLinkModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneratedLinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
