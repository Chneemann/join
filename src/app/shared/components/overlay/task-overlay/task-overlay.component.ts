import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BtnCloseComponent } from '../../buttons/btn-close/btn-close.component';
import { CommonModule } from '@angular/common';
import { OverlayService } from '../../../../services/overlay.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BtnBackComponent } from '../../buttons/btn-back/btn-back.component';
import { TranslateModule } from '@ngx-translate/core';
import { Task } from '../../../../interfaces/task.interface';
import { TaskService } from '../../../../services/task.service';
import { AuthService } from '../../../../services/auth.service';
import { map, Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../../../services/api.service';
import { UpdateNotifierService } from '../../../../services/update-notifier.service';
import { ToastNotificationService } from '../../../../services/toast-notification.service';

@Component({
  selector: 'app-task-overlay',
  standalone: true,
  imports: [BtnCloseComponent, CommonModule, BtnBackComponent, TranslateModule],
  templateUrl: './task-overlay.component.html',
  styleUrl: './task-overlay.component.scss',
})
export class TaskOverlayComponent implements OnInit, OnDestroy {
  @Input() overlayData: string = '';
  @Output() closeDialogEmitter = new EventEmitter<boolean>();

  task: Task | null = null;
  overlayMobile: boolean = false;
  currentUserId: string = '';
  showConfirmDialog = false;

  private destroy$ = new Subject<void>();

  constructor(
    private overlayService: OverlayService,
    private taskService: TaskService,
    private authService: AuthService,
    private apiService: ApiService,
    private updateNotifierService: UpdateNotifierService,
    private toastNotificationService: ToastNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  categoryColors = new Map<string, string>([
    ['User Story', '#0038ff'],
    ['Technical Task', '#20d7c2'],
  ]);

  ngOnInit(): void {
    this.setCurrentUserId();
    this.setOverlayDataFromRoute();
    this.loadTask(this.overlayData);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setCurrentUserId() {
    this.authService
      .getCurrentUserId()
      .pipe(
        takeUntil(this.destroy$),
        map((userId) => userId ?? '')
      )
      .subscribe((userId) => {
        this.currentUserId = userId;
      });
  }

  setOverlayDataFromRoute() {
    if (this.overlayData === '') {
      this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
        this.overlayData = params['id'];
        this.overlayMobile = true;
      });
    }
  }

  loadTask(taskId: string) {
    this.taskService
      .getTaskById(taskId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (task) => {
          this.task = task;
        },
        error: (err) => {
          console.error('Error loading the task:', err);
        },
      });
  }

  /**
   * Close the task overlay.
   *
   * Emits an empty string via the "closeDialogEmitter" output event, which
   * can be used to close the overlay from the parent component.
   */
  closeDialog() {
    this.closeDialogEmitter.emit(false);
  }

  /**
   * Edits the task with the given overlay data.
   *
   * Closes the task overlay and then either:
   * - Opens the task edit overlay if the window width is >= 650px
   * - Navigates to the task edit page if the window width is < 650px
   * @param overlayData the overlay data of the task to be edited
   */
  editTask(overlayData: string) {
    this.closeDialog();
    setTimeout(() => {
      if (window.innerWidth >= 650) {
        this.overlayService.setOverlayData('taskOverlayEdit', overlayData);
      } else {
        this.router.navigate(['/task-edit', overlayData]);
      }
    }, 10);
  }

  deleteTask(taskId: string) {
    this.apiService
      .deleteTaskById(taskId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (task) => {
          this.toastNotificationService.deleteTaskSuccessToast();
          this.updateNotifierService.notifyUpdate('task');
        },
        error: (err) => {
          console.error('Error deleting task', err);
        },
      });
    this.closeDialog();
  }

  toggleSubtaskStatus(
    taskId: string,
    subtaskId: string,
    subtaskTitle: string,
    currentStatus: boolean
  ) {
    const body = {
      subtask_id: subtaskId,
      subtask_title: subtaskTitle,
      subtask_status: !currentStatus,
    };
    this.apiService
      .updateSubtaskStatus(taskId, body)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.task?.subtasks.forEach((subtask) => {
            if (subtask.id === subtaskId) {
              subtask.status = !currentStatus;
            }
          });
          this.toastNotificationService.updateSubtaskSuccessToast();
          this.updateNotifierService.notifyUpdate('task');
        },
        (error) => {
          console.error('Error updating subtask:', error);
        }
      );
  }

  /**
   * Capitalizes the first letter of a given string.
   *
   * This function takes a string as an argument and returns a new string
   * with the first letter capitalized.
   * @param data The string to capitalize.
   * @returns {string} A new string with the first letter capitalized.
   */
  capitalizeFirstLetter(data: string) {
    return data.charAt(0).toUpperCase() + data.slice(1);
  }

  toggleConfirmDialog() {
    this.showConfirmDialog = !this.showConfirmDialog;
  }
}
