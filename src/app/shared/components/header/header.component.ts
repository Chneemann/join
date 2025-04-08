import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NavbarComponent, CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  showNavbar: boolean = false;
  showLanguageNavbar: boolean = false;
  currentUser: User | null = null;

  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  /**
   * Loads the current user data by calling the loadCurrentUser method.
   */
  ngOnInit(): void {
    this.loadCurrentUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads the current user data and sets it to the `currentUser` property.
   */
  loadCurrentUser(): void {
    this.userService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userData) => {
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
