import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-headline',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './headline.component.html',
  styleUrl: './headline.component.scss',
})
export class HeadlineComponent {
  @Input() title: string = '';
  @Input() description: string = '';

  get isContacts(): boolean {
    return this.title === 'Contacts' || this.title === 'Kontakte';
  }
}
