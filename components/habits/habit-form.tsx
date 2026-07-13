"use client";

import { useState } from "react";
import { Habit } from "@/lib/habits";

type HabitFormProps = {
  initialData?: Habit;
  onSave: (habit: Omit<Habit, "id">) => Promise<void>;
  onCancel: () => void;
};

export default function HabitForm({
  initialData,
  onSave,
  onCancel,
}: HabitFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [pillarId, setPillarId] = useState(
    initialData?.pillarId || "health"
  );

  const [frequency, setFrequency] = useState<"daily" | "weekly">(
    initialData?.frequency || "daily"
  );

  const [streak, setStreak] = useState(
    initialData?.streak || 0
  );

  const [active, setActive] = useState(
    initialData?.active ?? true
  );

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title.trim()) return;

    await onSave({
      title,
      pillarId,
      frequency,
      streak,
      active,
    });

    if (!initialData) {
      setTitle("");
      setPillarId("health");
      setFrequency("daily");
      setStreak(0);
      setActive(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border rounded-lg p-4"
    >
      <input
        className="w-full border rounded p-2"
        placeholder="Habit title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <select
        className="w-full border rounded p-2"
        value={pillarId}
        onChange={(e) =>
          setPillarId(e.target.value)
        }
      >
        <option value="health">Health</option>
        <option value="career">Career</option>
        <option value="finance">Finance</option>
        <option value="relationships">
          Relationships
        </option>
        <option value="learning">
          Learning
        </option>
      </select>

      <select
        className="w-full border rounded p-2"
        value={frequency}
        onChange={(e) =>
          setFrequency(
            e.target.value as "daily" | "weekly"
          )
        }
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) =>
            setActive(e.target.checked)
          }
        />
        Active
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded"
        >
          {initialData ? "Update Habit" : "Create Habit"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}