import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-btn.component.html',
  styleUrl: './form-btn.component.scss',
})
export class FormBtnComponent {
  @Input() class: string = '';
  @Input() type: string = '';
  @Input() value: string = '';
  @Input() img: string = '';
  @Input() disabled: boolean = false;
  @Input() imgFilter: string =
    'brightness(0) saturate(100%) invert(57%) sepia(44%) saturate(848%) hue-rotate(155deg) brightness(95%) contrast(86%)';
}
