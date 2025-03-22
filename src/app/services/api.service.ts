import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConfig } from '../environments/config';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = apiConfig.apiUrl;

  constructor(private http: HttpClient) {}

  // ------------- TASKS ------------- //

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
}
