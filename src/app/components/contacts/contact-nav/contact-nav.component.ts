import { Component, Input } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-nav',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './contact-nav.component.html',
  styleUrl: './contact-nav.component.scss',
})
export class ContactNavComponent {
  @Input() deleteContact!: () => any;
  @Input() openEditDialog!: () => any;

  constructor(public sharedService: SharedService) {}
}
