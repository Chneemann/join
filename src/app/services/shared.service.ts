import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  isAnyDialogOpen: boolean = false;
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

  // LOGOUT

  logout() {
    this.deleteUserIdInLocalStorage();
    window.location.reload();
  }

  deleteUserIdInLocalStorage() {
    localStorage.removeItem('currentUser');
  }
}
