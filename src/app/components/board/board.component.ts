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
  ) {}

  ngOnInit() {
    this.firebaseService.updateAllTasks();
    this.dragDropService.itemDropped.subscribe(({ index, status }) => {
      this.handleItemDropped(index, status);
    });
  }

  handleItemDropped(index: number, status: string): void {
    let firebaseId = this.firebaseService.allTasks[index].id;
    this.firebaseService.allTasks[index].status = status;
    this.firebaseService.updateTask(firebaseId, index);
  }

  isTaskRendered(taskColumn: string): boolean {
    for (let task of this.firebaseService.allTasks) {
      if (task.status === taskColumn) {
        return true;
      }
    }
    return false;
  }
}
