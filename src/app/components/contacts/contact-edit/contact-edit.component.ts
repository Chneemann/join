import { Component, Input } from '@angular/core';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { BtnBackComponent } from '../../../shared/components/buttons/btn-back/btn-back.component';

@Component({
  selector: 'app-contact-edit',
  standalone: true,
  imports: [CommonModule, ContactFormComponent, BtnBackComponent],
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.scss',
})
export class ContactEditComponent {
  @Input() currentUserId!: string;

  constructor(public userService: UserService) {}
}
