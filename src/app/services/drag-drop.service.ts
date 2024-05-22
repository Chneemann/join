import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  itemDropped = new EventEmitter<{ id: string; status: string }>();
  itemMoved = new EventEmitter<{ status: string }>();

  constructor() {}

  startDragging(event: DragEvent, id: string | undefined) {
    if (id !== undefined) {
      event.dataTransfer?.setData('text/plain', id);
    }
  }

  allowDrop(event: DragEvent, status: string) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer) {
      this.itemMoved.emit({ status });
    }
  }

  drop(event: DragEvent, status: string) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer) {
      const id = dataTransfer.getData('text/plain');
      if (id) {
        this.itemDropped.emit({ id, status });
      }
    }
  }
}
