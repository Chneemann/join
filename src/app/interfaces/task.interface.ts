import { UserSummary } from './user.interface';

// Enums

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'inProgress',
  AWAIT_FEEDBACK = 'awaitFeedback',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  URGENT = 'urgent',
}

export enum TaskCategory {
  USER_STORY = 'User Story',
  TECHNICAL_TASK = 'Technical Task',
}

// Interfaces

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
  id?: string;
  userId: string;
}

export interface TaskMoveEvent {
  task: Task;
  moveTo: TaskStatus;
}
