import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  firestore: Firestore = inject(Firestore);

  allUsers: User[] = [];
  isUserLogin: boolean = true;

  unsubUser;

  constructor() {
    this.unsubUser = this.subUserList();
  }

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

  getCurrentUserId() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser !== null) {
      return JSON.parse(currentUser);
    }
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

  ngOnDestroy() {
    this.unsubUser();
  }
}
