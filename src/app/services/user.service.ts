import { Injectable, inject } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  firestore: Firestore = inject(Firestore);

  allUsers: User[] = [];
  userMap: { [key: string]: User } = {};

  constructor() {
    this.subUserList().subscribe(() => {
      this.organizeUserData();
    });
  }

  subUserList() {
    return new Observable<void>((observer) => {
      const unsubscribe = onSnapshot(
        collection(this.firestore, 'users'),
        (list) => {
          this.allUsers = [];
          list.forEach((element) => {
            const taskData = { ...(element.data() as User), id: element.id };
            this.allUsers.push(taskData);
          });
          observer.next();
        }
      );
      return () => unsubscribe();
    });
  }

  organizeUserData() {
    this.userMap = {};
    this.allUsers.forEach((user) => {
      this.userMap[user.id] = user;
    });
  }

  displayUserName(id: string) {
    if (this.userMap[id]) {
      return this.userMap[id].firstName + ', ' + this.userMap[id].lastName;
    }
    return 'sd';
  }

  displayUserDetails(id: string, query: keyof User) {
    if (this.userMap[id]) {
      const user = this.userMap[id];
      return user[query];
    }
    return '';
  }
}
