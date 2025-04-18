import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { OverlayService } from '../../../services/overlay.service';
import { CommonModule } from '@angular/common';
import { TaskOverlayComponent } from './task-overlay/task-overlay.component';
import { TaskEditOverlayComponent } from './task-edit-overlay/task-edit-overlay.component';
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
  ],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent implements OnInit, OnDestroy {
  overlayType:
    | 'taskOverlay'
    | 'taskOverlayEdit'
    | 'newTaskOverlay'
    | 'contactOverlay'
    | null = null;
  overlayData: any = null;
  shouldShowOverlay = false;
  isClosingAnimation = false;

  private destroy$ = new Subject<void>();

  constructor(private overlayService: OverlayService) {}

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
   * Listens to the overlay data observable from the OverlayService
   * and handles the changes accordingly.
   */
  listenToOverlayChanges() {
    this.overlayService.overlayData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          if (data.overlay === 'taskOverlayEdit') {
            this.startClosingAnimation(() => {
              this.updateOverlayData(data);
            });
          } else {
            this.updateOverlayData(data);
          }
        } else {
          this.isClosingAnimation = true;
          this.shouldShowOverlay = false;
        }
      });
  }

  /**
   * Updates the overlay data from the given data object.
   * @param {any} data the data object containing the overlay type and data
   */
  updateOverlayData(data: any) {
    this.overlayType = data.overlay;
    this.overlayData = data.data;
    this.isClosingAnimation = false;
    this.shouldShowOverlay = true;
  }

  /**
   * Starts the closing animation and calls the given callback function after the animation has finished.
   * @param {() => void} callback the callback function to be called after the animation has finished
   */
  startClosingAnimation(callback: () => void) {
    this.isClosingAnimation = true;

    setTimeout(() => {
      callback();
      this.isClosingAnimation = false;
    }, 300);
  }

  /**
   * Closes the overlay by clearing the overlay data from the service.
   * @param {boolean} close Indicates the close event.
   */
  onCloseOverlay() {
    this.overlayType = null;
    this.overlayData = null;
    this.shouldShowOverlay = false;
    this.overlayService.clearOverlayData();
  }

  @HostListener('document:click', ['$event'])
  /**
   * If the event target is the overlay itself, the overlay is closed.
   * @param {MouseEvent} event The event object passed from the document click event.
   */
  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    if (
      targetElement &&
      targetElement.classList.contains('overlay') &&
      !targetElement.closest('.overlay-content')
    ) {
      this.onCloseOverlay();
    }
  }
}
