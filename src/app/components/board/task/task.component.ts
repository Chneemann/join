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

  handleMenuButtonClick(event: MouseEvent, taskId: string) {
    event.stopPropagation();
    const targetElement = event.target as HTMLElement;
    targetElement.classList.contains('menu-btn') ||
    targetElement.classList.contains('menu-img')
      ? this.toggleTaskMenu()
      : this.openTaskDetailsOverlay(taskId);
  }

  toggleTaskMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openTaskDetailsOverlay(taskId: string) {
    if (this.isMenuOpen) {
      this.toggleTaskMenu();
    }
    this.sharedService.isPageViewMedia
      ? this.router.navigate(['/task', taskId])
      : this.overlayService.setOverlayData('taskOverlay', taskId);
  }

  @HostListener('document:click', ['$event'])
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

  // Dialog

  openDialog(userId: any, event: MouseEvent) {
    this.AssignedDialogId = userId;
    this.updateDialogPosition(event);
  }

  updateDialogPosition(event: MouseEvent) {
    this.dialogX = event.clientX + 25;
    this.dialogY = event.clientY + 10;
  }

  closeDialog() {
    this.AssignedDialogId = '';
  }

  // Subtasks

  completedSubtasks(): number {
    return this.task.subtasksDone.filter((subtask: boolean) => subtask === true)
      .length;
  }

  completedSubtasksPercent(): number {
    const subtasks = this.task.subtasksDone;
    const completedSubtasksCount = subtasks.filter(
      (subtask: boolean) => subtask === true
    ).length;

    return (completedSubtasksCount / subtasks.length) * 100;
  }

  // Assigned

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
