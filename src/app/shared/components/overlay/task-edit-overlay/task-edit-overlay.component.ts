import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';
import { OverlayService } from '../../../../services/overlay.service';
import { BtnCloseComponent } from '../../buttons/btn-close/btn-close.component';

@Component({
  selector: 'app-task-edit-overlay',
  standalone: true,
  imports: [BtnCloseComponent],
  templateUrl: './task-edit-overlay.component.html',
  styleUrl: './task-edit-overlay.component.scss',
})
export class TaskEditOverlayComponent {
  @Input() overlayData: string = '';
  @Output() closeDialogEmitter = new EventEmitter<string>();

  constructor(
    public firebaseService: FirebaseService,
    private overlayService: OverlayService
  ) {}

  closeDialog() {
    this.closeDialogEmitter.emit('');
  }
}
