



<<<<<<< HEAD
<<<<<<< HEAD
// import GoalList from "@/components/goal/GoalList";
=======
// import GoalHeader from "@/components/goal/GoalHeader";
=======
>>>>>>> a67df6f (ok)
import GoalList from "@/components/goal/GoalList";
>>>>>>> 3072890 (.)

// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Goals | Parth AI",
//   description:
//     "View and manage your goals, progress, and milestones.",
// };

// export default function GoalPage() {
//   return (
//     <main className="px-5 py-8">
//       <div className="mx-auto ">
//         <GoalList  />
//       </div>
//     </main>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  Goal,
  createGoal,
  updateGoal,
  deleteGoal,
  subscribeGoals,
} from "@/lib/goals";

import GoalForm from "@/components/goals/goal-form";
import GoalCard from "@/components/goals/goal-card";

export default function GoalsPage() {
  const [uid, setUid] = useState("");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editing, setEditing] = useState<Goal | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      setUid(user.uid);

      const stop = subscribeGoals(user.uid, setGoals);

      return () => stop();
    });

    return () => unsub();
  }, []);

  if (!uid) {
    return (
      <main className="p-8">
        Loading...
      </main>
    );
  }

  return (
<<<<<<< HEAD
    <main className="max-w-3xl mx-auto p-8 space-y-8">

      <h1 className="text-3xl font-bold">
        Goals
      </h1>

      <GoalForm
        initialData={editing ?? undefined}
        onCancel={() => setEditing(null)}
        onSave={async (goal) => {

          if (editing) {
            await updateGoal(uid, editing.id, goal);
            setEditing(null);
          } else {
            await createGoal(uid, goal);
          }

        }}
      />

      <div className="space-y-4">

        {goals.length === 0 && (
          <p>No goals yet.</p>
        )}

        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={setEditing}
            onDelete={async (id) => {
              await deleteGoal(uid, id);
            }}
            onProgress={async (id, progress) => {
              await updateGoal(uid, id, {
                progress,
              });
            }}
          />
        ))}

=======
    <main className="px-5 py-8">
      <div className="mx-auto ">
        <GoalList  />
>>>>>>> a67df6f (ok)
      </div>

    </main>
  );
<<<<<<< HEAD
<<<<<<< HEAD
}
=======
}


>>>>>>> e7af21c2414436550645bf580f15d597ab7bcda7
=======
}




>>>>>>> a67df6f (ok)
