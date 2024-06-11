import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../interfaces/user.interface';
import { AddTaskComponent } from '../add-task.component';

@Component({
  selector: 'app-assigned',
  standalone: true,
  imports: [CommonModule, AddTaskComponent],
  templateUrl: './assigned.component.html',
  styleUrl: './assigned.component.scss',
})
export class AssignedComponent {
  @Input() filteredUsers: User[] = [];
  @Input() searchInput: boolean = false;
  @Input() taskCreator: string = '';
  @Output() assignedChange = new EventEmitter<string[]>();

  assigned: string[] = [];

  constructor(public firebaseService: FirebaseService) {
    this.loadTaskAssignedData();
  }

  updateAssigned() {
    this.assignedChange.emit(this.assigned);
  }

  addAssignedToTask(userId: string) {
    if (!this.assigned.includes(userId)) {
      this.assigned.push(userId);
    } else {
      this.assigned.splice(this.assigned.indexOf(userId), 1);
    }
    this.saveTaskData();
    this.updateAssigned();
  }

  saveTaskData() {
    let taskDataString = localStorage.getItem('taskData');
    if (taskDataString !== null) {
      let taskData = JSON.parse(taskDataString);
      taskData.assigned = this.assigned;
      localStorage.setItem('taskData', JSON.stringify(taskData));
    }
  }

  loadTaskAssignedData() {
    const taskDataString = localStorage.getItem('taskData');
    if (taskDataString !== null) {
      const taskData = JSON.parse(taskDataString);
      if (taskData.hasOwnProperty('assigned')) {
        this.assigned = taskData.assigned;
      }
    }
  }

  displayAssigned() {
    if (this.searchInput) {
      return this.filteredUsers;
    } else {
      return this.firebaseService.getAllUserWithoutGuestCurrentUserAndCreator(
        this.taskCreator
      );
    }
  }
}
