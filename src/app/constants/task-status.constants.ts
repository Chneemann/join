export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'inProgress',
  AWAIT_FEEDBACK = 'awaitFeedback',
  DONE = 'done',
}

export const STATUSES: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.AWAIT_FEEDBACK,
  TaskStatus.DONE,
];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'taskStatus.todo',
  [TaskStatus.IN_PROGRESS]: 'taskStatus.inProgress',
  [TaskStatus.AWAIT_FEEDBACK]: 'taskStatus.awaitFeedback',
  [TaskStatus.DONE]: 'taskStatus.done',
};
