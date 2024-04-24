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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [CommonModule, TaskOverlayComponent, TaskEditOverlayComponent],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent implements OnInit, OnDestroy {
  @HostBinding('class.overlay') isOverlay = window.innerWidth >= 650;
  @HostBinding('class.overlay-mobile') isOverlayMobile =
    window.innerWidth < 650;
  private resizeListener!: () => void;

  overlayType: any;
  overlayData: any;
  overlayMobile: boolean = false;

  constructor(
    private overlayService: OverlayService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.checkOverlayData();
    this.checkWindowWidth();
  }

  checkOverlayData() {
    this.overlayService.overlayData$.subscribe((data) => {
      if (data) {
        this.overlayType = data.overlay;
        this.overlayData = data.data;
        this.overlayMobile = data.mobile;
      }
    });
  }

  checkWindowWidth() {
    this.resizeListener = () => {
      this.isOverlay = window.innerWidth >= 650;
      this.isOverlayMobile = window.innerWidth < 650;
    };
    window.addEventListener('resize', this.resizeListener);
  }

  onCloseOverlay(emitter: string) {
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

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
  }
}
