import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { LanguageService } from '../../../services/language.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, HeaderComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() navbarVisible: boolean = false;
  @Input() navbarLanguageVisible: boolean = false;

  constructor(public langService: LanguageService) {}
}
