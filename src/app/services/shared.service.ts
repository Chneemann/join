import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  isBtnDisabled: boolean = false;
  isAnyDialogOpen: boolean = false;
  isMobileNavbarOpen: boolean = false;
  isNewContactDialogOpen: boolean = false;
  isEditContactDialogOpen: boolean = false;
  isDeleteContactDialogOpen: boolean = false;
  isPageViewMedia: boolean = window.innerWidth <= 650;
  isContactViewMedia: boolean = window.innerWidth <= 800;
  currentUserId: string = '';

  private resizeListener!: () => void;

  constructor() {
    this.initResizeListener();
  }

  // CHECK VIEW WIDTH

  private initResizeListener() {
    this.resizeListener = this.onResize.bind(this);
    window.addEventListener('resize', this.resizeListener);
  }

  private removeResizeListener() {
    window.removeEventListener('resize', this.resizeListener);
  }

  private onResize() {
    this.isPageViewMedia = window.innerWidth <= 650;
    this.isContactViewMedia = window.innerWidth <= 800;
  }

  cleanup() {
    this.removeResizeListener();
  }

  // RANDOM COLOR

  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    let isGrayScale = true;

    while (isGrayScale) {
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      const rgb = this.hexToRgb(color);
      if (rgb.r !== rgb.g || rgb.g !== rgb.b) {
        isGrayScale = false;
      } else {
        color = '#';
      }
    }

    return color;
  }

  hexToRgb(hex: string): { r: number; g: number; b: number } {
    const bigint = parseInt(hex.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  // SECURITY

  replaceXSSChars(input: string) {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
