import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { LoginService } from '../../../services/login.service';
import { FirebaseService } from '../../../services/firebase.service';

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
    private loginService: LoginService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.getCurrentPath();
  }

  logout() {
    this.loginService.logout(this.firebaseService.getCurrentUserId());
  }

  getCurrentPath() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = this.router.url.substring(1);
      }
    });
  }
}
