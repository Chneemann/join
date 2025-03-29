import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ErrorNotificationService {
  constructor(private toastr: ToastrService) {}

  handleHttpError(error: unknown): void {
    let errorMessage = 'An unknown error occurred.';

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          errorMessage =
            'Network issue: Unable to reach the server. Please check your internet connection or the server status.';
          break;
        case 401:
          errorMessage =
            'Invalid login credentials. Please check your email and password.';
          break;
        case 403:
          errorMessage = 'You do not have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 500:
          errorMessage =
            'Server error: Please try again later. If the issue persists, please contact support.';
          break;
        case 408:
          errorMessage =
            'Request timed out. Please check your connection and try again.';
          break;
        default:
          errorMessage =
            error.error?.message ||
            `Unknown error: ${error.statusText || error.message}`;
          break;
      }
    } else if (error instanceof Error) {
      errorMessage = `Network error: ${error.message || error.toString()}`;
    }

    this.toastr.error(errorMessage, 'Error');
  }
}
