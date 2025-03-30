import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { ContactNavComponent } from '../contact-nav/contact-nav.component';
import { FirebaseService } from '../../../services/firebase.service';
import { LanguageService } from '../../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../services/user.service';
import { finalize } from 'rxjs';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule, ContactNavComponent],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss',
})
export class ContactDetailComponent {
  @Input() selectedUserId: string | null = null;
  @Input() currentUser: User | null = null;
  @Output() closeContactEmitter = new EventEmitter<boolean>();

  isLoading: boolean = false;
  selectedUser: User | null = null;

  constructor(
    public sharedService: SharedService,
    public firebaseService: FirebaseService,
    private userService: UserService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['selectedUserId'] !== undefined &&
      changes['selectedUserId'].currentValue !== ''
    ) {
      this.loadUser();
    } else {
      this.selectedUser = null;
    }
  }

  /**
   * Closes the contact details view by resetting the current user id in the
   * shared service and emitting the closeContactEmitter event.
   */
  closeUserDetails() {
    this.closeContactEmitter.emit();
  }

  loadUser(): void {
    this.isLoading = true;

    if (!this.selectedUserId) {
      this.isLoading = false;
      return;
    }

    this.userService
      .getUserById(this.selectedUserId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.selectedUser = response;
        },
        error: (err) => {
          console.error('Error loading the tasks:', err);
        },
      });
  }

  /**
   * Toggles the mobile navigation bar on and off.
   * @remarks This method is used by the contact details component to toggle
   * the mobile navigation bar when the user clicks the three points icon.
   */
  toggleNav() {
    this.sharedService.isMobileNavbarOpen =
      !this.sharedService.isMobileNavbarOpen;
  }

  /**
   * Opens the edit contact dialog by setting the appropriate flags in the shared service.
   * This method is used by the contact details component to open the edit contact dialog when the user clicks the edit button.
   */
  openEditDialog() {
    this.sharedService.isAnyDialogOpen = true;
    this.sharedService.isEditContactDialogOpen = true;
    this.sharedService.isMobileNavbarOpen = false;
  }

  /**
   * Opens the delete contact dialog by setting the appropriate flags in the shared service.
   * This method is used by the contact details component to open the delete contact dialog when the user clicks the delete button.
   */
  deleteContact() {
    this.sharedService.isAnyDialogOpen = true;
    this.sharedService.isDeleteContactDialogOpen = true;
    this.sharedService.isMobileNavbarOpen = false;
  }

  @HostListener('document:click', ['$event'])
  /**
   * Handles the opening of the contact edit, new contact, and delete contact
   * dialogs when the respective buttons are clicked.
   *
   * @param event The MouseEvent that was triggered.
   */
  checkOpenContactEdit(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    if (targetElement.closest('.btn-edit')) {
      this.setDialogStatus(true, true, false, false);
    } else if (targetElement.closest('.btn-new')) {
      this.setDialogStatus(true, false, true, false);
    } else if (targetElement.closest('.btn-delete')) {
      this.setDialogStatus(true, false, false, true);
    } else if (!targetElement.closest('.dialog')) {
      this.setDialogStatus(false, false, false, false);
    }
  }

  /**
   * Updates the dialog status flags in the shared service.
   *
   * @param anyOpen - Indicates if any dialog is open.
   * @param editOpen - Indicates if the edit contact dialog is open.
   * @param newOpen - Indicates if the new contact dialog is open.
   * @param deleteOpen - Indicates if the delete contact dialog is open.
   */
  private setDialogStatus(
    anyOpen: boolean,
    editOpen: boolean,
    newOpen: boolean,
    deleteOpen: boolean
  ) {
    this.sharedService.isAnyDialogOpen = anyOpen;
    this.sharedService.isEditContactDialogOpen = editOpen;
    this.sharedService.isNewContactDialogOpen = newOpen;
    this.sharedService.isDeleteContactDialogOpen = deleteOpen;
  }
}
