import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { OverlayService } from '../../../services/overlay.service';
import { CommonModule } from '@angular/common';
import { TaskOverlayComponent } from './task-overlay/task-overlay.component';
import { TaskEditOverlayComponent } from './task-edit-overlay/task-edit-overlay.component';
import { Router } from '@angular/router';
import { DialogOverlayComponent } from './dialog-overlay/dialog-overlay.component';
import { ContactOverlayComponent } from './contact-overlay/contact-overlay.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [
    CommonModule,
    TaskOverlayComponent,
    TaskEditOverlayComponent,
    ContactOverlayComponent,
    DialogOverlayComponent,
  ],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent implements OnInit, OnDestroy {
  overlayType:
    | 'taskOverlay'
    | 'taskOverlayEdit'
    | 'newTaskOverlay'
    | 'dialogOverlay'
    | 'contactOverlay'
    | null = null;
  overlayData: any = null;
  shouldShowOverlay = false;
  isClosingAnimation = false;

  private destroy$ = new Subject<void>();

  constructor(private overlayService: OverlayService, private router: Router) {}

  /**
   * Checks the overlay data observable from the OverlayService and subscribes to it.
   */
  ngOnInit(): void {
    this.listenToOverlayChanges();
  }

  /**
   * Emits an event to stop listening to the overlay data observable and unsubscribes from it.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Subscribes to the overlay data observable from the OverlayService.
   * Updates the overlay type and data when new data is received.
   * Sets the overlay as visible with a slight delay if data is present.
   * Marks the overlay as closing and invisible if no data is present.
   */
  listenToOverlayChanges() {
    this.overlayService.overlayData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.overlayType = data.overlay;
          this.overlayData = data.data;
          this.isClosingAnimation = false;
          requestAnimationFrame(() => {
            this.shouldShowOverlay = true;
          });
        } else {
          this.isClosingAnimation = true;
          this.shouldShowOverlay = false;
        }
      });
  }

  /**
   * Closes the overlay by clearing the overlay data from the service.
   * @param {boolean} close Indicates the close event.
   */
  onCloseOverlay(close: boolean) {
    this.overlayData = close;
    this.overlayService.clearOverlayData();
  }

  @HostListener('document:click', ['$event'])
  /**
   * If the event target is the overlay itself, the overlay is closed.
   * @param {MouseEvent} event The event object passed from the document click event.
   */
  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    if (targetElement && targetElement.classList.contains('overlay')) {
      this.onCloseOverlay(false);
    }
  }
}
