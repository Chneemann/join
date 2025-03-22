import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { ApiService } from './api.service';
import { Task } from '../interfaces/task.interface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserSummary } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly statuses = ['todo', 'inprogress', 'awaitfeedback', 'done'];

  constructor(private apiService: ApiService) {}

  loadAllTasks(): Observable<{
    allTasks: Task[];
    filteredTasks: Record<string, Task[]>;
  }> {
    return forkJoin(
      this.statuses.map((status) => this.fetchTasksByStatus(status))
    ).pipe(
      switchMap((results) => {
        const allTasks = results.flat();
        const filteredTasks = this.statuses.reduce((acc, status, index) => {
          acc[status] = results[index] || [];
          return acc;
        }, {} as Record<string, Task[]>);

        return this.loadUsersForTasks(allTasks).pipe(
          map((tasksWithUsers) => {
            const updatedFilteredTasks = this.statuses.reduce((acc, status) => {
              acc[status] = tasksWithUsers.filter(
                (task) => task.status === status
              );
              return acc;
            }, {} as Record<string, Task[]>);

            return {
              allTasks: tasksWithUsers,
              filteredTasks: updatedFilteredTasks,
            };
          })
        );
      })
    );
  }

  private fetchTasksByStatus(status: string): Observable<Task[]> {
    return this.apiService.getTasksByStatus(status).pipe(
      catchError((error) => {
        console.error(
          `Fehler beim Abrufen von Tasks für Status ${status}:`,
          error
        );
        return of([]);
      })
    );
  }

  private loadUsersForTasks(tasks: Task[]): Observable<Task[]> {
    const userIds = new Set(
      tasks.flatMap((task) => [
        task.creator,
        ...task.assignees.map((a) => a.user),
      ])
    );

    return this.apiService.getUsersByIds([...userIds]).pipe(
      catchError((error) => {
        console.error('Fehler beim Abrufen der Benutzer:', error);
        return of([]);
      }),
      map((users) => {
        const userMap = this.createUserMap(users);
        return tasks.map((task) => ({
          ...task,
          userData: [
            ...task.assignees.map((a) => userMap[a.user] || null),
            userMap[task.creator] || null,
          ].filter(Boolean),
        }));
      })
    );
  }

  loadSingleTask(taskId: string): Observable<Task | null> {
    return this.apiService.getTaskById(taskId).pipe(
      switchMap((task) => {
        if (!task) return of(null);
        const userIds = [task.creator, ...task.assignees.map((a) => a.user)];

        return this.apiService.getUsersByIds(userIds).pipe(
          map((users) => ({
            ...task,
            userData: this.mapTaskUsers(task, users),
          })),
          catchError((error) => {
            console.error('Fehler beim Abrufen der Benutzerdaten:', error);
            return of(task);
          })
        );
      }),
      catchError((error) => {
        console.error('Fehler beim Laden des Tasks:', error);
        return of(null);
      })
    );
  }

  private createUserMap(users: UserSummary[]): Record<string, UserSummary> {
    return users.reduce((acc, user) => {
      if (user?.id)
        acc[user.id] = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          initials: user.initials,
          color: user.color,
        };
      return acc;
    }, {} as Record<string, UserSummary>);
  }

  private mapTaskUsers(task: Task, users: UserSummary[]): UserSummary[] {
    const userMap = this.createUserMap(users);
    return [
      ...task.assignees.map((a) => userMap[a.user] || null),
      userMap[task.creator] || null,
    ].filter(Boolean);
  }
}
