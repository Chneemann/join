import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormBtnComponent } from '../../../shared/components/buttons/form-btn/form-btn.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { FirebaseService } from '../../../services/firebase.service';
import { LoginService } from '../../../services/login.service';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';

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
    LoadingDialogComponent,
  ],
  templateUrl: './forgot-pw.component.html',
  styleUrl: './forgot-pw.component.scss',
})
export class ForgotPwComponent {
  pwResetData = {
    mail: '',
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
      // this.loginSerivce.login(this.pwResetData);
    }
  }

  existEmailonServer(mail: string) {
    return this.firebaseService
      .getAllUsers()
      .filter((user) => user.email === mail);
  }

  checkIfUserEmailIsValid(emailValue: string) {
    const channelNameLenght = emailValue.length;
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(emailValue)) {
      return true;
    } else {
      return false;
    }
  }
}
