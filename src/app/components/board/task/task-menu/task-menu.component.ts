import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task, TaskMoveEvent } from '../../../../interfaces/task.interface';

@Component({
  selector: 'app-task-menu',
  standalone: true,
  imports: [],
  templateUrl: './task-menu.component.html',
  styleUrl: './task-menu.component.scss',
})
export class TaskMenuComponent {
  @Input() task!: Task;
  @Input() boardTaskStatus!: string;
  @Output() updateStatusEmitter = new EventEmitter<TaskMoveEvent>();

  readonly TODO = 'todo';
  readonly IN_PROGRESS = 'inprogress';
  readonly AWAIT_FEEDBACK = 'awaitfeedback';
  readonly DONE = 'done';

  moveTask(moveTo: string) {
    this.updateStatusEmitter.emit({
      task: this.task,
      moveTo: moveTo,
    });
  }
}
