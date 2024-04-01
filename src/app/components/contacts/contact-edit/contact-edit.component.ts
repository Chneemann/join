import { Component, Input } from '@angular/core';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-contact-edit',
  standalone: true,
  imports: [CommonModule, ContactFormComponent],
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.scss',
})
export class ContactEditComponent {
  @Input() currentUserId!: string | undefined;

  constructor(
    public userService: UserService,
    public sharedService: SharedService
  ) {}
}
