import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FirebaseService } from '../../../services/firebase.service';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NavbarComponent, CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  navbarVisible: boolean = false;
  navbarLanguageVisible: boolean = false;
  currentUser: any = null;

  constructor(
    public firebaseService: FirebaseService,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  /**
   * Loads the current user data by calling the loadCurrentUser method.
   */
  ngOnInit() {
    this.loadCurrentUser();
  }

  /**
   * Loads the current user data by calling the getCurrentUserId method of the AuthService.
   */
  loadCurrentUser(): void {
    this.authService.getCurrentUserId().subscribe((userId) => {
      if (userId) {
        this.apiService.getUserById(userId).subscribe(
          (userData) => {
            this.currentUser = userData;
          },
          () => {
            this.currentUser = {};
          }
        );
      }
    });
  }

  /**
   * Toggles the visibility of the navbar.
   * @returns {void}
   */
  toggleNavbar(): void {
    this.navbarVisible = !this.navbarVisible;
  }

  /**
   * Toggles the visibility of the language selection navbar.
   * @returns {void}
   */
  toggleLanguage(): void {
    this.navbarLanguageVisible = !this.navbarLanguageVisible;
  }

  @HostListener('document:click', ['$event'])
  /**
   * Closes the navbar if the user clicks outside of it
   * @param event a MouseEvent
   * @returns {void}
   */
  checkOpenNavbar(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (
      !targetElement.closest('app-navbar') &&
      !targetElement.closest('.img-user')
    ) {
      this.navbarVisible = false;
    }
    if (
      !targetElement.closest('app-navbar') &&
      !targetElement.closest('.img-lang')
    ) {
      this.navbarLanguageVisible = false;
    }
    if (targetElement.closest('.link')) {
      this.navbarVisible = false;
      this.navbarLanguageVisible = false;
    }
  }
}
