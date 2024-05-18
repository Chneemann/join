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

  deleteContact() {
    this.firebaseService.deleteUser(this.currentUserId);
    this.router.navigate(['contacts']);
    this.sharedService.isDeleteContactDialogOpen = false;
    this.sharedService.isAnyDialogOpen = false;
    this.checkIfContactAnAssigned();
  }

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

  deleteCancle() {
    this.sharedService.isDeleteContactDialogOpen = false;
    if (!this.sharedService.isEditContactDialogOpen) {
      this.sharedService.isAnyDialogOpen = false;
    }
  }
}
