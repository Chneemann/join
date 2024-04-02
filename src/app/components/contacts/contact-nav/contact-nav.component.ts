import { Component, Input } from '@angular/core';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-contact-nav',
  standalone: true,
  imports: [],
  templateUrl: './contact-nav.component.html',
  styleUrl: './contact-nav.component.scss',
})
export class ContactNavComponent {
  @Input() deleteContact!: () => any;
  @Input() openEditDialog!: () => any;

  constructor(public sharedService: SharedService) {}
}
