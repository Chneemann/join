import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { OverlayService } from '../../../services/overlay.service';
import { CommonModule } from '@angular/common';
import { TaskOverlayComponent } from './task-overlay/task-overlay.component';
import { FirebaseService } from '../../../services/firebase.service';
import { TaskEditOverlayComponent } from './task-edit-overlay/task-edit-overlay.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AddTaskComponent } from '../../../components/add-task/add-task.component';
import { DialogOverlayComponent } from './dialog-overlay/dialog-overlay.component';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [
    CommonModule,
    TaskOverlayComponent,
    TaskEditOverlayComponent,
    DialogOverlayComponent,
    AddTaskComponent,
  ],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent implements OnInit {
  overlayType: any;
  overlayData: any;

  constructor(
    private overlayService: OverlayService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkOverlayData();
  }

  checkOverlayData() {
    this.overlayService.overlayData$.subscribe((data) => {
      if (data) {
        this.overlayType = data.overlay;
        this.overlayData = data.data;
      }
    });
  }

  onCloseOverlay(emitter: string) {
    this.overlayType === 'dialog' && this.router.navigate(['/login']);
    this.overlayData = emitter;
  }

  @HostListener('document:click', ['$event'])
  checkOpenContactEdit(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (
      targetElement.closest('.overlay') &&
      !targetElement.closest('.overlay-content')
    ) {
      this.onCloseOverlay('');
    }
  }
}
