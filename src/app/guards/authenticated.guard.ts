import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { ToastNotificationService } from '../services/toast-notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private toastNotificationService: ToastNotificationService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (
      !this.tokenService.isTokenAvailable() ||
      !this.tokenService.isUserIdAvailable()
    ) {
      this.router.navigate(['/login']);
      this.toastNotificationService.showSessionExpiredToast();
      return false;
    }

    return this.authService
      .checkAuthUser()
      .pipe(map((isAuthenticated) => isAuthenticated));
  }
}
