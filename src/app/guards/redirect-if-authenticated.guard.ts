import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectIfAuthenticatedGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (
      !this.tokenService.isTokenAvailable() ||
      !this.tokenService.isUserIdAvailable()
    ) {
      return true;
    }

    return this.authService.checkAuthUser().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/summary']);
          return false;
        }
        return true;
      })
    );
  }
}
