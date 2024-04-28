import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../../services/shared.service';
import { FirebaseService } from '../../../services/firebase.service';
import { FormBtnComponent } from '../../../shared/components/buttons/form-btn/form-btn.component';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [TranslateModule, FormsModule, FormBtnComponent],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements OnChanges {
  @Input() currentUserId!: string;

  constructor(
    private firebaseService: FirebaseService,
    public sharedService: SharedService
  ) {
    this.updateContactData();
  }

  contactData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentUserId']) {
      this.updateContactData();
    }
  }

  private updateContactData() {
    this.contactData.firstName = this.firebaseService
      .getUserDetails(this.currentUserId, 'firstName')
      .join(', ');
    this.contactData.lastName = this.firebaseService
      .getUserDetails(this.currentUserId, 'lastName')
      .join(', ');
    this.contactData.email = this.firebaseService
      .getUserDetails(this.currentUserId, 'email')
      .join(', ');
    this.contactData.phone = this.firebaseService
      .getUserDetails(this.currentUserId, 'phone')
      .join(', ');
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.firebaseService.updateUserData(this.currentUserId, this.contactData);
      this.closeEditDialog();
    }
  }

  deleteContact() {
    this.sharedService.isDeleteContactDialogOpen = false;
    this.sharedService.isAnyDialogOpen = false;
  }

  closeEditDialog() {
    this.sharedService.isEditContactDialogOpen = false;
    this.sharedService.isAnyDialogOpen = false;
  }
}
