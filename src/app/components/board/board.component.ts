import { Component } from '@angular/core';
import { DragDropService } from '../../services/drag-drop.service';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task/task.component';
import { TaskEmptyComponent } from './task/task-empty/task-empty.component';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { OverlayService } from '../../services/overlay.service';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { TranslateModule } from '@ngx-translate/core';
import { TaskHighlightedComponent } from './task/task-highlighted/task-highlighted.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    TaskComponent,
    TaskEmptyComponent,
    FormsModule,
    TranslateModule,
    TaskHighlightedComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  constructor(
    public dragDropService: DragDropService,
    public overlayService: OverlayService,
    private firebaseService: FirebaseService,
    private sharedService: SharedService,
    private router: Router
  ) {}
  searchValue: string = '';
  searchInput: boolean = false;
  taskMovedTo: string = '';
  taskMovedFrom: string = '';
  taskDropped: boolean = false;

  ngOnInit() {
    this.dragDropService.itemDropped.subscribe(({ id, status }) => {
      this.handleItemDropped(id, status);
    });
    this.dragDropService.itemMovedTo.subscribe(({ status }) => {
      this.taskMovedTo = status;
    });
    this.dragDropService.itemMovedFrom.subscribe(({ status }) => {
      this.taskMovedFrom = status;
    });
  }

  addNewTaskOverlay(status: string) {
    this.sharedService.isPageViewMedia
      ? this.router.navigate(['/add-task', status])
      : this.overlayService.setOverlayData('newTaskOverlay', status);
  }

  getTaskStatus(status: string) {
    if (this.updateSearchInput()) {
      return this.firebaseService
        .getFiltertTasks()
        .filter((task) => task.status === status);
    } else {
      return this.firebaseService
        .getAllTasks()
        .filter((task) => task.status === status);
    }
  }

  handleItemDropped(id: string, status: string): void {
    const index = this.firebaseService.allTasks.findIndex(
      (task) => task.id === id
    );
    const filteredIndex = this.firebaseService.filteredTasks.findIndex(
      (task) => task.id === id
    );
    if (index !== -1) {
      this.firebaseService.allTasks[index].status = status;
      if (filteredIndex !== -1) {
        this.firebaseService.filteredTasks[filteredIndex].status = status;
      }
      this.firebaseService.updateTask(id, index);
    }
  }

  clearInput() {
    this.searchInput = false;
    this.searchValue = '';
    this.searchTask();
  }

  updateSearchInput() {
    this.searchValue = this.sharedService.replaceXSSChars(this.searchValue);
    if (this.searchValue) {
      this.searchInput = this.searchValue.toLowerCase().length > 0;
    } else {
      this.searchInput = false;
    }
    return this.searchInput;
  }

  searchTask(): void {
    this.updateSearchInput();
    this.firebaseService.filteredTasks = this.firebaseService
      .getAllTasks()
      .filter(
        (task) =>
          task.title.toLowerCase().includes(this.searchValue) ||
          task.description.toLowerCase().includes(this.searchValue) ||
          task.category.toLowerCase().includes(this.searchValue)
      );
  }
}
