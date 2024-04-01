import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../services/user.service';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [TranslateModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements OnChanges {
  @Input() currentUserId!: string;

  constructor(
    public userService: UserService,
    private sharedService: SharedService
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
    this.contactData.firstName = this.userService
      .getUserDetails(this.currentUserId, 'firstName')
      .join(', ');
    this.contactData.lastName = this.userService
      .getUserDetails(this.currentUserId, 'lastName')
      .join(', ');
    this.contactData.email = this.userService
      .getUserDetails(this.currentUserId, 'email')
      .join(', ');
    this.contactData.phone = this.userService
      .getUserDetails(this.currentUserId, 'phone')
      .join(', ');
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.userService.updateUserData(this.currentUserId, this.contactData);
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
