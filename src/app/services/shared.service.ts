import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  isAnyDialogOpen: boolean = false;
  isEditContactDialogOpen: boolean = false;
  isDeleteContactDialogOpen: boolean = false;
  currentUserId: string = '';

  constructor() {}
}
