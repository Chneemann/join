import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBtnComponent } from '../../../shared/components/buttons/form-btn/form-btn.component';
import { LoginService } from '../../../services/login.service';
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
    public loginService: LoginService,
    public translateService: TranslateService,
    private authService: AuthService,
    private buttonStateService: ButtonStateService
  ) {}

  async onSubmit(ngForm: NgForm) {
    this.buttonStateService.disableButton();
    if (ngForm.submitted && ngForm.form.valid) {
      this.extractFirstAndLastName();
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
    this.registerData.firstName = names[0];
    this.registerData.lastName = names.slice(1).join(' ');
  }

  isEmailValid(emailValue: string) {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(emailValue)) {
      return true;
    } else {
      return false;
    }
  }
}
