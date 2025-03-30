import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactOverlayComponent } from './contact-overlay.component';

describe('ContactOverlayComponent', () => {
  let component: ContactOverlayComponent;
  let fixture: ComponentFixture<ContactOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactOverlayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
