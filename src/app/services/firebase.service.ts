import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Task } from '../interfaces/task.interface';
import { User } from '../interfaces/user.interface';
import CryptoJS from 'crypto-es';
import { CryptoJSSecretKey } from './../environments/config';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  private secretKey: string = CryptoJSSecretKey.secretKey;

  allTasks: Task[] = [];
  filteredTasks: Task[] = [];
  allUsers: User[] = [];

  unsubTask;
  unsubUser;

  constructor() {
    this.unsubTask = this.subTaskList();
    this.unsubUser = this.subUserList();
  }

  // ------------- TASKS ------------- //

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

  async updateTask(taskId: string, index: number) {
    await updateDoc(doc(collection(this.firestore, 'tasks'), taskId), {
      status: this.allTasks[index].status,
    }).catch((err) => {
      console.error(err);
    });
  }

  async updateSubTask(taskId: string, array: boolean[]) {
    await updateDoc(doc(collection(this.firestore, 'tasks'), taskId), {
      subtasksDone: array,
    }).catch((err) => {
      console.error(err);
    });
  }

  async replaceTaskData(taskId: string, newData: Task) {
    await setDoc(
      doc(collection(this.firestore, 'tasks'), taskId),
      newData
    ).catch((err) => {
      console.error(err);
    });
  }

  async deleteTask(taskId: string) {
    await deleteDoc(doc(collection(this.firestore, 'tasks'), taskId)).catch(
      (err) => {
        console.error(err);
      }
    );
  }

  async addNewTask(task: Task) {
    await addDoc(collection(this.firestore, 'tasks'), task).catch((err) => {
      console.error(err);
    });
  }

  // ------------- USERS ------------- //

  subUserList() {
    return onSnapshot(collection(this.firestore, 'users'), (list) => {
      this.allUsers = [];
      list.forEach((element) => {
        const userWithId = { id: element.id, ...element.data() } as User;
        this.allUsers.push(userWithId);
      });
    });
  }

  getAllUsers(): User[] {
    return this.allUsers;
  }

  getAllUserWithoutGuest(): User[] {
    return this.getAllUsers().filter((user) => user.initials !== 'G');
  }

  getAllUserWithoutGuestCurrentUserAndCreator(taskCreator: string): User[] {
    const currentUser = this.getCurrentUserId();
    const usersWithoutGuestAndCurrent = this.getAllUsers().filter(
      (user) => user.initials !== 'G' && user.id !== currentUser
    );
    return usersWithoutGuestAndCurrent.filter(
      (user) => user.id !== taskCreator
    );
  }

  getUserDataFromId(userId: string): User[] {
    return this.getAllUsers().filter((user) => user.id === userId);
  }

  getUserDataFromUid(userUid: string): User[] {
    return this.getAllUsers().filter((user) => user.uId === userUid);
  }

  getCurrentUserId() {
    const encryptedValue = localStorage.getItem('currentUserJOIN');
    if (encryptedValue) {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, this.secretKey);
      const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedValue);
    }
    return null;
  }

  getUserDetails(userId: string, query: keyof User) {
    return this.getAllUsers()
      .filter((user) => user.id === userId)
      .map((user) => user[query]);
  }

  async deleteUser(docId: string) {
    await deleteDoc(doc(collection(this.firestore, 'users'), docId)).catch(
      (err) => {
        console.error(err);
      }
    );
  }

  async updateUserData(docId: string, data: any) {
    await updateDoc(
      doc(collection(this.firestore, 'users'), docId),
      data
    ).catch((err) => {
      console.error(err);
    });
  }

  async addNewUser(userData: User) {
    try {
      return await addDoc(collection(this.firestore, 'users'), userData);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  ngOnDestroy() {
    this.unsubTask();
    this.unsubUser();
  }
}
