import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../services/user.service';

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

  constructor(public userService: UserService) {}

  toggleNavbar() {
    this.navbarVisible = !this.navbarVisible;
  }

  toggleLanguage() {
    this.navbarLanguageVisible = !this.navbarLanguageVisible;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (
      !targetElement.closest('app-navbar') &&
      !targetElement.closest('.img-user')
    ) {
      this.navbarVisible = false;
    }
    if (
      !targetElement.closest('app-navbar') &&
      !targetElement.closest('.img-language')
    ) {
      this.navbarLanguageVisible = false;
    }
    if (targetElement.closest('.link')) {
      this.navbarVisible = false;
      this.navbarLanguageVisible = false;
    }
  }
}
