import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Task } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { finalize, Subject, takeUntil } from 'rxjs';

import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [RouterModule, TranslateModule, LoadingSpinnerComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent implements OnInit, OnDestroy {
  allTasks: Task[] = [];
  nextUrgendTask: number[] = [];
  currentUser: User | null = null;
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private translateService: TranslateService,
    private userService: UserService,
    private taskService: TaskService
  ) {}

  /**
   * This method loads all tasks from the TaskService.
   */
  ngOnInit(): void {
    this.loadAllTasks();
    this.loadCurrentUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads all tasks from the TaskService.
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
    if (this.urgentTasks.length === 0) return null;

    const nextTask = this.urgentTasks.reduce((earliest, current) => {
      return Date.parse(current.date) < Date.parse(earliest.date)
        ? current
        : earliest;
    });

    return this.timeConverter(nextTask.date);
  }

  /**
   * Converts a date string to a human-readable format.
   * @param dateString - The date string to convert.
   * @returns A string representing the date in the format "MMM. DD, YYYY".
   */
  timeConverter(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  /**
   * Returns a greeting based on the current time of day.
   * @returns a localized greeting string.
   */
  get greeting(): string {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return this.translateService.instant('summary.morning');
    }
    if (currentHour >= 12 && currentHour < 18) {
      return this.translateService.instant('summary.afternoon');
    }
    return this.translateService.instant('summary.evening');
  }
}
