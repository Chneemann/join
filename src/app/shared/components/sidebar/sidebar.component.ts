import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { AuthService } from '../../../services/auth.service';

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
    private authService: AuthService
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

  /**
   * Logs out the current user by calling the logout method of the AuthService.
   *
   * This will clear the user's authentication token and any associated session
   * data, and navigate the user to the logout page.
   */
  logout() {
    this.authService.logout();
  }
}
