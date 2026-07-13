"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { subscribeHabits } from "@/lib/habits";
import { subscribeGoals } from "@/lib/goals";
import { subscribeCheckins } from "@/lib/checkins";

export default function AnalyticsPage() {
  const [uid, setUid] = useState("");

  const [habits, setHabits] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<any[]>([]);


  useEffect(() => {
    let unsubHabits: (() => void) | undefined;
    let unsubGoals: (() => void) | undefined;
    let unsubCheckins: (() => void) | undefined;


    const unsubAuth = onAuthStateChanged(
      auth,
      (user) => {
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
      }
    );


    return () => {
      unsubAuth();
      unsubHabits?.();
      unsubGoals?.();
      unsubCheckins?.();
    };

  }, []);



  if (!uid) {
    return (
      <main className="p-8">
        Loading...
      </main>
    );
  }



  // Habit calculation

  const completedHabits =
    habits.filter(
      (habit) => habit.completed
    ).length;


  const habitCompletion =
    habits.length
      ? Math.round(
          (completedHabits / habits.length) * 100
        )
      : 0;



  // Goal calculation

  const averageGoalProgress =
    goals.length
      ? Math.round(
          goals.reduce(
            (sum, goal) =>
              sum + (goal.progress || 0),
            0
          ) / goals.length
        )
      : 0;



  // Checkin calculation

  const totalCheckins =
    checkins.length;


  const averageEnergy =
    checkins.length
      ? Math.round(
          checkins.reduce(
            (sum, item) =>
              sum + (item.energy || 0),
            0
          ) / checkins.length
        )
      : 0;



  return (
    <main className="max-w-5xl mx-auto p-8 space-y-8">


      <h1 className="text-3xl font-bold">
        Analytics
      </h1>



      {/* Summary Cards */}

      <div className="grid md:grid-cols-3 gap-5">


        <div className="border rounded-xl p-5">
          <h2 className="font-semibold">
            Habit Completion
          </h2>

          <p className="text-3xl">
            {habitCompletion}%
          </p>
        </div>



        <div className="border rounded-xl p-5">

          <h2 className="font-semibold">
            Goal Progress
          </h2>

          <p className="text-3xl">
            {averageGoalProgress}%
          </p>

        </div>



        <div className="border rounded-xl p-5">

          <h2 className="font-semibold">
            Check-ins
          </h2>

          <p className="text-3xl">
            {totalCheckins}
          </p>

        </div>


      </div>





      {/* Habits */}

      <section>

        <h2 className="text-xl font-bold mb-3">
          Habit Performance
        </h2>


        <div className="space-y-3">

          {habits.map((habit)=>(
            <div
              key={habit.id}
              className="border rounded-lg p-3 flex justify-between"
            >

              <span>
                {habit.title}
              </span>


              <span>
                {habit.completed
                  ? "✅ Completed"
                  : "❌ Pending"}
              </span>

            </div>
          ))}

        </div>

      </section>





      {/* Goals */}

      <section>

        <h2 className="text-xl font-bold mb-3">
          Goal Progress
        </h2>


        {goals.map((goal)=>(
          <div
            key={goal.id}
            className="border rounded-lg p-4 mb-3"
          >

            <div className="flex justify-between">

              <span>
                {goal.title}
              </span>


              <span>
                {goal.progress || 0}%
              </span>

            </div>


            <div className="w-full bg-gray-200 h-2 rounded mt-2">

              <div
                className="bg-black h-2 rounded"
                style={{
                  width:
                    `${goal.progress || 0}%`
                }}
              />

            </div>

          </div>
        ))}


      </section>






      {/* Checkins */}

      <section>

        <h2 className="text-xl font-bold mb-3">
          Check-in Insights
        </h2>


        <div className="border rounded-xl p-5">

          <p>
            Total Check-ins:
            {" "}
            {totalCheckins}
          </p>


          <p>
            Average Energy:
            {" "}
            {averageEnergy}/10
          </p>


        </div>


      </section>



    </main>
  );
}