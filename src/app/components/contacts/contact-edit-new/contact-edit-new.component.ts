import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnCloseComponent } from '../../../shared/components/buttons/btn-close/btn-close.component';
import { FirebaseService } from '../../../services/firebase.service';
import { TranslateModule } from '@ngx-translate/core';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { SharedService } from '../../../services/shared.service';
import { ColorPickerModule } from 'ngx-color-picker';

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
    public sharedService: SharedService
  ) {}

  initialsEmitter(emitter: string) {
    this.userInitials = emitter;
  }

  updateColor(newColor: string) {
    this.newColor = newColor;
  }

  ngOnInit() {
    this.randomColor = this.sharedService.generateRandomColor();
  }
}
