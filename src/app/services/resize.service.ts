import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResizeService {
  isPageViewMedia: boolean = window.innerWidth <= 650;
  isContactViewMedia: boolean = window.innerWidth <= 800;

  private resizeListener!: () => void;

  constructor() {
    this.initResizeListener();
  }

  private initResizeListener() {
    this.resizeListener = this.onResize.bind(this);
    window.addEventListener('resize', this.resizeListener);
  }

  private onResize() {
    this.isPageViewMedia = window.innerWidth <= 650;
    this.isContactViewMedia = window.innerWidth <= 800;
  }

  cleanup() {
    window.removeEventListener('resize', this.resizeListener);
  }
}
