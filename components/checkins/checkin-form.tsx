"use client";

import { useState } from "react";
import { Checkin } from "@/lib/checkins";

type Props = {
  initialData?: Checkin;
  onSave: (data: Omit<Checkin, "id">) => Promise<void>;
  onCancel: () => void;
};

export default function CheckinForm({
  initialData,
  onSave,
  onCancel,
}: Props) {
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split("T")[0]
  );

  const [mood, setMood] = useState(
    initialData?.mood || "😊"
  );

  const [note, setNote] = useState(
    initialData?.note || ""
  );

  const [health, setHealth] = useState(
    initialData?.health || 5
  );

  const [career, setCareer] = useState(
    initialData?.career || 5
  );

  const [finance, setFinance] = useState(
    initialData?.finance || 5
  );

  const [learning, setLearning] = useState(
    initialData?.learning || 5
  );

  const [relationships, setRelationships] = useState(
    initialData?.relationships || 5
  );

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    await onSave({
      date,
      mood,
      note,
      health,
      career,
      finance,
      learning,
      relationships,
    });

    if (!initialData) {
      setNote("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border rounded-lg p-4"
    >
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border rounded p-2"
      />

      <select
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="w-full border rounded p-2"
      >
        <option>😄</option>
        <option>😊</option>
        <option>😐</option>
        <option>😔</option>
        <option>😴</option>
      </select>

      <textarea
        placeholder="How was your day?"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full border rounded p-2"
      />

      <div className="grid grid-cols-2 gap-3">

        <label>
          Health
          <input
            type="number"
            min={1}
            max={10}
            value={health}
            onChange={(e) =>
              setHealth(Number(e.target.value))
            }
            className="w-full border rounded p-2"
          />
        </label>

        <label>
          Career
          <input
            type="number"
            min={1}
            max={10}
            value={career}
            onChange={(e) =>
              setCareer(Number(e.target.value))
            }
            className="w-full border rounded p-2"
          />
        </label>

        <label>
          Finance
          <input
            type="number"
            min={1}
            max={10}
            value={finance}
            onChange={(e) =>
              setFinance(Number(e.target.value))
            }
            className="w-full border rounded p-2"
          />
        </label>

        <label>
          Learning
          <input
            type="number"
            min={1}
            max={10}
            value={learning}
            onChange={(e) =>
              setLearning(Number(e.target.value))
            }
            className="w-full border rounded p-2"
          />
        </label>

        <label className="col-span-2">
          Relationships
          <input
            type="number"
            min={1}
            max={10}
            value={relationships}
            onChange={(e) =>
              setRelationships(Number(e.target.value))
            }
            className="w-full border rounded p-2"
          />
        </label>

      </div>

      <div className="flex gap-2">

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded"
        >
          {initialData ? "Update" : "Save"}
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