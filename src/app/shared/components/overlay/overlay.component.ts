import { Component, HostListener, OnInit } from '@angular/core';
import { OverlayService } from '../../../services/overlay.service';
import { CommonModule } from '@angular/common';
import { TaskOverlayComponent } from './task-overlay/task-overlay.component';
import { TaskEditOverlayComponent } from './task-edit-overlay/task-edit-overlay.component';
import { Router } from '@angular/router';
import { DialogOverlayComponent } from './dialog-overlay/dialog-overlay.component';
import { ContactOverlayComponent } from './contact-overlay/contact-overlay.component';

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
export class OverlayComponent implements OnInit {
  overlayType: any;
  overlayData: any;

  constructor(private overlayService: OverlayService, private router: Router) {}

  /**
   * Angular lifecycle hook that is called after the component's view has been fully initialized.
   * Invokes `checkOverlayData` to subscribe to overlay data changes and update the component's state accordingly.
   */
  ngOnInit(): void {
    this.checkOverlayData();
  }

  /**
   * Subscribes to the overlay data observable from the OverlayService.
   * Updates the component's `overlayType` and `overlayData` properties
   * whenever new overlay data is emitted.
   */
  checkOverlayData() {
    this.overlayService.overlayData$.subscribe((data) => {
      if (data) {
        this.overlayType = data.overlay;
        this.overlayData = data.data;
      }
    });
  }

  /**
   * Emits an event to close the overlay and set the overlay type/data to the provided string.
   * If the overlay type is 'dialog', navigates to the login route.
   * @param emitter The string to be emitted, which will also be set as the overlay data.
   */
  onCloseOverlay(emitter: boolean) {
    this.overlayData = emitter;
    this.overlayService.clearOverlayData();
  }

  @HostListener('document:click', ['$event'])
  /**
   * Closes the contact edit overlay if the user clicks on the overlay background.
   *
   * @param event The MouseEvent triggered by a click action.
   */
  checkOpenContactEdit(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    if (targetElement === document.querySelector('.overlay')) {
      this.onCloseOverlay(false);
    }
  }
}
