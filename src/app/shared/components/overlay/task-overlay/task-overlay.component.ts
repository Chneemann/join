import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';
import { BtnCloseComponent } from '../../buttons/btn-close/btn-close.component';

@Component({
  selector: 'app-task-overlay',
  standalone: true,
  imports: [BtnCloseComponent],
  templateUrl: './task-overlay.component.html',
  styleUrl: './task-overlay.component.scss',
})
export class TaskOverlayComponent {
  @Input() overlayData: string = '';
  @Output() closeDialogEmitter = new EventEmitter<string>();

  constructor(private firebaseService: FirebaseService) {}

  categoryColors = new Map<string, string>([
    ['User Story', '#0038ff'],
    ['Technical Task', '#20d7c2'],
  ]);

  sendMessage() {
    this.closeDialogEmitter.emit('');
  }

  getTask(taskId: string) {
    return this.firebaseService
      .getAllTasks()
      .filter((task) => task.id === taskId);
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