import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  allUsers: User[] = [];
  usersFirstLetter: string[] = [];
  usersByFirstLetter: { [key: string]: string[] } = {};
  userMap: { [key: string]: User } = {};
  paramsId = '';

  constructor(private userService: UserService, private route: ActivatedRoute) {
    this.userService.subUserList().subscribe(() => {
      this.allUsers = this.loadAllUser();
      this.organizeUserData();
      this.sortAllUsers();
      this.sortUsersFirstLetter();
      this.sortUsersByFirstLetter();
    });
  }

  ngOnInit(): void {
    this.routeUserId();
  }

  routeUserId() {
    if (this.route.params.subscribe()) {
      this.route.params.subscribe((params) => {
        this.paramsId = params['id'];
      });
    }
  }

  organizeUserData() {
    this.userMap = {};
    this.allUsers.forEach((user) => {
      this.userMap[user.id] = user;
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
    this.usersFirstLetter = [];
    this.usersFirstLetter = Array.from(
      new Set(this.allUsers.map((user) => user.firstName[0].toUpperCase()))
    );
  }

  sortUsersByFirstLetter() {
    this.usersByFirstLetter = {};
    this.allUsers.forEach((user) => {
      const firstLetter = user.firstName[0].toUpperCase();
      if (!this.usersByFirstLetter[firstLetter]) {
        this.usersByFirstLetter[firstLetter] = [];
      }
      this.usersByFirstLetter[firstLetter].push(user.id);
    });
  }

  displayUserName(id: string) {
    if (this.userMap[id]) {
      return this.userMap[id].firstName + ', ' + this.userMap[id].lastName;
    }
    return '';
  }

  displayUserDetails(id: string, query: keyof User) {
    if (this.userMap[id]) {
      const user = this.userMap[id];
      return user[query];
    }
    return '';
  }
}
