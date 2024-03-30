import { Component, ElementRef, ViewChild } from '@angular/core';
import { DragDropService } from '../../services/drag-drop.service';
import { CommonModule } from '@angular/common';
import { Task } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';
import { TaskComponent } from './task/task.component';
import { TaskEmptyComponent } from './task/task-empty/task-empty.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskComponent, TaskEmptyComponent, FormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  constructor(
    public dragDropService: DragDropService,
    private taskService: TaskService
  ) {}
  searchValue: string = '';
  searchInput: boolean = false;

  ngOnInit() {
    this.dragDropService.itemDropped.subscribe(({ id, status }) => {
      this.handleItemDropped(id, status);
    });
  }

  getTaskStatus(status: string) {
    if (this.updateSearchInput()) {
      return this.taskService
        .getFiltertTasks()
        .filter((task) => task.status === status);
    } else {
      return this.taskService
        .getAllTasks()
        .filter((task) => task.status === status);
    }
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

  clearInput() {
    this.searchInput = false;
    this.searchValue = '';
    this.searchTask();
  }

  updateSearchInput() {
    if (this.searchValue) {
      this.searchInput = this.searchValue.toLowerCase().length > 0;
    } else {
      this.searchInput = false;
    }
    return this.searchInput;
  }

  searchTask(): void {
    this.updateSearchInput();
    this.taskService.filteredTasks = this.taskService
      .getAllTasks()
      .filter(
        (task) =>
          task.title.toLowerCase().includes(this.searchValue) ||
          task.description.toLowerCase().includes(this.searchValue) ||
          task.category.toLowerCase().includes(this.searchValue)
      );
  }
}
