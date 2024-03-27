import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  allUsers: User[] = [];
  usersFirstLetter: string[] = [];
  usersByFirstLetter: { [key: string]: string[] } = {};

  constructor(private userService: UserService) {
    this.userService.subUserList().subscribe(() => {
      this.allUsers = this.loadAllUser();
      this.sortAllUsers();
      this.sortUsersFirstLetter();
      this.sortUsersByFirstLetter();
    });
  }

  loadAllUser(): User[] {
    // Without Guest
    return this.userService.allUsers.filter((user, index) => index !== 0);
  }

  sortAllUsers() {
    this.allUsers = [...this.allUsers].sort((a, b) =>
      (a.firstName?.toLowerCase() ?? '').localeCompare(
        b.firstName?.toLowerCase() ?? ''
      )
    );
  }

  sortUsersFirstLetter() {
    this.usersFirstLetter = Array.from(
      new Set(this.allUsers.map((user) => user.firstName[0].toUpperCase()))
    );
  }

  sortUsersByFirstLetter() {
    this.allUsers.forEach((user) => {
      const firstLetter = user.firstName[0].toUpperCase();
      if (!this.usersByFirstLetter[firstLetter]) {
        this.usersByFirstLetter[firstLetter] = [];
      }
      this.usersByFirstLetter[firstLetter].push(user.id);
    });
  }

  displayUser(firstLetter: string) {
    return this.allUsers
      .filter(
        (user) =>
          user.firstName.charAt(0).toUpperCase() === firstLetter.toUpperCase()
      )
      .map((user) => user.firstName);
  }

  userName() {}
}
