import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormBtnComponent } from '../../../shared/components/buttons/form-btn/form-btn.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '../../../services/auth.service';
import { SharedService } from '../../../services/shared.service';
import { BtnBackComponent } from '../../../shared/components/buttons/btn-back/btn-back.component';

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
    public sharedService: SharedService
  ) {}

  onSubmit(ngForm: NgForm) {
    this.sharedService.isBtnDisabled = true;
    if (ngForm.submitted && ngForm.form.valid) {
      this.loginService.passwordReset(this.pwResetData.mail.toLowerCase());
    }
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
