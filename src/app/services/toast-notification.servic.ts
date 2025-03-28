import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastNotificationService {
  constructor(private toastr: ToastrService) {}

  // Auth
  loginSuccessToast(): void {
    this.createSuccessToast(
      'You have successfully logged in.',
      'Login Successful'
    );
  }

  logoutSuccessToast(): void {
    this.createInfoToast(
      'You have successfully logged out. Have a nice day!',
      'Logout Successful'
    );
  }

  // Tasks
  createTaskSuccessToast(): void {
    this.createSuccessToast('Task created successfully!', 'Task Created');
  }

  deleteTaskSuccessToast(): void {
    this.createSuccessToast('Task deleted successfully!', 'Task Deleted');
  }

  taskStatusUpdatedToast(): void {
    this.createInfoToast('Task successfully moved!', 'Task Moved');
  }

  // Helperfunctions

  createSuccessToast(message: string, title: string = 'Success'): void {
    this.toastr.success(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
    });
  }

  createErrorToast(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
    });
  }

  createInfoToast(message: string, title: string = 'Info'): void {
    this.toastr.info(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
    });
  }
}
