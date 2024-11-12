import { Component, HostListener } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { SharedService } from '../../services/shared.service';
import { FirebaseService } from '../../services/firebase.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ContactDetailComponent, TranslateModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  allUsers: User[] = [];
  usersFirstLetter: string[] = [];
  usersByFirstLetter: { [key: string]: string[] } = {};
  showAllUsers: boolean = false;

  constructor(
    public firebaseService: FirebaseService,
    private route: ActivatedRoute,
    public sharedService: SharedService
  ) {}

  /**
   * Trigger onResize when the component is initialized
   */
  ngOnInit(): void {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  /**
   * Toggles the showAllUsers variable based on the window width and the
   * currentUserId of the shared service.
   *
   * If the window width is less than or equal to 1150px and the currentUserId
   * is not empty, showAllUsers is set to false. Otherwise, showAllUsers is set
   * to true.
   */
  onResize() {
    if (window.innerWidth <= 1150 && this.sharedService.currentUserId != '') {
      this.showAllUsers = false;
    } else {
      this.showAllUsers = true;
    }
  }

  /**
   * Updates the shared service current user id and triggers the resize function.
   * If the parameter is not given, it resets the current user id to an empty string.
   * @param userId - the id of the user to be set as the current user id
   */
  showUserId(userId: string = '') {
    this.sharedService.currentUserId = userId;
    this.onResize();
  }

  /**
   * Triggers the resize function to adjust UI elements based on the current state.
   */
  closeContactEmitter() {
    this.onResize();
  }

  /**
   * Returns an array of users without the guest user.
   * @returns An array of users
   */
  loadAllUserWithoutGuest(): User[] {
    return this.firebaseService
      .getAllUsers()
      .filter((user) => user.initials !== 'G');
  }

  /**
   * Sorts the users array by the first letter of the user's initials, and filters it by the given sort letter.
   * @param sortLetter - the letter to filter the users by
   * @returns An array of users with the given sort letter
   */
  sortUsersByFirstLetter(sortLetter: string) {
    return this.loadAllUserWithoutGuest().filter(
      (user) => user.initials.substring(0, 1) === sortLetter
    );
  }

  /**
   * Returns an array of unique first letters from the sorted array of users.
   * The users array is first sorted by the first letter of the user's first name,
   * and then the first letter of each user's first name is extracted and
   * converted to uppercase. The resulting array is then deduplicated with a
   * Set, and the unique letters are returned in an array.
   * @returns An array of unique first letters
   */
  sortFirstLetter() {
    let filterteArray = this.loadAllUserWithoutGuest().sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
    );
    let usersFirstLetter = Array.from(
      new Set(filterteArray.map((user) => user.firstName[0].toUpperCase()))
    );
    return usersFirstLetter;
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
}
