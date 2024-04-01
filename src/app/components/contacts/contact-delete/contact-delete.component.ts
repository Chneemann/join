import { Component, Input } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-delete',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './contact-delete.component.html',
  styleUrl: './contact-delete.component.scss',
})
export class ContactDeleteComponent {
  @Input() currentUserId!: string;

  constructor(private sharedService: SharedService) {}

  deleteContact() {
    console.log('Contact deleted');
    this.sharedService.isDeleteContactDialogOpen = false;
    this.sharedService.isAnyDialogOpen = false;
  }

  deleteCancle() {
    this.sharedService.isDeleteContactDialogOpen = false;
    if (!this.sharedService.isEditContactDialogOpen) {
      this.sharedService.isAnyDialogOpen = false;
    }
  }
}
