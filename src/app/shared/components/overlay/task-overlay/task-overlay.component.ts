import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';
import { BtnCloseComponent } from '../../buttons/btn-close/btn-close.component';
import { CommonModule } from '@angular/common';
import { OverlayService } from '../../../../services/overlay.service';

@Component({
  selector: 'app-task-overlay',
  standalone: true,
  imports: [BtnCloseComponent, CommonModule],
  templateUrl: './task-overlay.component.html',
  styleUrl: './task-overlay.component.scss',
})
export class TaskOverlayComponent {
  @Input() overlayData: string = '';
  @Input() overlayMobile: boolean = false;
  @Output() closeDialogEmitter = new EventEmitter<string>();

  constructor(
    public firebaseService: FirebaseService,
    private overlayService: OverlayService
  ) {}

  categoryColors = new Map<string, string>([
    ['User Story', '#0038ff'],
    ['Technical Task', '#20d7c2'],
  ]);

  closeDialog() {
    this.closeDialogEmitter.emit('');
  }

  editTask(overlayData: string) {
    this.overlayService.setOverlayData('taskOverlayEdit', overlayData, false);
  }

  deleteTask(overlayData: string) {
    this.firebaseService.deleteTask(overlayData);
    this.closeDialog();
  }

  getTaskData(taskId: string) {
    return this.firebaseService
      .getAllTasks()
      .filter((task) => task.id === taskId);
  }

  getSubTaskStatus(taskId: string, index: number) {
    const subtask = this.firebaseService
      .getAllTasks()
      .filter((task) => task.id === taskId);

    return subtask[0].subtasksDone[index];
  }

  toggleSubtaskStatus(
    taskId: string,
    index: number,
    array: boolean[],
    status: boolean
  ) {
    status ? (array[index] = false) : (array[index] = true);
    this.firebaseService.updateSubTask(taskId, array);
  }

  capitalizeFirstLetter(data: string) {
    return data.charAt(0).toUpperCase() + data.slice(1);
  }

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
}
