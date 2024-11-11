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

  /**
   * Return the total number of tasks.
   *
   * @returns The number of total tasks.
   */
  displayNumberOfAllTasks() {
    return this.firebaseService.getAllTasks().length;
  }

  /**
   * Returns the number of tasks with the given status.
   *
   * @param query The task status to query for.
   * @returns The number of tasks with the given status.
   */
  displayNumberOfTaskStatus(query: string) {
    const filteredTasks = this.firebaseService
      .getAllTasks()
      .filter((task) => task.status === query);
    return filteredTasks.length;
  }

  /**
   * Returns the number of tasks with the "urgent" priority.
   *
   * @returns The number of tasks with the "urgent" priority.
   */
  displayNumberOfTaskStatusUrgent() {
    return this.firebaseService
      .getAllTasks()
      .filter((task) => task.priority === 'urgent');
  }

  /**
   * Return the next task with the "urgent" priority or null if none
   * exist.
   *
   * @returns The next task with the "urgent" priority or null.
   */
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

  /**
   * Converts a date string to a human-readable format.
   *
   * @param dateString The date string to convert.
   * @returns A string in the format "Month DD, YYYY".
   */
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

  /**
   * Displays a greeting message based on the current time of day.
   *
   * The time is converted to the user's local time and then compared to the
   * following ranges to determine the greeting message:
   * - Before 12pm: "Good morning"
   * - 12pm to 6pm: "Good afternoon"
   * - After 6pm: "Good evening"
   *
   * @returns The greeting message.
   */
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
