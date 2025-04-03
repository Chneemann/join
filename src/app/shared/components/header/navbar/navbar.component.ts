import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../../../services/language.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '../../../../services/login.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() navbarVisible: boolean = false;
  @Input() navbarLanguageVisible: boolean = false;

  currentRoute: string = '';

  constructor(
    public langService: LanguageService,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Lifecycle hook that is called after the component has been initialized.
   *
   * Sets the currentRoute property to the current route's url.
   */
  ngOnInit() {
    this.currentRoute = this.router.url;
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
