import { UserSummary } from './user.interface';

export interface Task {
  id?: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  subtasks: Subtask[];
  subtasksTitle: string[];
  subtasksDone: boolean[];
  assigned: string[];
  assignees: Assignee[];
  userData: UserSummary[];
  creator: string;
  date: string;
}

export interface Subtask {
  id: number;
  title: string;
  done: boolean;
}

export interface Assignee {
  userId: string;
}
