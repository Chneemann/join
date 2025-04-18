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

  registerSuccessToast(): void {
    this.createSuccessToast(
      'You have successfully registered. Please log in.',
      'Registration Successful'
    );
  }

  resetPasswordSuccessToast(): void {
    this.createSuccessToast(
      'If the e-mail address is valid, you will receive an e-mail with a link to reset the password.',
      'Password Reset Successful'
    );
  }

  resetPasswordConfirmSuccessToast(): void {
    this.createSuccessToast(
      'You have successfully reset your password. Please log in.',
      'Password Reset Successful'
    );
  }

  showSessionExpiredToast(): void {
    this.createInfoToast(
      'Your session has expired, please log in again.',
      'Session Expired'
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

  updateTaskSuccessToast(): void {
    this.createSuccessToast('Task updated successfully!', 'Task Updated');
  }

  // Subtask

  updateSubtaskSuccessToast(): void {
    this.createSuccessToast('Subtask updated successfully!', 'Subtask Updated');
  }

  // Contacts

  createContactSuccessToast(): void {
    this.createSuccessToast('Contact created successfully!', 'Contact Created');
  }

  deleteContactSuccessToast(): void {
    this.createSuccessToast('Contact deleted successfully!', 'Contact Deleted');
  }

  updateContactSuccessToast(): void {
    this.createSuccessToast('Contact updated successfully!', 'Contact Updated');
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
