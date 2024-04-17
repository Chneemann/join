import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-task-overlay',
  standalone: true,
  imports: [],
  templateUrl: './task-overlay.component.html',
  styleUrl: './task-overlay.component.scss',
})
export class TaskOverlayComponent {
  @Input() overlayData: string = '';
}
