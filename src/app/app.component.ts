import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { LanguageService } from './services/language.service';
import { SidebarMobileComponent } from './shared/components/sidebar/sidebar-mobile/sidebar-mobile.component';
import { ContactEditComponent } from './components/contacts/contact-edit/contact-edit.component';
import { CommonModule } from '@angular/common';
import { SharedService } from './services/shared.service';
import { ContactDeleteComponent } from './components/contacts/contact-delete/contact-delete.component';
import { OverlayComponent } from './shared/components/overlay/overlay.component';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    SidebarMobileComponent,
    ContactEditComponent,
    ContactDeleteComponent,
    CommonModule,
    OverlayComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'join';
  isLoggedIn: string = '';

  constructor(
    public langService: LanguageService,
    public sharedService: SharedService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {
    this.isLoggedIn = this.firebaseService.getCurrentUserId();
  }

  ngOnInit() {
    console.log(this.isLoggedIn);

    if (this.isLoggedIn === undefined) {
      this.router.navigate(['/login']);
    } else {
      this.getUserIdInLocalStorage();
      this.router.navigate(['/summary']);
    }
  }

  getUserIdInLocalStorage() {
    localStorage.setItem('currentUser', JSON.stringify('5EX7gnwPPGEDbN186Rdw'));
  }
}
