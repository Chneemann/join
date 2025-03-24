import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConfig } from '../environments/config';
import { Task } from '../interfaces/task.interface';
import { User } from '../interfaces/user.interface';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = apiConfig.apiUrl;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  // ------------- TASKS ------------- //

  getTaskById(taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/api/tasks/${taskId}/`);
  }

  getTasksByStatus(status: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/api/tasks/`, {
      params: { status },
    });
  }

  updateTaskStatus(taskId: string, status: string): Observable<Task> {
    return this.http.put<Task>(
      `${this.apiUrl}/api/tasks/${taskId}/update_status/`,
      { status: status }
    );
  }

  // ------------- USERS ------------- //

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/users/${userId}/`);
  }

  getUsersByIds(userIds: string[]): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/api/users/`, {
      params: { ids: userIds.join(',') },
    });
  }

  // ------------- TOKEN ------------- //

  private addAuthHeaders(headers: HttpHeaders): HttpHeaders {
    const token = this.tokenService.getAuthToken();
    if (token) {
      return headers.set('Authorization', `Token ${token}`);
    }
    return headers;
  }

  post<T>(url: string, body: any): Observable<T> {
    let headers = new HttpHeaders();
    headers = this.addAuthHeaders(headers);
    return this.http.post<T>(url, body, { headers });
  }

  get<T>(url: string): Observable<T> {
    let headers = new HttpHeaders();
    headers = this.addAuthHeaders(headers);
    return this.http.get<T>(url, { headers });
  }
}
