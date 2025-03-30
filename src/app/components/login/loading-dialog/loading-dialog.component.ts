import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonStateService } from '../../../services/button-state.service';

@Component({
  selector: 'app-loading-dialog',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './loading-dialog.component.html',
  styleUrl: './loading-dialog.component.scss',
})
export class LoadingDialogComponent {
  constructor(private buttonStateService: ButtonStateService) {}

  isButtonDisabled() {
    return this.buttonStateService.isButtonDisabled;
  }
}
