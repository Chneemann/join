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
  @Input() selectedUserId: string | undefined;
  @Input() currentUser: User | null = null;
  @Output() closeContactEmitter = new EventEmitter<boolean>();

  isLoading: boolean = false;
  selectedUser: User | null = null;

  constructor(
    private router: Router,
    public sharedService: SharedService,
    public firebaseService: FirebaseService,
    private userService: UserService,
    private languageService: LanguageService
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

  /**
   * Converts a given timestamp to a human-readable date string.
   * @param timestamp the timestamp to convert
   * @returns a string in the format "DD. MMM. YYYY - HH:mm" in German or "MMM. DD, YYYY - hh:mm A" in English
   */
  convertTimestamp(timestamp: number) {
    const date = new Date(timestamp);
    const monthsEN = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthsDE = [
      'Jan',
      'Feb',
      'Mär',
      'Apr',
      'Mai',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Okt',
      'Nov',
      'Dez',
    ];
    const months =
      this.languageService.currentLang === 'de' ? monthsDE : monthsEN;
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();

    if (this.languageService.currentLang === 'de') {
      const time = `${day}. ${month}. ${year}`;
      return `${time} - ${this.convertTimestampHourDE(timestamp)}`;
    } else {
      const time = `${month}. ${day}, ${year}`;
      return `${time} - ${this.convertTimestampHourEN(timestamp)}`;
    }
  }

  /**
   * Converts a given timestamp to a human-readable time string in English.
   * @param timestamp the timestamp to convert
   * @returns a string in the format "hh:mm:ss AM/PM"
   */
  convertTimestampHourEN(timestamp: number) {
    const date = new Date(timestamp * 1000);
    let hour = date.getHours();
    const minute = ('0' + date.getMinutes()).slice(-2);
    const second = ('0' + date.getMinutes()).slice(-2);
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;

    let hourWithNull = ('0' + hour).slice(-2);

    return `${hourWithNull}:${minute}:${second} ${period}`;
  }

  /**
   * Converts a given timestamp to a human-readable time string in German.
   *
   * @param timestamp The timestamp to convert, in seconds.
   * @returns A string in the format "HH:mm:ss Uhr".
   */
  convertTimestampHourDE(timestamp: number) {
    const date = new Date(timestamp * 1000);
    let hour = date.getHours();
    const minute = ('0' + date.getMinutes()).slice(-2);
    const second = ('0' + date.getMinutes()).slice(-2);

    return `${hour}:${minute}:${second} Uhr`;
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
