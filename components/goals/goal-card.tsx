"use client";

import { Goal } from "@/lib/goals";

type GoalCardProps = {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onProgress: (
    id: string,
    progress: number
  ) => void;
};

export default function GoalCard({
  goal,
  onEdit,
  onDelete,
  onProgress,
}: GoalCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4">

      <div>
        <h2 className="text-lg font-semibold">
          {goal.title}
        </h2>

        <p className="text-sm text-gray-500">
          {goal.description}
        </p>

        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          {goal.pillarId}
        </span>
      </div>

      <div>

        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{goal.progress}%</span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full">

          <div
            className="h-2 bg-green-500 rounded-full"
            style={{
              width: `${goal.progress}%`,
            }}
          />

        </div>

      </div>

      <div className="text-sm">
        <strong>Status:</strong> {goal.status}
      </div>

      <div className="text-sm">
        <strong>Target:</strong>{" "}
        {goal.targetDate || "No date"}
      </div>

      <div className="flex gap-2">

        <button
          onClick={() =>
            onProgress(
              goal.id,
              Math.max(0, goal.progress - 10)
            )
          }
          className="border rounded px-3 py-1"
        >
          -10%
        </button>

        <button
          onClick={() =>
            onProgress(
              goal.id,
              Math.min(100, goal.progress + 10)
            )
          }
          className="border rounded px-3 py-1"
        >
          +10%
        </button>

      </div>

      <div className="flex gap-2">

        <button
          onClick={() => onEdit(goal)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(goal.id)}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </button>

      </div>

    </div>
  );
}