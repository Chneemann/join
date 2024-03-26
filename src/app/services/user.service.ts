import { Injectable, inject } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  firestore: Firestore = inject(Firestore);

  allUsers: User[] = [];

  unsubUser;

  constructor() {
    this.unsubUser = this.subUserList();
  }

  subUserList() {
    return onSnapshot(this.getUserRef(), (list) => {
      this.allUsers = [];
      list.forEach((element) => {
        const taskData = { ...(element.data() as User), id: element.id };
        this.allUsers.push(taskData);
      });
    });
  }

  getUserRef() {
    return collection(this.firestore, 'users');
  }

  ngOnDestroy() {
    this.unsubUser;
  }
}
