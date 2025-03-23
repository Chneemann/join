import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { apiConfig } from '../environments/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = apiConfig.apiUrl;

  constructor(private http: HttpClient) {}

  async login(body: any, storage: boolean) {
    const data = (await lastValueFrom(
      this.http.post(`${this.apiUrl}/auth/login/`, body)
    )) as { token: string };
    this.storeAuthToken(data.token, storage);
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

  private deleteAuthToken() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  }

  checkAuthToken(): string | null {
    return (
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    );
  }
}
