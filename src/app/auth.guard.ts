import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private loginService: LoginService, private router: Router) {}

  /**
   * The canActivate guard checks if the user is authenticated.
   * If the user is authenticated, the guard returns true.
   * If the user is not authenticated, the guard navigates to the root route and returns false.
   * If an error occurs during the authentication check, the guard navigates to the root route and returns false.
   */
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginService.checkAuthUser().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
}
