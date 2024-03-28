import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from '../contacts.component';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, ContactsComponent],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss',
})
export class ContactDetailComponent {
  @Input() currentUserId: string = '';

  constructor(public userService: UserService) {}
}
