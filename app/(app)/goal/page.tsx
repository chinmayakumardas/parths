



import GoalList from "@/components/goal/GoalList";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goals | Parth AI",
  description:
    "View and manage your goals, progress, and milestones.",
};

export default function GoalPage() {
  return (
    <main className="px-5 py-8">
      <div className="mx-auto ">
        <GoalList  />
      </div>
    </main>
  );
}




