import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DragDropService } from '../../../services/drag-drop.service';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input() index: number | undefined;

  constructor(
    public dragDropService: DragDropService,
    public firebaseService: FirebaseService
  ) {}

  generateCategoryColor(index: number) {
    const task = this.firebaseService.allTasks[index];
    if (task.category === 'HTML') {
      return '#E54B20';
    } else if (task.category === 'CSS') {
      return '#214CE4';
    } else if (task.category === 'JavaScript') {
      return '#D5BA32';
    } else if (task.category === 'Angular') {
      return '#DD002D';
    } else {
      return '';
    }
  }
}
