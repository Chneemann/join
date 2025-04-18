import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormBtnComponent } from '../../../../shared/components/buttons/form-btn/form-btn.component';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ButtonStateService } from '../../../../services/button-state.service';
import { AuthService } from '../../../../services/auth.service';
import { PasswordVisibilityService } from '../../../../services/password-visibility.service';

@Component({
  selector: 'app-pw-reset',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FormBtnComponent,
    FooterComponent,
    HeaderComponent,
    TranslateModule,
  ],
  templateUrl: './pw-reset.component.html',
  styleUrl: './pw-reset.component.scss',
})
export class PwResetComponent implements OnInit, OnDestroy {
  uidb64: string = '';
  token: string = '';
  errorHttpMessage: string = '';

  pwResetData = {
    password: '',
    passwordConfirm: '',
  };

  private destroy$ = new Subject<void>();

  constructor(
    public pwVisibility: PasswordVisibilityService,
    private authService: AuthService,
    private buttonStateService: ButtonStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  routeParams() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.uidb64 = params['uidb64'];
      this.token = params['token'];
    });
  }

  isButtonDisabled() {
    return this.buttonStateService.isButtonDisabled;
  }

  async onSubmit(ngForm: NgForm) {
    this.buttonStateService.disableButton();
    if (ngForm.submitted && ngForm.form.valid) {
      try {
        console.log(this.uidb64, this.token);
        await this.authService.resetPasswordConfirm(
          this.pwResetData.password,
          this.uidb64,
          this.token
        );
        this.buttonStateService.enableButton();
      } catch (error: any) {
        this.errorHttpMessage = error.message;
        this.buttonStateService.enableButton();
      }
    } else {
      this.buttonStateService.enableButton();
    }
  }
}
