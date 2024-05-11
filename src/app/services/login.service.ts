import { Injectable, inject } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { FirebaseService } from './firebase.service';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { SharedService } from './shared.service';
import { User } from '../interfaces/user.interface';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  firestore: Firestore = inject(Firestore);
  errorCode: string = '';

  constructor(
    private firebaseService: FirebaseService,
    public sharedService: SharedService
  ) {
    console.log(this.sharedService.generateRandomColor());
  }

  login(loginData: { mail: string; password: string }) {
    signInWithEmailAndPassword(getAuth(), loginData.mail, loginData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = this.firebaseService.checkUserUID(user.uid);
        if (userData.length > 0 && userData[0].id) {
          this.getUserIdInLocalStorage(userData[0].id);
          this.updateUserOnlineStatus(userData[0].id);
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
      .then((userCredential) => {
        const user = userCredential.user;
        const usersCollection = collection(this.firestore, 'users');
        const querySnapshot = query(
          usersCollection,
          where('uId', '==', user.uid)
        );
        getDocs(querySnapshot).then((snapshot) => {
          if (snapshot.empty) {
            this.createUserInFirestore({
              uId: user.uid,
              email: user.email || 'no mail',
              firstName: user.displayName ? user.displayName.split(' ')[0] : '',
              lastName: user.displayName ? user.displayName.split(' ')[1] : '',
              status: true,
              phone: '',
              initials: user.displayName
                ? user.displayName.split(' ')[0].slice(0, 1) +
                  user.displayName.split(' ')[1].slice(0, 1)
                : '',
              color: this.sharedService.generateRandomColor(),
              lastLogin: 0,
            });
          } else {
            this.ifExistUser(user.uid);
          }
        });
      })
      .catch((error) => {
        console.error('Google login error:', error);
      });
  }

  async createUserInFirestore(user: User) {
    const userDataToSave: User = {
      uId: user.uId,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      status: true,
      phone: '',
      initials: user.initials,
      color: user.color,
      lastLogin: new Date().getTime(),
    };
    const usersCollection = collection(this.firestore, 'users');
    try {
      const docRef = await addDoc(usersCollection, userDataToSave);
      this.ifExistUser(user.uId);
    } catch (error) {
      console.error(error);
    }
  }

  ifExistUser(user: string) {
    const userData = this.firebaseService.checkUserUID(user);
    if (userData.length > 0 && userData[0].id) {
      this.getUserIdInLocalStorage(userData[0].id);
      this.updateUserOnlineStatus(userData[0].id);
    }
  }

  async updateUserOnlineStatus(userId: string) {
    await updateDoc(doc(collection(this.firestore, 'users'), userId), {
      status: true,
      lastLogin: new Date().getTime(),
    }).catch((err) => {
      console.error(err);
    });
    window.location.reload();
  }

  getUserIdInLocalStorage(userId: string) {
    localStorage.setItem('currentUser', JSON.stringify(userId));
  }
}
