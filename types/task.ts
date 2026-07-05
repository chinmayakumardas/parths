export interface Task {
  id: string;

  title: string;

  completed: boolean;

  order: number;

  note?: string;
  dueDate?: string;

  createdAt: any;
}