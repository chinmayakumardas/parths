import { Task } from "./task";

export interface Goal {
  id: string;

  title: string;
  description?: string;

  progress: number;

  createdAt: any;
  updatedAt: any;

  tasks?: Task[];
}