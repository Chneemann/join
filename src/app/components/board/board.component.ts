import { Component } from '@angular/core';
import { DragDropService } from '../../services/drag-drop.service';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task/task.component';
import { TaskEmptyComponent } from './task/task-empty/task-empty.component';
import { FormsModule } from '@angular/forms';
import { OverlayService } from '../../services/overlay.service';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { TranslateModule } from '@ngx-translate/core';
import { TaskHighlightedComponent } from './task/task-highlighted/task-highlighted.component';
import { ApiService } from '../../services/api.service';
import { Task } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';

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
  readonly TODO = 'todo';
  readonly IN_PROGRESS = 'inprogress';
  readonly AWAIT_FEEDBACK = 'awaitfeedback';
  readonly DONE = 'done';

  constructor(
    public dragDropService: DragDropService,
    public overlayService: OverlayService,
    private sharedService: SharedService,
    private taskService: TaskService,
    private apiService: ApiService,
    private router: Router
  ) {}

  allTasks: Task[] = [];
  filteredTasks: { [key: string]: Task[] } = {};

  searchValue: string = '';
  searchInput: boolean = false;
  taskMovedTo: string = '';
  taskMovedFrom: string = '';

  /**
   * Is called when the component is initialized.
   * Calls the `loadTasks` method to load tasks and subscribes to drag-and-drop events via `subscribeToDragDropEvents`.
   */
  ngOnInit() {
    this.loadTasks();
    this.subscribeToDragDropEvents();
  }

  /**
   * Retrieves all tasks from the API and initializes the `allTasks` and `filteredTasks` properties.
   */
  loadTasks(): void {
    this.taskService.loadAllTasks().subscribe({
      next: (result) => {
        this.allTasks = result.allTasks;
        this.filteredTasks = result.filteredTasks;
      },

      error: (err) => {
        console.error('Error loading the tasks:', err);
      },
    });
  }

  /**
   * Subscribes to events from the DragDropService and handles them.
   * @remarks
   * Handles the following events:
   * - `itemDropped`: Calls `handleItemDropped` with the task id and status.
   * - `itemMovedTo`: Sets `taskMovedTo` to the status.
   * - `itemMovedFrom`: Sets `taskMovedFrom` to the status.
   */
  private subscribeToDragDropEvents(): void {
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
   * Opens an overlay or navigates to the add-task page based on the view mode.
   * @param status The status to be used for the new task.
   */
  addNewTaskOverlay(status: string) {
    this.sharedService.isPageViewMedia
      ? this.router.navigate(['/add-task', status])
      : this.overlayService.setOverlayData('newTaskOverlay', status);
  }

  /**
   * Handles the event when an item is dropped on a column.
   * @param taskId The id of the task being moved.
   * @param status The status of the column where the task was dropped.
   */
  handleItemDropped(taskId: string, status: string): void {
    this.apiService.updateTaskStatus(taskId, status).subscribe({
      next: () => {
        this.updateTaskStatus(taskId, status);
      },
      error: (error) => console.error('Error updating task:', error),
    });
  }

  /**
   * Updates the status of a task in the local task lists.
   * @param taskId The ID of the task to be updated.
   * @param status The new status to assign to the task.
   */
  updateTaskStatus(taskId: string, status: string) {
    const updatedTask = this.allTasks.find((task) => task.id === taskId);
    if (updatedTask) {
      const oldStatus = updatedTask.status;
      updatedTask.status = status;

      this.filteredTasks[oldStatus] = this.filteredTasks[oldStatus].filter(
        (task) => task !== updatedTask
      );
      this.filteredTasks[status] = [
        ...(this.filteredTasks[status] || []),
        updatedTask,
      ];
    }
  }

  /**
   * Clears the search input by resetting the search input flag and the search value.
   */
  clearInput() {
    this.searchInput = false;
    this.searchValue = '';
    this.searchTask(this.searchValue);
  }

  /**
   * Filters the tasks by the given search term.
   * @param searchTerm The search term to filter the tasks by.
   * @returns The filtered tasks, with the same structure as the original tasks.
   */
  searchTask(searchTerm: string): void {
    searchTerm = searchTerm.toLowerCase();

    this.filteredTasks = Object.fromEntries(
      Object.entries(this.filteredTasks).map(([status]) => [
        status,
        this.allTasks.filter(
          (task) =>
            task.status === status &&
            (task.title.toLowerCase().includes(searchTerm) ||
              task.description.toLowerCase().includes(searchTerm))
        ),
      ])
    );
  }
}
