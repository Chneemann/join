import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NavbarComponent, CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  showNavbar: boolean = false;
  showLanguageNavbar: boolean = false;
  currentUser: User | null = null;

  constructor(private userService: UserService) {}

  /**
   * Loads the current user data by calling the loadCurrentUser method.
   */
  ngOnInit() {
    this.loadCurrentUser();
  }

  /**
   * Loads the current user data and sets it to the `currentUser` property.
   */
  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe((userData) => {
      this.currentUser = userData;
    });
  }

  /**
   * Toggles the visibility of the navbar.
   * @returns {void}
   */
  toggleNavbar(): void {
    this.showNavbar = !this.showNavbar;
  }

  /**
   * Toggles the visibility of the language selection navbar.
   * @returns {void}
   */
  toggleLanguageNavbar(): void {
    this.showLanguageNavbar = !this.showLanguageNavbar;
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
      this.showNavbar = false;
    }
    if (
      !targetElement.closest('app-navbar') &&
      !targetElement.closest('.img-lang')
    ) {
      this.showLanguageNavbar = false;
    }
    if (targetElement.closest('.link')) {
      this.showNavbar = false;
      this.showLanguageNavbar = false;
    }
  }
}
