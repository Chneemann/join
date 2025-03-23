import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { LoginService } from '../../../services/login.service';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  currentPath: string = '';

  constructor(
    private router: Router,
    public languageService: LanguageService,
    private loginService: LoginService,
    private firebaseService: FirebaseService
  ) {}

  /**
   * Lifecycle hook that is called after the component has been initialized.
   *
   * Calls the getCurrentPath method to set the currentPath property to the current route's url.
   */
  ngOnInit(): void {
    this.getCurrentPath();
  }

  /**
   * Logs out the current user and navigates to the login page.
   *
   * Calls the logout method of the LoginService with the current user ID as
   * its argument. This will remove the user ID from the local storage and
   * perform any other necessary cleanup operations.
   *
   * The user is then navigated to the login page.
   */
  logout() {
    this.loginService.logout(this.firebaseService.getCurrentUserId());
  }

  /**
   * Subscribes to router events and updates the currentPath property
   * with the current route's URL, excluding the leading slash, whenever
   * a navigation ends.
   */
  getCurrentPath() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = this.router.url.substring(1);
      }
    });
  }
}
