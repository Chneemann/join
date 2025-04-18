import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormBtnComponent } from '../../shared/components/buttons/form-btn/form-btn.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoginLoaderComponent } from './login-loader/login-loader.component';
import { OverlayService } from '../../services/overlay.service';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { ButtonStateService } from '../../services/button-state.service';
import { PasswordVisibilityService } from '../../services/password-visibility.service';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FormBtnComponent,
    FooterComponent,
    HeaderComponent,
    TranslateModule,
    LoginLoaderComponent,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  isPasswordIconVisible: boolean = true;
  checkboxRememberMe: boolean = false;

  loginData = {
    email: '',
    password: '',
  };

  private destroy$ = new Subject<void>();

  constructor(
    public pwVisibility: PasswordVisibilityService,
    private authService: AuthService,
    private tokenService: TokenService,
    private overlayService: OverlayService,
    private buttonStateService: ButtonStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeParams();
    this.deleteTokens();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  routeParams() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['id'] && params['id'] === 'pw-send') {
        this.overlayService.setOverlayData('dialog', 'pw-send');
      }
      if (params['id'] && params['id'] === 'pw-change') {
        this.overlayService.setOverlayData('dialog', 'pw-change');
      }
    });
  }

  isButtonDisabled() {
    return this.buttonStateService.isButtonDisabled;
  }

  deleteTokens() {
    this.tokenService.deleteAuthToken();
    this.tokenService.deleteUserId();
  }

  async onSubmit(ngForm: NgForm) {
    this.buttonStateService.disableButton();
    if (ngForm.submitted && ngForm.form.valid) {
      this.loginData.email = this.loginData.email.toLowerCase();
      try {
        await this.authService.login(this.loginData, this.checkboxRememberMe);
      } catch (error) {
        this.buttonStateService.enableButton();
      } finally {
        this.buttonStateService.enableButton();
      }
    } else {
      this.buttonStateService.enableButton();
    }
  }

  guestLogin() {
    this.loginData.email = environment.guestEmail.toLowerCase();
    this.loginData.password = environment.guestPassword.toLowerCase();
    this.isPasswordIconVisible = !this.isPasswordIconVisible;
    this.onSubmit({ submitted: true, form: { valid: true } } as NgForm);
  }

  isEmailValid(emailValue: string) {
    return /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailValue);
  }
}
