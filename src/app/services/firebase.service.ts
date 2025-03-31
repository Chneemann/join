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
import CryptoES from 'crypto-es';
import { CryptoESSecretKey } from './../environments/config';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  private secretKey: string = CryptoESSecretKey.secretKey;

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

  /**
   * Subscribes to Firestore for the list of all tasks.
   *
   * This function uses the `onSnapshot` function from `@angular/fire/firestore` to
   * subscribe to the 'tasks' collection in Firestore. When the data in the
   * collection changes, this function is called with a `QuerySnapshot` object as an
   * argument. The function then iterates over the `QuerySnapshot` and creates a
   * `Task` object from each document in the snapshot. The created `Task` objects are
   * then stored in the `allTasks` array.
   *
   * @returns The unsubscribe function from `onSnapshot`.
   */
  subTaskList() {
    return onSnapshot(collection(this.firestore, 'tasks'), (list) => {
      this.allTasks = [];
      list.forEach((element) => {
        const taskWithId = { id: element.id, ...element.data() } as Task;
        this.allTasks.push(taskWithId);
      });
    });
  }

  /**
   * Returns the list of all tasks.
   *
   * This function simply returns the value of the `allTasks` property, which is
   * an array of `Task` objects that is kept up-to-date by the `subTaskList`
   * function.
   *
   * @returns The list of all tasks.
   */
  getAllTasks(): Task[] {
    return this.allTasks;
  }

  /**
   * Returns the list of tasks that match the current filter.
   *
   * This function simply returns the value of the `filteredTasks` property, which
   * is an array of `Task` objects that is kept up-to-date by the `searchTask`
   * function.
   *
   * @returns The list of filtered tasks.
   */
  getFiltertTasks(): Task[] {
    return this.filteredTasks;
  }

  /**
   * Updates the status of a task in the Firestore database.
   *
   * This function updates the status of the task identified by `taskId`
   * using the status from the `allTasks` array at the specified `index`.
   *
   * @param taskId The ID of the task to be updated.
   * @param index The index of the task in the `allTasks` array.
   */
  async updateTask(taskId: string, index: number) {
    await updateDoc(doc(collection(this.firestore, 'tasks'), taskId), {
      status: this.allTasks[index].status,
    }).catch((err) => {
      console.error(err);
    });
  }

  /**
   * Updates the subtasksDone property of a task in the Firestore database.
   *
   * This function updates the subtasksDone property of the task identified by
   * `taskId` with the `array` parameter. The `array` parameter is an array of booleans
   * that indicates which subtasks are completed.
   *
   * @param taskId The ID of the task to be updated.
   * @param array An array of booleans that indicates which subtasks are completed.
   */
  async updateSubTask(taskId: string, array: boolean[]) {
    await updateDoc(doc(collection(this.firestore, 'tasks'), taskId), {
      subtasksDone: array,
    }).catch((err) => {
      console.error(err);
    });
  }

  /**
   * Replaces the task identified by `taskId` with the data from the `newData` object.
   *
   * This function uses the `setDoc` function from `@angular/fire/firestore` to
   * replace the task identified by `taskId` with the data from the `newData` object.
   * The `newData` object should be of type `Task` and should contain all the fields
   * that are required for a task.
   *
   * @param taskId The ID of the task to be replaced.
   * @param newData The new task data.
   */
  async replaceTaskData(taskId: string, newData: Task) {
    await setDoc(
      doc(collection(this.firestore, 'tasks'), taskId),
      newData
    ).catch((err) => {
      console.error(err);
    });
  }

  /**
   * Deletes the task with the specified ID from the Firestore database.
   *
   * This function uses the `deleteDoc` function to remove the task identified by
   * `taskId` from the 'tasks' collection in Firestore.
   *
   * @param taskId The ID of the task to be deleted.
   */
  async deleteTask(taskId: string) {
    await deleteDoc(doc(collection(this.firestore, 'tasks'), taskId)).catch(
      (err) => {
        console.error(err);
      }
    );
  }

  /**
   * Adds a new task to the Firestore database.
   *
   * This function uses the `addDoc` function from `@angular/fire/firestore` to add
   * the task to the 'tasks' collection in Firestore. The `task` parameter should be
   * of type `Task` and should contain all the fields that are required for a task.
   *
   * @param task The new task data to be added.
   */
  async addNewTask(task: Task) {
    await addDoc(collection(this.firestore, 'tasks'), task).catch((err) => {
      console.error(err);
    });
  }

  // ------------- USERS ------------- //

  /**
   * Subscribes to Firestore for the list of all users.
   *
   * This function uses the `onSnapshot` function from `@angular/fire/firestore` to
   * subscribe to the 'users' collection in Firestore. When the data in the
   * collection changes, this function is called with a `QuerySnapshot` object as an
   * argument. The function then iterates over the `QuerySnapshot` and creates a
   * `User` object from each document in the snapshot. The created `User` objects are
   * then stored in the `allUsers` array.
   *
   * @returns The unsubscribe function from `onSnapshot`.
   */
  subUserList() {
    return onSnapshot(collection(this.firestore, 'users'), (list) => {
      this.allUsers = [];
      list.forEach((element) => {
        const userWithId = { id: element.id, ...element.data() } as User;
        this.allUsers.push(userWithId);
      });
    });
  }

  /**
   * Returns the list of all users.
   *
   * @returns An array of User objects.
   */
  getAllUsers(): User[] {
    return this.allUsers;
  }

  /**
   * Retrieves a list of all users excluding those with initials 'G' (typically representing guest users).
   *
   * @returns An array of User objects without guest users.
   */
  getAllUserWithoutGuest(): User[] {
    return this.getAllUsers().filter((user) => user.initials !== 'G');
  }

  /**
   * Retrieves a list of all users excluding guest users and the current user and the task creator.
   *
   * @param taskCreator - The id of the task creator.
   * @returns An array of User objects excluding guest users, the current user, and the task creator.
   */
  getFilteredUsers(taskCreator: string): User[] {
    const currentUser = this.getCurrentUserId();
    const filteredUsers = this.getAllUsers().filter(
      (user) => user.initials !== 'G' && user.id !== currentUser
    );
    return filteredUsers.filter((user) => user.id !== taskCreator);
  }

  /**
   * Retrieves a list of users from the list of all users that have the given userId.
   *
   * @param userId - The id of the user to be retrieved.
   * @returns An array of User objects with the given userId.
   */
  getUserDataFromId(userId: string): User[] {
    return this.getAllUsers().filter((user) => user.id === userId);
  }

  /**
   * Retrieves a list of users from the list of all users that have the given userUid.
   *
   * @param userUid - The unique identifier of the user to be retrieved.
   * @returns An array of User objects with the given userUid.
   */
  getUserDataFromUid(userUid: string): User[] {
    return this.getAllUsers().filter((user) => user.id === userUid);
  }

  /**
   * Retrieves the current user ID from local storage.
   *
   * The current user ID is stored in local storage encrypted with the secret key.
   * This method decrypts the value and returns the current user ID as a string.
   * If the value does not exist or is not decryptable, it returns null.
   * @returns The current user ID as a string, or null if not found.
   */
  getCurrentUserId() {
    const encryptedValue = localStorage.getItem('currentUserJOIN');
    if (encryptedValue) {
      const bytes = CryptoES.AES.decrypt(encryptedValue, this.secretKey);
      const decryptedValue = bytes.toString(CryptoES.enc.Utf8);
      return JSON.parse(decryptedValue);
    }
    return null;
  }

  /**
   * Retrieves specific user information from the list of all users.
   *
   * @param userId - The id of the user whose information is to be retrieved.
   * @param query - The specific field of the user object to be retrieved, such as 'firstName', 'email', etc.
   * @returns An array containing the values of the specified field for the user with the given userId.
   */
  getUserDetails(userId: string, query: keyof User) {
    return this.getAllUsers()
      .filter((user) => user.id === userId)
      .map((user) => user[query]);
  }

  /**
   * Deletes a user document from the Firestore database.
   *
   * @param docId The id of the document to be deleted.
   * @returns A Promise resolving to void.
   * @throws An error if the deletion attempt fails.
   */
  async deleteUser(docId: string) {
    await deleteDoc(doc(collection(this.firestore, 'users'), docId)).catch(
      (err) => {
        console.error(err);
      }
    );
  }

  /**
   * Updates a user document in the Firestore database.
   *
   * @param docId The id of the document to be updated.
   * @param data The object with the new data to be updated.
   * @returns A Promise resolving to void.
   * @throws An error if the update attempt fails.
   */
  async updateUserData(docId: string, data: any) {
    await updateDoc(
      doc(collection(this.firestore, 'users'), docId),
      data
    ).catch((err) => {
      console.error(err);
    });
  }

  /**
   * Adds a new user to the Firestore database.
   *
   * @param userData The data of the user to be added.
   * @returns A Promise resolving to the newly added user document.
   * @throws An error if the add attempt fails.
   */
  async addNewUser(userData: User) {
    try {
      return await addDoc(collection(this.firestore, 'users'), userData);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // ------------- AUTH ------------- //

  /**
   * Retrieves the current user from local storage.
   *
   * The current user is stored in local storage encrypted with the secret key.
   * This method decrypts the value and returns the current user as an Observable,
   * or null if not found.
   * @returns An Observable resolving to the current user, or null if not found.
   */
  getAuthUser(): Observable<any> {
    const encryptedValue = localStorage.getItem('currentUserJOIN');
    if (encryptedValue) {
      const bytes = CryptoES.AES.decrypt(encryptedValue, this.secretKey);
      const decryptedValue = bytes.toString(CryptoES.enc.Utf8);
      return of(JSON.parse(decryptedValue));
    }
    return of(null);
  }

  // ------------- Destroy ------------- //

  /**
   * Lifecycle hook that is called when the component is about to be destroyed.
   * Unsubscribes from task and user changes to prevent memory leaks.
   */
  ngOnDestroy() {
    this.unsubTask();
    this.unsubUser();
  }
}
