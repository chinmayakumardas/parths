export type Goal = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "archived"; // ✅ ADD THIS
};