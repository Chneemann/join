import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../interfaces/user.interface';
import { Assignee } from '../../../../interfaces/task.interface';

@Component({
  selector: 'app-assigned-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assigned-list.component.html',
  styleUrl: './assigned-list.component.scss',
})
export class AssignedListComponent implements OnChanges {
  @Input() filteredUsers: User[] = [];
  @Input() currentAssignees: Assignee[] = [];
  @Output() assignedChange = new EventEmitter<string[]>();

  selectedAssignees: string[] = [];

  /**
   * Retrieves a set of user IDs for the current assignees.
   *
   * @returns A Set containing the user IDs of the current assignees.
   */
  get assignedUserIds(): Set<string> {
    return new Set(this.currentAssignees.map((assignee) => assignee.userId));
  }

  /**
   * Syncs the selected assignees with the current assignees whenever the
   * `currentAssignees` input changes.
   */
  ngOnChanges() {
    this.selectedAssignees = [
      ...this.currentAssignees.map((assignee) => assignee.userId),
    ];
  }

  /**
   * Emits an event with the current list of selected assignee user IDs.
   */
  emitAssignedChange() {
    this.assignedChange.emit(this.selectedAssignees);
  }

  /**
   * Toggles the selection status of an assignee.
   *
   * @param userId - The ID of the user to be toggled in the selected assignees list.
   */
  toggleAssignee(userId: string) {
    const index = this.selectedAssignees.indexOf(userId);
    if (index === -1) {
      this.selectedAssignees.push(userId);
    } else {
      this.selectedAssignees.splice(index, 1);
    }
    this.emitAssignedChange();
  }
}
