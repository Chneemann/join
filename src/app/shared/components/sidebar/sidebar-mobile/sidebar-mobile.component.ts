import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar-mobile',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslateModule],
  templateUrl: './sidebar-mobile.component.html',
  styleUrl: './sidebar-mobile.component.scss',
})
export class SidebarMobileComponent {
  currentPath: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getCurrentPath();
  }

  isAddTask(): boolean {
    return (
      this.currentPath === 'add-task' ||
      this.currentPath === 'add-task/none' ||
      this.currentPath === 'add-task/todo' ||
      this.currentPath === 'add-task/inprogress' ||
      this.currentPath === 'add-task/awaitfeedback' ||
      this.currentPath === 'add-task/done'
    );
  }

  getCurrentPath() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = this.router.url.substring(1);
      }
    });
  }
}
