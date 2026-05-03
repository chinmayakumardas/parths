














// "use client";

// import { useState } from "react";

// import { Calendar } from "@/components/ui/calendar";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// import { Plus, Flame, Trash2 } from "lucide-react";

// // ================= TYPES =================
// type HabitStreakDay = {
//   date: string;
//   status: 0 | 1;
// };

// type Habit = {
//   id: string;
//   name: string;
//   category?: string;

//   habitStreak: HabitStreakDay[];

//   currentStreak: number;
//   longestStreak: number;
// };

// // ================= DUMMY DATA =================
// const dummyHabits: Habit[] = [
//   {
//     id: "1",
//     name: "Read 10 Pages",
//     category: "Learning",
//     habitStreak: [],
//     currentStreak: 3,
//     longestStreak: 10,
//   },
// ];

// // ================= UTILS =================
// function calcStreak(streak: HabitStreakDay[]) {
//   let current = 0;
//   let longest = 0;

//   for (let i = streak.length - 1; i >= 0; i--) {
//     if (streak[i].status === 1) {
//       current++;
//       longest = Math.max(longest, current);
//     } else break;
//   }

//   return { current, longest };
// }

// // ================= PAGE =================
// export default function HabitPage() {
//   const [habits, setHabits] = useState<Habit[]>(dummyHabits);
//   const [selected, setSelected] = useState<Habit | null>(null);
//   const [open, setOpen] = useState(false);

//   const today = new Date();

//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(
//     new Date()
//   );

//   // ================= TOGGLE DAY =================
//   const toggleHabit = (date: Date) => {
//     if (!selected) return;

//     const key = date.toISOString().split("T")[0];

//     const exists = selected.habitStreak.find((d) => d.date === key);

//     let updated: HabitStreakDay[];

//     if (exists) {
//       updated = selected.habitStreak.map((d) =>
//         d.date === key
//           ? { ...d, status: d.status === 1 ? 0 : 1 }
//           : d
//       );
//     } else {
//       updated = [
//         ...selected.habitStreak,
//         { date: key, status: 1 },
//       ];
//     }

//     const { current, longest } = calcStreak(updated);

//     const updatedHabit: Habit = {
//       ...selected,
//       habitStreak: updated,
//       currentStreak: current,
//       longestStreak: Math.max(longest, selected.longestStreak),
//     };

//     setHabits((prev) =>
//       prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h))
//     );

//     setSelected(updatedHabit);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">

//       {/* ================= HEADER ================= */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-xl font-semibold">Habits</h1>

//         <Button>
//           <Plus className="w-4 h-4 mr-2" />
//           New Habit
//         </Button>
//       </div>

//       {/* ================= LIST ================= */}
//       <div className="space-y-3">
//         {habits.map((h) => (
//           <Card
//             key={h.id}
//             onClick={() => {
//               setSelected(h);
//               setOpen(true);
//             }}
//             className="p-4 cursor-pointer flex justify-between"
//           >
//             <div>
//               <p className="font-medium">{h.name}</p>
//               <p className="text-xs text-muted-foreground">
//                 {h.category}
//               </p>
//             </div>

//             <div className="flex items-center gap-1 text-orange-500">
//               <Flame className="w-4 h-4" />
//               {h.currentStreak}
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* ================= DIALOG ================= */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="max-w-4xl">

//           {selected && (
//             <>
//               <DialogHeader>
//                 <DialogTitle>{selected.name}</DialogTitle>
//               </DialogHeader>

//               {/* ================= LAYOUT ================= */}
//               <div className="grid md:grid-cols-2 gap-6">

//                 {/* ================= CALENDAR ================= */}
//                 <div className="border rounded-xl p-3">

//                   <Calendar
//                     mode="single"
//                     selected={selectedDate}
//                     defaultMonth={selectedDate}
//                     onSelect={(date) => {
//                       if (!date) return;
//                       if (date > today) return;

//                       setSelectedDate(date);
//                       toggleHabit(date);
//                     }}
//                     className="rounded-lg"
//                   />

//                 </div>

//                 {/* ================= STATS ================= */}
//                 <div className="space-y-4">

//                   <Card className="p-4">
//                     <p className="text-sm text-muted-foreground">
//                       Current Streak
//                     </p>
//                     <p className="text-2xl font-bold">
//                       {selected.currentStreak}
//                     </p>
//                   </Card>

//                   <Card className="p-4">
//                     <p className="text-sm text-muted-foreground">
//                       Longest Streak
//                     </p>
//                     <p className="text-2xl font-bold">
//                       {selected.longestStreak}
//                     </p>
//                   </Card>

//                   <Card className="p-4 text-sm text-muted-foreground">
//                     Category: {selected.category}
//                   </Card>

//                   <Button
//                     variant="destructive"
//                     onClick={() => {
//                       setHabits((prev) =>
//                         prev.filter((h) => h.id !== selected.id)
//                       );
//                       setOpen(false);
//                     }}
//                   >
//                     <Trash2 className="w-4 h-4 mr-2" />
//                     Delete Habit
//                   </Button>

//                 </div>

//               </div>
//             </>
//           )}

//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// }








"use client";

import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Trash2,
  Pencil,
  Flame,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// ================= TYPES =================
type Day = {
  date: string;
  status: 0 | 1;
};

type Habit = {
  id: string;
  name: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  habitStreak: Day[];
  currentStreak: number;
  longestStreak: number;
};

// ================= UTIL =================
const isSameDay = (a?: Date, b?: string) => {
  if (!a || !b) return false;
  return a.toISOString().split("T")[0] === b;
};

// ================= COMPONENT =================
export default function HabitModal({
  open,
  setOpen,
  habit,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  habit: Habit | null;
}) {
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  if (!habit) return null;

  const today = new Date();

  // ================= MAP STATUS =================
  const statusMap = useMemo(() => {
    const map = new Map<string, 0 | 1>();
    habit.habitStreak.forEach((d) => map.set(d.date, d.status));
    return map;
  }, [habit]);

  // ================= TOGGLE DAY =================
  const toggleDay = (date: Date) => {
    const key = date.toISOString().split("T")[0];

    const existing = statusMap.get(key) === 1 ? 0 : 1;

    statusMap.set(key, existing);

    habit.habitStreak = Array.from(statusMap.entries()).map(
      ([date, status]) => ({ date, status })
    );
  };

  // ================= DAY STYLE =================
  const getDayClass = (date: Date) => {
    const key = date.toISOString().split("T")[0];

    const status = statusMap.get(key);

    if (date > today) {
      return "text-muted-foreground opacity-40 cursor-not-allowed";
    }

    if (status === 1) {
      return "bg-green-500 text-white hover:bg-green-600";
    }

    return "hover:bg-muted";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between p-5 border-b">

          <div>
            <h2 className="text-lg font-semibold">{habit.name}</h2>

            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">{habit.category}</Badge>
              <Badge>
                🔥 {habit.currentStreak}
              </Badge>
              <Badge variant="outline">
                Best {habit.longestStreak}
              </Badge>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">

            <Button size="icon" variant="ghost">
              <Pencil className="w-4 h-4" />
            </Button>

            <Button size="icon" variant="ghost">
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>

          </div>

        </div>

        {/* ================= BODY ================= */}
        <div className="grid grid-cols-3">

          {/* LEFT PANEL */}
          <div className="p-5 border-r space-y-3">

            <div className="text-sm text-muted-foreground">
              <p>Start: {habit.startDate || "—"}</p>
              <p>End: {habit.endDate || "∞"}</p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Flame className="w-4 h-4 text-orange-500" />
              Streak tracking active
            </div>

          </div>

          {/* RIGHT CALENDAR (MAIN HERO) */}
          <div className="col-span-2 p-6">

            <div className="rounded-xl border p-4">

              <Calendar
                mode="single"
                selected={selected}
                onSelect={(date) => {
                  if (!date) return;
                  if (date > today) return;

                  setSelected(date);
                  toggleDay(date);
                }}
                modifiers={{
                  booked: (date) =>
                    statusMap.get(
                      date.toISOString().split("T")[0]
                    ) === 1,
                }}
                modifiersClassNames={{
                  booked: "bg-green-500 text-white",
                }}
                className="rounded-md"
              />

            </div>

            {/* LEGEND */}
            <div className="flex gap-4 mt-4 text-xs text-muted-foreground">

              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                Done
              </span>

              <span className="flex items-center gap-1">
                <XCircle className="w-3 h-3 text-muted-foreground" />
                Pending
              </span>

            </div>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}