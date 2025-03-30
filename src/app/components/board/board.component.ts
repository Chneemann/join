import { Component } from '@angular/core';
import { DragDropService } from '../../services/drag-drop.service';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task/task.component';
import { TaskEmptyComponent } from './task/task-empty/task-empty.component';
import { FormsModule } from '@angular/forms';
import { OverlayService } from '../../services/overlay.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TaskHighlightedComponent } from './task/task-highlighted/task-highlighted.component';
import { ApiService } from '../../services/api.service';
import { Task } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TaskUpdateService } from '../../services/task-update.service';
import { ToastNotificationService } from '../../services/toast-notification.servic';
import { ResizeService } from '../../services/resize.service';

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
    LoadingSpinnerComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  private destroy$ = new Subject<void>();

  readonly TODO = 'todo';
  readonly IN_PROGRESS = 'inprogress';
  readonly AWAIT_FEEDBACK = 'awaitfeedback';
  readonly DONE = 'done';

  constructor(
    public dragDropService: DragDropService,
    public overlayService: OverlayService,
    private resizeService: ResizeService,
    private taskService: TaskService,
    private apiService: ApiService,
    private taskUpdateService: TaskUpdateService,
    private toastNotificationService: ToastNotificationService,
    private router: Router
  ) {}

  allTasks: Task[] = [];
  filteredTasks: { [key: string]: Task[] } = {};

  searchValue: string = '';
  searchInput: boolean = false;
  taskMovedTo: string = '';
  taskMovedFrom: string = '';
  isLoading = false;

  ngOnInit() {
    this.loadAllTasks();
    this.subscribeToTaskUpdates();
    this.subscribeToDragDropEvents();
  }

  loadAllTasks(): void {
    this.isLoading = true;

    this.taskService
      .getTasksWithUsers()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.allTasks = response.allTasks;
          this.filteredTasks = this.groupTasksByStatus(response.allTasks);
        },
        error: (err) => {
          console.error('Error loading the tasks:', err);
        },
      });
  }

  groupTasksByStatus(tasks: Task[]): { [key: string]: Task[] } {
    return tasks.reduce((acc, task) => {
      const status = task.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    }, {} as { [key: string]: Task[] });
  }

  private subscribeToTaskUpdates() {
    this.taskUpdateService.taskUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadAllTasks();
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
    this.resizeService.isPageViewMedia
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
        this.toastNotificationService.taskStatusUpdatedToast();
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
