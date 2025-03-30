import { Component, HostListener } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { SharedService } from '../../services/shared.service';
import { FirebaseService } from '../../services/firebase.service';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ContactDetailComponent, TranslateModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  allUsers: User[] = [];
  currentUser: User | null = null;
  selectedUserId: string | null = null;
  showAllUsers: boolean = false;
  isLoading: boolean = false;

  constructor(
    public firebaseService: FirebaseService,
    private userService: UserService,
    public sharedService: SharedService
  ) {}

  /**
   * Trigger onResize when the component is initialized
   */
  ngOnInit(): void {
    this.onResize();
    this.loadAllUsers();
    this.loadCurrentUser();
  }

  loadAllUsers(): void {
    this.isLoading = true;

    this.userService
      .getUsers()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.allUsers = response;
        },
        error: (err) => {
          console.error('Error loading the tasks:', err);
        },
      });
  }

  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe((userData) => {
      this.currentUser = userData;
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
  closeContactEmitter() {
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

  /**
   * Opens the new contact dialog.
   * This function sets the isAnyDialogOpen and isNewContactDialogOpen
   * properties of the shared service to true, which will open the new contact
   * dialog.
   */
  openNewContactDialog() {
    this.sharedService.isAnyDialogOpen = true;
    this.sharedService.isNewContactDialogOpen = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 1150 && this.selectedUserId != undefined) {
      this.showAllUsers = false;
    } else {
      this.showAllUsers = true;
    }
  }
}
