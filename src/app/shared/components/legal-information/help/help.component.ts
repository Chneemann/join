import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BtnBackComponent } from '../../buttons/btn-back/btn-back.component';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [RouterModule, TranslateModule, BtnBackComponent],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss',
})
export class HelpComponent {
  constructor(private location: Location) {}

  /**
   * Navigates back in the browser's history.
   */
  backClicked() {
    this.location.back();
  }
}
