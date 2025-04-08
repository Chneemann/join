import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PasswordVisibilityService {
  passwordFieldType: string = 'password';
  passwordIcon: string = './../../../assets/img/login/close-eye.svg';

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
    this.toggleIcon();
  }

  toggleIcon() {
    this.passwordIcon =
      this.passwordIcon === './../../../assets/img/login/close-eye.svg'
        ? './../../../assets/img/login/open-eye.svg'
        : './../../../assets/img/login/close-eye.svg';
  }
}
