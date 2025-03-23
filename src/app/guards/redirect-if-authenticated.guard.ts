import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectIfAuthenticatedGuard {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginService.checkAuthUser().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/summary']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
