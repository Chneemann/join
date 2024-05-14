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

  ngOnInit(): void {
    this.checkCurrentRoute();
  }

  backClicked() {
    this.location.back();
  }

  checkCurrentRoute(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/privacy-policy') {
      this.isRouteLogin = true;
    }
  }
}
