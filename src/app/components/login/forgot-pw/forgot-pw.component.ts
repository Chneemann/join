import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormBtnComponent } from '../../../shared/components/buttons/form-btn/form-btn.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '../../../services/login.service';
import { BtnBackComponent } from '../../../shared/components/buttons/btn-back/btn-back.component';
import { ButtonStateService } from '../../../services/button-state.service';

@Component({
  selector: 'app-forgot-pw',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FormBtnComponent,
    FooterComponent,
    HeaderComponent,
    TranslateModule,
    BtnBackComponent,
  ],
  templateUrl: './forgot-pw.component.html',
  styleUrl: './forgot-pw.component.scss',
})
export class ForgotPwComponent {
  pwResetData = {
    mail: '',
  };

  constructor(
    public loginService: LoginService,
    private buttonStateService: ButtonStateService
  ) {}

  onSubmit(ngForm: NgForm) {
    this.buttonStateService.enableButton();
    if (ngForm.submitted && ngForm.form.valid) {
      this.loginService.passwordReset(this.pwResetData.mail.toLowerCase());
    }
  }

  isButtonDisabled() {
    return this.buttonStateService.isButtonDisabled;
  }

  checkIfUserEmailIsValid(emailValue: string) {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(emailValue)) {
      return true;
    } else {
      return false;
    }
  }
}
