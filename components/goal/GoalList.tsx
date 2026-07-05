// "use client";

// import React, { useState } from "react";
// import type { DragEndEvent } from "../kibo-ui/list/index"; // adjust path to your component file

// import {
//   ListProvider,
//   ListGroup,
//   ListHeader,
//   ListItems,
//   ListItem,
// } from "../kibo-ui/list/index"; // ← adjust path

// type Goal = {
//   id: string;
//   name: string;
//   description?: string;
// };

// const initialGoals: Goal[] = [
//   { id: "g1", name: "Wake up at 5 AM daily", description: "Build strong discipline" },
//   { id: "g2", name: "Exercise 4 times per week", description: "Improve fitness" },
//   { id: "g3", name: "Read 12 books in 2026", description: "Personal growth" },
//   { id: "g4", name: "Save $5000 by year end", description: "Financial goal" },
//   { id: "g5", name: "Master TypeScript", description: "Career development" },
//   { id: "g6", name: "Meditate 10 minutes daily", description: "Mental health" },
// ];

// export default function GoalsList() {
//   const [goals, setGoals] = useState(initialGoals);

//   const onDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (!over || active.id === over.id) return;

//     const oldIndex = goals.findIndex((goal) => goal.id === active.id);
//     const newIndex = goals.findIndex((goal) => goal.id === over.id);

//     if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

//     // Manual reorder without @dnd-kit/sortables
//     const newGoals = [...goals];
//     const [movedItem] = newGoals.splice(oldIndex, 1);
//     newGoals.splice(newIndex, 0, movedItem);

//     setGoals(newGoals);
//   };

//   return (
//     <div className="min-h-screen  p-6">
//       <div className="max-w-xl mx-auto">
       

//         <ListProvider onDragEnd={onDragEnd}>
//           <ListGroup id="goals" className="rounded-xl border shadow-sm overflow-hidden">
//             <ListHeader name="2026 Goals" color="#3b82f6" />

//             <ListItems>
//               {goals.map((goal, index) => (
//                 <ListItem
//                   key={goal.id}
//                   id={goal.id}
//                   name={goal.name}
//                   index={index}
//                   parent="goals"
//                 >
//                   <div className="flex-1">
//                     <p className="font-medium text-sm">{goal.name}</p>
//                     {goal.description && (
//                       <p className="text-xs text-muted-foreground mt-1">
//                         {goal.description}
//                       </p>
//                     )}
//                   </div>
//                 </ListItem>
//               ))}
//             </ListItems>
//           </ListGroup>
//         </ListProvider>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import { Circle, Clock, CheckCircle2, Trash2, Edit2, Plus } from "lucide-react";
import type { DragEndEvent } from "../kibo-ui/list/index"; // adjust path to your component file

import {
  ListProvider,
  ListGroup,
  ListHeader,
  ListItems,
  ListItem,
} from "../kibo-ui/list/index"; // ← adjust path

type GoalStatus = "todo" | "in-progress" | "done";

type Goal = {
  id: string;
  name: string;
  description?: string;
  status: GoalStatus;
};

const initialGoals: Goal[] = [
  { id: "g1", name: "Wake up at 5 AM daily", description: "Build strong discipline", status: "done" },
  { id: "g2", name: "Exercise 4 times per week", description: "Improve fitness", status: "in-progress" },
  { id: "g3", name: "Read 12 books in 2026", description: "Personal growth", status: "todo" },
  { id: "g4", name: "Save $5000 by year end", description: "Financial goal", status: "todo" },
  { id: "g5", name: "Master TypeScript", description: "Career development", status: "todo" },
  { id: "g6", name: "Meditate 10 minutes daily", description: "Mental health", status: "todo" },
];

export default function GoalsList() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  // 1. Separate Dialog: Create Goal
  const handleCreateGoal = () => {
    const name = prompt("Enter goal name:");
    if (!name || !name.trim()) return;

    const description = prompt("Enter description (optional):") || undefined;

    const newGoal: Goal = {
      id: `g-${Date.now()}`,
      name: name.trim(),
      description: description?.trim() || undefined,
      status: "todo",
    };

    setGoals([...goals, newGoal]);
  };

  // 2. Separate Dialog: Edit Goal
  const handleEditGoal = (goal: Goal) => {
    const updatedName = prompt("Edit goal name:", goal.name);
    if (updatedName === null) return; // User cancelled
    if (!updatedName.trim()) return;

    const updatedDesc = prompt("Edit description:", goal.description || "");
    if (updatedDesc === null) return; // User cancelled

    setGoals(
      goals.map((g) =>
        g.id === goal.id
          ? { ...g, name: updatedName.trim(), description: updatedDesc.trim() || undefined }
          : g
      )
    );
  };

  // 3. Separate Dialog: Delete Goal
  const handleDeleteGoal = (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this goal?");
    if (confirmDelete) {
      setGoals(goals.filter((g) => g.id !== id));
    }
  };

  // 4. Status Update Loop: Todo -> In Progress -> Done
  const toggleStatus = (id: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== id) return goal;
        let nextStatus: GoalStatus = "todo";
        if (goal.status === "todo") nextStatus = "in-progress";
        else if (goal.status === "in-progress") nextStatus = "done";
        return { ...goal, status: nextStatus };
      })
    );
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = goals.findIndex((goal) => goal.id === active.id);
    const newIndex = goals.findIndex((goal) => goal.id === over.id);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    const newGoals = [...goals];
    const [movedItem] = newGoals.splice(oldIndex, 1);
    newGoals.splice(newIndex, 0, movedItem);

    setGoals(newGoals);
  };

  // Render icons corresponding to the goal status
  const StatusIcon = ({ status }: { status: GoalStatus }) => {
    const baseClass = "w-5 h-5 shrink-0 transition-transform active:scale-95 cursor-pointer mt-0.5";
    if (status === "done") return <CheckCircle2 className={`${baseClass} text-emerald-500 fill-emerald-50`} />;
    if (status === "in-progress") return <Clock className={`${baseClass} text-amber-500 animate-pulse`} />;
    return <Circle className={`${baseClass} text-slate-300 hover:text-slate-400`} />;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-xl mx-auto space-y-4">
        
        {/* Top Control Action Bar */}
        <div className="flex justify-end">
          <button
            onClick={handleCreateGoal}
            className="flex items-center gap-1.5 text-xs font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Goal
          </button>
        </div>

        <ListProvider onDragEnd={onDragEnd}>
          <ListGroup id="goals" className="rounded-xl border shadow-sm overflow-hidden bg-white">
            <ListHeader name="2026 Goals" color="#3b82f6" />

            <ListItems>
              {goals.map((goal, index) => (
                <ListItem
                  key={goal.id}
                  id={goal.id}
                  name={goal.name}
                  index={index}
                  parent="goals"
                >
                  <div className="flex items-start gap-3 w-full p-1 group">
                    
                    {/* Status Update Feature */}
                    <button
                      type="button"
                      onClick={() => toggleStatus(goal.id)}
                      className="focus:outline-none"
                    >
                      <StatusIcon status={goal.status} />
                    </button>

                    {/* Content Display Matches Your Original Code */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm transition-all ${
                        goal.status === "done" ? "line-through text-slate-400" : "text-slate-900"
                      }`}>
                        {goal.name}
                      </p>
                      {goal.description && (
                        <p className={`text-xs mt-1 transition-all ${
                          goal.status === "done" ? "text-slate-200" : "text-muted-foreground"
                        }`}>
                          {goal.description}
                        </p>
                      )}
                    </div>

                    {/* Inline Hover Action Triggers */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-500"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1 hover:bg-rose-50 rounded text-rose-500"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </ListItem>
              ))}
            </ListItems>
          </ListGroup>
        </ListProvider>
      </div>
    </div>
  );
}