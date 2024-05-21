import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedService } from '../../../../services/shared.service';
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

  constructor(public sharedService: SharedService, private router: Router) {}

  closeOverlay() {
    this.router.navigate(['/login']);
    this.closeDialogEmitter.emit('');
  }
}
