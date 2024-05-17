import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from '../contacts.component';
import { Router } from '@angular/router';
import { ContactEditComponent } from '../contact-edit/contact-edit.component';
import { SharedService } from '../../../services/shared.service';
import { ContactNavComponent } from '../contact-nav/contact-nav.component';
import { FirebaseService } from '../../../services/firebase.service';
import { LanguageService } from '../../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [
    CommonModule,
    ContactsComponent,
    ContactEditComponent,
    ContactNavComponent,
    TranslateModule,
  ],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss',
})
export class ContactDetailComponent {
  @Input() currentUserId!: string | undefined;

  isMobileNavbarOpen: boolean = false;

  constructor(
    private router: Router,
    public sharedService: SharedService,
    public firebaseService: FirebaseService,
    private languageService: LanguageService
  ) {}

  closeUserDetails() {
    this.router.navigate(['contacts']);
  }

  checkUserData(userId: string) {
    return this.firebaseService
      .getAllUsers()
      .filter((user) => user.id === userId);
  }

  toggleNav() {
    this.isMobileNavbarOpen = !this.isMobileNavbarOpen;
  }

  openEditDialog() {
    this.sharedService.isAnyDialogOpen = true;
    this.sharedService.isEditContactDialogOpen = true;
  }

  deleteContact() {
    this.sharedService.isAnyDialogOpen = true;
    this.sharedService.isDeleteContactDialogOpen = true;
  }

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

  convertTimestampHourDE(timestamp: number) {
    const date = new Date(timestamp * 1000);
    let hour = date.getHours();
    const minute = ('0' + date.getMinutes()).slice(-2);
    const second = ('0' + date.getMinutes()).slice(-2);

    return `${hour}:${minute}:${second} Uhr`;
  }

  @HostListener('document:click', ['$event'])
  checkOpenContactEdit(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.closest('.btn-edit')) {
      this.sharedService.isAnyDialogOpen = true;
      this.sharedService.isEditContactDialogOpen = true;
    } else if (targetElement.closest('.btn-delete')) {
      this.sharedService.isAnyDialogOpen = true;
      this.sharedService.isDeleteContactDialogOpen = true;
    } else if (!targetElement.closest('.dialog')) {
      this.sharedService.isAnyDialogOpen = false;
      this.sharedService.isEditContactDialogOpen = false;
      this.sharedService.isDeleteContactDialogOpen = false;
    }
  }
}
