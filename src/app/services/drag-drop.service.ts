import { Injectable, EventEmitter } from '@angular/core';
import { Task, TaskStatus } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  itemDropped = new EventEmitter<{ task: Task; status: TaskStatus }>();
  itemMovedFrom = new EventEmitter<{ status: string }>();
  itemMovedTo = new EventEmitter<{ status: string }>();

  private draggedTask: Task | null = null;

  constructor() {}

  /**
   * Start a drag/drop operation. Called on the dragstart event.
   * @param event The dragstart event.
   * @param task The task being dragged.
   * @remarks
   * - Sets the dragged task to the given task.
   * - Emits the `itemMovedFrom` event with the status of the task.
   */
  startDragging(event: DragEvent, task: Task) {
    if (task.id) {
      event.dataTransfer?.setData('text/plain', task.id);
      this.draggedTask = task;
      this.itemMovedFrom.emit({ status: task.status });
    }
  }

  /**
   * Called on the dragover event.
   * @param event The dragover event.
   * @param status The status of the column being dropped on.
   * @remarks
   * - Prevents the default browser behavior.
   * - Emits the `itemMovedTo` event with the status of the column.
   */
  allowDrop(event: DragEvent, status: TaskStatus) {
    event.preventDefault();
    this.itemMovedTo.emit({ status });
  }

  /**
   * Complete the drag/drop operation. Called on the drop event.
   * @param event The drop event.
   * @param newStatus The status of the column being dropped on.
   * @remarks
   * - Prevents the default browser behavior.
   * - If the dragged task is not null and the new status is different from its current status,
   *   emits the `itemDropped` event with the task and the new status.
   * - Sets the dragged task to null.
   * - Emits the `itemMovedTo` event with an empty status, to reset the highlight.
   */
  drop(event: DragEvent, newStatus: TaskStatus) {
    event.preventDefault();

    if (this.draggedTask) {
      if (this.draggedTask.status !== newStatus) {
        this.itemDropped.emit({ task: this.draggedTask, status: newStatus });
      }
      this.draggedTask = null;
    }

    this.itemMovedTo.emit({ status: '' });
  }
}
