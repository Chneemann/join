import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private overlayDataSubject = new BehaviorSubject<any>(null);
  overlayData$ = this.overlayDataSubject.asObservable();

  constructor() {}

  setOverlayData(overlay: string, data: any) {
    this.overlayDataSubject.next({ overlay, data });
  }
}
