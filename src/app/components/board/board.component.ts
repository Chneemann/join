import { Component, ElementRef, ViewChild } from '@angular/core';
import { DragDropService } from '../../services/drag-drop.service';
import { CommonModule } from '@angular/common';
import { Task } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';
import { TaskComponent } from './task/task.component';
import { EMPTY, isEmpty } from 'rxjs';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  @ViewChild('searchField') searchField!: ElementRef;

  constructor(
    public dragDropService: DragDropService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.dragDropService.itemDropped.subscribe(({ id, status }) => {
      this.handleItemDropped(id, status);
    });
  }

  ngOnDestroy() {
    this.taskService.unsubTask();
  }

  getTask(status: string) {
    if (this.taskService.filteredTasks.length > 0) {
      return this.taskService.filteredTasks.filter(
        (task) => task.status === status
      );
    } else {
      return this.taskService.allTasks.filter((task) => task.status === status);
    }
  }

  handleItemDropped(id: string, status: string): void {
    const index = this.taskService.allTasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      this.taskService.allTasks[index].status = status;
      const filteredIndex = this.taskService.filteredTasks.findIndex(
        (task) => task.id === id
      );
      if (filteredIndex !== -1) {
        this.taskService.filteredTasks[filteredIndex].status = status;
      }
      this.taskService.updateTask(id, index);
    }
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
