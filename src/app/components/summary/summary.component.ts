import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  allTasksCount: Number = 0;
  todoTasksCount: Number = 0;
  inprogressTasksCount: Number = 0;
  awaitfeedbackTasksCount: Number = 0;
  doneTasksCount: Number = 0;
  urgentTasksCount: Number = 0;
  urgentTasksDate: String = '';

  constructor(private taskService: TaskService) {
    this.updateTasksCount();
    this.updateAllTasksCount();
    this.updateUrgentTasksCount();
  }

  updateAllTasksCount() {
    this.allTasksCount = this.taskService.allTasks.length;
  }

  updateTasksCount() {
    this.todoTasksCount = this.countTasks('todo');
    this.inprogressTasksCount = this.countTasks('inprogress');
    this.awaitfeedbackTasksCount = this.countTasks('awaitfeedback');
    this.doneTasksCount = this.countTasks('done');
  }

  countTasks(status: string): number {
    const filteredTasks = this.taskService.allTasks.filter(
      (task) => task.status === status
    );
    return filteredTasks.length;
  }

  updateUrgentTasksCount() {
    const filteredTasks = this.taskService.allTasks.filter(
      (task) => task.priority === 'urgent'
    );
    this.urgentTasksCount = filteredTasks.length;
    this.nextUrgentTasks(filteredTasks);
  }

  nextUrgentTasks(filteredTasks: any[]) {
    if (filteredTasks.length >= 2) {
      let timestamps = [];
      for (let i = 0; i < filteredTasks.length; i++) {
        timestamps.push(filteredTasks[i].timestamp);
      }
      this.urgentTasksDate = this.timeConverter(Math.min(...timestamps));
    } else if (filteredTasks.length > 0) {
      for (let i = 0; i < filteredTasks.length; i++) {
        this.urgentTasksDate = this.timeConverter(filteredTasks[i].timestamp);
      }
    }
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
}
