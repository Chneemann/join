import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { BtnCloseComponent } from '../../buttons/btn-close/btn-close.component';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { FirebaseService } from '../../../../services/firebase.service';

@Component({
  selector: 'app-contact-overlay',
  standalone: true,
  imports: [
    CommonModule,
    ContactFormComponent,
    BtnCloseComponent,
    TranslateModule,
    ColorPickerModule,
  ],
  templateUrl: './contact-overlay.component.html',
  styleUrl: './contact-overlay.component.scss',
})
export class ContactOverlayComponent implements OnInit {
  @Input() overlayData: any = [];
  @Input() overlayType: string = '';
  @Output() closeDialogEmitter = new EventEmitter<string>();

  randomColor: string = '';
  userInitials: string = '';
  newColor: string = '';

  constructor(public firebaseService: FirebaseService) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are
   * initialized.
   * This method sets a random color for the user to be edited.
   */
  ngOnInit() {
    this.randomColor = this.getRandomColor();
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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

  closeDialog() {
    this.closeDialogEmitter.emit('');
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
