import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  handleHttpError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          return 'Network issue: Unable to reach the server.\nPlease check your internet connection or the server status.';
        case 401:
          return 'Invalid login credentials.\nPlease check your email and password.';
        case 403:
          return 'You do not have permission to access this resource.';
        case 404:
          return 'The requested resource was not found.';
        case 500:
          return 'Server error: Please try again later.';
        default:
          return `Unknown error: ${error.statusText || error.message}`;
      }
    }

    if (error instanceof Error) {
      return `${error.message || error.toString()}`;
    }

    return 'An unknown error occurred.';
  }
}
