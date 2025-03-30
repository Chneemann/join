import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormBtnComponent } from '../../../../shared/components/buttons/form-btn/form-btn.component';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '../../../../services/login.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ButtonStateService } from '../../../../services/button-state.service';

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
  oobCode: string = '';
  private queryParamsSubscription: Subscription = new Subscription();

  pwResetData = {
    password: '',
    passwordConfirm: '',
  };

  constructor(
    public loginService: LoginService,
    private buttonStateService: ButtonStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        this.oobCode = params['oobCode'];
      }
    );
  }

  isButtonDisabled() {
    return this.buttonStateService.isButtonDisabled;
  }

  onSubmit(ngForm: NgForm) {
    this.buttonStateService.enableButton();
    if (ngForm.submitted && ngForm.form.valid) {
      this.loginService.newPassword(this.pwResetData.password, this.oobCode);
    }
  }
}
