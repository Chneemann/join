import { Component, Input } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-assigned',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assigned.component.html',
  styleUrl: './assigned.component.scss',
})
export class AssignedComponent {
  @Input() filteredUsers: User[] = [];
  @Input() searchInput: boolean = false;
  assigned: string[] = [];

  constructor(public firebaseService: FirebaseService) {
    this.loadTaskAssigedData();
  }

  addAssignedToTask(userId: string) {
    if (!this.assigned.includes(userId)) {
      this.assigned.push(userId);
    } else {
      this.assigned.splice(this.assigned.indexOf(userId), 1);
    }
    this.saveTaskData();
  }

  saveTaskData() {
    let taskDataString = localStorage.getItem('taskData');
    if (taskDataString !== null) {
      let taskData = JSON.parse(taskDataString);
      taskData.assigned = this.assigned;
      localStorage.setItem('taskData', JSON.stringify(taskData));
    }
  }

  loadTaskAssigedData() {
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
      return this.firebaseService.getAllUserWithoutGuest();
    }
  }
}
