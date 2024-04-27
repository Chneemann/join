import { Component, Input } from '@angular/core';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-btn-close',
  standalone: true,
  imports: [],
  templateUrl: './btn-close.component.html',
  styleUrl: './btn-close.component.scss',
})
export class BtnCloseComponent {
  @Input() isEditContactDialogOpen: boolean = false;

  constructor(private sharedService: SharedService) {}

  closeClicked() {
    this.sharedService.isAnyDialogOpen = false;
    this.sharedService.isEditContactDialogOpen = this.isEditContactDialogOpen;
  }
}
