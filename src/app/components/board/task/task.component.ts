import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DragDropService } from '../../../services/drag-drop.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input() index: number | undefined;

  constructor(public dragDropService: DragDropService) {}
}
