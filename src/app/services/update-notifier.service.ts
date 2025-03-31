import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateNotifierService {
  private updateSubjects: Record<string, Subject<void>> = {
    task: new Subject<void>(),
    contact: new Subject<void>(),
  };

  taskUpdated$ = this.updateSubjects['task'].asObservable();
  contactUpdated$ = this.updateSubjects['contact'].asObservable();

  notifyUpdate(type: 'task' | 'contact') {
    this.updateSubjects[type].next();
  }
}
