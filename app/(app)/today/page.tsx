import Today from "@/components/today/today";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Today | Parth AI",
  description:
    "View and manage today's tasks, schedule, and daily progress.",
};

export default function TodayPage() {
  return <Today />;
}