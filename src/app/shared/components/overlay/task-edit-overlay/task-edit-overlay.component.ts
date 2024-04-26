import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';
import { OverlayService } from '../../../../services/overlay.service';
import { BtnCloseComponent } from '../../buttons/btn-close/btn-close.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Task } from '../../../../interfaces/task.interface';
import { CommonModule } from '@angular/common';
import { User } from '../../../../interfaces/user.interface';
import { AssignedComponent } from '../../../../components/add-task/assigned/assigned.component';
import { AddTaskComponent } from '../../../../components/add-task/add-task.component';
import { ActivatedRoute } from '@angular/router';
import { BtnBackComponent } from '../../buttons/btn-back/btn-back.component';

@Component({
  selector: 'app-task-edit-overlay',
  standalone: true,
  imports: [
    BtnCloseComponent,
    FormsModule,
    CommonModule,
    AssignedComponent,
    AddTaskComponent,
    BtnBackComponent,
  ],
  templateUrl: './task-edit-overlay.component.html',
  styleUrl: './task-edit-overlay.component.scss',
})
export class TaskEditOverlayComponent {
  @Input() overlayData: string = '';
  @Input() overlayType: string = '';
  @Output() closeDialogEmitter = new EventEmitter<string>();

  overlayMobile: boolean = false;

  constructor(
    public firebaseService: FirebaseService,
    private overlayService: OverlayService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.overlayData == '') {
      if (this.route.params.subscribe()) {
        this.route.params.subscribe((params) => {
          this.overlayData = params['id'];
          this.overlayType = this.overlayType;
          this.overlayMobile = true;
        });
      }
    }
  }

  getTaskData(taskId: string) {
    return this.firebaseService
      .getAllTasks()
      .filter((task) => task.id === taskId);
  }

  closeDialog() {
    this.closeDialogEmitter.emit('');
    this.removeTaskData();
  }

  removeTaskData() {
    localStorage.removeItem('taskData');
  }
}
