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
import { ErrorHandlingService } from './error-handling.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserIdSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService,
    private errorHandlingService: ErrorHandlingService,
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
      this.errorHandlingService.loginSuccessToast();
    } catch (error) {
      console.error('Login failed:', error);
      this.errorHandlingService.handleHttpError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await lastValueFrom(this.apiService.request('POST', `/auth/logout/`));

      this.tokenService.deleteAuthToken();
      this.tokenService.deleteUserId();
      this.currentUserIdSubject.next(null);
      this.errorHandlingService.logoutSuccessToast();
      this.router.navigate(['/logout']);
    } catch (error) {
      console.error('Logout failed:', error);
      this.errorHandlingService.handleHttpError(error);
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
}
