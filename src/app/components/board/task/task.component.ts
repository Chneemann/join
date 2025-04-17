import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { DragDropService } from '../../../services/drag-drop.service';
import {
  Assignee,
  Task,
  TaskMoveEvent,
} from '../../../interfaces/task.interface';
import { OverlayService } from '../../../services/overlay.service';
import { Router } from '@angular/router';
import { TaskMenuComponent } from './task-menu/task-menu.component';
import { ResizeService } from '../../../services/resize.service';
import { take } from 'rxjs';
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from '../../../constants/task-category.constants';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, TranslateModule, TaskMenuComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input() task!: Task;
  @Output() updateStatusEmitter = new EventEmitter<TaskMoveEvent>();

  readonly CATEGORY_LABELS = CATEGORY_LABELS;
  readonly categoryColors = CATEGORY_COLORS;
  readonly DISABLE_DRAG_BREAKPOINT = 667;
  readonly DIALOG_OFFSET_X = 25;
  readonly DIALOG_OFFSET_Y = 10;

  pageViewMedia$ = this.resizeService.pageViewMedia$;

  assignees: Assignee[] = [];

  mobileMenuOpen = false;
  disableDrag = false;
  assignedDialogId = '';
  dialogX = 0;
  dialogY = 0;

  constructor(
    public dragDropService: DragDropService,
    public overlayService: OverlayService,
    public resizeService: ResizeService,
    private router: Router
  ) {}

  /**
   * Sets the initial state of the `disableDrag` property based on the window width.
   */
  ngOnInit(): void {
    this.updateDisableDragStatus();
  }

  /**
   * Updates the `disableDrag` property based on the current window width.
   */
  private updateDisableDragStatus(): void {
    this.disableDrag = window.innerWidth > this.DISABLE_DRAG_BREAKPOINT;
  }

  /**
   * Handles the button click event on a task in the board
   * @param event the MouseEvent
   * @param taskId the id of the task
   *
   * If the event target is a menu button or menu img, toggle the task menu
   * If the event target is anything else, open the task details overlay
   */
  handleMenuButtonClick(event: MouseEvent, taskId: string): void {
    event.stopPropagation();
    const targetElement = event.target as HTMLElement;
    targetElement.classList.contains('menu-btn') ||
    targetElement.classList.contains('menu-img')
      ? this.toggleMobileMenu()
      : this.openTaskDetailsOverlay(taskId);
  }

  /**
   * Toggle the task menu for the current task
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  /**
   * Open the task details overlay for the given task id
   * @param taskId the id of the task
   *
   * If the task menu is open, close it
   * If the page is in the media view, navigate to the task details page
   * If the page is not in the media view, open the task overlay
   */
  openTaskDetailsOverlay(taskId: string): void {
    if (this.mobileMenuOpen) {
      this.toggleMobileMenu();
    }
    this.pageViewMedia$.pipe(take(1)).subscribe((isPageViewMedia) => {
      isPageViewMedia
        ? this.router.navigate(['/task', taskId])
        : this.overlayService.setOverlayData('taskOverlay', taskId);
    });
  }

  /**
   * Opens the user dialog for the given user id at the position of the mouse click
   * @param userId the id of the user
   * @param event the MouseEvent that triggered the dialog
   */
  openDialog(userId: string, event: MouseEvent): void {
    this.assignedDialogId = userId;
    this.updateDialogPosition(event);
  }

  /**
   * Updates the position of the user dialog based on the MouseEvent
   * @param event the MouseEvent that triggered the dialog
   */
  updateDialogPosition(event: MouseEvent): void {
    this.dialogX = event.clientX + this.DIALOG_OFFSET_X;
    this.dialogY = event.clientY + this.DIALOG_OFFSET_Y;
  }

  /**
   * Closes the user dialog
   */
  closeDialog(): void {
    this.assignedDialogId = '';
  }

  /**
   * Returns the number of completed subtasks of the task
   * @returns the number of completed subtasks
   */
  completedSubtasks(): number {
    return this.task.subtasks.filter((subtask) => subtask.status).length;
  }

  /**
   * Calculates the percentage of completed subtasks
   * @returns the percentage of completed subtasks as a number
   */
  completedSubtasksPercent(): number {
    const completedSubtasksCount = this.task.subtasks.filter(
      (subtask) => subtask.status
    ).length;

    return this.task.subtasks.length > 0
      ? (completedSubtasksCount / this.task.subtasks.length) * 100
      : 0;
  }

  /**
   * Emits an event to update the status of a task.
   * @param event The TaskMoveEvent containing the task and the new status to move to.
   */
  onStatusUpdate(event: TaskMoveEvent): void {
    this.updateStatusEmitter.emit({
      task: event.task,
      moveTo: event.moveTo,
    });
  }

  @HostListener('document:click', ['$event'])
  /**
   * If the target element of the event is not a task menu button,
   * task menu img, or the task menu itself, close the task menu
   * @param event the MouseEvent
   */
  checkToggleTaskMenu(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const menuSelectors = ['.menu-btn', '.menu-img', 'app-task-menu'];
    const isMenuClicked = menuSelectors.some((selector) =>
      targetElement.closest(selector)
    );

    if (!isMenuClicked) {
      this.mobileMenuOpen = false;
    }
  }

  @HostListener('window:resize')
  /**
   * Called when the window is resized.
   * Updates the disableDragStatus so that tasks are not draggable on mobile devices.
   */
  onResize(): void {
    this.updateDisableDragStatus();
  }
}
