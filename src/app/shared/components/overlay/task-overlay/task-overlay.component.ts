import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';
import { BtnCloseComponent } from '../../buttons/btn-close/btn-close.component';
import { CommonModule } from '@angular/common';
import { OverlayService } from '../../../../services/overlay.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BtnBackComponent } from '../../buttons/btn-back/btn-back.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-overlay',
  standalone: true,
  imports: [BtnCloseComponent, CommonModule, BtnBackComponent, TranslateModule],
  templateUrl: './task-overlay.component.html',
  styleUrl: './task-overlay.component.scss',
})
export class TaskOverlayComponent implements OnInit {
  @Input() overlayData: string = '';
  @Output() closeDialogEmitter = new EventEmitter<string>();

  overlayMobile: boolean = false;

  constructor(
    public firebaseService: FirebaseService,
    private overlayService: OverlayService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  categoryColors = new Map<string, string>([
    ['User Story', '#0038ff'],
    ['Technical Task', '#20d7c2'],
  ]);

  /**
   * OnInit lifecycle hook.
   *
   * Initializes the overlay component by checking if the `overlayData` is empty.
   * If it is, subscribes to route parameters to obtain and assign the `id` to `overlayData`.
   * Also sets `overlayMobile` to `true` if parameters are successfully retrieved.
   */
  ngOnInit() {
    if (this.overlayData == '') {
      if (this.route.params.subscribe()) {
        this.route.params.subscribe((params) => {
          this.overlayData = params['id'];
          this.overlayMobile = true;
        });
      }
    }
  }

  /**
   * Close the task overlay.
   *
   * Emits an empty string via the "closeDialogEmitter" output event, which
   * can be used to close the overlay from the parent component.
   */
  closeDialog() {
    this.closeDialogEmitter.emit('');
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

  /**
   * Deletes the task with the given overlay data from the Firebase Realtime Database and closes the overlay.
   * @param overlayData the overlay data of the task to be deleted
   * @returns {void}
   */
  deleteTask(overlayData: string) {
    this.firebaseService.deleteTask(overlayData);
    this.closeDialog();
  }

  /**
   * Gets the task data from the Firebase Realtime Database for the given task id.
   *
   * This function takes a task id and returns an array of tasks with the given id.
   * The function uses the Firebase service to get all tasks from the Realtime Database
   * and then filters the result to return only the task with the given id.
   *
   * @param taskId The id of the task to be retrieved.
   * @returns {Task[]} An array of tasks with the given id.
   */
  getTaskData(taskId: string) {
    return this.firebaseService
      .getAllTasks()
      .filter((task) => task.id === taskId);
  }

  /**
   * Retrieves the status of a single subtask of a task.
   *
   * This function takes the task id and the index of the subtask
   * and returns the status of the subtask at the given index.
   *
   * @param taskId The task id of the task containing the subtask.
   * @param index The index of the subtask.
   * @returns {boolean} The status of the subtask at the given index.
   */
  getSubTaskStatus(taskId: string, index: number) {
    const subtask = this.firebaseService
      .getAllTasks()
      .filter((task) => task.id === taskId);

    return subtask[0].subtasksDone[index];
  }

  /**
   * Toggles the status of a single subtask of a task.
   *
   * This function takes the task id, the index of the subtask,
   * the array of subtask statuses, and the status of the subtask.
   * It toggles the status of the subtask at the given index
   * and updates the subtasksDone property of the task in the
   * Firebase Realtime Database.
   *
   * @param taskId The task id of the task containing the subtask.
   * @param index The index of the subtask.
   * @param array The array of subtask statuses.
   * @param status The status of the subtask at the given index.
   */
  toggleSubtaskStatus(
    taskId: string,
    index: number,
    array: boolean[],
    status: boolean
  ) {
    status ? (array[index] = false) : (array[index] = true);
    this.firebaseService.updateSubTask(taskId, array);
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

  /**
   * Converts a date string to a human-readable format.
   *
   * @param dateString - The date string to convert.
   * @returns A string representing the date in the format "MMM. DD, YYYY".
   */
  timeConverter(dateString: string) {
    var a = new Date(dateString);
    var months = [
      'Jan.',
      'Feb.',
      'Mar.',
      'Apr.',
      'May.',
      'Jun.',
      'Jul.',
      'Aug.',
      'Sep.',
      'Oct.',
      'Nov.',
      'Dec.',
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = month + ' ' + date + ', ' + year;
    return time;
  }
}
