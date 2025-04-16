import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TaskState } from 'zone.js/lib/zone-impl';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private overlayDataSubject = new BehaviorSubject<any>(null);
  overlayData$ = this.overlayDataSubject.asObservable();

  constructor() {}

  /**
   * Set the overlay data subject.
   *
   * @param overlay The overlay type.
   * @param data The overlay data.
   */
  setOverlayData(overlay: string | TaskState, data: any) {
    this.overlayDataSubject.next({ overlay, data });
  }

  clearOverlayData() {
    this.overlayDataSubject.next(null);
  }
}
