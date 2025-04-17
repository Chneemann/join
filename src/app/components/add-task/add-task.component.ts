import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AssignedComponent } from './assigned/assigned.component';
import {
  Subtask,
  Task,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from '../../interfaces/task.interface';
import { OverlayService } from '../../services/overlay.service';
import { FormBtnComponent } from '../../shared/components/buttons/form-btn/form-btn.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom, map, Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { UpdateNotifierService } from '../../services/update-notifier.service';
import { ToastNotificationService } from '../../services/toast-notification.service';
import { HeadlineComponent } from '../../shared/components/headline/headline.component';
import {
  PRIORITIES,
  PRIORITY_LABELS,
} from '../../constants/task-priority.constants';
import {
  CATEGORIES,
  CATEGORY_LABELS,
} from '../../constants/task-category.constants';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HeadlineComponent,
    AssignedComponent,
    FormBtnComponent,
    TranslateModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent implements OnInit, OnDestroy {
  @Input() overlayData: string = '';
  @Input() overlayType: string = '';
  @Input() overlayMobile: boolean = false;

  readonly PRIORITIES = PRIORITIES;
  readonly PRIORITY_LABELS = PRIORITY_LABELS;
  readonly CATEGORIES = CATEGORIES;
  readonly CATEGORY_LABELS = CATEGORY_LABELS;

  currentDate: string = new Date().toISOString().split('T')[0];
  dateInPast: boolean = false;
  subtaskValue: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private overlayService: OverlayService,
    private apiService: ApiService,
    private authService: AuthService,
    private updateNotifierService: UpdateNotifierService,
    private toastNotificationService: ToastNotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  taskData: Task = {
    title: '',
    description: '',
    category: TaskCategory.USER_STORY,
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    subtasks: [],
    assignees: [],
    userData: [],
    creator: '',
    date: this.currentDate,
  };

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * This method performs the following actions:
   * - Loads task data for editing if applicable.
   * - Sets up route parameters to determine task status.
   * - Loads any existing task data from local storage.
   */
  ngOnInit(): void {
    this.setCurrentUserId();
    this.loadExistingTaskData();
    this.routeParams();
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
        this.taskData.creator = userId;
      });
  }

  async loadExistingTaskData() {
    if (this.overlayType === 'newTaskOverlay') {
      // OverlayData = Status "todo"
      const statusCandidate = this.overlayData as TaskStatus;

      if (Object.values(TaskStatus).includes(statusCandidate)) {
        this.taskData.status = statusCandidate;
      } else {
        console.warn('Invalid status in overlayData:', this.overlayData);
      }
    } else if (this.overlayData) {
      // OverlayData = Current TaskId
      const taskData = await firstValueFrom(this.getTaskData(this.overlayData));
      if (taskData) {
        this.taskData = { ...this.taskData, ...taskData };
      }
    }
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * This method performs the following actions:
   * - Subscribes to route parameters to determine task status.
   * - Updates the task status if a route parameter is present.
   * @returns {void}
   */
  routeParams() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['id']) {
        this.taskData.status = params['id'];
      }
    });
  }

  getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.URGENT:
        return 'red';
      case TaskPriority.MEDIUM:
        return 'orange';
      case TaskPriority.LOW:
        return 'green';
      default:
        return 'white';
    }
  }

  getPriorityIcon(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.URGENT:
        return './../../../assets/img/urgent.svg';
      case TaskPriority.MEDIUM:
        return './../../../assets/img/medium.svg';
      case TaskPriority.LOW:
        return './../../../assets/img/low.svg';
      default:
        return '';
    }
  }

  togglePriority(priority: TaskPriority): void {
    this.taskData.priority = priority;
  }

  /**
   * Gets the task data from the Firebase service for the given task id.
   * @param taskId the id of the task
   * @returns {Task[]} an array of tasks with the given id
   */
  getTaskData(taskId: string) {
    return this.apiService.getTaskById(taskId);
  }

  addSubtask(subtaskName: string) {
    const newSubtask: Subtask = {
      title: subtaskName,
      status: false,
    };
    this.taskData.subtasks.push(newSubtask);
  }

  deleteSubtask(subtaskToDelete: Subtask) {
    this.taskData.subtasks = this.taskData.subtasks.filter(
      (subtask) => subtask !== subtaskToDelete
    );
  }

  /**
   * Updates the subtask value by removing any potential XSS characters.
   * This ensures that the subtask value is sanitized before further processing or storage.
   */
  updateSubtaskValue() {
    this.subtaskValue = this.replaceXSSChars(this.subtaskValue);
  }

  /**
   * Updates the taskData object with the given assigned users.
   * @param assigned an array of user ids
   * @returns {void}
   */
  receiveAssigned(assigned: string[]) {
    this.taskData.assignees = assigned.map((userId) => ({
      userId: userId,
    }));
  }

  /**
   * Checks if the selected date is in the past.
   *
   * This function compares the date selected in the taskData with the current date.
   * If the selected date is earlier than the current date, it sets the dateInPast flag to true,
   * otherwise it sets the flag to false.
   */
  checkDateInput() {
    const currentDateForm = this.taskData.date.replaceAll('-', '');
    const currentDate = new Date()
      .toISOString()
      .split('T')[0]
      .replaceAll('-', '');
    currentDateForm < currentDate
      ? (this.dateInPast = true)
      : (this.dateInPast = false);
  }

  /**
   * Removes the task data from local storage and resets the form and form data.
   * @param form the form to reset
   * @returns {void}
   */
  clearTaskData(form: NgForm) {
    this.clearForm(form);
    this.clearFormData();
  }

  /**
   * Closes the overlay and resets the overlay data.
   *
   * @returns {void}
   */
  closeOverlay() {
    this.overlayService.clearOverlayData();
  }

  /**
   * Resets the title, description, and category form controls to their pristine state.
   *
   * @param form the form containing the controls to reset
   * @returns {void}
   */
  clearForm(form: NgForm) {
    form.controls['title'].reset();
    form.controls['description'].reset();
    form.controls['category'].reset();
  }

  /**
   * Resets the task data to its initial state.
   *
   * This method sets the task date to the current date and clears the category,
   * assigned users, subtask titles, and subtask completion states.
   */
  clearFormData() {
    this.taskData.date = this.currentDate;
    this.taskData.category = TaskCategory.USER_STORY;
    this.taskData.assignees = [];
    this.taskData.subtasks = [];
  }

  /**
   * Handles the enter key press event in the subtask input field.
   *
   * If the enter key is pressed while the subtask input field is focused,
   * this function adds the subtask title to the task data and resets
   * the value of the input field.
   * @param event the keyboard event
   * @returns {void}
   */
  handleEnterKey(event: Event) {
    event.preventDefault();
    if (event instanceof KeyboardEvent) {
      if (event.target instanceof HTMLInputElement) {
        const inputField = event.target as HTMLInputElement;
        if (inputField.name === 'subtask') {
          this.addSubtask(inputField.value);
          inputField.value = '';
          this.subtaskValue = '';
        }
      }
    }
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      if (this.overlayType === 'taskOverlayEdit') {
        this.updateTask(ngForm);
      } else {
        this.createTask(ngForm);
      }
    }
  }

  createTask(ngForm: NgForm) {
    this.apiService
      .saveNewTask(this.taskData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toastNotificationService.createTaskSuccessToast();
          this.updateNotifierService.notifyUpdate('task');
          this.clearTaskData(ngForm);
          this.closeOverlay();
          this.router.navigate(['/board']);
        },
        error: (error) => {
          console.error('Fehler beim Speichern:', error);
        },
      });
  }

  updateTask(ngForm: NgForm) {
    // OverlayData = Current TaskId
    this.apiService
      .updateTask(this.taskData, this.overlayData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toastNotificationService.updateTaskSuccessToast();
          this.updateNotifierService.notifyUpdate('task');
          this.clearTaskData(ngForm);
          this.closeOverlay();
          this.router.navigate(['/board']);
        },
        error: (error) => {
          console.error('Fehler beim Speichern:', error);
        },
      });
  }

  /**
   * Sanitizes the task data by removing any potential cross-site scripting characters.
   * This ensures that the task data is safe to be stored in the Firebase Realtime Database.
   * @returns {void}
   */
  checkCrossSiteScripting(): void {
    this.taskData.title = this.replaceXSSChars(this.taskData.title);
    this.taskData.description = this.replaceXSSChars(this.taskData.description);
    this.taskData.subtasks = this.taskData.subtasks.map((subtask) => ({
      ...subtask,
      title: this.replaceXSSChars(subtask.title),
    }));
  }

  /**
   * Deletes the task with the given overlay data from the Firebase Realtime Database and closes the overlay.
   * @param overlayData the overlay data of the task to be deleted
   * @returns {void}
   */
  deleteTask(overlayData: string) {
    // OverlayData = Current TaskId
    this.apiService.deleteTaskById(overlayData);
  }

  replaceXSSChars(input: string) {
    if (!input) {
      return '';
    }
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
