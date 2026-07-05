

"use client";

import React, { useState } from "react";
import { Circle, Clock, CheckCircle2 } from "lucide-react";
import type { DragEndEvent } from "../kibo-ui/list/index"; // adjust path
import {
  ListProvider,
  ListGroup,
  ListItems,
  ListItem,
  ListHeader,
} from "../kibo-ui/list/index"; // adjust path

type TaskStatus = "todo" | "in-progress" | "done";

type TimelineTask = {
  id: string;
  hour: number; // 0 to 23 representing the matching hour row
  name: string;
  description?: string;
  status: TaskStatus;
};

// Your actual daily tasks mapped to specific hours
const initialTasks: TimelineTask[] = [
  { id: "t1", hour: 5, name: "Wake up & Hydrate", description: "Start the morning routine", status: "done" },
  { id: "t2", hour: 6, name: "Meditate 10 minutes daily", description: "Mental health focus", status: "done" },
  { id: "t3", hour: 7, name: "Exercise Session", description: "Cardio / Morning stretching", status: "in-progress" },
  { id: "t4", hour: 8, name: "Breakfast & Prep", description: "Fueling up for the day", status: "todo" },
  { id: "t5", hour: 9, name: "Master TypeScript", description: "Deep work & engineering block", status: "todo" },
  { id: "t6", hour: 11, name: "Project Management", description: "Reviewing tasks & issue tracking", status: "todo" },
  { id: "t7", hour: 12, name: "Lunch Break", status: "todo" },
  { id: "t8", hour: 13, name: "Financial Tracking", description: "Budget optimization checks", status: "todo" },
  { id: "t9", hour: 15, name: "Coding & Code Review", description: "Reviewing PRs and writing code", status: "todo" },
  { id: "t10", hour: 18, name: "Dinner & Wind Down", status: "todo" },
  { id: "t11", hour: 20, name: "Personal Growth Reading", description: "Read 12 books goal session", status: "todo" },
  { id: "t12", hour: 22, name: "Rest & Sleep", description: "Night time rest routine", status: "todo" },
];

// Helper to format 24h index integers into display strings (e.g., 5 -> "05:00 AM", 13 -> "01:00 PM")
const formatHour = (h: number): string => {
  const ampm = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  const pad = displayHour < 10 ? "0" : "";
  return `${pad}${displayHour}:00 ${ampm}`;
};

export default function Today() {
  const [tasks, setTasks] = useState<TimelineTask[]>(initialTasks);

  const toggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        let nextStatus: TaskStatus = "todo";
        if (task.status === "todo") nextStatus = "in-progress";
        else if (task.status === "in-progress") nextStatus = "done";
        return { ...task, status: nextStatus };
      })
    );
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Grab the source task
    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // Use the "over" target hour directly to reschedule the item on the timeline matrix
    const targetHour = parseInt(over.id as string, 10);
    if (isNaN(targetHour)) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, hour: targetHour } : t))
    );
  };

  const StatusButton = ({ status }: { status: TaskStatus }) => {
    const iconClass = "w-5 h-5 transition-transform active:scale-90 cursor-pointer shrink-0 mt-0.5";
    switch (status) {
      case "done":
        return <CheckCircle2 className={`${iconClass} text-emerald-500 fill-emerald-50`} />;
      case "in-progress":
        return <Clock className={`${iconClass} text-amber-500 animate-pulse`} />;
      default:
        return <Circle className={`${iconClass} text-slate-300 hover:text-slate-400`} />;
    }
  };

  // Generate a flat grid of 24 slots (from 0 to 23 hours)
  const hoursGrid = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <ListProvider onDragEnd={onDragEnd}>
        <ListGroup id="goals" className="rounded-xl border shadow-sm overflow-hidden">
           <ListHeader name="Today tasks" color="#3b82f6" />
          <ListItems>
            {hoursGrid.map((hourIndex) => {
              // Find if there's an assigned task for this specific hour row
              const matchingTask = tasks.find((t) => t.hour === hourIndex);

              return (
                <ListItem key={hourIndex} id={matchingTask ? matchingTask.id : hourIndex.toString()}>
                  <div className="flex items-start gap-4 w-full py-1">
                    
                    {/* Continuous static timeline clock column - Always Visible */}
                    <div className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded min-w-[75px] text-center shrink-0 select-none">
                      {formatHour(hourIndex)}
                    </div>

                    {matchingTask ? (
                      <>
                        {/* Status Toggle Action Button */}
                        <button 
                          onClick={() => toggleStatus(matchingTask.id)}
                          className="focus:outline-none"
                        >
                          <StatusButton status={matchingTask.status} />
                        </button>

                        {/* Configured Text Content layout block */}
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            matchingTask.status === "done" ? "line-through text-slate-400" : "text-slate-900"
                          }`}>
                            {matchingTask.name}
                          </p>
                          
                          {matchingTask.description && (
                            <span className={`text-xs ${
                              matchingTask.status === "done" ? "text-slate-300" : "text-slate-500"
                            }`}>
                              {matchingTask.description}
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      /* Fallback structure when no task occupies this row index slot */
                      <div className="flex-1 flex items-center min-h-[28px]">
                        <span className="text-xs italic text-slate-300 select-none">Free Slot</span>
                      </div>
                    )}

                  </div>
                </ListItem>
              );
            })}
          </ListItems>
        </ListGroup>
      </ListProvider>
    </div>
  );
}