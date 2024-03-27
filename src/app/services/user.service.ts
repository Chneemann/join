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

  constructor() {}

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
}
