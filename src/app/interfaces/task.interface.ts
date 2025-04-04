import { UserSummary } from './user.interface';

export interface Task {
  id?: string;
  title: string;
  description: string;
  category: string;
  status: string;
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
