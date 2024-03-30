import { Component, ElementRef, ViewChild } from '@angular/core';
import { DragDropService } from '../../services/drag-drop.service';
import { CommonModule } from '@angular/common';
import { Task } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';
import { TaskComponent } from './task/task.component';
import { TaskEmptyComponent } from './task/task-empty/task-empty.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskComponent, TaskEmptyComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  @ViewChild('searchField') searchField!: ElementRef;
  constructor(
    public dragDropService: DragDropService,
    private taskService: TaskService
  ) {}

  search!: string;

  ngOnInit() {
    this.dragDropService.itemDropped.subscribe(({ id, status }) => {
      this.handleItemDropped(id, status);
    });
  }

  getTaskStatus(status: string) {
    if (this.searchField) {
      this.search = this.searchField.nativeElement.value.toLowerCase();
      if (this.search.length > 0) {
        return this.taskService
          .getFiltertTasks()
          .filter((task) => task.status === status);
      } else {
        return this.taskService
          .getAllTasks()
          .filter((task) => task.status === status);
      }
    }
    return;
  }

  handleItemDropped(id: string, status: string): void {
    const index = this.taskService.allTasks.findIndex((task) => task.id === id);
    const filteredIndex = this.taskService.filteredTasks.findIndex(
      (task) => task.id === id
    );
    if (index !== -1) {
      this.taskService.allTasks[index].status = status;
      if (filteredIndex !== -1) {
        this.taskService.filteredTasks[filteredIndex].status = status;
      }
      this.taskService.updateTask(id, index);
    }
  }

  searchTask(): void {
    this.taskService.filteredTasks = this.taskService
      .getAllTasks()
      .filter(
        (task) =>
          task.title.toLowerCase().includes(this.search) ||
          task.description.toLowerCase().includes(this.search) ||
          task.category.toLowerCase().includes(this.search)
      );
  }
}
