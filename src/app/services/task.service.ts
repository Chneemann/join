import { EventEmitter, Injectable, OnDestroy, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { Task } from '../interfaces/task.interface';
@Injectable({
  providedIn: 'root',
})
export class TaskService implements OnDestroy {
  firestore: Firestore = inject(Firestore);

  allTasks: Task[] = [];
  filteredTasks: Task[] = [];

  unsubTask;

  constructor() {
    this.unsubTask = this.subTaskList();
  }

  subTaskList() {
    return onSnapshot(collection(this.firestore, 'tasks'), (list) => {
      this.allTasks = [];
      list.forEach((element) => {
        const taskWithId = { id: element.id, ...element.data() } as Task;
        this.allTasks.push(taskWithId);
      });
    });
  }

  getAllTasks(): Task[] {
    return this.allTasks;
  }

  getFiltertTasks(): Task[] {
    return this.filteredTasks;
  }

  async updateTask(taskId: any, index: number) {
    await updateDoc(doc(collection(this.firestore, 'tasks'), taskId), {
      status: this.allTasks[index].status,
    }).catch((err) => {
      console.error(err);
    });
  }

  ngOnDestroy() {
    this.unsubTask();
  }
}
