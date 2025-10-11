import { TaskStatus } from '~/composables/useTask';

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.DONE]: 'Completed',
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'grey',
  [TaskStatus.IN_PROGRESS]: 'primary',
  [TaskStatus.DONE]: 'success',
};

export const STATUESES = Object.values(TaskStatus);
