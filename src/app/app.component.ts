import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { LanguageService } from './services/language.service';
import { SidebarMobileComponent } from './shared/components/sidebar/sidebar-mobile/sidebar-mobile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    SidebarMobileComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'join';

  constructor(public langService: LanguageService, private router: Router) {
    this.router.events.subscribe((event) => {});
  }
}
