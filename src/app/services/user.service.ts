import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserCache: User | null = null;
  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  private loading = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  /**
   * Retrieves the current user from the cache if available, or loads it from the API.
   *
   * @returns An Observable resolving to the current user, or null if not available.
   */
  getCurrentUser(): Observable<User | null> {
    if (this.currentUserCache) {
      this.currentUserSubject.next(this.currentUserCache);
      return this.currentUserSubject.asObservable();
    }

    return this.loadCurrentUser();
  }

  /**
   * Loads the current user data by fetching the user ID from the AuthService and
   * retrieving the user details from the ApiService.
   *
   * @returns an Observable resolving to the current user, or null if none exists
   */
  loadCurrentUser(): Observable<User | null> {
    if (this.loading) {
      return this.currentUserSubject.asObservable();
    }

    this.loading = true;

    return this.authService.getCurrentUserId().pipe(
      switchMap((userId) => {
        if (!userId) return of(null);

        return this.apiService.getUserById(userId).pipe(
          catchError(() => of(null)),
          tap((userData) => {
            if (userData) {
              this.currentUserCache = userData;
              this.currentUserSubject.next(userData);
            }
            this.loading = false;
          })
        );
      })
    );
  }

  /**
   * Resets the current user cache and emits a null value to the current user Observable.
   */
  resetUserCache(): void {
    this.currentUserCache = null;
    this.currentUserSubject.next(null);
  }

  /**
   * Retrieves the list of all users from the API.
   *
   * @returns An Observable resolving to the list of all users.
   */
  getUsers(): Observable<User[]> {
    return this.apiService.getUsers();
  }

  /**
   * Retrieves a user by its ID from the API.
   *
   * @param userId The ID of the user to be retrieved.
   * @returns An Observable resolving to the user with the given ID, or an empty Observable if the user does not exist.
   */
  getUserById(userId: string): Observable<User> {
    return this.apiService.getUserById(userId);
  }
}
