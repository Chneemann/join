import { Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('searchField') searchField!: ElementRef;

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
    this.searchField.nativeElement.value = '';
  }

  isTaskRendered(taskColumn: string): boolean {
    for (let task of this.firebaseService.filteredTasks) {
      if (task.status === taskColumn) {
        return true;
      }
    }
    return false;
  }

  searchTask(): void {
    const search = this.searchField.nativeElement.value.toLowerCase();
    this.firebaseService.filteredTasks = this.firebaseService.allTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search) ||
        task.category.toLowerCase().includes(search)
    );
  }
}
