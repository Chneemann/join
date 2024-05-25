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
import { Router } from '@angular/router';

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
  @Input() newColor: string = '';
  @Input() currentColor: string = '';
  @Output() inititalsEmitter = new EventEmitter<string>();

  constructor(
    private router: Router,
    public firebaseService: FirebaseService,
    public sharedService: SharedService
  ) {
    this.updateContactData();
  }

  contactData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    initials: '',
    color: '',
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
    if (!this.currentUserId) {
      this.userData = {
        ...this.userData,
        color: this.randomColor,
        lastLogin: new Date().getTime(),
      };
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentUserId']) {
      this.updateContactData();
    }
  }

  updateFormData() {
    this.updateInitials();
    this.updateUserData();
  }

  updateInitials() {
    const initials = this.contactData
      ? this.contactData.firstName.slice(0, 1).toUpperCase() +
        this.contactData.lastName.slice(0, 1).toUpperCase()
      : '';
    if (!this.currentUserId) {
      this.userData = {
        ...this.userData,
        initials: initials,
      };
    } else {
      this.contactData = {
        ...this.contactData,
        initials: initials,
      };
    }
    this.inititalsEmitter.emit(initials);
  }

  updateUserData() {
    if (!this.currentUserId) {
      this.userData = {
        ...this.userData,
        firstName: this.capitalizeFirstLetter(this.contactData.firstName),
        lastName: this.capitalizeFirstLetter(this.contactData.lastName),
        email: this.contactData.email,
        phone: this.contactData.phone,
      };
    } else {
      this.contactData = {
        ...this.contactData,
        firstName: this.capitalizeFirstLetter(this.contactData.firstName),
        lastName: this.capitalizeFirstLetter(this.contactData.lastName),
      };
    }
  }

  capitalizeFirstLetter(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  checkIfUserEmailIsValid(emailValue: string) {
    const channelNameLenght = emailValue.length;
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(emailValue)) {
      return true;
    } else {
      return false;
    }
  }

  existEmailonServer(mail: string) {
    return this.firebaseService
      .getAllUsers()
      .filter((user) => user.email === mail);
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
    this.contactData.initials = this.firebaseService
      .getUserDetails(this.currentUserId, 'initials')
      .join(', ');
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      if (this.currentUserId) {
        console.log(this.newColor, this.currentColor);

        this.newColor !== ''
          ? (this.contactData.color = this.newColor)
          : (this.contactData.color = this.currentColor);
        this.firebaseService.updateUserData(
          this.currentUserId,
          this.contactData
        );
      } else {
        this.newColor !== ''
          ? (this.userData.color = this.newColor)
          : (this.userData.color = this.randomColor);
        const { id, ...taskWithoutIds } = this.userData;
        this.firebaseService.addNewUser(taskWithoutIds).then((docRef) => {
          this.router.navigate([`/contacts/${docRef.id}`]);
        });
      }
      this.closeDialog();
    }
  }

  deleteContact() {
    this.sharedService.isDeleteContactDialogOpen = false;
    this.sharedService.isAnyDialogOpen = false;
  }

  closeDialog() {
    this.sharedService.isAnyDialogOpen = false;
    this.sharedService.isEditContactDialogOpen = false;
    this.sharedService.isNewContactDialogOpen = false;
  }
}
