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
  currentUserId: string = '';
}
