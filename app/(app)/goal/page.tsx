import Goal from "@/components/goal/goal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goals | Parth AI",
  description:
    "View and manage your goals, progress, and milestones.",
};

export default function GoalPage() {
  return <Goal />;
}