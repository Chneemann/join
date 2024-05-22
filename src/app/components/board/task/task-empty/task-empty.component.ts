import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-empty',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './task-empty.component.html',
  styleUrl: './task-empty.component.scss',
})
export class TaskEmptyComponent {}
