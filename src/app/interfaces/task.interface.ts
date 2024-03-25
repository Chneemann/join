export interface Task {
  id?: string;
  title: string;
  description: string;
  category: string;
  status: string;
  subtasksTitle: string[];
  subtasksDone: boolean[];
  assigned: number[];
}
