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

  /**
   * OnInit lifecycle hook. Subscribes to the following events:
   *
   * - itemDropped: updates the taskMovedTo and taskMovedFrom properties
   * - itemMovedTo: updates the taskMovedTo property
   * - itemMovedFrom: updates the taskMovedFrom property
   *
   * These properties are used to conditionally render a highlighted task
   * component when a task is moved.
   *
   * @returns void
   */
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

  /**
   * Adds a new task by opening a new route if the user is in page view mode,
   * or by setting the overlay data to open a new task overlay in overlay mode.
   * @param status The status of the task to be added.
   */
  addNewTaskOverlay(status: string) {
    this.sharedService.isPageViewMedia
      ? this.router.navigate(['/add-task', status])
      : this.overlayService.setOverlayData('newTaskOverlay', status);
  }

  /**
   * Retrieves tasks based on their status.
   * If a search input is active, it filters the tasks from the filteredTasks list.
   * Otherwise, it filters from the complete list of tasks.
   *
   * @param status The status of the tasks to be retrieved.
   * @returns A list of tasks matching the given status.
   */
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

  /**
   * Updates the status of a task in both the complete and filtered lists
   * of tasks when it is dropped.
   *
   * @param id The id of the task to be updated.
   * @param status The new status of the task.
   */
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

  /**
   * Clears the search input by resetting the search input flag and the search value, and
   * then calling searchTask() to update the list of tasks.
   */
  clearInput() {
    this.searchInput = false;
    this.searchValue = '';
    this.searchTask();
  }

  /**
   * Updates the search input flag and the search value by stripping any XSS
   * characters from the search value, and then setting the search input flag
   * to true if the search value is not empty, and false otherwise.
   *
   * @returns The updated search input flag.
   */
  updateSearchInput() {
    this.searchValue = this.sharedService.replaceXSSChars(this.searchValue);
    if (this.searchValue) {
      this.searchInput = this.searchValue.toLowerCase().length > 0;
    } else {
      this.searchInput = false;
    }
    return this.searchInput;
  }

  /**
   * Filters the list of tasks based on the current search value.
   *
   * It first calls updateSearchInput() to update the search input flag and the search value.
   * Then it sets the filteredTasks property of the FirebaseService to the result of calling
   * filter() on the list of all tasks, where the filter condition is that any of the
   * task's title, description, or category includes the search value (case-insensitive).
   */
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
