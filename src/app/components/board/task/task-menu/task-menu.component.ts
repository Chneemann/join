import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Task,
  TaskMoveEvent,
  TaskStatus,
} from '../../../../interfaces/task.interface';
import {
  STATUS_LABELS,
  STATUSES,
} from '../../../../constants/task-status.constants';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-menu',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './task-menu.component.html',
  styleUrl: './task-menu.component.scss',
})
export class TaskMenuComponent {
  @Input() task!: Task;
  @Input() currentTaskStatus!: TaskStatus;
  @Output() updateStatusEmitter = new EventEmitter<TaskMoveEvent>();

  readonly STATUSES = STATUSES;
  readonly STATUS_LABELS = STATUS_LABELS;

  moveTask(moveTo: TaskStatus) {
    this.updateStatusEmitter.emit({ task: this.task, moveTo });
  }
}
