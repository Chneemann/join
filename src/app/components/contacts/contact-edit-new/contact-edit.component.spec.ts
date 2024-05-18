import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactEditNewComponent } from './contact-edit.component';

describe('ContactEditComponent', () => {
  let component: ContactEditNewComponent;
  let fixture: ComponentFixture<ContactEditNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactEditNewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactEditNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
