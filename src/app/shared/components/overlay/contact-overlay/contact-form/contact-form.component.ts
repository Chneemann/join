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
import { FormBtnComponent } from '../../../buttons/form-btn/form-btn.component';
import { ResizeService } from '../../../../../services/resize.service';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../../../../../services/api.service';
import { ToastNotificationService } from '../../../../../services/toast-notification.service';
import { UpdateNotifierService } from '../../../../../services/update-notifier.service';
import { User } from '../../../../../interfaces/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, FormBtnComponent],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements OnInit, OnChanges {
  @Input() selectedUser: any = {};
  @Input() randomColor: string = '';
  @Input() newColor: string = '';
  @Input() currentColor: string = '';
  @Output() initialsEmitter = new EventEmitter<string>();
  @Output() closeDialogEmitter = new EventEmitter<boolean>();

  constructor(
    public resizeService: ResizeService,
    private apiService: ApiService,
    private toastNotificationService: ToastNotificationService,
    private updateNotifierService: UpdateNotifierService
  ) {}

  showConfirmDialog = false;

  contactData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    initials: '',
    color: '',
  };

  userData: User = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    initials: '',
    color: '',
    isContactOnly: true,
    isOnline: false,
    lastLogin: 0,
  };

  contactViewMedia$ = this.resizeService.contactViewMedia$;

  /**
   * OnInit lifecycle hook.
   *
   * If the currentUserId input property is empty, it sets the color and lastLogin
   * properties of the userData object.
   */
  ngOnInit() {
    if (!this.selectedUserExists) {
      this.userData = {
        ...this.userData,
        color: this.randomColor,
        lastLogin: new Date().getTime(),
      };
    }
  }

  get selectedUserExists() {
    return !!this.selectedUser && Object.keys(this.selectedUser).length > 0;
  }

  /**
   * Lifecycle hook that is called whenever the input properties of the component change.
   *
   * If the currentUserId input property has changed, it calls the updateContactData method.
   * @param changes an object containing the changed input properties
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedUser']) {
      this.updateContactData();
    }
  }

  /**
   * Updates the form data by calling helper methods to update the initials and user data.
   */
  updateFormData() {
    this.updateInitials();
    this.updateUserData();
  }

  /**
   * Updates the initials property of the userData object by extracting the first letter
   * of the firstName and lastName properties of the contactData object. If the
   * currentUserId input property is empty, it sets the initials property of the
   * userData object, otherwise it sets the initials property of the contactData object.
   * Finally, it emits an event containing the initials.
   */
  updateInitials() {
    const firstName = this.contactData?.firstName || '';
    const lastName = this.contactData?.lastName || '';
    const initials = (
      firstName.slice(0, 1) + lastName.slice(0, 1)
    ).toUpperCase();

    if (!this.selectedUser) {
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
    this.initialsEmitter.emit(initials);
  }

  /**
   * Updates the userData or contactData object by copying the properties from the
   * other object and capitalizing the first letter of the firstName and lastName
   * properties. If the currentUserId input property is empty, it updates the userData
   * object. Otherwise, it updates the contactData object.
   */
  updateUserData() {
    if (!this.selectedUser) {
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

  /**
   * Returns a string with the first letter capitalized and the rest of the letters
   * in lower case.
   *
   * @param {string} name - The string to modify.
   * @return {string} The modified string.
   */
  capitalizeFirstLetter(name?: string): string {
    if (!name) return ''; // Return an empty string if name is undefined or null
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  /**
   * Validates if the given email address matches the standard email format.
   *
   * @param {string} emailValue - The email address to validate.
   * @return {boolean} Returns true if the email address is in a valid format, otherwise false.
   */
  checkIfUserEmailIsValid(emailValue: string) {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(emailValue)) {
      return true;
    } else {
      return false;
    }
  }

  existEmailOnServer(mail: string) {
    return false; //TODO
  }

  /**
   * Updates the contactData object with user details retrieved from the Firebase service.
   * It fetches the first name, last name, email, phone number, and initials of the user
   * associated with the currentUserId from the Firebase database and assigns these values to the
   * respective properties of the contactData object. The values are expected to be arrays and are
   * joined into strings using a comma separator.
   */
  private updateContactData() {
    this.contactData.firstName = this.selectedUser.firstName;
    this.contactData.lastName = this.selectedUser.lastName;
    this.contactData.email = this.selectedUser.email;
    this.contactData.phone = this.selectedUser.phone;
    this.contactData.initials = this.selectedUser.initials;
  }

  /**
   * Submits the form when the user clicks the submit button. If the form is valid,
   * it either updates the existing contact if currentUserId is set, or adds a new
   * contact if currentUserId is empty. When the operation is completed, it closes
   * the contact dialog.
   *
   * @param ngForm - The angular form object.
   */
  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.contactData.color =
        this.newColor && this.newColor !== ''
          ? this.newColor
          : this.currentColor || this.randomColor;

      if (this.selectedUserExists) {
        this.updateContact();
      } else {
        this.saveNewContact();
      }
    }
  }

  async updateContact() {
    try {
      const snakeCaseUserData = this.convertCamelToSnake(this.contactData);
      const updatedUser = await lastValueFrom(
        this.apiService.updateUser(snakeCaseUserData, this.selectedUser.id)
      );
      this.toastNotificationService.updateContactSuccessToast();
      this.updateNotifierService.notifyUpdate('contact', updatedUser.id);
      this.closeDialog();
    } catch (error) {
      console.error('Error updating the contact:', error);
    }
  }

  async saveNewContact() {
    try {
      const userData: User = {
        firstName: this.contactData.firstName,
        lastName: this.contactData.lastName,
        email: this.contactData.email,
        phone: this.contactData.phone,
        initials: this.contactData.initials,
        color: this.contactData.color || this.randomColor,
        isContactOnly: true,
        isOnline: false,
        lastLogin: null,
      };

      const snakeCaseUserData = this.convertCamelToSnake(userData);
      const savedUser = await lastValueFrom(
        this.apiService.saveNewUser(snakeCaseUserData)
      );
      this.toastNotificationService.createContactSuccessToast();
      this.updateNotifierService.notifyUpdate('contact', savedUser.id);
      this.closeDialog();
    } catch (error) {
      console.error('Error saving the contact:', error);
    }
  }

  convertCamelToSnake(obj: any): any {
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (match) => `_${match.toLowerCase()}`
      );
      newObj[snakeKey] = obj[key];
    });
    return newObj;
  }

  async deleteContact(userId: string) {
    try {
      await lastValueFrom(this.apiService.deleteUserById(userId));
      this.toastNotificationService.deleteContactSuccessToast();
      this.updateNotifierService.notifyUpdate('contact');
      this.closeDialog();
    } catch (error) {
      console.error(error);
    }
  }

  toggleConfirmDialog(): void {
    this.showConfirmDialog = !this.showConfirmDialog;
  }

  closeDialog() {
    this.closeDialogEmitter.emit(false);
  }
}
