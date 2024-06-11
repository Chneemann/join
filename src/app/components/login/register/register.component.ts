import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBtnComponent } from '../../../shared/components/buttons/form-btn/form-btn.component';
import { FirebaseService } from '../../../services/firebase.service';
import { LoginService } from '../../../services/login.service';
import { SharedService } from '../../../services/shared.service';
import { BtnBackComponent } from '../../../shared/components/buttons/btn-back/btn-back.component';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    FormBtnComponent,
    BtnBackComponent,
    FormsModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    LoadingDialogComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerData = {
    name: '',
    firstName: '',
    lastName: '',
    mail: '',
    password: '',
    passwordConfirm: '',
    checkboxState: '',
  };

  constructor(
    private firebaseService: FirebaseService,
    public loginService: LoginService,
    public sharedService: SharedService,
    public translateService: TranslateService
  ) {}

  onSubmit(ngForm: NgForm) {
    this.sharedService.isBtnDisabled = true;
    if (ngForm.submitted && ngForm.form.valid) {
      this.splitName();
      this.loginService.register(this.registerData);
    }
  }

  splitName() {
    const names = this.registerData.name.split(' ');
    this.registerData.firstName = names[0];
    this.registerData.lastName = names.slice(1).join(' ');
  }

  existEmailOnServer(mail: string) {
    return this.firebaseService
      .getAllUsers()
      .filter((user) => user.email === mail);
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
