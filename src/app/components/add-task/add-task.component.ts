import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AssignedComponent } from './assigned/assigned.component';
import { User } from '../../interfaces/user.interface';
import { FirebaseService } from '../../services/firebase.service';
import { Task } from '../../interfaces/task.interface';
import { OverlayService } from '../../services/overlay.service';
import { FormBtnComponent } from '../../shared/components/buttons/form-btn/form-btn.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom, map } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { ApiService } from '../../services/api.service';
import { TaskUpdateService } from '../../services/task-update.service';

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
  isAssignedOpen: boolean = false;
  subtaskValue: string = '';
  searchValue: string = '';
  searchInput: boolean = false;
  filteredUsers: User[] = [];
  AssignedDialogId: string = '';
  dialogX: number = 0;
  dialogY: number = 0;

  constructor(
    public firebaseService: FirebaseService,
    private overlayService: OverlayService,
    private sharedService: SharedService,
    private taskService: TaskService,
    private apiService: ApiService,
    private authService: AuthService,
    private taskUpdateService: TaskUpdateService,
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
    subtasksTitle: [],
    subtasksDone: [],
    assigned: [],
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
    this.loadEditTaskData();
    this.routeParams();
    this.loadLocalStorageData();
  }

  setCurrentUserId() {
    this.authService
      .getCurrentUserId()
      .pipe(map((userId) => userId ?? ''))
      .subscribe((userId) => {
        this.taskData.creator = userId;
      });
  }

  /**
   * Loads task data for editing if applicable, or sets the task status if this is a new task overlay.
   * @param {string} overlayData The task id or status of the task to be loaded.
   * @param {string} overlayType The type of overlay to be opened.
   * @returns {void}
   */
  async loadEditTaskData() {
    if (this.overlayData) {
      const taskData = await firstValueFrom(this.getTaskData(this.overlayData));
      Object.assign(this.taskData, taskData);
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
  loadLocalStorageData() {
    const storedTaskData = localStorage.getItem('taskData');
    if (storedTaskData) {
      this.taskData = JSON.parse(storedTaskData);
    } else {
      this.saveTaskData();
    }
  }

  /**
   * Opens the user dialog for the given user id at the position of the mouse click
   * @param userId the id of the user
   * @param event the MouseEvent that triggered the dialog
   */
  openDialog(userId: any, event: MouseEvent) {
    this.AssignedDialogId = userId;
    this.updateDialogPosition(event);
  }

  /**
   * Updates the position of the user dialog based on the MouseEvent
   * @param event the MouseEvent that triggered the dialog
   */
  updateDialogPosition(event: MouseEvent) {
    this.dialogX = event.clientX + 25;
    this.dialogY = event.clientY + 10;
  }

  /**
   * Closes the assigned user dialog
   */
  closeDialog() {
    this.AssignedDialogId = '';
  }

  /**
   * Gets the task data from the Firebase service for the given task id.
   * @param taskId the id of the task
   * @returns {Task[]} an array of tasks with the given id
   */
  getTaskData(taskId: string) {
    return this.apiService.getTaskById(taskId);
  }

  /**
   * Adds a new subtask to the task data
   * @param subtaskName the name of the new subtask
   */
  addSubtask(subtaskName: string) {
    this.taskData.subtasksTitle.unshift(subtaskName);
    this.taskData.subtasksDone.push(false);
    this.saveTaskData();
  }

  /**
   * Deletes a subtask from the task data.
   * @param subtaskName the name of the subtask to delete
   */
  deleteSubtask(subtaskName: string) {
    const index = this.taskData.subtasksTitle.indexOf(subtaskName);
    if (index !== -1) {
      this.taskData.subtasksTitle.splice(index, 1);
      this.taskData.subtasksDone.splice(index, 1);
      this.saveTaskData();
    }
  }

  /**
   * Updates the filteredUsers array with users that match the current search value
   * from the getFilteredUsers list.
   * @param taskCreator the id of the task creator
   */
  searchTask(taskCreator: string): void {
    this.updateSearchInput();
    this.filteredUsers = this.firebaseService
      .getFilteredUsers(taskCreator)
      .filter(
        (user) =>
          user.firstName.toLowerCase().includes(this.searchValue) ||
          user.lastName.toLowerCase().includes(this.searchValue) ||
          user.initials.toLowerCase().includes(this.searchValue)
      );
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
   * Updates the subtask value by removing any potential XSS characters.
   * This ensures that the subtask value is sanitized before further processing or storage.
   */
  updateSubtaskValue() {
    this.subtaskValue = this.sharedService.replaceXSSChars(this.subtaskValue);
  }

  /**
   * Updates the taskData object with the given assigned users.
   * @param assigned an array of user ids
   * @returns {void}
   */
  receiveAssigned(assigned: string[]) {
    this.taskData.assigned = assigned;
  }

  /**
   * Toggle the assigned menu for the current task.
   * This function toggles the boolean flag isAssignedOpen, which determines whether the assigned menu is open or not.
   * @returns {void}
   */
  toggleAssignedMenu() {
    this.isAssignedOpen = !this.isAssignedOpen;
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
    this.saveTaskData();
  }

  /**
   * Saves the current task data to local storage.
   *
   * This function first runs the cross site scripting check on the task data,
   * then saves the task data to local storage.
   * @returns {void}
   */
  saveTaskData() {
    this.checkCrossSiteScripting();
    localStorage.setItem('taskData', JSON.stringify(this.taskData));
  }

  /**
   * Removes the task data from local storage and resets the form and form data.
   * @param form the form to reset
   * @returns {void}
   */
  removeTaskData(form: NgForm) {
    localStorage.removeItem('taskData');
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
    this.taskData.assigned = [];
    this.taskData.subtasksTitle = [];
    this.taskData.subtasksDone = [];
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

  onSubmit(ngForm: NgForm, overlayData: string) {
    if (ngForm.submitted && ngForm.form.valid) {
      const { id, ...taskWithoutId } = this.taskData;

      this.apiService.saveNewTask(taskWithoutId).subscribe({
        next: (response) => {
          this.taskUpdateService.notifyTaskUpdate();
          this.removeTaskData(ngForm);
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
  checkCrossSiteScripting() {
    this.taskData.title = this.sharedService.replaceXSSChars(
      this.taskData.title
    );
    this.taskData.description = this.sharedService.replaceXSSChars(
      this.taskData.description
    );
    this.taskData.subtasksTitle = this.taskData.subtasksTitle.map((title) =>
      this.sharedService.replaceXSSChars(title)
    );
  }

  /**
   * Deletes the task with the given overlay data from the Firebase Realtime Database and closes the overlay.
   * @param overlayData the overlay data of the task to be deleted
   * @returns {void}
   */
  deleteTask(overlayData: string) {
    this.apiService.deleteTaskById(overlayData);
    this.closeDialog();
  }

  @HostListener('document:click', ['$event'])
  /**
   * Closes the assigned dropdown menu if the user clicks anywhere outside of
   * the assigned dropdown menu.
   * @param event the MouseEvent
   * @returns {void}
   */
  checkOpenNavbar(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (
      !targetElement.closest('.search-assigned') &&
      !targetElement.closest('app-assigned') &&
      !targetElement.closest('.checkbox-img')
    ) {
      this.isAssignedOpen = false;
    }
  }
}
