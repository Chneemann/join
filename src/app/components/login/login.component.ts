import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormBtnComponent } from '../../shared/components/buttons/form-btn/form-btn.component';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { SharedService } from '../../services/shared.service';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, FormBtnComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginData = {
    mail: '',
    password: '',
  };

  constructor(
    private firebaseService: FirebaseService,
    public loginSerivce: LoginService,
    public sharedService: SharedService,
    private router: Router
  ) {}

  onSubmit(ngForm: NgForm) {
    this.sharedService.isBtnDisabled = true;
    if (ngForm.submitted && ngForm.form.valid) {
      this.loginSerivce.login(this.loginData);
    }
  }

  guestLogin() {
    this.sharedService.isBtnDisabled = true;
    this.loginData.mail = 'guest@guestaccount.com';
    this.loginData.password = 'guest@guestaccount.com';
    this.onSubmit({ submitted: true, form: { valid: true } } as NgForm);
  }

  googleLogin() {
    this.loginSerivce.googleLogin();
  }
}
