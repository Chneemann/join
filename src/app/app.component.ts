import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { LanguageService } from './services/language.service';
import { SidebarMobileComponent } from './shared/components/sidebar/sidebar-mobile/sidebar-mobile.component';
import { ContactEditComponent } from './components/contacts/contact-edit/contact-edit.component';
import { CommonModule } from '@angular/common';
import { SharedService } from './services/shared.service';
import { Observable } from 'rxjs';
import { ContactDeleteComponent } from './components/contacts/contact-delete/contact-delete.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    SidebarMobileComponent,
    ContactEditComponent,
    ContactDeleteComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'join';
  constructor(
    public langService: LanguageService,
    private router: Router,
    public sharedService: SharedService
  ) {
    this.router.events.subscribe((event) => {});
  }

  ngOnInit() {
    this.getUserIdInLocalStorage();
  }

  getUserIdInLocalStorage() {
    localStorage.setItem(
      'currentUserId',
      JSON.stringify('5EX7gnwPPGEDbN186Rdw')
    );
  }
}
