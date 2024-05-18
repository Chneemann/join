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
  currentUserId: string = '';

  constructor(
    public firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.routeUserId();
    this.onResize();
  }

  routeUserId() {
    if (this.route.params.subscribe()) {
      this.route.params.subscribe((params) => {
        this.currentUserId = params['id'];
        this.sharedService.currentUserId = params['id'];
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 1150 && this.currentUserId != '') {
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
