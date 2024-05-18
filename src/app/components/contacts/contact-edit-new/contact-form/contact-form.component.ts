import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../../../services/shared.service';
import { FirebaseService } from '../../../../services/firebase.service';
import { FormBtnComponent } from '../../../../shared/components/buttons/form-btn/form-btn.component';
import { User } from '../../../../interfaces/user.interface';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [TranslateModule, FormsModule, FormBtnComponent],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements OnInit, OnChanges {
  @Input() currentUserId: string = '';
  @Input() randomColor: string = '';
  @Output() inititalsEmitter = new EventEmitter<string>();

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

  userData: User = {
    uId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    initials: '',
    color: '',
    status: false,
    lastLogin: 0,
  };

  ngOnInit() {
    this.userData = {
      ...this.userData,
      color: this.randomColor,
      lastLogin: new Date().getTime(),
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentUserId']) {
      this.updateContactData();
    }
  }

  updateFormData() {
    if (!this.currentUserId) {
      this.updateInitials();
      this.updateUserData();
    }
  }

  updateInitials() {
    const initials = this.contactData
      ? this.contactData.firstName.slice(0, 1).toUpperCase() +
        this.contactData.lastName.slice(0, 1).toUpperCase()
      : '';
    this.userData = {
      ...this.userData,
      initials: initials,
    };
    this.inititalsEmitter.emit(initials);
  }

  updateUserData() {
    this.userData = {
      ...this.userData,
      firstName:
        this.contactData.firstName.charAt(0).toUpperCase() +
        this.contactData.firstName.slice(1).toLowerCase(),
      lastName:
        this.contactData.lastName.charAt(0).toUpperCase() +
        this.contactData.lastName.slice(1).toLowerCase(),
      email: this.contactData.email,
      phone: this.contactData.phone,
    };
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
      if (this.currentUserId) {
        this.firebaseService.updateUserData(
          this.currentUserId,
          this.contactData
        );
      } else {
        const { id, ...taskWithoutIds } = this.userData;
        this.firebaseService.addNewUser(taskWithoutIds);
        console.log('add new contact');
      }
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