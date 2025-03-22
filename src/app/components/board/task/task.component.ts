import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { DragDropService } from '../../../services/drag-drop.service';
import { Task } from '../../../interfaces/task.interface';
import { FirebaseService } from '../../../services/firebase.service';
import { OverlayService } from '../../../services/overlay.service';
import { Router } from '@angular/router';
import { TaskMenuComponent } from './task-menu/task-menu.component';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, TaskMenuComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input() task: Task = {} as Task;
  isMenuOpen: boolean = false;
  AssignedDialogId: string = '';
  dialogX: number = 0;
  dialogY: number = 0;

  creator: any = '';
  assignees: any[] = [];

  categoryColors = new Map<string, string>([
    ['User Story', '#0038ff'],
    ['Technical Task', '#20d7c2'],
  ]);

  constructor(
    public dragDropService: DragDropService,
    public firebaseService: FirebaseService,
    public overlayService: OverlayService,
    public sharedService: SharedService,
    private router: Router
  ) {}

  /**
   * Handles the button click event on a task in the board
   * @param event the MouseEvent
   * @param taskId the id of the task
   *
   * If the event target is a menu button or menu img, toggle the task menu
   * If the event target is anything else, open the task details overlay
   */
  handleMenuButtonClick(event: MouseEvent, taskId: string) {
    event.stopPropagation();
    const targetElement = event.target as HTMLElement;
    targetElement.classList.contains('menu-btn') ||
    targetElement.classList.contains('menu-img')
      ? this.toggleTaskMenu()
      : this.openTaskDetailsOverlay(taskId);
  }

  /**
   * Toggle the task menu for the current task
   */
  toggleTaskMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Open the task details overlay for the given task id
   * @param taskId the id of the task
   *
   * If the task menu is open, close it
   * If the page is in the media view, navigate to the task details page
   * If the page is not in the media view, open the task overlay
   */
  openTaskDetailsOverlay(taskId: string) {
    if (this.isMenuOpen) {
      this.toggleTaskMenu();
    }
    this.sharedService.isPageViewMedia
      ? this.router.navigate(['/task', taskId])
      : this.overlayService.setOverlayData('taskOverlay', taskId);
  }

  @HostListener('document:click', ['$event'])
  /**
   * If the target element of the event is not a task menu button,
   * task menu img, or the task menu itself, close the task menu
   * @param event the MouseEvent
   */
  checkToggleTaskMenu(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const menuSelectors = ['.menu-btn', '.menu-img', 'app-task-menu'];
    const isMenuClicked = menuSelectors.some((selector) =>
      targetElement.closest(selector)
    );

    if (!isMenuClicked) {
      this.isMenuOpen = false;
    }
  }

  // User Dialog

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
   * Closes the user dialog
   */
  closeDialog() {
    this.AssignedDialogId = '';
  }

  // Subtasks

  /**
   * Returns the number of completed subtasks of the task
   * @returns the number of completed subtasks
   */
  completedSubtasks(): number {
    return this.task.subtasks.filter((subtask) => subtask.done).length;
  }

  /**
   * Calculates the percentage of completed subtasks
   * @returns the percentage of completed subtasks as a number
   */
  completedSubtasksPercent(): number {
    const completedSubtasksCount = this.task.subtasks.filter(
      (subtask) => subtask.done
    ).length;

    return (completedSubtasksCount / this.task.subtasks.length) * 100;
  }

  // Assigned

  /**
   * Returns the initials of the user
   * @param id the id of the user
   * @returns the initials of the user as a string
   */
  userBadged(id: string) {
    const userId = String(id);
    const user = this.firebaseService
      .getAllUsers()
      .find((user) => user.id === userId);
    if (user) {
      if (user.firstName === 'Guest') {
        return user.firstName.charAt(0);
      } else {
        const firstNameLetter = user.firstName.charAt(0);
        const lastNameLetter = user.lastName.charAt(0);
        return firstNameLetter + lastNameLetter;
      }
    } else {
      return;
    }
  }

  /**
   * Returns the color of the user with the given id
   * @param id the id of the user
   * @returns the color of the user as a string
   */
  userBadgedColor(id: string) {
    const userId = String(id);
    const user = this.firebaseService
      .getAllUsers()
      .find((user) => user.id === userId);
    if (user) {
      return user.color;
    } else {
      return;
    }
  }
}
