import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnCloseComponent } from '../../../shared/components/buttons/btn-close/btn-close.component';
import { FirebaseService } from '../../../services/firebase.service';
import { TranslateModule } from '@ngx-translate/core';
import { ContactFormComponent } from './contact-form/contact-form.component';

@Component({
  selector: 'app-contact-edit',
  standalone: true,
  imports: [
    CommonModule,
    ContactFormComponent,
    BtnCloseComponent,
    TranslateModule,
  ],
  templateUrl: './contact-edit-new.component.html',
  styleUrl: './contact-edit-new.component.scss',
})
export class ContactEditNewComponent {
  @Input() currentUserId: string | undefined;

  constructor(public firebaseService: FirebaseService) {}
}
