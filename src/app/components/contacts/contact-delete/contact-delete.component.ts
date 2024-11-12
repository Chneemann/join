import { Component, Input } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-contact-delete',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './contact-delete.component.html',
  styleUrl: './contact-delete.component.scss',
})
export class ContactDeleteComponent {
  @Input() currentUserId: string = '';

  constructor(
    private sharedService: SharedService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  /**
   * Deletes the current user and performs cleanup operations.
   * This method deletes the user with the current user ID from the database,
   * navigates to the contacts page, and closes any open dialog flags in the shared service.
   * It also checks if the deleted contact was assigned to any tasks and removes them.
   */
  deleteContact() {
    this.firebaseService.deleteUser(this.currentUserId);
    this.router.navigate(['contacts']);
    this.sharedService.isDeleteContactDialogOpen = false;
    this.sharedService.isAnyDialogOpen = false;
    this.checkIfContactAnAssigned();
  }

  /**
   * Checks if the deleted contact was assigned to any tasks and removes them.
   * This method retrieves all tasks from the database, iterates over them,
   * and checks if the current user ID is in the task's assigned array.
   * If the ID is found, it is removed from the array and the modified task
   * is updated in the database.
   */
  checkIfContactAnAssigned() {
    const tasks = this.firebaseService.getAllTasks();

    tasks.forEach((task) => {
      const index = task.assigned.indexOf(this.currentUserId);
      if (index !== -1) {
        task.assigned.splice(index, 1);
        const { id, ...taskWithoutIds } = task;
        if (task.id) {
          this.firebaseService.replaceTaskData(task.id, taskWithoutIds);
        }
      }
    });
  }

  /**
   * Closes the delete contact dialog by setting the appropriate flags in the shared service.
   * If the edit contact dialog is not open, it also closes any open dialog flags in the shared service.
   */
  cancelDeleteContact() {
    this.sharedService.isDeleteContactDialogOpen = false;
    if (!this.sharedService.isEditContactDialogOpen) {
      this.sharedService.isAnyDialogOpen = false;
    }
  }
}
