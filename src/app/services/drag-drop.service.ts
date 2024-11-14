import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  itemDropped = new EventEmitter<{ id: string; status: string }>();
  itemMovedFrom = new EventEmitter<{ status: string }>();
  itemMovedTo = new EventEmitter<{ status: string }>();

  constructor() {}

  /**
   * This function is called when a drag event starts.
   *
   * It sets the `id` of the item being dragged to the `dataTransfer` object
   * and emits an event indicating that the item has been moved from a certain
   * status.
   *
   * @param event The drag event.
   * @param id The id of the item being dragged.
   * @param status The status of the item being dragged.
   */
  startDragging(event: DragEvent, id: string | undefined, status: string) {
    if (id !== undefined) {
      event.dataTransfer?.setData('text/plain', id);
      this.itemMovedFrom.emit({ status });
    }
  }

  /**
   * Allows a drop event to occur by preventing the default handling of the event.
   *
   * This function is called during the dragover event to indicate that the dragged
   * item can be dropped in the current target. It prevents the default behavior and
   * emits an event indicating that the item is being moved to a specified status.
   *
   * @param event The drag event.
   * @param status The status to which the item is being moved.
   */
  allowDrop(event: DragEvent, status: string) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer) {
      this.itemMovedTo.emit({ status });
    }
  }

  /**
   * This function is called when the user drops an item that was being dragged.
   *
   * It prevents the default behavior of the drop event and emits an event
   * indicating that the item has been dropped. It also emits an event indicating
   * that the item has been moved to a certain status.
   *
   * @param event The drag event.
   * @param status The status to which the item is being moved.
   */
  drop(event: DragEvent, status: string) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer) {
      const id = dataTransfer.getData('text/plain');
      if (id) {
        this.itemDropped.emit({ id, status });
        status = '';
        this.itemMovedTo.emit({ status });
      }
    }
  }
}
