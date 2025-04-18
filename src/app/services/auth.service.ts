import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  lastValueFrom,
  map,
  Observable,
  of,
} from 'rxjs';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { ToastNotificationService } from './toast-notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserIdSubject = new BehaviorSubject<string | null>(null);

  passwordFieldType: string = 'password';
  passwordIcon: string = './../../../assets/img/login/close-eye.svg';

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService,
    private toastNotificationService: ToastNotificationService,
    private router: Router
  ) {
    this.currentUserIdSubject.next(this.tokenService.getUserId());
  }

  async login(credentials: any, storage: boolean): Promise<void> {
    try {
      const { token, userId } = await lastValueFrom(
        this.apiService.request<{ token: string; userId: string }>(
          'POST',
          `/auth/login/`,
          credentials
        )
      );

      this.tokenService.storeAuthToken(token, storage);
      this.tokenService.storeUserId(userId, storage);
      this.currentUserIdSubject.next(userId);
      this.toastNotificationService.loginSuccessToast();
      this.router.navigate(['/summary']);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await lastValueFrom(this.apiService.request('POST', `/auth/logout/`));

      this.tokenService.deleteAuthToken();
      this.tokenService.deleteUserId();
      this.currentUserIdSubject.next(null);
      this.toastNotificationService.logoutSuccessToast();
      this.router.navigate(['/logout']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  async register(credentials: any): Promise<void> {
    try {
      await lastValueFrom(
        this.apiService.request('POST', `/auth/register/`, credentials)
      );
      this.toastNotificationService.registerSuccessToast();
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error?.error?.error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await lastValueFrom(
        this.apiService.request('POST', `/auth/reset/`, { email })
      );
      this.toastNotificationService.resetPasswordSuccessToast();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  }

  async resetPasswordConfirm(password: string, uidb64: string, token: string) {
    try {
      await lastValueFrom(
        this.apiService.request('POST', `/auth/reset/confirm/`, {
          password,
          uidb64,
          token,
        })
      );
      this.toastNotificationService.resetPasswordConfirmSuccessToast();
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Password reset confirmation failed:', error);
      throw new Error(error?.error?.error);
    }
  }

  checkAuthUser(): Observable<boolean> {
    return this.apiService.request('GET', `/auth/`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  getCurrentUserId(): Observable<string | null> {
    return this.currentUserIdSubject.asObservable();
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
}
