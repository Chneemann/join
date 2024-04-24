import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-btn',
  standalone: true,
  imports: [],
  templateUrl: './form-btn.component.html',
  styleUrl: './form-btn.component.scss',
})
export class FormBtnComponent {
  @Input() class: string = '';
  @Input() type: string = '';
  @Input() value: string = '';
  @Input() disabled: boolean = false;
}
