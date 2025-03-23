import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OverlayComponent } from './shared/components/overlay/overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'join';
}
