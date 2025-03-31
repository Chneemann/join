import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateNotifierService {
  private updateSubjects: Record<string, Subject<string>> = {
    task: new Subject<string>(),
    contact: new Subject<string>(),
  };

  taskUpdated$ = this.updateSubjects['task'].asObservable();
  contactUpdated$ = this.updateSubjects['contact'].asObservable();

  notifyUpdate(type: 'task' | 'contact', payload?: string) {
    this.updateSubjects[type].next(payload ?? '');
  }
}
