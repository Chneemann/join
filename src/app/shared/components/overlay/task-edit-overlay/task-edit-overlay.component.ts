import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BtnCloseComponent } from '../../buttons/btn-close/btn-close.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddTaskComponent } from '../../../../components/add-task/add-task.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-edit-overlay',
  standalone: true,
  imports: [BtnCloseComponent, FormsModule, CommonModule, AddTaskComponent],
  templateUrl: './task-edit-overlay.component.html',
  styleUrl: './task-edit-overlay.component.scss',
})
export class TaskEditOverlayComponent implements OnInit, OnDestroy {
  @Input() overlayData: string = '';
  @Input() overlayType: string = '';
  @Output() closeDialogEmitter = new EventEmitter<boolean>();

  overlayMobile: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * OnInit lifecycle hook.
   *
   * If the overlay data is empty, this hook subscribes to the route parameters
   * and sets the overlay data and type from the route parameters. It also sets
   * the overlay mobile flag to true.
   */
  ngOnInit(): void {
    this.loadOverlayData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadOverlayData(): void {
    if (this.overlayData === '') {
      this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
        this.overlayData = params['id'];
        this.overlayType = this.overlayType;
        this.overlayMobile = true;
      });
    }
  }

  /**
   * Gets the task data from the Firebase service for the given task id.
   * @param taskId the id of the task
   * @returns {Task[]} an array of tasks with the given id
   */
  getTaskData(taskId: string) {
    return this.apiService.getTaskById(taskId);
  }

  /**
   * Closes the task edit overlay dialog.
   *
   * If the overlay is being displayed in mobile view, this function navigates to
   * the board page. Otherwise, it emits a close dialog event. It also removes
   * the task data from local storage.
   */
  closeDialog() {
    this.overlayMobile
      ? this.router.navigate(['/board'])
      : this.closeDialogEmitter.emit(false);
    this.removeTaskData();
  }

  /**
   * Removes the task data from local storage.
   */
  removeTaskData() {
    localStorage.removeItem('taskData');
  }
}
