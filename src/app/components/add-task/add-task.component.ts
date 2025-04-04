import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AssignedComponent } from './assigned/assigned.component';
import { Subtask, Task } from '../../interfaces/task.interface';
import { OverlayService } from '../../services/overlay.service';
import { FormBtnComponent } from '../../shared/components/buttons/form-btn/form-btn.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom, map } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { ApiService } from '../../services/api.service';
import { UpdateNotifierService } from '../../services/update-notifier.service';
import { ToastNotificationService } from '../../services/toast-notification.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    AssignedComponent,
    FormBtnComponent,
    TranslateModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent implements OnInit {
  @Input() overlayData: string = '';
  @Input() overlayType: string = '';
  @Input() overlayMobile: boolean = false;

  currentDate: string = new Date().toISOString().split('T')[0];
  dateInPast: boolean = false;
  subtaskValue: string = '';

  constructor(
    private overlayService: OverlayService,
    private taskService: TaskService,
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
    category: '',
    status: this.taskService.getStatuses()[0],
    priority: this.taskService.getPriorities()[0],
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
  ngOnInit() {
    this.setCurrentUserId();
    this.loadExistingTaskData();
    this.routeParams();
  }

  setCurrentUserId() {
    this.authService
      .getCurrentUserId()
      .pipe(map((userId) => userId ?? ''))
      .subscribe((userId) => {
        this.taskData.creator = userId;
      });
  }

  async loadExistingTaskData() {
    if (this.overlayData) {
      const taskData = await firstValueFrom(this.getTaskData(this.overlayData));
      if (taskData) {
        this.taskData = { ...this.taskData, ...taskData };
      }
    } else if (this.overlayType === 'newTaskOverlay') {
      this.taskData.status = this.overlayData;
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
    if (this.route.params.subscribe()) {
      this.route.params.subscribe((params) => {
        if (params['id']) {
          this.taskData.status = params['id'];
        }
      });
    }
  }

  /**
   * Loads any existing task data from local storage and assigns it to the taskData object.
   * If no task data is present in local storage, this method saves the current taskData object to local storage.
   * @returns {void}
   */

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
   * Toggles the priority of the task between the given priority and the current priority.
   * If the given priority is different from the current priority, it sets the priority to the given priority,
   * otherwise it keeps the current priority.
   * After setting the priority, it saves the task data.
   * @param priority the priority to toggle to
   */
  togglePriority(priority: string) {
    this.taskData.priority !== priority
      ? (this.taskData.priority = priority)
      : this.taskData.priority;
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
    this.overlayService.setOverlayData('', '');
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
    this.taskData.category = '';
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
      this.apiService.saveNewTask(this.taskData).subscribe({
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
    this.apiService.deleteTaskById(overlayData);
  }

  replaceXSSChars(input: string) {
    if (!input) {
      return '';
    }
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
