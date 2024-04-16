import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DragDropService } from '../../../services/drag-drop.service';
import { Task } from '../../../interfaces/task.interface';
import { FirebaseService } from '../../../services/firebase.service';
import { OverlayService } from '../../../services/overlay.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input() task!: Task;

  categoryColors = new Map<string, string>([
    ['User Story', '#0038ff'],
    ['Technical Task', '#20d7c2'],
  ]);

  constructor(
    public dragDropService: DragDropService,
    private firebaseService: FirebaseService,
    public overlayService: OverlayService
  ) {}

  showTaskDetails(taskId: string | undefined) {
    this.overlayService.setOverlayData(taskId);
  }

  // Subtasks

  completedSubtasks(): number {
    return this.task.subtasksDone.filter((subtask: boolean) => subtask === true)
      .length;
  }

  completedSubtasksPercent(): number {
    const subtasks = this.task.subtasksDone;
    const completedSubtasksCount = subtasks.filter(
      (subtask: boolean) => subtask === true
    ).length;

    return (completedSubtasksCount / subtasks.length) * 100;
  }

  // Assigned

  userBadged(id: string) {
    const userId = String(id);
    const user = this.firebaseService
      .getAllUsers()
      .find((user) => user.id === userId);
    if (user) {
      if (user.firstName === 'Guest') {
        return user.firstName.charAt(0);
      } else {
        const firstNameLetter = user.firstName.charAt(0);
        const lastNameLetter = user.lastName.charAt(0);
        return firstNameLetter + lastNameLetter;
      }
    } else {
      return;
    }
  }

  userBadgedColor(id: string) {
    const userId = String(id);
    const user = this.firebaseService
      .getAllUsers()
      .find((user) => user.id === userId);
    if (user) {
      return user.color;
    } else {
      return;
    }
  }
}
