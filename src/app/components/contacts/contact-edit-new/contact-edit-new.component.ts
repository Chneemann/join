import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnCloseComponent } from '../../../shared/components/buttons/btn-close/btn-close.component';
import { FirebaseService } from '../../../services/firebase.service';
import { TranslateModule } from '@ngx-translate/core';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { SharedService } from '../../../services/shared.service';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-contact-edit',
  standalone: true,
  imports: [
    CommonModule,
    ContactFormComponent,
    BtnCloseComponent,
    TranslateModule,
  ],
  templateUrl: './contact-edit-new.component.html',
  styleUrl: './contact-edit-new.component.scss',
})
export class ContactEditNewComponent implements OnInit {
  @Input() currentUserId: string | undefined;
  randomColor: string = '';
  userInitials: string = '';

  userData: User = {
    uId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    initials: '',
    color: this.randomColor,
    status: false,
    lastLogin: 0,
  };

  constructor(
    public firebaseService: FirebaseService,
    public sharedService: SharedService
  ) {}

  inititalsEmitter(emitter: string) {
    this.userInitials = emitter;
  }

  ngOnInit() {
    this.randomColor = this.sharedService.generateRandomColor();
  }
}
