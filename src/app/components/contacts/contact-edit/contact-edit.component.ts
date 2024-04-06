import { Component, Input } from '@angular/core';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { CommonModule } from '@angular/common';
import { BtnCloseComponent } from '../../../shared/components/buttons/btn-close/btn-close.component';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-contact-edit',
  standalone: true,
  imports: [CommonModule, ContactFormComponent, BtnCloseComponent],
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.scss',
})
export class ContactEditComponent {
  @Input() currentUserId!: string;

  constructor(public firebaseService: FirebaseService) {}
}
