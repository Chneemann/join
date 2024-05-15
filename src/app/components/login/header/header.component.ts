import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() signUpBtn: boolean = false;

  constructor(public languageService: LanguageService) {}
}
