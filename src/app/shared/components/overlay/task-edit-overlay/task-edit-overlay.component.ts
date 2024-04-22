import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';
import { OverlayService } from '../../../../services/overlay.service';
import { BtnCloseComponent } from '../../buttons/btn-close/btn-close.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Task } from '../../../../interfaces/task.interface';

@Component({
  selector: 'app-task-edit-overlay',
  standalone: true,
  imports: [BtnCloseComponent, FormsModule],
  templateUrl: './task-edit-overlay.component.html',
  styleUrl: './task-edit-overlay.component.scss',
})
export class TaskEditOverlayComponent implements OnInit {
  @Input() overlayData: string = '';
  @Output() closeDialogEmitter = new EventEmitter<string>();

  taskDataEdit: Task = {
    title: '',
    description: '',
    category: '',
    status: 'todo',
    priority: 'medium',
    subtasksTitle: [],
    subtasksDone: [],
    assigned: [],
    date: '',
  };

  constructor(
    public firebaseService: FirebaseService,
    private overlayService: OverlayService
  ) {}

  ngOnInit() {
    const taskData = this.getTaskData(this.overlayData)[0];
    this.taskDataEdit.title = taskData.title;
    this.taskDataEdit.description = taskData.description;
    this.taskDataEdit.category = taskData.category;
    this.taskDataEdit.status = taskData.status;
    this.taskDataEdit.priority = taskData.priority;
    this.taskDataEdit.subtasksTitle = taskData.subtasksTitle;
    this.taskDataEdit.subtasksDone = taskData.subtasksDone;
    this.taskDataEdit.assigned = taskData.assigned;
    this.taskDataEdit.date = taskData.date;
  }

  closeDialog() {
    this.closeDialogEmitter.emit('');
    this.removeTaskData();
  }

  getTaskData(taskId: string) {
    return this.firebaseService
      .getAllTasks()
      .filter((task) => task.id === taskId);
  }

  saveTaskData() {
    localStorage.setItem('taskDataEdit', JSON.stringify(this.taskDataEdit));
  }

  removeTaskData() {
    localStorage.removeItem('taskDataEdit');
    this.clearFormData();
  }

  clearFormData() {
    this.taskDataEdit.title = '';
    this.taskDataEdit.description = '';
    this.taskDataEdit.date = '';
    this.taskDataEdit.category = '';
    this.taskDataEdit.assigned = [];
    this.taskDataEdit.subtasksTitle = [];
    this.taskDataEdit.subtasksDone = [];
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
    }
  }
}
