import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-mobile',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar-mobile.component.html',
  styleUrl: './sidebar-mobile.component.scss',
})
export class SidebarMobileComponent {
  currentPath: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getCurrentPath();
  }

  getCurrentPath() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = this.router.url.substring(1);
      }
    });
  }
}
