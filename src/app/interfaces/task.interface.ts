export interface Task {
  title: string;
  description: string;
  category: string;
  status: string;
  subtasksTitle: string;
  subtasksDone: boolean;
  assigned: number;
}
