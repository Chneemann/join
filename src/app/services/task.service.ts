import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { Task, TaskStatus } from '../interfaces/task.interface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserSummary } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly statuses: TaskStatus[] = [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.AWAIT_FEEDBACK,
    TaskStatus.DONE,
  ];
  private readonly priorities = ['low', 'medium', 'high'];

  constructor(private apiService: ApiService) {}

  getStatuses(): TaskStatus[] {
    return this.statuses;
  }

  getPriorities(): string[] {
    return this.priorities;
  }

  getTasks(): Observable<Task[]> {
    return this.fetchTasks();
  }

  getTasksWithUsers(): Observable<{ allTasks: Task[] }> {
    return this.fetchTasks().pipe(
      switchMap((tasks) =>
        this.attachUsersToTasks(tasks).pipe(
          map((tasksWithUsers) => ({ allTasks: tasksWithUsers }))
        )
      )
    );
  }

  getTaskById(taskId: string): Observable<Task | null> {
    return this.apiService.getTaskById(taskId).pipe(
      catchError((error) => {
        console.error('Error loading the task:', error);
        return of(null);
      }),
      switchMap((task) => (task ? this.attachUsersToTask(task) : of(null)))
    );
  }

  private fetchTasks(): Observable<Task[]> {
    return this.apiService.getTasks().pipe(
      catchError((error) => {
        console.error('Error when retrieving the tasks:', error);
        return of([]);
      })
    );
  }

  private attachUsersToTask(task: Task): Observable<Task> {
    const userIds = [task.creator, ...task.assignees.map((a) => a.userId)];

    return this.apiService.getUsersByIds(userIds).pipe(
      catchError((error) => {
        console.error('Error when retrieving user data:', error);
        return of([]);
      }),
      map((users) => ({
        ...task,
        userData: this.mapTaskUsers(task, this.createUserMap(users)),
      }))
    );
  }

  private attachUsersToTasks(tasks: Task[]): Observable<Task[]> {
    const userIds = new Set(
      tasks.flatMap((task) => [
        task.creator,
        ...task.assignees.map((a) => a.userId),
      ])
    );

    return this.apiService.getUsersByIds([...userIds]).pipe(
      catchError((error) => {
        console.error('Error when retrieving users:', error);
        return of([]);
      }),
      map((users) => {
        const userMap = this.createUserMap(users);
        return tasks.map((task) => ({
          ...task,
          userData: this.mapTaskUsers(task, userMap),
        }));
      })
    );
  }

  private createUserMap(users: UserSummary[]): Record<string, UserSummary> {
    return users.reduce((acc, user) => {
      if (user?.id) {
        acc[user.id] = user;
      }
      return acc;
    }, {} as Record<string, UserSummary>);
  }

  private mapTaskUsers(
    task: Task,
    userMap: Record<string, UserSummary>
  ): UserSummary[] {
    return [
      ...task.assignees.map((a) => userMap[a.userId] || null),
      userMap[task.creator] || null,
    ].filter(Boolean);
  }
}
