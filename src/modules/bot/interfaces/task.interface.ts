export enum TaskType {
  ASSIGNMENT = 'assignment',
  QUIZ = 'quiz',
}
export interface Task {
  id: number;
  name: string;
  type: TaskType;
  createdAt: Date;
  updatedAt: Date;
  deadline: Date;
}
