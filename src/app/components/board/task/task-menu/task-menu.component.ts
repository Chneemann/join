import { Component, Input } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';

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

  constructor(private firebaseService: FirebaseService) {}

  moveTask(moveTo: string) {
    const index = this.firebaseService.allTasks.findIndex(
      (task) => task.id === this.taskId
    );
    const filteredIndex = this.firebaseService.filteredTasks.findIndex(
      (task) => task.id === this.taskId
    );
    if (index !== -1) {
      this.firebaseService.allTasks[index].status = moveTo;
      if (filteredIndex !== -1) {
        this.firebaseService.filteredTasks[filteredIndex].status = moveTo;
      }
      this.firebaseService.updateTask(this.taskId, index);
    }
  }
}
