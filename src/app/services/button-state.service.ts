import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ButtonStateService {
  isButtonDisabled: boolean = false;

  disableButton() {
    this.isButtonDisabled = true;
  }

  enableButton() {
    this.isButtonDisabled = false;
  }
}
