import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormBtnComponent } from '../../../../shared/components/buttons/form-btn/form-btn.component';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ButtonStateService } from '../../../../services/button-state.service';
import { AuthService } from '../../../../services/auth.service';
import { LoginService } from '../../../../services/login.service';

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
export class PwResetComponent {
  private routeSubscription: Subscription = new Subscription();

  uid: string = '';
  token: string = '';
  errorHttpMessage: string = '';

  pwResetData = {
    password: '',
    passwordConfirm: '',
  };

  constructor(
    public loginService: LoginService,
    private authService: AuthService,
    private buttonStateService: ButtonStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.uid = params['uid'];
      this.token = params['token'];
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  isButtonDisabled() {
    return this.buttonStateService.isButtonDisabled;
  }

  async onSubmit(ngForm: NgForm) {
    this.buttonStateService.disableButton();
    if (ngForm.submitted && ngForm.form.valid) {
      try {
        await this.authService.resetPasswordConfirm(
          this.pwResetData.password,
          this.uid,
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
