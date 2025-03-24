import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private TOKEN_KEY = 'authToken';
  private USER_ID_KEY = 'currentUserId';

  storeAuthToken(token: string, persistent: boolean): void {
    persistent
      ? localStorage.setItem(this.TOKEN_KEY, token)
      : sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  getAuthToken(): string | null {
    return (
      localStorage.getItem(this.TOKEN_KEY) ||
      sessionStorage.getItem(this.TOKEN_KEY)
    );
  }

  deleteAuthToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  storeUserId(userId: string, persistent: boolean): void {
    persistent
      ? localStorage.setItem(this.USER_ID_KEY, userId)
      : sessionStorage.setItem(this.USER_ID_KEY, userId);
  }

  getUserId(): string | null {
    return (
      localStorage.getItem(this.USER_ID_KEY) ||
      sessionStorage.getItem(this.USER_ID_KEY)
    );
  }

  deleteUserId(): void {
    localStorage.removeItem(this.USER_ID_KEY);
    sessionStorage.removeItem(this.USER_ID_KEY);
  }
}
