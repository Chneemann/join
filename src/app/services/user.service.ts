import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  Firestore,
  collection,
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
      return JSON.parse(currentUser)[0].id;
    }
  }

  getUserDetails(userId: string, query: keyof User) {
    return this.getAllUsers()
      .filter((user) => user.id === userId)
      .map((user) => user[query]);
  }

  async updateUserData(userId: string, data: any) {
    await updateDoc(
      doc(collection(this.firestore, 'users'), userId),
      data
    ).catch((err) => {
      console.error(err);
    });
  }

  ngOnDestroy() {
    this.unsubUser();
  }
}
