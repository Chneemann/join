import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import { UpdateNotifierService } from '../../services/update-notifier.service';
import { ToastNotificationService } from '../../services/toast-notification.service';
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
export class BoardComponent implements OnInit, OnDestroy {
  readonly TODO = 'todo';
  readonly IN_PROGRESS = 'inprogress';
  readonly AWAIT_FEEDBACK = 'awaitfeedback';
  readonly DONE = 'done';

  allTasks: Task[] = [];
  filteredTasks: { [key: string]: Task[] } = {};

  searchValue: string = '';
  searchInput: boolean = false;
  taskMovedTo: string = '';
  taskMovedFrom: string = '';
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    public dragDropService: DragDropService,
    public overlayService: OverlayService,
    private resizeService: ResizeService,
    private taskService: TaskService,
    private apiService: ApiService,
    private updateNotifierService: UpdateNotifierService,
    private toastNotificationService: ToastNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllTasks();
    this.subscribeToTaskUpdates();
    this.subscribeToDragDropEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAllTasks(): void {
    this.isLoading = true;

    this.taskService
      .getTasksWithUsers()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
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
    this.updateNotifierService.taskUpdated$
      .pipe(debounceTime(50), takeUntil(this.destroy$))
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
    this.dragDropService.itemDropped
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ task, status }) => {
        this.handleItemDropped(task, status);
      });

    this.dragDropService.itemMovedTo
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ status }) => {
        this.taskMovedTo = status;
      });

    this.dragDropService.itemMovedFrom
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ status }) => {
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
  handleItemDropped(task: Task, status: string): void {
    if (!task || task.status === status) return;

    this.apiService
      .updateTaskStatus(task.id!, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastNotificationService.taskStatusUpdatedToast();
          this.updateTaskStatus(task.id!, status);
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
