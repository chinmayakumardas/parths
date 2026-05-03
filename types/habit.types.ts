export type HabitFrequency =
  | "daily"
  | "weekdays"
  | "weekend"
  | "custom";

export type HabitStreakDay = {
  date: string;   // YYYY-MM-DD
  status: 0 | 1;  // 0 = not done, 1 = done
};

export type Habit = {
  id: string;
  userId: string;

  name: string;
  category?: string;

  frequency: HabitFrequency;
  daysOfWeek?: number[];

  startDate: string;
  endDate?: string;

  habitStreak: HabitStreakDay[];

  currentStreak: number;
  longestStreak: number;

  createdAt: string;
};