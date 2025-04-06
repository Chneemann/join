import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormBtnComponent } from '../../../shared/components/buttons/form-btn/form-btn.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { BtnBackComponent } from '../../../shared/components/buttons/btn-back/btn-back.component';
import { ButtonStateService } from '../../../services/button-state.service';
import { AuthService } from '../../../services/auth.service';

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
    private buttonStateService: ButtonStateService,
    private authService: AuthService
  ) {}

  onSubmit(ngForm: NgForm) {
    this.buttonStateService.disableButton();
    if (ngForm.submitted && ngForm.form.valid) {
      try {
        this.authService.resetPassword(this.pwResetData.mail.toLowerCase());
        this.buttonStateService.enableButton();
      } catch (error: any) {
        this.buttonStateService.enableButton();
      }
    } else {
      this.buttonStateService.enableButton();
    }
  }

  isButtonDisabled() {
    return this.buttonStateService.isButtonDisabled;
  }

  isEmailValid(emailValue: string) {
    return /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailValue);
  }
}
