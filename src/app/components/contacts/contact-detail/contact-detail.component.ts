import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../services/user.service';
import { finalize, lastValueFrom } from 'rxjs';
import { User } from '../../../interfaces/user.interface';
import { OverlayService } from '../../../services/overlay.service';
import { ApiService } from '../../../services/api.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { UpdateNotifierService } from '../../../services/update-notifier.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule, ConfirmDialogComponent],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss',
})
export class ContactDetailComponent {
  @Input() selectedUserId: string | null = null;
  @Input() currentUser: User | null = null;
  @Output() contactClosed = new EventEmitter<boolean>();

  selectedUser: User | null = null;
  isLoading = false;
  showMobileNavbar = false;
  showConfirmDialog = false;

  constructor(
    private overlayService: OverlayService,
    private userService: UserService,
    private apiService: ApiService,
    private toastNotificationService: ToastNotificationService,
    private updateNotifierService: UpdateNotifierService
  ) {}

  /**
   * If the `selectedUserId` input property changes and has a current value,
   * it loads the user data. Otherwise, it resets the `selectedUser` to null.
   *
   * @param changes An object of key-value pairs representing the changed properties.
   */

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUserId']?.currentValue) {
      this.loadUser();
    } else {
      this.selectedUser = null;
    }
  }

  /**
   * Emits an event with the value false to trigger the contact list to close.
   */
  emitCloseContact() {
    this.contactClosed.emit(false);
  }

  /**
   * Toggles the visibility of the mobile contact details navbar.
   */
  toggleNav(): void {
    this.showMobileNavbar = !this.showMobileNavbar;
  }

  /**
   * Toggles the visibility of the confirmation dialog.
   * This method switches the `showConfirmDialog` boolean state.
   */
  toggleConfirmDialog(): void {
    this.showConfirmDialog = !this.showConfirmDialog;
    this.overlayService.setOverlayData('dialog', '');
  }

  /**
   * Sets the overlay data for the contact overlay to the given user data,
   * and hides the mobile contact details navbar.
   *
   * @param userData The user data to be edited.
   */
  editContact(userData: User) {
    this.overlayService.setOverlayData('contactOverlay', userData);
    this.showMobileNavbar = false;
  }

  /**
   * Deletes the contact with the given id, shows a success toast, triggers an update of the contact list,
   * and closes the contact details component.
   */
  async deleteContact() {
    try {
      await lastValueFrom(this.apiService.deleteUserById(this.selectedUserId!));
      this.toastNotificationService.deleteContactSuccessToast();
      this.updateNotifierService.notifyUpdate('contact');
      this.emitCloseContact();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Loads the user data with the given id and sets it to the `selectedUser` property.
   */
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
}
