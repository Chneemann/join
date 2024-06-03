import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';
import { OverlayService } from '../../../../services/overlay.service';
import { BtnCloseComponent } from '../../buttons/btn-close/btn-close.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssignedComponent } from '../../../../components/add-task/assigned/assigned.component';
import { AddTaskComponent } from '../../../../components/add-task/add-task.component';
import { ActivatedRoute, Router } from '@angular/router';
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
    private route: ActivatedRoute,
    private router: Router
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
    this.overlayMobile
      ? this.router.navigate(['/board'])
      : this.closeDialogEmitter.emit('');
    this.removeTaskData();
  }

  removeTaskData() {
    localStorage.removeItem('taskData');
  }
}
