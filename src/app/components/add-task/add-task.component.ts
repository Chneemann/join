import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { AssignedComponent } from './assigned/assigned.component';
import { User } from '../../interfaces/user.interface';
import { FirebaseService } from '../../services/firebase.service';
import { Task } from '../../interfaces/task.interface';

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
  @Input() task: string = '';
  @Input() overlayData: string = '';

  currentDate: string = new Date().toISOString().split('T')[0];
  dateInPast: boolean = false;
  isAssignedOpen: boolean = false;
  subtaskValue: string = '';
  searchValue: string = '';
  searchInput: boolean = false;
  filteredUsers: User[] = [];

  constructor(public firebaseService: FirebaseService) {}

  taskData: Task = {
    title: '',
    description: '',
    category: '',
    status: 'todo',
    priority: 'medium',
    subtasksTitle: [],
    subtasksDone: [],
    assigned: [],
    date: this.currentDate,
  };

  ngOnInit() {
    this.loadEditTaskData();
    this.loadLocalStorageData();
  }

  loadEditTaskData() {
    if (this.overlayData !== '') {
      const taskData = this.getTaskData(this.overlayData)[0];
      this.taskData.title = taskData.title;
      this.taskData.description = taskData.description;
      this.taskData.category = taskData.category;
      this.taskData.status = taskData.status;
      this.taskData.priority = taskData.priority;
      this.taskData.subtasksTitle = taskData.subtasksTitle;
      this.taskData.subtasksDone = taskData.subtasksDone;
      this.taskData.assigned = taskData.assigned;
      this.taskData.date = taskData.date;
    }
  }

  loadLocalStorageData() {
    const storedTaskData = localStorage.getItem('taskData');
    if (storedTaskData) {
      this.taskData = JSON.parse(storedTaskData);
    } else {
      this.saveTaskData();
    }
  }

  getTaskData(taskId: string) {
    return this.firebaseService
      .getAllTasks()
      .filter((task) => task.id === taskId);
  }

  addSubtask(subtaskName: string) {
    this.taskData.subtasksTitle.unshift(subtaskName);
    this.taskData.subtasksDone.push(false);
    this.saveTaskData();
  }

  deleteSubtask(subtaskName: string) {
    this.taskData.subtasksTitle.splice(
      this.taskData.subtasksTitle.indexOf(subtaskName),
      1
    );
    this.taskData.subtasksDone.splice(1);
    this.saveTaskData();
  }

  searchTask(): void {
    this.updateSearchInput();
    this.filteredUsers = this.firebaseService
      .getAllUserWithoutGuest()
      .filter(
        (user) =>
          user.firstName.toLowerCase().includes(this.searchValue) ||
          user.lastName.toLowerCase().includes(this.searchValue) ||
          user.initials.toLowerCase().includes(this.searchValue)
      );
  }

  updateSearchInput() {
    if (this.searchValue) {
      this.searchInput = this.searchValue.toLowerCase().length > 0;
    } else {
      this.searchInput = false;
    }
    return this.searchInput;
  }

  receiveAssigned(assigned: string[]) {
    this.taskData.assigned = assigned;
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
    this.taskData.subtasksTitle = [];
    this.taskData.subtasksDone = [];
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      const { id, ...taskWithoutId } = this.taskData;
      this.firebaseService.addNewTask(taskWithoutId);
      this.removeTaskData();
    }
  }

  @HostListener('document:click', ['$event'])
  checkOpenNavbar(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (
      !targetElement.closest('.search-assigned') &&
      !targetElement.closest('app-assigned')
    ) {
      this.isAssignedOpen = false;
    }
  }
}
