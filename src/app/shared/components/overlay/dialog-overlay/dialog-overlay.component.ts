import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BtnCloseComponent } from '../../buttons/btn-close/btn-close.component';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog-overlay',
  standalone: true,
  imports: [BtnCloseComponent, TranslateModule],
  templateUrl: './dialog-overlay.component.html',
  styleUrl: './dialog-overlay.component.scss',
})
export class DialogOverlayComponent {
  @Input() overlayData: string = '';
  @Input() overlayType: string = '';
  @Output() closeDialogEmitter = new EventEmitter<string>();

  constructor(private router: Router) {}

  /**
   * Navigates to the login route and emits an empty string via the
   * "closeDialogEmitter" output event, which can be used to close the overlay
   * from the parent component.
   */
  closeOverlay() {
    this.router.navigate(['/login']);
    this.closeDialogEmitter.emit('');
  }
}
