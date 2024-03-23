import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss',
})
export class HelpComponent {
  constructor(private location: Location) {}

  backClicked() {
    this.location.back();
  }
}
