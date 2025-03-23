import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConfig } from '../environments/config';
import { Task } from '../interfaces/task.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = apiConfig.apiUrl;

  constructor(private http: HttpClient) {}

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
}
