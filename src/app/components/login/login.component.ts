import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormBtnComponent } from '../../shared/components/buttons/form-btn/form-btn.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoginLoaderComponent } from './login-loader/login-loader.component';
import { OverlayService } from '../../services/overlay.service';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { ButtonStateService } from '../../services/button-state.service';

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
export class LoginComponent {
  isPasswordIconVisible: boolean = true;
  checkboxRememberMe: boolean = false;

  loginData = {
    email: '',
    password: '',
  };

  constructor(
    private authService: AuthService,
    public loginService: LoginService,
    private tokenService: TokenService,
    private overlayService: OverlayService,
    private buttonStateService: ButtonStateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.routeParams();
    this.deleteTokens();
  }

  routeParams() {
    this.route.params.subscribe((params) => {
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
        this.router.navigate(['/summary']);
        this.buttonStateService.enableButton();
      } catch (error) {
        this.buttonStateService.enableButton();
      }
    } else {
      this.buttonStateService.enableButton();
    }
  }

  guestLogin() {
    this.loginData.email = 'guest@guestaccount.com';
    this.loginData.password = 'guest@guestaccount.com';
    this.isPasswordIconVisible = !this.isPasswordIconVisible;
    this.onSubmit({ submitted: true, form: { valid: true } } as NgForm);
  }

  isEmailValid(emailValue: string) {
    return /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailValue);
  }
}
