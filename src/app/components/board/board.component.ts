import { Component } from '@angular/core';
import { TaskComponent } from './task/task.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {}
