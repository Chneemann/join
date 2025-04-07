import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { Router, NavigationStart } from '@angular/router';
import { TokenService } from '../services/token.service';
import { ToastNotificationService } from '../services/toast-notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isNavigatingToLogin = false;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private toast: ToastNotificationService
  ) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationStart => event instanceof NavigationStart
        )
      )
      .subscribe((event) => {
        if (event.url === '/login') {
          this.isNavigatingToLogin = true;
        } else {
          this.isNavigatingToLogin = false;
        }
      });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.tokenService.getAuthToken();
    let clonedReq = req;

    if (token) {
      clonedReq = req.clone({
        setHeaders: {
          Authorization: `Token ${token}`,
        },
      });
    }

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0 && !this.isNavigatingToLogin) {
          this.tokenService.deleteAuthToken();
          this.tokenService.deleteUserId();
          this.router.navigate(['/login']);
        }
        if (error.status === 401 && !this.isNavigatingToLogin) {
          this.toast.showSessionExpiredToast();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
