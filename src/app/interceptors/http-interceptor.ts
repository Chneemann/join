import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorNotificationService } from '../services/error-notification.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private errorNotificationService: ErrorNotificationService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorNotificationService.handleHttpError(error);
        return throwError(error);
      })
    );
  }
}
