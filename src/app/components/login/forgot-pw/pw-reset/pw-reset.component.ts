import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormBtnComponent } from '../../../../shared/components/buttons/form-btn/form-btn.component';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingDialogComponent } from '../../loading-dialog/loading-dialog.component';
import { FirebaseService } from '../../../../services/firebase.service';
import { LoginService } from '../../../../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { Subscription } from 'rxjs';

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
    LoadingDialogComponent,
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
    private firebaseService: FirebaseService,
    public loginService: LoginService,
    public sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        this.oobCode = params['oobCode'];
      }
    );
  }

  onSubmit(ngForm: NgForm) {
    this.sharedService.isBtnDisabled = true;
    if (ngForm.submitted && ngForm.form.valid) {
      this.loginService.newPassword(this.pwResetData.password, this.oobCode);
    }
  }
}
