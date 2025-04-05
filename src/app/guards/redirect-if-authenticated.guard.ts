import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectIfAuthenticatedGuard {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const authToken = this.tokenService.getAuthToken();

    if (!authToken || !this.tokenService.isTokenExpired(authToken)) {
      return true;
    }

    return this.authService.checkAuthUser().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
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
