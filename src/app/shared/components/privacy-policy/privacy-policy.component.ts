import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BtnBackComponent } from '../buttons/btn-back/btn-back.component';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [TranslateModule, BtnBackComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent {
  constructor(private location: Location) {}

  backClicked() {
    this.location.back();
  }
}
