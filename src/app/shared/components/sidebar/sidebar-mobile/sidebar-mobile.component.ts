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

  /**
   * Lifecycle hook that is called after the component has been initialized.
   *
   * Calls the getCurrentPath method to set the currentPath property to the current route's url.
   */
  ngOnInit(): void {
    this.getCurrentPath();
  }

  /**
   * Returns true if the current route is one of the add-task routes (add-task, add-task/none, add-task/todo, add-task/inprogress, add-task/awaitfeedback, add-task/done).
   *
   * This is used to conditionally render the add-task button in the sidebar.
   * @returns true if the current route is one of the add-task routes, false otherwise.
   */
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

  /**
   * Subscribes to router events and updates the currentPath property
   * with the current route's URL, excluding the leading slash, whenever
   * a navigation ends.
   */
  getCurrentPath() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = this.router.url.substring(1);
      }
    });
  }
}
