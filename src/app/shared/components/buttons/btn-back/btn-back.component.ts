import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-btn-back',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './btn-back.component.html',
  styleUrl: './btn-back.component.scss',
})
export class BtnBackComponent {
  constructor(private location: Location) {}

  /**
   * Navigates back in the browser's history.
   */
  backClicked() {
    this.location.back();
  }
}
