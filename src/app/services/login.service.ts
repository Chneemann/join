import { Injectable, inject } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { FirebaseService } from './firebase.service';
import { Firestore } from '@angular/fire/firestore';
import { SharedService } from './shared.service';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  firestore: Firestore = inject(Firestore);
  errorCode: string = '';

  constructor(
    private firebaseService: FirebaseService,
    public sharedService: SharedService
  ) {}

  login(loginData: { mail: string; password: string }) {
    signInWithEmailAndPassword(getAuth(), loginData.mail, loginData.password)
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
        this.errorCode = error.code;
        this.sharedService.isBtnDisabled = false;
      });
  }

  googleLogin() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(
          'Google User: ',
          user.displayName,
          user.email,
          user.photoURL
        );
      })
      .catch((error) => {
        console.error('Google login error:', error);
      });
  }

  getUserIdInLocalStorage(userId: string) {
    localStorage.setItem('currentUser', JSON.stringify(userId));
  }
}
