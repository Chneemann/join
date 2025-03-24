import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  lastValueFrom,
  map,
  Observable,
  of,
} from 'rxjs';
import { apiConfig } from '../environments/config';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = apiConfig.apiUrl;
  private currentUserIdSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService
  ) {
    this.currentUserIdSubject.next(this.tokenService.getUserId());
  }

  async login(body: any, storage: boolean) {
    try {
      const data = await lastValueFrom(
        this.apiService.post<{ token: string; userId: string }>(
          `${this.apiUrl}/auth/login/`,
          body
        )
      );

      this.tokenService.storeAuthToken(data.token, storage);
      this.tokenService.storeUserId(data.userId, storage);
      this.currentUserIdSubject.next(data.userId);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await lastValueFrom(
        this.apiService.post(`${this.apiUrl}/auth/logout/`, {})
      );

      this.tokenService.deleteAuthToken();
      this.tokenService.deleteUserId();
      this.currentUserIdSubject.next(null);

      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  checkAuthUser(): Observable<boolean> {
    return this.apiService.get(`${this.apiUrl}/auth/`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  getCurrentUserId(): Observable<string | null> {
    return this.currentUserIdSubject.asObservable();
  }
}
