import { EventEmitter, Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { Task } from '../interfaces/task.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  firestore: Firestore = inject(Firestore);

  allTasks: Task[] = [];
  filteredTasks: Task[] = [];

  constructor() {}

  subTaskList() {
    return new Observable<void>((observer) => {
      const unsubscribe = onSnapshot(
        collection(this.firestore, 'tasks'),
        (list) => {
          this.allTasks = [];
          list.forEach((element) => {
            const taskData = { ...(element.data() as Task), id: element.id };
            this.allTasks.push(taskData);
          });
          observer.next();
        }
      );
      return () => unsubscribe();
    });
  }

  async updateTask(taskId: any, index: number) {
    await updateDoc(
      doc(collection(this.firestore, 'tasks'), taskId),
      this.getCleanJson(this.allTasks[index])
    ).catch((err) => {
      console.error(err);
    });
  }

  getCleanJson(task: any): {} {
    return {
      category: task.category,
      description: task.description,
      title: task.title,
      status: task.status,
    };
  }
}
