import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  currentDate: string = new Date().toISOString().split('T')[0];

  taskData = {
    title: '',
    description: '',
    date: this.currentDate,
    priority: 'medium',
  };

  ngOnInit() {
    const storedTaskData = localStorage.getItem('taskData');
    if (storedTaskData) {
      this.taskData = JSON.parse(storedTaskData);
    }
  }

  tooglePriority(prio: string) {
    this.taskData.priority !== prio
      ? (this.taskData.priority = prio)
      : this.taskData.priority;
    this.saveTaskData();
  }

  saveTaskData() {
    localStorage.setItem('taskData', JSON.stringify(this.taskData));
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      console.log('Send completed');
    }
  }
}
