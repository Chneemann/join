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

  constructor(private taskService: TaskService) {
    this.taskService.tasksLoaded.subscribe(() => {
      this.updateTasksCount();
      this.updateAllTasksCount();
    });
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
}
