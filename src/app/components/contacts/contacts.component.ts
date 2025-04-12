import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { finalize, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { OverlayService } from '../../services/overlay.service';
import { UpdateNotifierService } from '../../services/update-notifier.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ContactDetailComponent, TranslateModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit, OnDestroy {
  allUsers: User[] = [];
  currentUser: User | null = null;
  selectedUserId: string | null = null;
  showAllUsers: boolean = false;
  isLoading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private overlayService: OverlayService,
    private updateNotifierService: UpdateNotifierService
  ) {}

  ngOnInit(): void {
    this.onResize();
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async initializeData(): Promise<void> {
    try {
      await this.loadAllUsers();
      this.loadCurrentUser();
      this.subscribeToUserUpdates();
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }

  private async loadAllUsers(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await firstValueFrom(
        this.userService
          .getUsers()
          .pipe(finalize(() => (this.isLoading = false)))
      );
      this.allUsers = response;
    } catch (err) {
      console.error('Error loading the users:', err);
    }
  }

  private async subscribeToUserUpdates(): Promise<void> {
    this.updateNotifierService.contactUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (userId: string) => {
        this.selectedUserId = null;
        try {
          await this.loadAllUsers();
          this.selectedUserId = userId;
        } catch (error) {
          console.error('Error while waiting for user load:', error);
        }
      });
  }

  private loadCurrentUser(): void {
    this.userService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userData) => {
          this.currentUser = userData;
        },
        error: (err) => {
          console.error('Error loading current user:', err);
        },
      });
  }

  /**
   * Updates the shared service current user id and triggers the resize function.
   * If the parameter is not given, it resets the current user id to an empty string.
   * @param userId - the id of the user to be set as the current user id
   */
  openUserDetails(userId: string = '') {
    this.selectedUserId = userId;
    this.onResize();
  }

  /**
   * Triggers the resize function to adjust UI elements based on the current state.
   */
  handleCloseContact() {
    this.selectedUserId = null;
    this.onResize();
  }

  filterUsersByFirstLetter(filterLetter: string) {
    return this.allUsers.filter(
      (user) => user.initials.substring(0, 1) === filterLetter
    );
  }

  getUniqueFirstLetters() {
    let sortedUsers = this.allUsers.sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
    );
    let uniqueFirstLetters = Array.from(
      new Set(sortedUsers.map((user) => user.firstName[0].toUpperCase()))
    );
    return uniqueFirstLetters;
  }

  addNewContact() {
    this.overlayService.setOverlayData('contactOverlay', 'new');
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 1000 && this.selectedUserId != undefined) {
      this.showAllUsers = false;
    } else {
      this.showAllUsers = true;
    }
  }
}
