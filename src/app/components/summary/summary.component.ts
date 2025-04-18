import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Task } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { finalize, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { HeadlineComponent } from '../../shared/components/headline/headline.component';
import {
  STATUS_LABELS,
  TaskStatus,
} from '../../constants/task-status.constants';
import {
  PRIORITIES,
  PRIORITY_LABELS,
} from '../../constants/task-priority.constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LoadingSpinnerComponent,
    HeadlineComponent,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent implements OnInit, OnDestroy {
  allTasks: Task[] = [];
  currentUser: User | null = null;
  isLoading = false;

  readonly UPPER_STATUSES = [TaskStatus.TODO, TaskStatus.DONE];
  readonly LOWER_STATUSES = [TaskStatus.IN_PROGRESS, TaskStatus.AWAIT_FEEDBACK];
  readonly PRIORITIES = PRIORITIES;
  readonly PRIORITY_LABELS = PRIORITY_LABELS;
  readonly STATUS_LABELS = STATUS_LABELS;

  private destroy$ = new Subject<void>();

  constructor(
    private translateService: TranslateService,
    private userService: UserService,
    private taskService: TaskService
  ) {}

  /**
   * Loads all tasks and the current user. Initializes the component
   * by fetching necessary data from the TaskService and UserService.
   */
  ngOnInit(): void {
    this.loadAllTasks();
    this.loadCurrentUser();
  }

  /**
   * Emits a value to the `destroy$` subject and completes it to clean up
   * subscriptions and prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads all tasks from the TaskService and sets them to the `allTasks` property.
   */
  loadAllTasks(): void {
    this.isLoading = true;

    this.taskService
      .getTasks()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (response) => {
          this.allTasks = response;
        },
        error: (err) => {
          console.error('Error loading the tasks:', err);
        },
      });
  }

  /**
   * Loads the current user from the UserService and sets it to the `currentUser` property.
   */
  loadCurrentUser(): void {
    this.userService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userData) => {
        this.currentUser = userData;
      });
  }

  /**
   * Gets the total number of tasks.
   * @returns The total count of tasks.
   */
  get totalTasks(): number {
    return this.allTasks.length;
  }

  /**
   * A map of task statuses to their respective counts.
   * @returns A Map where each key is a task status and each value is the count of tasks with that status.
   */
  get taskStatusCounts(): Map<string, number> {
    return this.allTasks.reduce((acc, task) => {
      acc.set(task.status, (acc.get(task.status) || 0) + 1);
      return acc;
    }, new Map<string, number>());
  }

  /**
   * A list of tasks with the priority set to "urgent".
   * @returns An array of tasks with the priority of "urgent".
   */
  get urgentTasks(): any[] {
    return this.allTasks.filter((task) => task.priority === 'urgent');
  }

  /**
   * Retrieves the date of the next urgent task.
   * @returns {string | null} The date of the next urgent task formatted as a string, or null if no urgent tasks exist.
   */
  get nextUrgentTask(): string | null {
    return this.urgentTasks.length
      ? this.urgentTasks.reduce((a, b) =>
          Date.parse(a.date) < Date.parse(b.date) ? a : b
        ).date
      : null;
  }

  /**
   * Returns a greeting based on the current time of day.
   * @returns a localized greeting string.
   */
  get greeting(): string {
    const hour = new Date().getHours();
    const key =
      hour < 5 || hour >= 18 ? 'evening' : hour < 12 ? 'morning' : 'afternoon';
    return this.translateService.instant(`summary.${key}`);
  }
}
