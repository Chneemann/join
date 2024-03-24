import { Component } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { DragDropService } from '../../services/drag-drop.service';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TaskComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  constructor(
    public dragDropService: DragDropService,
    public firebaseService: FirebaseService
  ) {
    this.dragDropService.itemDropped.subscribe(({ index, status }) => {
      this.firebaseService.allTasks[index].status = status;
      this.firebaseService.updateTask(
        this.firebaseService.allTasks[index].id,
        index
      );
    });
  }

  ngOnInit() {
    this.firebaseService.updateAllTasks();
  }
}
