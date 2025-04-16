import { UserSummary } from './user.interface';

// Enums

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'inProgress',
  AWAIT_FEEDBACK = 'awaitFeedback',
  DONE = 'done',
}

// Interfaces

export interface Task {
  id?: string;
  title: string;
  description: string;
  category: string;
  status: TaskStatus;
  priority: string;
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
  id?: string;
  userId: string;
}

export interface TaskMoveEvent {
  task: Task;
  moveTo: TaskStatus;
}
