import { Component, HostListener, Input } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from '../contacts.component';
import { Router } from '@angular/router';
import { ContactEditComponent } from '../contact-edit/contact-edit.component';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, ContactsComponent, ContactEditComponent],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss',
})
export class ContactDetailComponent {
  @Input() currentUserId!: string | undefined;

  constructor(
    public userService: UserService,
    private router: Router,
    public sharedService: SharedService
  ) {}

  closeUserDetails() {
    this.router.navigate(['contacts']);
  }

  openEditDialog() {
    this.sharedService.isAnyDialogOpen = true;
    this.sharedService.isEditContactDialogOpen = true;
  }

  deleteContact() {
    this.sharedService.isAnyDialogOpen = true;
    this.sharedService.isDeleteContactDialogOpen = true;
  }

  @HostListener('document:click', ['$event'])
  checkOpenContactEdit(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.closest('.btn-edit')) {
      this.sharedService.isAnyDialogOpen = true;
      this.sharedService.isEditContactDialogOpen = true;
    } else if (targetElement.closest('.btn-delete')) {
      this.sharedService.isAnyDialogOpen = true;
      this.sharedService.isDeleteContactDialogOpen = true;
    } else if (!targetElement.closest('.dialog')) {
      this.sharedService.isAnyDialogOpen = false;
      this.sharedService.isEditContactDialogOpen = false;
      this.sharedService.isDeleteContactDialogOpen = false;
    }
  }
}
