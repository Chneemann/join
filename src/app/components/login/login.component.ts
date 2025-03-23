import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormBtnComponent } from '../../shared/components/buttons/form-btn/form-btn.component';
import { FirebaseService } from '../../services/firebase.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { SharedService } from '../../services/shared.service';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { OverlayService } from '../../services/overlay.service';
import { AuthService } from '../../services/auth.service';

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
    LoadingDialogComponent,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isPasswordIconVisible: boolean = true;

  loginData = {
    email: '',
    password: '',
  };

  constructor(
    private authService: AuthService,
    public loginService: LoginService,
    public sharedService: SharedService,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.routeParams();
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

  async onSubmit(ngForm: NgForm) {
    this.sharedService.isBtnDisabled = true;
    if (ngForm.submitted && ngForm.form.valid) {
      try {
        await this.authService.login(this.loginData, true);
        this.router.navigate(['/summary']);
      } catch (error) {
        this.sharedService.isBtnDisabled = false;
      }
    }
  }

  guestLogin() {
    this.sharedService.isBtnDisabled = true;
    this.loginData.email = 'guest@guestaccount.com';
    this.loginData.password = 'guest@guestaccount.com';
    this.isPasswordIconVisible = !this.isPasswordIconVisible;
    this.onSubmit({ submitted: true, form: { valid: true } } as NgForm);
  }

  googleLogin() {
    this.sharedService.isBtnDisabled = true;
    this.loginService.googleLogin();
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
