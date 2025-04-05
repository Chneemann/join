import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonStateService } from '../../../services/button-state.service';

@Component({
  selector: 'app-login-loader',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './login-loader.component.html',
  styleUrl: './login-loader.component.scss',
})
export class LoginLoaderComponent {
  constructor(private buttonStateService: ButtonStateService) {}

  /**
   * Checks if the button is disabled (i.e., loading is in progress)
   * @returns whether the button is disabled
   */
  isLoginButtonDisabled(): boolean {
    return this.buttonStateService.isButtonDisabled;
  }
}
