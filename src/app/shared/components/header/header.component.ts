import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

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
  }
}
