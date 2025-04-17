export enum TaskCategory {
  USER_STORY = 'User Story',
  TECHNICAL_TASK = 'Technical Task',
}

export const CATEGORIES: TaskCategory[] = [
  TaskCategory.USER_STORY,
  TaskCategory.TECHNICAL_TASK,
];

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  [TaskCategory.USER_STORY]: 'taskCategory.userStory',
  [TaskCategory.TECHNICAL_TASK]: 'taskCategory.technicalTask',
};

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  [TaskCategory.USER_STORY]: '#0038ff',
  [TaskCategory.TECHNICAL_TASK]: '#20d7c2',
};
