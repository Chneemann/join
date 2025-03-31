import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../../services/firebase.service';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../services/user.service';
import { finalize, lastValueFrom } from 'rxjs';
import { User } from '../../../interfaces/user.interface';
import { OverlayService } from '../../../services/overlay.service';
import { ApiService } from '../../../services/api.service';
import { ToastNotificationService } from '../../../services/toast-notification.servic';
import { UpdateNotifierService } from '../../../services/update-notifier.service';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss',
})
export class ContactDetailComponent {
  @Input() selectedUserId: string | null = null;
  @Input() currentUser: User | null = null;
  @Output() closeContactEmitter = new EventEmitter<boolean>();

  isLoading: boolean = false;
  selectedUser: User | null = null;
  isMobileNavbarOpen: boolean = false;

  constructor(
    public firebaseService: FirebaseService,
    private overlayService: OverlayService,
    private userService: UserService,
    private apiService: ApiService,
    private toastNotificationService: ToastNotificationService,
    private updateNotifierService: UpdateNotifierService
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
    this.isMobileNavbarOpen = !this.isMobileNavbarOpen;
  }

  /**
   * Opens the edit contact dialog by setting the appropriate flags in the shared service.
   * This method is used by the contact details component to open the edit contact dialog when the user clicks the edit button.
   */
  editContact(userData: User) {
    this.overlayService.setOverlayData('contactOverlay', userData);
    this.isMobileNavbarOpen = false;
  }

  async deleteContact(userId: string) {
    try {
      await lastValueFrom(this.apiService.deleteUserById(userId));
      this.toastNotificationService.deleteContactSuccessToast();
      this.updateNotifierService.notifyUpdate('contact');
      this.closeUserDetails();
    } catch (error) {
      console.error(error);
    }
  }
}
