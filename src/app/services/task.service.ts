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
        this.allTasks.push(this.setUserObject(element.data(), element.id));
      });
    });
  }

  setUserObject(obj: any, id: string): Task {
    return {
      id: id,
      title: obj.title,
      description: obj.description,
      category: obj.category,
      status: obj.status,
      priority: obj.priority,
      subtasksTitle: obj.subtasksTitle,
      subtasksDone: obj.subtasksDone,
      assigned: obj.assigned,
      timestamp: obj.timestamp,
    };
  }

  getAllTasks(): Task[] {
    return this.allTasks;
  }

  getFiltertTasks(): Task[] {
    return this.filteredTasks;
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
    this.unsubTask();
  }
}
