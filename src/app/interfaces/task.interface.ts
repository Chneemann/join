import { TaskCategory } from '../constants/task-category.constants';
import { TaskPriority } from '../constants/task-priority.constants';
import { TaskStatus } from '../constants/task-status.constants';
import { UserSummary } from './user.interface';

export interface Task {
  id?: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  subtasks: Subtask[];
  assignees: Assignee[];
  userData: UserSummary[];
  creator: string;
  date: string;
}

export interface Subtask {
  id?: string;
  title: string;
  status: boolean;
}

export interface Assignee {
  userId: string;
}

export interface TaskMoveEvent {
  task: Task;
  moveTo: TaskStatus;
}
