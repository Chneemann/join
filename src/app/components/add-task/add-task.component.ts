import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  taskData = {
    title: '',
    description: '',
    date: '',
  };

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      console.log('Send completed');
    }
  }
}
