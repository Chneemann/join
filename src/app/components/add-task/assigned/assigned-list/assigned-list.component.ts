import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../interfaces/user.interface';

@Component({
  selector: 'app-assigned-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assigned-list.component.html',
  styleUrl: './assigned-list.component.scss',
})
export class AssignedListComponent {
  @Input() filteredUsers: User[] = [];
  @Input() searchInput: boolean = false;
  @Input() taskCreator: string = '';
  @Output() assignedChange = new EventEmitter<string[]>();

  users: User[] = [];
  assigned: string[] = [];
  currentUser: User | null = null;

  constructor() {}

  ngOnInit() {
    this.loadTaskAssignedData();
  }

  /**
   * Updates the assignedChange event emitter with the current list of assigned users.
   * This should be called whenever the assigned list is updated.
   */
  updateAssigned() {
    this.assignedChange.emit(this.assigned);
  }

  /**
   * Toggles the assignment of a user to the task.
   *
   * If the user is not currently assigned, they are added to the assigned list.
   * If the user is already assigned, they are removed from the list.
   * Updates the local storage with the current list of assigned users and emits the
   * assignedChange event to notify other components of the update.
   *
   * @param userId The ID of the user to be added or removed from the assigned list.
   */
  addAssignedToTask(userId: string) {
    if (!this.assigned.includes(userId)) {
      this.assigned.push(userId);
    } else {
      this.assigned.splice(this.assigned.indexOf(userId), 1);
    }
    this.saveTaskData();
    this.updateAssigned();
  }

  /**
   * Saves the current list of assigned users to local storage.
   *
   * Retrieves the current task data from local storage, updates the assigned
   * list with the current list of assigned users, and saves the updated task
   * data back to local storage.
   */
  saveTaskData() {
    let taskDataString = localStorage.getItem('taskData');
    if (taskDataString !== null) {
      let taskData = JSON.parse(taskDataString);
      taskData.assigned = this.assigned;
      localStorage.setItem('taskData', JSON.stringify(taskData));
    }
  }

  /**
   * Loads the list of assigned users from local storage.
   *
   * Retrieves the task data from local storage, checks if the assigned list exists,
   * and if so, assigns the list to the local assigned variable.
   */
  loadTaskAssignedData() {
    const taskDataString = localStorage.getItem('taskData');
    if (taskDataString !== null) {
      const taskData = JSON.parse(taskDataString);
      if (taskData.hasOwnProperty('assigned')) {
        this.assigned = taskData.assigned;
      }
    }
  }
}
