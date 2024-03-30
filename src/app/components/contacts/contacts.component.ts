import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, RouterLink, ContactDetailComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  allUsers: User[] = [];
  usersFirstLetter: string[] = [];
  usersByFirstLetter: { [key: string]: string[] } = {};
  currentUserId: string = '';

  constructor(public userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeUserId();
  }

  routeUserId() {
    if (this.route.params.subscribe()) {
      this.route.params.subscribe((params) => {
        this.currentUserId = params['id'];
      });
    }
  }

  loadAllUserWithoutGuest(): User[] {
    return this.userService.getUsers().filter((user) => user.initials !== 'G');
  }

  sortUsersByFirstLetter(sortLetter: string) {
    return this.loadAllUserWithoutGuest().filter(
      (user) => user.initials.substring(0, 1) === sortLetter
    );
  }

  checkUsersFirstLetter() {
    let usersFirstLetter = Array.from(
      new Set(
        this.loadAllUserWithoutGuest().map((user) =>
          user.firstName[0].toUpperCase()
        )
      )
    );
    return usersFirstLetter;
  }
}
