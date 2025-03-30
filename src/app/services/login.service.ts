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
import { ColorService } from './color.service';

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
    private colorService: ColorService,
    public sharedService: SharedService,
    private router: Router
  ) {}

  /**
   * Checks if a user is logged in.
   *
   * @returns An Observable resolving to a boolean indicating whether a user is logged in.
   */
  checkAuthUser(): Observable<boolean> {
    return this.firebaseService.getAuthUser().pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      }),
      catchError(() => {
        return of(false);
      })
    );
  }

  /**
   * Logs in a user given their email and password.
   * @param loginData An object with properties `mail` and `password`.
   * @returns A Promise resolving to void.
   * @throws An error if the login attempt fails.
   */
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

  /**
   * Registers a new user given their name, first name, last name, email and password.
   * @param registerData An object with properties `name`, `firstName`, `lastName`, `mail` and `password`.
   * @returns A Promise resolving to void.
   * @throws An error if the registration attempt fails.
   */
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
          isContactOnly: false,
          isOnline: true,
          phone: '',
          initials: registerData.name
            ? registerData.firstName.slice(0, 1).toUpperCase() +
              registerData.lastName.slice(0, 1).toUpperCase()
            : '',
          color: this.colorService.generateRandomColor(),
          lastLogin: new Date().getTime(),
        };
        this.createUserInFirestore(userDataToSave);
      })
      .catch((error) => {
        this.sharedService.isBtnDisabled = false;
      });
  }

  /**
   * Google login method.
   *
   * Signs in the user with Google Authentication.
   * If the user is not in the database, creates a new user with the provided name and email.
   * If the user is already in the database, logins the user.
   *
   * @returns {Promise<void>}
   * @memberof LoginService
   */
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
              isContactOnly: false,
              isOnline: true,
              phone: '',
              initials: firstName.slice(0, 1) + lastName.slice(0, 1),
              color: this.colorService.generateRandomColor(),
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

  /**
   * Creates a new user in the Firestore database with the given user data.
   * If the user already exists in the database, the method does nothing.
   * @param user The user data to save. The user data should contain the following properties: `uId`, `email`, `firstName`, `lastName`, `initials`, `color`.
   * @returns A Promise resolving to void.
   */
  async createUserInFirestore(user: User) {
    const userDataToSave: User = {
      uId: user.uId,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      isContactOnly: false,
      isOnline: true,
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

  /**
   * Checks if a user with the given user id exists in the database.
   * If the user exists, the method saves the user's id in the local storage and
   * updates the user's online status in the database.
   * @param user The id of the user to check.
   * @returns void
   */
  ifExistUser(user: string) {
    const userData = this.firebaseService.getUserDataFromUid(user);
    if (userData.length > 0 && userData[0].id) {
      this.getUserIdInLocalStorage(userData[0].id);
      this.updateUserOnlineStatus(userData[0].id, true);
    }
  }

  /**
   * Updates the online status of the user with the given id in the Firestore database.
   * If the user's status is set to true, the user's lastLogin property is also updated
   * to the current time.
   * @param userId The id of the user to update.
   * @param status The new online status of the user.
   * @returns A Promise resolving to void.
   */
  async updateUserOnlineStatus(userId: string, status: boolean) {
    await updateDoc(doc(collection(this.firestore, 'users'), userId), {
      status: status,
      lastLogin: new Date().getTime(),
    });
    window.location.reload();
  }

  /**
   * Toggles the visibility of the password field.
   *
   * This function switches the input type between 'password' and 'text',
   * allowing the user to view or hide the password as needed.
   * It also updates the icon to reflect the current visibility state.
   */
  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
    this.toggleIcon();
  }

  /**
   * Toggles the password visibility icon.
   *
   * This function switches the icon src between the 'close eye' and 'open eye'
   * icons, indicating whether the password is hidden or visible.
   */
  toggleIcon() {
    this.passwordIcon =
      this.passwordIcon === './../../../assets/img/login/close-eye.svg'
        ? './../../../assets/img/login/open-eye.svg'
        : './../../../assets/img/login/close-eye.svg';
  }

  /**
   * Saves the given userId to local storage, encrypted with the secret key.
   *
   * The userId is first stringified and then encrypted with the secret key.
   * The encrypted string is then saved to local storage under the key
   * 'currentUserJOIN'. Additionally, the current timestamp is saved to local
   * storage under the key 'sessionTimeJOIN'.
   *
   * @param userId The id of the user to be saved.
   */
  getUserIdInLocalStorage(userId: string): void {
    const encryptedValue = CryptoES.AES.encrypt(
      JSON.stringify(userId),
      this.secretKey
    ).toString();
    localStorage.setItem('currentUserJOIN', encryptedValue);
    localStorage.setItem('sessionTimeJOIN', new Date().getTime().toString());
  }

  // LOGOUT

  /**
   * Logs out the current user by deleting the user ID from local storage and
   * updating the user's online status to offline in the Firestore database.
   *
   * @param userId The id of the user to log out.
   */
  logout(userId: string) {
    this.deleteUserIdInLocalStorage();
    this.updateUserOnlineStatus(userId, false);
  }

  /**
   * Deletes the user ID from local storage, effectively logging the user out.
   *
   * This function removes the user ID from local storage by deleting the
   * 'currentUserJOIN' and 'sessionTimeJOIN' items.
   */
  deleteUserIdInLocalStorage() {
    localStorage.removeItem('currentUserJOIN');
    localStorage.removeItem('sessionTimeJOIN');
  }

  // FORGOT PASSWORD

  /**
   * Initiates the password reset process for the given email address.
   *
   * This function sends a password reset email to the specified email address
   * using Firebase Authentication. Upon successful sending of the email, the
   * user is redirected to the password reset notice page. If there is an error,
   * the button will be re-enabled for the user to try again.
   *
   * @param email The email address of the user requesting a password reset.
   */
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

  /**
   * Resets the user's password given the new password and the oobCode from the
   * password reset email.
   *
   * This function sends a request to Firebase Authentication to reset the user's
   * password. If the request is successful, it navigates to the password reset
   * notice page and re-enables the submit button. If there is an error, the
   * button will be re-enabled for the user to try again.
   *
   * @param newPW The new password to be set for the user.
   * @param oobCode The one-time code from the password reset email.
   */
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
