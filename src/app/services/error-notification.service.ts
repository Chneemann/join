import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ErrorNotificationService {
  constructor(private toastr: ToastrService) {}
  private isToastVisible = false;

  handleHttpError(error: unknown): void {
    if (this.isToastVisible) {
      return;
    }

    let errorMessage = 'An unknown error occurred.';

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          errorMessage =
            'Unable to connect to the server. Please check your internet connection or the server status.';
          break;
        case 400:
          errorMessage =
            'The request could not be processed due to invalid input. Please check your entries and try again.';
          break;
        case 401:
          console.log(error);

          if (
            error.error.detail &&
            (error.error.detail.includes('Token') ||
              error.error.detail.includes('token'))
          ) {
            errorMessage =
              'The authentication token is invalid or expired. Please log in again.';
          } else {
            errorMessage =
              'The login credentials are incorrect. Please check your email and password.';
          }
          break;
        case 403:
          errorMessage =
            'You do not have permission to access this resource. If you believe this is a mistake, please contact support.';
          break;
        case 404:
          errorMessage =
            'The requested page could not be found. Please make sure the URL is correct and try again.';
          break;
        case 406:
          errorMessage =
            'The request was not acceptable. Invalid request parameters were provided.';
          break;
        case 408:
          errorMessage =
            'The request timed out. Please check your connection and try again later.';
          break;
        case 409:
          errorMessage =
            'The email is already in use. Please choose a different email or log in if you already have an account.';
          break;
        case 500:
          errorMessage =
            'There was a problem on the server. Please try again later or contact support if the issue persists.';
          break;
        default:
          errorMessage =
            error.error?.message ||
            `An unknown error occurred. Please try again later.`;
          break;
      }
    } else if (error instanceof Error) {
      errorMessage = `Network error: ${error.message || error.toString()}`;
    }

    this.isToastVisible = true;

    this.toastr.error(errorMessage, 'Error', {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
    });

    setTimeout(() => {
      this.isToastVisible = false;
    }, 3000);
  }
}
