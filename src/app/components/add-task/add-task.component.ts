import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { AssignedComponent } from './assigned/assigned.component';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, CommonModule, AssignedComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  @ViewChild('title', { static: true }) titleField!: NgModel;
  @ViewChild('description', { static: true }) descriptionField!: NgModel;
  @ViewChild('category', { static: true }) categoryField!: NgModel;

  currentDate: string = new Date().toISOString().split('T')[0];
  dateInPast: boolean = false;
  isAssignedOpen: boolean = true;

  taskData = {
    title: '',
    description: '',
    date: this.currentDate,
    priority: 'medium',
    category: '',
    assigned: [],
  };

  ngOnInit() {
    const storedTaskData = localStorage.getItem('taskData');
    if (storedTaskData) {
      this.taskData = JSON.parse(storedTaskData);
    } else {
      this.saveTaskData();
    }
  }

  toggleAssignedMenu() {
    this.isAssignedOpen = !this.isAssignedOpen;
  }

  checkDateInput() {
    const currentDateForm = this.taskData.date.replaceAll('-', '');
    const currentDate = new Date()
      .toISOString()
      .split('T')[0]
      .replaceAll('-', '');
    currentDateForm < currentDate
      ? (this.dateInPast = true)
      : (this.dateInPast = false);
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

  removeTaskData() {
    localStorage.removeItem('taskData');
    this.untouchedFormFields();
    this.clearFormData();
  }

  untouchedFormFields() {
    this.titleField.control.markAsUntouched();
    this.descriptionField.control.markAsUntouched();
    this.categoryField.control.markAsUntouched();
  }

  clearFormData() {
    this.taskData.title = '';
    this.taskData.description = '';
    this.taskData.date = this.currentDate;
    this.taskData.category = '';
    this.taskData.assigned = [];
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      console.log('Send completed');
      this.removeTaskData();
    }
  }

  @HostListener('document:click', ['$event'])
  checkOpenNavbar(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.assigned')) {
      this.isAssignedOpen = false;
    }
  }
}
