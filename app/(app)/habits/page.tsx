"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import {
  Habit,
  createHabit,
  updateHabit,
  deleteHabit,
  subscribeHabits,
} from "@/lib/habits";

import HabitForm from "@/components/habits/habit-form";
import HabitCard from "@/components/habits/habit-card";

export default function HabitsPage() {
  const [uid, setUid] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [editing, setEditing] = useState<Habit | null>(null);

  useEffect(() => {
    let unsubscribeHabits: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      setUid(user.uid);

      unsubscribeHabits = subscribeHabits(
        user.uid,
        setHabits
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeHabits) unsubscribeHabits();
    };
  }, []);

  if (!uid) {
    return (
      <main className="p-8">
        Loading...
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-8">

      <h1 className="text-3xl font-bold">
        Habits
      </h1>

      <HabitForm
        initialData={editing ?? undefined}
        onCancel={() => setEditing(null)}
        onSave={async (habit) => {

          if (editing) {
            await updateHabit(
              uid,
              editing.id,
              habit
            );

            setEditing(null);
          } else {
            await createHabit(uid, habit);
          }

        }}
      />

      <div className="space-y-4">

        {habits.length === 0 && (
          <p>No habits yet.</p>
        )}

        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={setEditing}
            onDelete={async (id) => {
              await deleteHabit(uid, id);
            }}
            onToggle={async (
              id,
              active
            ) => {
              await updateHabit(uid, id, {
                active,
              });
            }}
            onStreak={async (
              id,
              streak
            ) => {
              await updateHabit(uid, id, {
                streak,
              });
            }}
          />
        ))}

      </div>

    </main>
  );
}