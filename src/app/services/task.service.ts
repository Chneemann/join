import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  firestore: Firestore = inject(Firestore);

  allTasks: any[] = [];
  filteredTasks: any[] = [];

  unsubTask;

  constructor() {
    this.unsubTask = this.subTaskList();
  }

  subTaskList() {
    return onSnapshot(this.getTaskRef(), (list) => {
      this.allTasks = [];
      list.forEach((element) => {
        const taskData = element.data();
        taskData['id'] = element.id;
        this.allTasks.push(taskData);
      });
    });
  }

  getTaskRef() {
    return collection(this.firestore, 'tasks');
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

  ngOnDestroy() {
    this.unsubTask;
  }
}
