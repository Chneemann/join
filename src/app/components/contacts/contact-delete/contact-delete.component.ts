import { Component, Input } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-contact-delete',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './contact-delete.component.html',
  styleUrl: './contact-delete.component.scss',
})
export class ContactDeleteComponent {
  @Input() currentUserId!: string;

  constructor(
    private sharedService: SharedService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {
    console.log(this.sharedService.isEditContactDialogOpen);
  }

  deleteContact() {
    this.firebaseService.deleteUser(this.currentUserId);
    this.router.navigate(['contacts']);
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
