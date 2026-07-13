"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { subscribeCheckins } from "@/lib/checkins";
import { subscribeHabits } from "@/lib/habits";
import { subscribeGoals } from "@/lib/goals";

export default function TodayPage() {
  const [uid, setUid] = useState("");

  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    let unsubHabits;
    let unsubGoals;
    let unsubCheckins;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      setUid(user.uid);

      unsubHabits = subscribeHabits(
        user.uid,
        setHabits
      );

      unsubGoals = subscribeGoals(
        user.uid,
        setGoals
      );

      unsubCheckins = subscribeCheckins(
        user.uid,
        setCheckins
      );
    });

    return () => {
      unsubAuth();
      unsubHabits?.();
      unsubGoals?.();
      unsubCheckins?.();
    };

  }, []);


  if (!uid) {
    return <main>Loading...</main>;
  }


  const completedHabits =
    habits.filter((h:any)=>h.completed).length;

  const habitPercentage =
    habits.length
      ? Math.round(
          (completedHabits / habits.length) * 100
        )
      : 0;


  return (
    <main className="max-w-5xl mx-auto p-8 space-y-8">

      <h1 className="text-3xl font-bold">
        Today's Dashboard
      </h1>


      <section>
        <h2>
          Progress: {habitPercentage}%
        </h2>
      </section>


      <section>
        <h2 className="text-xl font-bold">
          Today's Habits
        </h2>

        {habits.map((habit:any)=>(
          <div key={habit.id}>
            {habit.completed ? "☑" : "☐"}
            {" "}
            {habit.title}
          </div>
        ))}
      </section>


      <section>
        <h2 className="text-xl font-bold">
          Active Goals
        </h2>

        {goals.map((goal:any)=>(
          <div key={goal.id}>
            {goal.title}
            {" "}
            {goal.progress}%
          </div>
        ))}
      </section>


      <section>
        <h2 className="text-xl font-bold">
          Today's Check-in
        </h2>

        {checkins.length ? (
          <p>{checkins[0].note}</p>
        ) : (
          <p>No check-in completed today.</p>
        )}

      </section>


    </main>
  );
}