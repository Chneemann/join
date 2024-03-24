import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DragDropService } from '../../../services/drag-drop.service';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input() index: number | undefined;
  @Input() task: any;

  categoryColors = new Map<string, string>([
    ['HTML', '#E54B20'],
    ['CSS', '#214CE4'],
    ['JavaScript', '#D5BA32'],
    ['Angular', '#DD002D'],
  ]);

  constructor(
    public dragDropService: DragDropService,
    private taskService: TaskService
  ) {}

  // Subtasks

  completedSubtasks(index: number) {
    const subtasks = this.taskService.allTasks[index].subtasksDone;
    return subtasks.filter((subtask: boolean) => subtask === true).length;
  }

  completedSubtasksPercent(index: number): number {
    const subtasks = this.taskService.allTasks[index].subtasksDone;
    const completedSubtasksCount = subtasks.filter(
      (subtask: boolean) => subtask === true
    ).length;

    return (completedSubtasksCount / subtasks.length) * 100;
  }
}
