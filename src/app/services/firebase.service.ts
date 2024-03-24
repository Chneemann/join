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
export class FirebaseService {
  firestore: Firestore = inject(Firestore);

  allTasks: any[] = [];

  updateAllTasks() {
    onSnapshot(collection(this.firestore, 'tasks'), (list) => {
      if (!list.empty) {
        this.allTasks = [];
        list.forEach((doc) => {
          const taskData = doc.data();
          taskData['id'] = doc.id;
          this.allTasks.push(taskData);
        });
      } else {
        console.info('No such document!');
      }
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
