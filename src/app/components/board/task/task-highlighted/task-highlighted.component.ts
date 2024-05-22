import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-highlighted',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './task-highlighted.component.html',
  styleUrl: './task-highlighted.component.scss',
})
export class TaskHighlightedComponent {}
