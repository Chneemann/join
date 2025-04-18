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
import { environment } from '../../../../environments/environment';

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
  errorMessage = false;
  pwResetData = {
    mail: '',
  };

  constructor(
    private buttonStateService: ButtonStateService,
    private authService: AuthService
  ) {}

  async onSubmit(ngForm: NgForm): Promise<void> {
    this.buttonStateService.disableButton();
    if (this.checkGuestEmail()) return;

    if (ngForm.submitted && ngForm.form.valid) {
      try {
        await this.authService.resetPassword(
          this.pwResetData.mail.toLowerCase()
        );
      } catch (error) {
        this.buttonStateService.enableButton();
      } finally {
        this.buttonStateService.enableButton();
      }
    } else {
      this.buttonStateService.enableButton();
    }
  }

  checkGuestEmail(): boolean {
    this.errorMessage = false;

    if (
      this.pwResetData.mail.toLowerCase() ===
      environment.guestEmail.toLowerCase()
    ) {
      this.errorMessage = true;
      this.buttonStateService.enableButton();
      return true;
    }
    return false;
  }

  isButtonDisabled(): boolean {
    return this.buttonStateService.isButtonDisabled;
  }

  isEmailValid(emailValue: string): boolean {
    return /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailValue);
  }
}
