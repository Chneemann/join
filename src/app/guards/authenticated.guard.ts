import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { ToastNotificationService } from '../services/toast-notification.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private tokenService: TokenService,
    private toastNotificationService: ToastNotificationService,
    private router: Router
  ) {}

  /**
   * Determines whether the route can be activated based on the user's authentication status.
   *
   * This method checks if the user's token and user ID are available. If either is unavailable,
   * it navigates to the login page, resets the user cache, and displays a session expired toast.
   * If both are available, it checks the user's authentication status and returns it.
   *
   * @returns {Observable<boolean> | Promise<boolean> | boolean} An observable, promise, or boolean
   * indicating whether the route can be activated.
   */
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (
      !this.tokenService.isTokenAvailable() ||
      !this.tokenService.isUserIdAvailable()
    ) {
      this.router.navigate(['/login']);
      this.userService.resetUserCache();
      this.toastNotificationService.showSessionExpiredToast();
      return false;
    }

    return this.authService
      .checkAuthUser()
      .pipe(map((isAuthenticated) => isAuthenticated));
  }
}
