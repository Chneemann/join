import { TaskPriority } from '../interfaces/task.interface';

export const PRIORITIES: TaskPriority[] = [
  TaskPriority.LOW,
  TaskPriority.MEDIUM,
  TaskPriority.URGENT,
];

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'taskPriority.low',
  [TaskPriority.MEDIUM]: 'taskPriority.medium',
  [TaskPriority.URGENT]: 'taskPriority.urgent',
};
