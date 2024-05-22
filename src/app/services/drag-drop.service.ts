import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  itemDropped = new EventEmitter<{ id: string; status: string }>();
  itemMovedFrom = new EventEmitter<{ status: string }>();
  itemMovedTo = new EventEmitter<{ status: string }>();

  constructor() {}

  startDragging(event: DragEvent, id: string | undefined, status: string) {
    if (id !== undefined) {
      event.dataTransfer?.setData('text/plain', id);
      this.itemMovedFrom.emit({ status });
    }
  }

  allowDrop(event: DragEvent, status: string) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer) {
      this.itemMovedTo.emit({ status });
    }
  }

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
