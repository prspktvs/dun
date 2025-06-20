import { TaskStatus, TaskPriority, type ITask as Task } from '../../../types/Task.d.ts'

export interface ColumnData {
  id: TaskStatus;
  title: string;
  count: number;
  tasks: Task[];
}

export interface SwimLane {
  id: string;
  title: string;
}

export { type Task, TaskStatus, TaskPriority }