import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DragDropService } from '../../../services/drag-drop.service';
import { Task } from '../../../interfaces/task.interface';
import { FirebaseService } from '../../../services/firebase.service';
import { OverlayService } from '../../../services/overlay.service';
import { Router } from '@angular/router';
import { TaskMenuComponent } from './task-menu/task-menu.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, TaskMenuComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task: Task = {} as Task;
  private resizeListener!: () => void;

  isPageViewMedia: boolean = window.innerWidth <= 650;
  isMenuOpen: boolean = false;

  categoryColors = new Map<string, string>([
    ['User Story', '#0038ff'],
    ['Technical Task', '#20d7c2'],
  ]);

  constructor(
    public dragDropService: DragDropService,
    private firebaseService: FirebaseService,
    public overlayService: OverlayService,
    private router: Router
  ) {}

  ngOnInit() {
    this.resizeListener = this.onResize.bind(this);
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }

  onResize() {
    this.isPageViewMedia = window.innerWidth <= 650;
  }

  handleMenuButtonClick(event: MouseEvent, taskId: string | undefined) {
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

  openTaskDetailsOverlay(taskId: string | undefined) {
    if (this.isMenuOpen) {
      this.toggleTaskMenu();
    }
    this.isPageViewMedia
      ? this.router.navigate(['/task', taskId])
      : this.overlayService.setOverlayData('taskOverlay', taskId);
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
