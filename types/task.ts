import { Timestamp } from "firebase/firestore";

export type RecurringType =
  | "daily"
  | "weekly"
  | "monthly"
  | null;

export interface Task {
  id: string;

  title: string;
  description?: string;

  completed: boolean;

  order: number;

  dueDate?: Timestamp | null;

  recurring?: RecurringType;

  note?: string;

  resource?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;

  completedAt?: Timestamp | null;
}