import { Component, ElementRef, ViewChild } from '@angular/core';
import { DragDropService } from '../../services/drag-drop.service';
import { CommonModule } from '@angular/common';
import { Task } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';
import { TaskComponent } from './task/task.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  @ViewChild('searchField') searchField!: ElementRef;

  allTasks: Task[] = [];

  constructor(
    public dragDropService: DragDropService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.dragDropService.itemDropped.subscribe(({ index, status }) => {
      this.handleItemDropped(index, status);
    });
  }

  getTask() {
    return this.taskService.allTasks;
  }

  handleItemDropped(index: number, status: string): void {
    let firebaseId = this.taskService.allTasks[index].id;
    this.taskService.allTasks[index].status = status;
    this.taskService.updateTask(firebaseId, index);
    this.searchField.nativeElement.value = '';
  }

  isTaskRendered(taskColumn: string): boolean {
    for (let task of this.taskService.filteredTasks) {
      if (task.status === taskColumn) {
        return true;
      }
    }
    return false;
  }

  searchTask(): void {
    const search = this.searchField.nativeElement.value.toLowerCase();
    this.taskService.filteredTasks = this.taskService.allTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search) ||
        task.category.toLowerCase().includes(search)
    );
  }
}
