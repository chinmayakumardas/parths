"use client";

import { useState } from "react";
import { Goal } from "@/lib/goals";

type GoalFormProps = {
  initialData?: Goal;
  onSave: (
    goal: Omit<Goal, "id">
  ) => Promise<void>;
  onCancel: () => void;
};

export default function GoalForm({
  initialData,
  onSave,
  onCancel,
}: GoalFormProps) {
  const [title, setTitle] = useState(
    initialData?.title || ""
  );

  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const [pillarId, setPillarId] = useState(
    initialData?.pillarId || "health"
  );

  const [progress, setProgress] = useState(
    initialData?.progress || 0
  );

  const [status, setStatus] = useState<
    "active" | "completed"
  >(initialData?.status || "active");

  const [targetDate, setTargetDate] = useState(
    initialData?.targetDate || ""
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    await onSave({
      title,
      description,
      pillarId,
      progress,
      status,
      targetDate,
    });

    if (!initialData) {
      setTitle("");
      setDescription("");
      setPillarId("health");
      setProgress(0);
      setStatus("active");
      setTargetDate("");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4 border rounded-lg p-4"
    >
      <input
        className="w-full border rounded p-2"
        placeholder="Goal Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <textarea
        className="w-full border rounded p-2"
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
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

      <input
        type="date"
        className="w-full border rounded p-2"
        value={targetDate}
        onChange={(e) =>
          setTargetDate(e.target.value)
        }
      />

      <input
        type="number"
        min={0}
        max={100}
        className="w-full border rounded p-2"
        value={progress}
        onChange={(e) =>
          setProgress(Number(e.target.value))
        }
      />

      <select
        className="w-full border rounded p-2"
        value={status}
        onChange={(e) =>
          setStatus(
            e.target.value as
              | "active"
              | "completed"
          )
        }
      >
        <option value="active">
          Active
        </option>

        <option value="completed">
          Completed
        </option>
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded"
        >
          {initialData
            ? "Update Goal"
            : "Create Goal"}
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