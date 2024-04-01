import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  isAnyDialogOpen: boolean = true;
  isEditDialogOpen: boolean = true;
  currentUserId: string = '';

  constructor() {}
}
