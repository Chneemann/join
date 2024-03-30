import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from '../contacts.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, ContactsComponent],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss',
})
export class ContactDetailComponent {
  @Input() currentUserId!: string;

  constructor(public userService: UserService, private router: Router) {}

  closeUserDetails() {
    this.router.navigate(['contacts']);
  }
}
