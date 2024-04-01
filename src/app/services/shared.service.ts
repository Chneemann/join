import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  isAnyDialogOpen: boolean = false;
  isEditDialogOpen: boolean = false;
  currentUserId: string = '';

  constructor() {}
}
