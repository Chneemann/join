import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BtnBackComponent } from '../../buttons/btn-back/btn-back.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [TranslateModule, BtnBackComponent, CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent implements OnInit {
  isRouteLogin: boolean = false;

  constructor(private location: Location, private router: Router) {}

  /**
   * OnInit lifecycle hook.
   *
   * Checks if the current route is '/login/privacy-policy' and sets
   * `isRouteLogin` accordingly.
   */
  ngOnInit(): void {
    this.checkCurrentRoute();
  }

  /**
   * Navigates back in the browser's history.
   */
  backClicked() {
    this.location.back();
  }

  /**
   * Checks the current route and updates the `isRouteLogin` flag.
   *
   * This method retrieves the current URL from the router. If the URL
   * matches '/login/privacy-policy', it sets the `isRouteLogin` property to true.
   */
  checkCurrentRoute(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/login/privacy-policy') {
      this.isRouteLogin = true;
    }
  }
}
