"use client";

import { useEffect, useState } from "react";

export default function GoalPage() {
  const deadline = new Date("2026-08-18T00:00:00");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();

      const difference = deadline.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("Deadline Reached");
        return;
      }

      const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      );

      const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
      );

      setTimeLeft(
        `${days}d ${hours}h ${minutes}m left`
      );
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const goals = [
    {
      id: "01",
      title: "Upskill",
      desc: "Become highly valuable & AI-leveraged",
    },
    {
      id: "02",
      title: "Close First Client",
      desc: "Start freelance income journey",
    },
  ];

  return (
    <main className=" px-5 py-8 text-sm">
      <div className="mx-auto max-w-4xl">
        {/* TOP */}
        <div className="mb-14 flex items-start justify-between border-b pb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Phase 1 Goals
            </p>

            <h1 className="mt-2 text-xl font-semibold tracking-tight">
              Deadline — 18 Aug 2026
            </h1>
          </div>

          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Time Left
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-primary">
              {timeLeft}
            </h2>
          </div>
        </div>

        {/* GOALS */}
        <div className="space-y-1">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="flex items-start justify-between border-b py-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-[11px] font-semibold">
                  {goal.id}
                </div>

                <div>
                  <h3 className="text-sm font-medium tracking-tight">
                    {goal.title}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {goal.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}