import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignedListComponent } from './assigned-list/assigned-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../interfaces/user.interface';
import { ApiService } from '../../../services/api.service';
import { map, catchError, of } from 'rxjs';
import { Assignee } from '../../../interfaces/task.interface';

@Component({
  selector: 'app-assigned',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, AssignedListComponent],
  templateUrl: './assigned.component.html',
  styleUrl: './assigned.component.scss',
})
export class AssignedComponent {
  @Input() taskCreator: string = '';
  @Input() currentAssignees: Assignee[] = [];
  @Output() assignedChange = new EventEmitter<string[]>();

  tooltipUserId: string | null = null;
  filteredUsers: User[] = [];
  users: User[] = [];
  searchValue: string = '';
  showSearch: boolean = false;
  showAssignedList: boolean = false;
  dialogX: number = 0;
  dialogY: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService
      .getUsers()
      .pipe(
        map((users) => users.filter((user) => user.id !== this.taskCreator)),
        catchError(() => of([]))
      )
      .subscribe((filteredUsers) => {
        this.users = filteredUsers;
        this.filteredUsers = filteredUsers;
      });
  }

  searchTask(): void {
    this.searchValue = this.replaceXSSChars(this.searchValue) || '';
    this.showSearch = this.searchValue.trim().length > 0;

    const searchValue = this.searchValue.toLowerCase();
    this.filteredUsers = this.users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchValue) ||
        user.lastName.toLowerCase().includes(searchValue) ||
        user.initials.toLowerCase().includes(searchValue)
    );
    if (this.filteredUsers.length === 0) {
      this.filteredUsers = [];
    }
  }

  replaceXSSChars(input: string) {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  openTooltipUser(userId: any, event: MouseEvent) {
    this.tooltipUserId = userId;
    this.updateTooltipUserPosition(event);
  }

  updateTooltipUserPosition(event: MouseEvent) {
    this.dialogX = event.clientX + 25;
    this.dialogY = event.clientY + 10;
  }

  closeTooltipUser() {
    this.tooltipUserId = null;
  }

  receiveAssigned(assigned: string[]) {
    this.assignedChange.emit(assigned);
  }

  toggleAssignedMenu() {
    this.showAssignedList = !this.showAssignedList;
  }

  get assignedUserIds(): Set<string> {
    return new Set(this.currentAssignees.map((assignee) => assignee.userId));
  }

  @HostListener('document:click', ['$event'])
  checkOpenNavbar(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (
      !targetElement.closest('.search-assigned') &&
      !targetElement.closest('app-assigned-list') &&
      !targetElement.closest('.checkbox-img')
    ) {
      this.showAssignedList = false;
    }
  }
}
