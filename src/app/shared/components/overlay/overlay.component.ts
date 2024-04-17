import { Component, HostListener, OnInit } from '@angular/core';
import { OverlayService } from '../../../services/overlay.service';
import { CommonModule } from '@angular/common';
import { TaskOverlayComponent } from './task-overlay/task-overlay.component';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [CommonModule, TaskOverlayComponent],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent implements OnInit {
  overlayType: any;
  overlayData: any;

  constructor(private overlayService: OverlayService) {}

  ngOnInit(): void {
    this.overlayService.overlayData$.subscribe((data) => {
      if (data) {
        this.overlayType = data.overlay;
        this.overlayData = data.data;
      }
    });
  }

  onCloseOverlay() {
    this.overlayData = '';
  }

  @HostListener('document:click', ['$event'])
  checkOpenContactEdit(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (
      targetElement.closest('.overlay') &&
      !targetElement.closest('.overlay-content')
    ) {
      this.onCloseOverlay();
    }
  }
}
