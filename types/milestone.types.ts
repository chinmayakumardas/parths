


export type Milestone = {
  id: string;
  goalId: string;
  name: string;
  frequencyType: "daily" | "weekly" | "custom";
  startDate: string;
  endDate?: string;
};