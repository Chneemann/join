import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResizeService implements OnDestroy {
  private readonly PAGE_VIEW_BREAKPOINT = 650;
  private readonly CONTACT_VIEW_BREAKPOINT = 800;

  private pageViewMediaSubject = new BehaviorSubject<boolean>(
    window.innerWidth <= this.PAGE_VIEW_BREAKPOINT
  );
  private contactViewMediaSubject = new BehaviorSubject<boolean>(
    window.innerWidth <= this.CONTACT_VIEW_BREAKPOINT
  );

  pageViewMedia$ = this.pageViewMediaSubject.asObservable();
  contactViewMedia$ = this.contactViewMediaSubject.asObservable();

  private resizeListener!: () => void;

  /**
   * Initializes the resize event listener, which updates the media query subjects
   * based on the current window width whenever the window is resized.
   */
  constructor() {
    this.initResizeListener();
  }

  /**
   * Cleans up resources by removing the resize event listener,
   * ensuring that no memory leaks occur when the service is no longer in use.
   */
  ngOnDestroy(): void {
    this.cleanup();
  }

  /**
   * Initializes the resize event listener.
   *
   * This method binds the onResize method to the resizeListener and adds it as an event listener
   * for the window's resize event. This allows the service to respond to changes in window size
   * by updating the relevant media query subjects.
   */
  private initResizeListener(): void {
    this.resizeListener = this.onResize.bind(this);
    window.addEventListener('resize', this.resizeListener);
  }

  /**
   * Updates the media query subjects based on the current window width.
   *
   * This method checks the window's inner width against predefined breakpoints
   * and updates the pageViewMediaSubject and contactViewMediaSubject accordingly.
   * It is triggered whenever a window resize event occurs.
   */
  private onResize(): void {
    this.pageViewMediaSubject.next(
      window.innerWidth <= this.PAGE_VIEW_BREAKPOINT
    );
    this.contactViewMediaSubject.next(
      window.innerWidth <= this.CONTACT_VIEW_BREAKPOINT
    );
  }

  /**
   * Remove the event listener for window resizing.
   */
  cleanup(): void {
    window.removeEventListener('resize', this.resizeListener);
  }
}
