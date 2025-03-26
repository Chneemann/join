import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const authToken = this.tokenService.getAuthToken();
    if (!authToken) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.authService.checkAuthUser().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        } else {
          this.showSessionExpiredMessage();
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError(() => {
        this.showSessionExpiredMessage();
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }

  private showSessionExpiredMessage() {
    this.toastrService.error(
      'Your session has expired, please log in again.',
      'Session Expired',
      {
        timeOut: 3000,
      }
    );
  }
}
