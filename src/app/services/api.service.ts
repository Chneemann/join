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
  private readonly apiUrl = apiConfig.apiUrl;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  request<T, B = unknown>(
    method: string,
    endpoint: string,
    body?: B | null,
    params?: Record<string, string | number>
  ): Observable<T> {
    return this.http.request<T>(method, `${this.apiUrl}${endpoint}`, {
      body,
      params,
      headers: this.getHeaders(),
    });
  }

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getAuthToken();
    return token
      ? new HttpHeaders().set('Authorization', `Token ${token}`)
      : new HttpHeaders();
  }

  // ------------- TASKS ------------- //

  getTasks(): Observable<Task[]> {
    return this.request<Task[]>('GET', `/api/tasks/`);
  }

  getTaskById(taskId: string): Observable<Task> {
    return this.request<Task>('GET', `/api/tasks/${taskId}/`);
  }

  updateTaskStatus(taskId: string, status: string): Observable<Task> {
    return this.request<Task>('PATCH', `/api/tasks/${taskId}/update_status/`, {
      status,
    });
  }

  saveNewTask(task: Task): Observable<Task> {
    return this.request<Task>('POST', '/api/tasks/', task);
  }

  deleteTaskById(taskId: string): Observable<Task> {
    return this.request<Task>('DELETE', `/api/tasks/${taskId}/`);
  }

  // ------------- USERS ------------- //

  getUserById(userId: string): Observable<User> {
    return this.request<User>('GET', `/api/users/${userId}/`);
  }

  getUsersByIds(userIds: string[]): Observable<User[]> {
    return this.request<User[]>('GET', '/api/users/', undefined, {
      ids: userIds.join(','),
    });
  }
}
