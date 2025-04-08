import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBtnComponent } from '../../../shared/components/buttons/form-btn/form-btn.component';
import { PasswordVisibilityService } from '../../../services/password-visibility.service';
import { BtnBackComponent } from '../../../shared/components/buttons/btn-back/btn-back.component';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonStateService } from '../../../services/button-state.service';
import { LoginLoaderComponent } from '../login-loader/login-loader.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    FormBtnComponent,
    BtnBackComponent,
    FormsModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    LoginLoaderComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  errorHttpMessage: string = '';

  registerData = {
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    checkboxState: '',
  };

  constructor(
    public pwVisibility: PasswordVisibilityService,
    public translateService: TranslateService,
    private authService: AuthService,
    private buttonStateService: ButtonStateService
  ) {}

  async onSubmit(ngForm: NgForm) {
    this.buttonStateService.disableButton();
    if (ngForm.submitted && ngForm.form.valid) {
      this.extractFirstAndLastName();
      this.registerData.email = this.registerData.email.toLowerCase();
      try {
        await this.authService.register(this.registerData);
        this.buttonStateService.enableButton();
      } catch (error: any) {
        this.errorHttpMessage = error.message;
        this.buttonStateService.enableButton();
      }
    } else {
      this.buttonStateService.enableButton();
    }
  }

  isButtonDisabled() {
    return this.buttonStateService.isButtonDisabled;
  }

  extractFirstAndLastName() {
    const names = this.registerData.name.split(' ');
    this.registerData.firstName =
      names[0].charAt(0).toUpperCase() + names[0].slice(1).toLowerCase();
    this.registerData.lastName =
      names.slice(1).join(' ').charAt(0).toUpperCase() +
      names.slice(1).join(' ').slice(1).toLowerCase();
  }

  isEmailValid(emailValue: string) {
    return /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailValue);
  }
}
