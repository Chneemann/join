import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { FirebaseService } from '../../services/firebase.service';
import { LanguageService } from '../../services/language.service';
import { SharedService } from '../../services/shared.service';
import { SidebarMobileComponent } from '../../shared/components/sidebar/sidebar-mobile/sidebar-mobile.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ContactDeleteComponent } from '../contacts/contact-delete/contact-delete.component';
import { ContactEditNewComponent } from '../contacts/contact-edit-new/contact-edit-new.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    SidebarMobileComponent,
    ContactEditNewComponent,
    ContactDeleteComponent,
    CommonModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  isLoggedIn: string = '';

  constructor(
    public langService: LanguageService,
    public sharedService: SharedService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {
    this.checkAndClearLocalStorage();
    this.isLoggedIn = this.firebaseService.getCurrentUserId();
  }

  /**
   * Lifecycle hook that is called after the component has been initialized.
   *
   * Checks if the user is logged in by verifying the `isLoggedIn` property.
   */
  ngOnInit() {
    if (this.isLoggedIn === null) {
      this.checkPwResetRoute();
    } else {
      this.router.navigate(['/summary']);
      this.sharedService.isBtnDisabled = false;
    }
  }

  /**
   * Clears the local storage after a certain time period (12h) has
   * passed since the last login.
   */
  checkAndClearLocalStorage() {
    const startTime = localStorage.getItem('sessionTimeJOIN');

    if (startTime) {
      const startTimeMills = parseInt(startTime);
      const currentTime = new Date().getTime();
      const timeDifference = 12 * 60 * 60 * 1000; // 12h
      if (currentTime - startTimeMills > timeDifference) {
        localStorage.clear();
      }
    }
  }

  /**
   * Listens to router events and checks if the current route is one of the
   * allowed routes for password reset, registration, forgotten password,
   * or login. If it is not, it navigates to the login page.
   */
  checkPwResetRoute() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const urlTree = this.router.parseUrl(this.router.url);
        const firstSegment = this.getFirstSegment(urlTree);
        const allowedRoutes = ['pw-reset', 'register', 'forgot-pw', 'login'];

        if (!allowedRoutes.includes(firstSegment)) {
          this.router.navigate(['/login']);
        }
      });
  }

  /**
   * Returns the first segment of the current URL or an empty string if it does not exist.
   *
   * @param urlTree The current URL tree.
   * @returns The first segment of the current URL or an empty string if it does not exist.
   */
  private getFirstSegment(urlTree: any): string {
    return urlTree.root.children['primary']?.segments[0]?.path || '';
  }
}
