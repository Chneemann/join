import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { LanguageService } from './services/language.service';
import { SidebarMobileComponent } from './shared/components/sidebar/sidebar-mobile/sidebar-mobile.component';
import { ContactEditNewComponent } from './components/contacts/contact-edit-new/contact-edit-new.component';
import { CommonModule } from '@angular/common';
import { SharedService } from './services/shared.service';
import { ContactDeleteComponent } from './components/contacts/contact-delete/contact-delete.component';
import { OverlayComponent } from './shared/components/overlay/overlay.component';
import { FirebaseService } from './services/firebase.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    SidebarMobileComponent,
    ContactEditNewComponent,
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
    this.checkAndClearLocalStorage();
    this.isLoggedIn = this.firebaseService.getCurrentUserId();
  }

  ngOnInit() {
    if (this.isLoggedIn === null) {
      this.checkPwResetRoute();
    } else {
      this.router.navigate(['/summary']);
      this.sharedService.isBtnDisabled = false;
    }
  }

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

  private getFirstSegment(urlTree: any): string {
    return urlTree.root.children['primary']?.segments[0]?.path || '';
  }
}
