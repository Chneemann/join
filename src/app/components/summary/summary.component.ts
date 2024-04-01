import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  constructor(
    private taskService: TaskService,
    public userService: UserService,
    private translateService: TranslateService
  ) {}

  displayNumberOfAllTasks() {
    return this.taskService.getAllTasks().length;
  }

  displayNumberOfTaskStatus(query: string) {
    const filteredTasks = this.taskService
      .getAllTasks()
      .filter((task) => task.status === query);
    return filteredTasks.length;
  }

  displayNumberOfTaskStatusUrgent() {
    return this.taskService
      .getAllTasks()
      .filter((task) => task.priority === 'urgent');
  }

  nextUrgentTasks() {
    const urgentTasks = this.displayNumberOfTaskStatusUrgent();
    if (urgentTasks.length >= 2) {
      const timestamps = urgentTasks.map((task) => task.timestamp);
      return this.timeConverter(Math.min(...timestamps));
    } else if (urgentTasks.length > 0) {
      return this.timeConverter(urgentTasks[0].timestamp);
    }
    return;
  }

  timeConverter(timestamp: number) {
    var a = new Date(timestamp * 1000);
    var months = [
      'Jan.',
      'Feb.',
      'Mar.',
      'Apr.',
      'May.',
      'Jun.',
      'Jul.',
      'Aug.',
      'Sep.',
      'Oct.',
      'Nov.',
      'Dec.',
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = month + ' ' + date + ', ' + year;
    return time;
  }

  displayGreeting() {
    let currentTime = new Date();
    let localTime = new Date(currentTime.getTime() + 3600000);
    let currentHour = localTime.getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return this.translateService.instant('summary.morning');
    } else if (currentHour >= 12 && currentHour < 18) {
      return this.translateService.instant('summary.afternoon');
    } else {
      return this.translateService.instant('summary.evening');
    }
  }
}
