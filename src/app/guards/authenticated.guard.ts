import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { ToastrService } from 'ngx-toastr';
import { ToastNotificationService } from '../services/toast-notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private toastrService: ToastrService,
    private toastNotificationService: ToastNotificationService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const authToken = this.tokenService.getAuthToken();

    if (!authToken || !this.tokenService.isTokenExpired(authToken)) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.authService.checkAuthUser().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        } else {
          this.toastNotificationService.showSessionExpiredMessage();
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError(() => {
        this.toastNotificationService.showSessionExpiredMessage();
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
