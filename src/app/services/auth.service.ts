import { HttpClient, HttpHeaders } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = apiConfig.apiUrl;

  private currentUserIdSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    const storedUserId =
      localStorage.getItem('currentUserId') ||
      sessionStorage.getItem('currentUserId');
    this.currentUserIdSubject = new BehaviorSubject<string | null>(
      storedUserId
    );
  }

  async login(body: any, storage: boolean) {
    const data = (await lastValueFrom(
      this.http.post(`${this.apiUrl}/auth/login/`, body)
    )) as { token: string; user_id: string };
    this.storeAuthToken(data.token, storage);
    this.storeUserId(data.user_id, storage);
    this.currentUserIdSubject.next(data.user_id);
  }

  async logout() {
    const token = this.checkAuthToken();
    if (!token) return;

    await lastValueFrom(
      this.http.post(
        `${this.apiUrl}/auth/logout/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      )
    ).catch((error) => console.error('Logout failed:', error));

    this.deleteAuthToken();
    this.deleteUserId();
    window.location.href = '/login';
  }

  checkAuthUser(): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/auth/`, { headers }).pipe(
      map(() => {
        return true;
      }),
      catchError(() => of(false))
    );
  }

  private getAuthHeaders(): HttpHeaders {
    let authToken = localStorage.getItem('authToken');
    if (!authToken) {
      authToken = sessionStorage.getItem('authToken');
    }
    return new HttpHeaders({
      Authorization: `Token ${authToken}`,
    });
  }

  private storeAuthToken(data: any, storage: boolean) {
    storage
      ? localStorage.setItem('authToken', data.toString())
      : sessionStorage.setItem('authToken', data.toString());
  }

  private storeUserId(userId: string, storage: boolean) {
    if (storage) {
      localStorage.setItem('currentUserId', userId);
    } else {
      sessionStorage.setItem('currentUserId', userId);
    }
  }

  private deleteAuthToken() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  }

  private deleteUserId() {
    localStorage.removeItem('currentUserId');
    sessionStorage.removeItem('currentUserId');
    this.currentUserIdSubject.next(null);
  }

  checkAuthToken(): string | null {
    return (
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    );
  }

  getCurrentUserId(): Observable<string | null> {
    return this.currentUserIdSubject.asObservable();
  }
}
