import { Injectable, inject } from '@angular/core';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseService } from './firebase.service';
import { Firestore, collection, query, where } from '@angular/fire/firestore';
import { SharedService } from './shared.service';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  firestore: Firestore = inject(Firestore);

  constructor(
    private firebaseService: FirebaseService,
    public sharedService: SharedService
  ) {}

  login(loginData: { mail: string; password: string }) {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, loginData.mail, loginData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (this.firebaseService.checkUserUID(user.uid).length > 0) {
          this.getUserIdInLocalStorage(
            this.firebaseService.checkUserUID(user.uid)[0].id
          );
          window.location.reload();
        } else {
          console.error('No user with this UID was found!');
        }
        this.sharedService.isBtnDisabled = false;
      })
      .catch((error) => {
        console.error(error);
        alert('Invalid email or password! Please try again.');
        this.sharedService.isBtnDisabled = false;
      });
  }

  getUserIdInLocalStorage(userId: string) {
    localStorage.setItem('currentUser', JSON.stringify(userId));
  }
}
