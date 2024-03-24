import { Component } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { DragDropService } from '../../services/drag-drop.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TaskComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  tasks = [
    {
      id: '1',
      category: 'HTML',
      status: 'todo',
    },
    {
      id: '2',
      category: 'CSS',
      status: 'done',
    },
  ];

  constructor(public dragDropService: DragDropService) {
    this.dragDropService.itemDropped.subscribe(({ index, status }) => {
      if (index >= 0 && index < this.tasks.length) {
        this.tasks[index].status = status;
      }
    });
  }
}
