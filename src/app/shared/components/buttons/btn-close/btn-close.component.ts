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
  @Input() isContactDialogOpen: boolean = false;

  constructor(private sharedService: SharedService) {}

  /**
   * Called when the close button is clicked.
   * Sets isAnyDialogOpen to false and sets
   * isEditContactDialogOpen and isNewContactDialogOpen
   * to the value of isContactDialogOpen.
   */
  closeClicked() {
    this.sharedService.isAnyDialogOpen = false;
    this.sharedService.isEditContactDialogOpen = this.isContactDialogOpen;
    this.sharedService.isNewContactDialogOpen = this.isContactDialogOpen;
  }
}
