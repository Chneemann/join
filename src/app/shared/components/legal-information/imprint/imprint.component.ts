import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BtnBackComponent } from '../../buttons/btn-back/btn-back.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [TranslateModule, BtnBackComponent, CommonModule],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss',
})
export class ImprintComponent {
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
    if (currentUrl === '/login/imprint') {
      this.isRouteLogin = true;
    }
  }
}
