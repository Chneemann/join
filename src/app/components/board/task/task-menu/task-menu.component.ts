import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-task-menu',
  standalone: true,
  imports: [],
  templateUrl: './task-menu.component.html',
  styleUrl: './task-menu.component.scss',
})
export class TaskMenuComponent {
  @Input() taskId: string = '';
  @Input() boardTaskStatus: string = '';

  constructor() {}

  /**
   * Moves the task to a specified status.
   *
   * This function updates the status of the task identified by `taskId`
   * in both `allTasks` and `filteredTasks` lists to the new status
   * specified by `moveTo`. It also updates the task status in the
   * Firestore database.
   *
   * @param moveTo - The new status to move the task to.
   */
  moveTask(moveTo: string) {
    // TODO
  }
}
