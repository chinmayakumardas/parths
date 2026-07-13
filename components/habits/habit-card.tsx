"use client";

import { Habit } from "@/lib/habits";

type HabitCardProps = {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
  onStreak: (id: string, streak: number) => void;
};

export default function HabitCard({
  habit,
  onEdit,
  onDelete,
  onToggle,
  onStreak,
}: HabitCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4">

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">
            {habit.title}
          </h2>

          <p className="text-sm text-gray-500">
            {habit.pillarId}
          </p>
        </div>

        <span
          className={`px-2 py-1 rounded text-xs ${
            habit.active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {habit.active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Frequency</span>
        <span>{habit.frequency}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Streak</span>
        <span>{habit.streak} days</span>
      </div>

      <div className="flex gap-2">

        <button
          onClick={() =>
            onStreak(
              habit.id,
              Math.max(0, habit.streak - 1)
            )
          }
          className="border rounded px-3 py-1"
        >
          -
        </button>

        <button
          onClick={() =>
            onStreak(
              habit.id,
              habit.streak + 1
            )
          }
          className="border rounded px-3 py-1"
        >
          +
        </button>

      </div>

      <div className="flex gap-2">

        <button
          onClick={() =>
            onToggle(
              habit.id,
              !habit.active
            )
          }
          className="border rounded px-3 py-1"
        >
          {habit.active ? "Deactivate" : "Activate"}
        </button>

        <button
          onClick={() => onEdit(habit)}
          className="bg-blue-600 text-white rounded px-3 py-1"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(habit.id)}
          className="bg-red-600 text-white rounded px-3 py-1"
        >
          Delete
        </button>

      </div>

    </div>
  );
}