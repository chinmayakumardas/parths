import { Timestamp } from "firebase/firestore";

export type GoalStatus =
  | "active"
  | "completed"
  | "paused"
  | "archived";

export interface Goal {
  id: string;

  title: string;
  description: string;

  progress: number;

  status: GoalStatus;

  targetDate?: Timestamp | null;

  createdAt: Timestamp;
  updatedAt: Timestamp;

  completedAt?: Timestamp | null;
}