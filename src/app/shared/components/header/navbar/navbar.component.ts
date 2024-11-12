import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../../../services/language.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '../../../../services/auth.service';
import { FirebaseService } from '../../../../services/firebase.service';

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
    private loginService: LoginService,
    private firebaseService: FirebaseService
  ) {}

  /**
   * OnInit lifecycle hook.
   *
   * Sets the currentRoute property to the current route's url.
   */
  ngOnInit() {
    this.currentRoute = this.router.url;
  }

  /**
   * Logs out the current user and navigates to the login page.
   *
   * The logout method of the LoginService is called with the current user ID as
   * its argument. This will remove the user ID from the local storage and
   * perform any other necessary cleanup operations.
   *
   * The user is then navigated to the login page.
   */
  logout() {
    this.loginService.logout(this.firebaseService.getCurrentUserId());
  }
}
