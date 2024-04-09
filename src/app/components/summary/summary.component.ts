import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  nextUrgendTask: number[] = [];

  constructor(
    public firebaseService: FirebaseService,
    private translateService: TranslateService
  ) {}

  displayNumberOfAllTasks() {
    return this.firebaseService.getAllTasks().length;
  }

  displayNumberOfTaskStatus(query: string) {
    const filteredTasks = this.firebaseService
      .getAllTasks()
      .filter((task) => task.status === query);
    return filteredTasks.length;
  }

  displayNumberOfTaskStatusUrgent() {
    return this.firebaseService
      .getAllTasks()
      .filter((task) => task.priority === 'urgent');
  }

  nextUrgentTask() {
    const urgentTasks = this.displayNumberOfTaskStatusUrgent();
    if (urgentTasks.length > 0) {
      const nextTask = urgentTasks.reduce((earliest, current) => {
        const currentDate = Date.parse(current.date);
        const earliestDate = Date.parse(earliest.date);
        return currentDate < earliestDate ? current : earliest;
      });
      return this.timeConverter(nextTask.date);
    }
    return null;
  }

  timeConverter(dateString: string) {
    var a = new Date(dateString);
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
