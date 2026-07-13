"use client";

import { Checkin } from "@/lib/checkins";

type Props = {
  checkin: Checkin;
  onEdit: (checkin: Checkin) => void;
  onDelete: (id: string) => void;
};

export default function CheckinCard({
  checkin,
  onEdit,
  onDelete,
}: Props) {
  const average = Math.round(
    (
      checkin.health +
      checkin.career +
      checkin.finance +
      checkin.learning +
      checkin.relationships
    ) / 5
  );

  return (
    <div className="border rounded-lg p-4 space-y-4">

      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold">
            {checkin.date}
          </h2>

          <p className="text-2xl">
            {checkin.mood}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">
            Average
          </p>

          <p className="text-xl font-bold">
            {average}/10
          </p>
        </div>
      </div>

      <p>{checkin.note}</p>

      <div className="grid grid-cols-2 gap-2 text-sm">

        <div>
          💪 Health: {checkin.health}
        </div>

        <div>
          💼 Career: {checkin.career}
        </div>

        <div>
          💰 Finance: {checkin.finance}
        </div>

        <div>
          📚 Learning: {checkin.learning}
        </div>

        <div className="col-span-2">
          ❤️ Relationships: {checkin.relationships}
        </div>

      </div>

      <div className="flex gap-2">

        <button
          onClick={() => onEdit(checkin)}
          className="px-3 py-1 rounded bg-blue-600 text-white"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(checkin.id)}
          className="px-3 py-1 rounded bg-red-600 text-white"
        >
          Delete
        </button>

      </div>

    </div>
  );
}