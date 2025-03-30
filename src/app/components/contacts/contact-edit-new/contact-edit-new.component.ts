import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnCloseComponent } from '../../../shared/components/buttons/btn-close/btn-close.component';
import { FirebaseService } from '../../../services/firebase.service';
import { TranslateModule } from '@ngx-translate/core';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { SharedService } from '../../../services/shared.service';
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorService } from '../../../services/color.service';

@Component({
  selector: 'app-contact-edit',
  standalone: true,
  imports: [
    CommonModule,
    ContactFormComponent,
    BtnCloseComponent,
    TranslateModule,
    ColorPickerModule,
  ],
  templateUrl: './contact-edit-new.component.html',
  styleUrl: './contact-edit-new.component.scss',
})
export class ContactEditNewComponent implements OnInit {
  @Input() currentUserId: string = '';
  @Input() currentColor: string = '';

  randomColor: string = '';
  userInitials: string = '';
  newColor: string = '';

  constructor(
    public firebaseService: FirebaseService,
    public sharedService: SharedService,
    private colorService: ColorService
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are
   * initialized.
   * This method sets a random color for the user to be edited.
   */
  ngOnInit() {
    this.randomColor = this.colorService.generateRandomColor();
  }

  /**
   * This method is an event emitter that listens for changes to the user's initials.
   * It is called by the contact form component and updates the userInitials
   * variable with the new initials.
   *
   * @param emitter The new initials of the user.
   */
  initialsEmitter(emitter: string) {
    this.userInitials = emitter;
  }

  /**
   * Updates the newColor variable with the newly selected color.
   *
   * @param newColor The new color to be set.
   */
  updateColor(newColor: string) {
    this.newColor = newColor;
  }
}
