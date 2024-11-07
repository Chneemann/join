import { Injectable, inject } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
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
import { Router } from '@angular/router';
import CryptoES from 'crypto-es';
import { CryptoESSecretKey } from '../environments/config';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  firestore: Firestore = inject(Firestore);
  passwordFieldType: string = 'password';
  passwordIcon: string = './../../../assets/img/login/close-eye.svg';
  errorCode: string = '';

  private secretKey: string = CryptoESSecretKey.secretKey;

  constructor(
    private firebaseService: FirebaseService,
    public sharedService: SharedService,
    private router: Router
  ) {}

  checkAuthUser(): Observable<boolean> {
    return this.firebaseService.getAuthUser().pipe(
      map((user) => !!user),
      catchError(() => of(false))
    );
  }

  login(loginData: { mail: string; password: string }) {
    signInWithEmailAndPassword(getAuth(), loginData.mail, loginData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = this.firebaseService.getUserDataFromUid(user.uid);
        if (userData.length > 0 && userData[0].id) {
          this.getUserIdInLocalStorage(userData[0].id);
          this.updateUserOnlineStatus(userData[0].id, true);
        }
      })
      .catch((error) => {
        this.errorCode = error.code;
        this.sharedService.isBtnDisabled = false;
      });
  }

  register(registerData: {
    name: string;
    firstName: string;
    lastName: string;
    mail: string;
    password: string;
  }) {
    createUserWithEmailAndPassword(
      getAuth(),
      registerData.mail,
      registerData.password
    )
      .then((userCredential) => {
        const user = userCredential.user;

        const userDataToSave: User = {
          uId: user.uid,
          email: user.email || '',
          firstName: registerData.firstName
            ? registerData.firstName.charAt(0).toUpperCase() +
              registerData.firstName.slice(1)
            : '',
          lastName: registerData.lastName
            ? registerData.lastName.charAt(0).toUpperCase() +
              registerData.lastName.slice(1)
            : '',
          status: true,
          phone: '',
          initials: registerData.name
            ? registerData.firstName.slice(0, 1).toUpperCase() +
              registerData.lastName.slice(0, 1).toUpperCase()
            : '',
          color: this.sharedService.generateRandomColor(),
          lastLogin: new Date().getTime(),
        };
        this.createUserInFirestore(userDataToSave);
      })
      .catch((error) => {
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
            const displayName = user.displayName || '';
            const [firstName = '', lastName = ''] = displayName.split(' ');
            this.createUserInFirestore({
              uId: user.uid,
              email: user.email || 'no mail',
              firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
              lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
              status: true,
              phone: '',
              initials: firstName.slice(0, 1) + lastName.slice(0, 1),
              color: this.sharedService.generateRandomColor(),
              lastLogin: 0,
            });
          } else {
            this.ifExistUser(user.uid);
          }
        });
      })
      .catch((error) => {
        this.sharedService.isBtnDisabled = false;
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
    const userData = this.firebaseService.getUserDataFromUid(user);
    if (userData.length > 0 && userData[0].id) {
      this.getUserIdInLocalStorage(userData[0].id);
      this.updateUserOnlineStatus(userData[0].id, true);
    }
  }

  async updateUserOnlineStatus(userId: string, status: boolean) {
    await updateDoc(doc(collection(this.firestore, 'users'), userId), {
      status: status,
      lastLogin: new Date().getTime(),
    });
    window.location.reload();
  }

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
    this.toggleIcon();
  }

  toggleIcon() {
    this.passwordIcon =
      this.passwordIcon === './../../../assets/img/login/close-eye.svg'
        ? './../../../assets/img/login/open-eye.svg'
        : './../../../assets/img/login/close-eye.svg';
  }

  getUserIdInLocalStorage(userId: string): void {
    const encryptedValue = CryptoES.AES.encrypt(
      JSON.stringify(userId),
      this.secretKey
    ).toString();
    localStorage.setItem('currentUserJOIN', encryptedValue);
    localStorage.setItem('sessionTimeJOIN', new Date().getTime().toString());
  }

  // LOGOUT

  logout(userId: string) {
    this.deleteUserIdInLocalStorage();
    this.updateUserOnlineStatus(userId, false);
  }

  deleteUserIdInLocalStorage() {
    localStorage.removeItem('currentUserJOIN');
    localStorage.removeItem('sessionTimeJOIN');
  }

  // FORGOT PASSWORD
  passwordReset(email: string) {
    const auth = getAuth();
    const actionCodeSettings = {
      url: 'https://join.andre-kempf.com/',
      handleCodeInApp: true,
    };
    sendPasswordResetEmail(auth, email, actionCodeSettings)
      .then(() => {
        this.router.navigate(['/login/notice/pw-send']);
        this.sharedService.isBtnDisabled = false;
      })
      .catch((error) => {
        this.sharedService.isBtnDisabled = false;
      });
  }

  newPassword(newPW: string, oobCode: string) {
    const auth = getAuth();
    confirmPasswordReset(auth, oobCode, newPW)
      .then(() => {
        this.router.navigate(['/login/notice/pw-change']);
        this.sharedService.isBtnDisabled = false;
      })
      .catch((error) => {
        this.sharedService.isBtnDisabled = false;
      });
  }
}
