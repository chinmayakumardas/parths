
"use client";

import { useEffect, useState } from "react";

const habits = [
  {
    id: "01",
    start: 4,
    end: 5,
    title: "Wake Up",
    desc: "Start early & grounded",
    time: "04:00 AM",
  },
  {
    id: "02",
    start: 5,
    end: 7,
    title: "Gym",
    desc: "Mind + Muscle",
    time: "05:30 AM",
  },
  {
    id: "03",
    start: 7,
    end: 8,
    title: "No Doom Scrolling",
    desc: "Protect focus & energy",
  },
  {
    id: "04",
    start: 8,
    end: 9,
    title: "Top 3 Tasks",
    desc: "Think clearly before action",
  },
  {
    id: "05",
    start: 9,
    end: 14,
    title: "Skill Learning",
    desc: "Learn valuable high-income skills",
  },
  {
    id: "06",
    start: 14,
    end: 20,
    title: "Building",
    desc: "Create projects, products & systems",
  },
  {
    id: "07",
    start: 20,
    end: 21,
    title: "Journal",
    desc: "Review day & plan tomorrow",
    time: "09:00 PM",
  },
  {
    id: "08",
    start: 21,
    end: 22,
    title: "Go To Bed",
    desc: "Recover & reset",
    time: "10:00 PM",
  },
];

export default function Today() {
  const [time, setTime] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      const formatted = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      setTime(formatted);

      const currentHour = now.getHours();

      const active = habits.findIndex(
        (habit) =>
          currentHour >= habit.start &&
          currentHour < habit.end
      );

      setActiveIndex(active !== -1 ? active : null);
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className=" px-5 py-8 text-sm">
      <div className="mx-auto max-w-5xl">
        {/* TOP */}
        <div className="mb-12 flex items-start justify-between  pb-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Discipline
          </p>

          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Current Time
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              {time}
            </h2>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="grid gap-x-16 md:grid-cols-2">
          {habits.map((habit, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={habit.id}
                className={`flex items-start justify-between border-b py-5 transition-all ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* NUMBER */}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-semibold transition-all ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {habit.id}
                  </div>

                  {/* CONTENT */}
                  <div>
                    <h3
                      className={`text-sm tracking-tight ${
                        isActive
                          ? "font-semibold"
                          : "font-medium"
                      }`}
                    >
                      {habit.title}
                    </h3>

                    <p className="mt-1 text-xs">
                      {habit.desc}
                    </p>
                  </div>
                </div>

                {/* OPTIONAL TIME */}
                {habit.time && (
                  <p
                    className={`text-xs tracking-wide ${
                      isActive ? "font-semibold" : ""
                    }`}
                  >
                    {habit.time}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}