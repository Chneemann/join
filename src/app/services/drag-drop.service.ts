import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  itemDropped = new EventEmitter<{ index: number; status: string }>();

  constructor() {}

  startDragging(event: DragEvent, index: number) {
    event.dataTransfer?.setData('text/plain', index.toString());
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  drop(event: DragEvent, status: string) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer) {
      const index = +dataTransfer.getData('text/plain');
      if (!isNaN(index)) {
        this.itemDropped.emit({ index, status });
      }
    }
  }
}
