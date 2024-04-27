import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-task-menu',
  standalone: true,
  imports: [],
  templateUrl: './task-menu.component.html',
  styleUrl: './task-menu.component.scss',
})
export class TaskMenuComponent {
  @Input() boardTaskStatus: string = '';

  moveTask(moveTo: string) {
    console.log(moveTo);
  }
}
