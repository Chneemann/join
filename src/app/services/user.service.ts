import { Injectable, OnDestroy, inject } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
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
        const taskData = element.data() as User;
        const taskWithId = { ...taskData };
        taskWithId.id = element.id;
        this.allUsers.push(taskWithId);
      });
    });
  }

  getUsers(): User[] {
    return this.allUsers;
  }

  getUserDetails(userId: string, query: keyof User) {
    const filteredUsers = this.getUsers().filter((user) => user.id === userId);
    return filteredUsers.map((user) => user[query]);
  }

  ngOnDestroy() {
    this.unsubUser();
  }
}
