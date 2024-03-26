import { EventEmitter, Injectable, inject } from '@angular/core';
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
export class TaskService {
  firestore: Firestore = inject(Firestore);
  tasksLoaded: EventEmitter<void> = new EventEmitter<void>();

  allTasks: Task[] = [];
  filteredTasks: Task[] = [];

  unsubTask;

  constructor() {
    this.unsubTask = this.subTaskList();
  }

  subTaskList() {
    return onSnapshot(this.getTaskRef(), (list) => {
      this.allTasks = [];
      list.forEach((element) => {
        const taskData = { ...(element.data() as Task), id: element.id };
        this.allTasks.push(taskData);
      });
      this.tasksLoaded.emit();
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
