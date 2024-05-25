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
  imports: [CommonModule, RouterLink, ContactDetailComponent, TranslateModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  allUsers: User[] = [];
  usersFirstLetter: string[] = [];
  usersByFirstLetter: { [key: string]: string[] } = {};
  showAllUsers!: boolean;

  constructor(
    public firebaseService: FirebaseService,
    private route: ActivatedRoute,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.onResize();
  }

  showUserId(userId: string = '') {
    this.sharedService.currentUserId = userId;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 1150 && this.sharedService.currentUserId != '') {
      this.showAllUsers = false;
    } else {
      this.showAllUsers = true;
    }
  }

  loadAllUserWithoutGuest(): User[] {
    return this.firebaseService
      .getAllUsers()
      .filter((user) => user.initials !== 'G');
  }

  sortUsersByFirstLetter(sortLetter: string) {
    return this.loadAllUserWithoutGuest().filter(
      (user) => user.initials.substring(0, 1) === sortLetter
    );
  }

  sortFirstLetter() {
    let filteretArray = this.loadAllUserWithoutGuest().sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
    );
    let usersFirstLetter = Array.from(
      new Set(filteretArray.map((user) => user.firstName[0].toUpperCase()))
    );
    return usersFirstLetter;
  }

  openNewContactDialog() {
    this.sharedService.isAnyDialogOpen = true;
    this.sharedService.isNewContactDialogOpen = true;
  }
}
