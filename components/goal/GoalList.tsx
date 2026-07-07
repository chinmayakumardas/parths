

"use client";

import React, { useState } from "react";
import { Circle, Clock, CheckCircle2, Trash2, Edit2, Plus, GripVertical } from "lucide-react";
import type { DragEndEvent } from "../kibo-ui/list/index";

import {
  ListProvider,
  ListGroup,
  ListHeader,
  ListItems,
  ListItem,
} from "../kibo-ui/list/index";

import { useGoals } from "@/hooks/useGoals";
import { CreateGoalDialog } from "./CreateGoalDialog";
import { EditGoalDialog } from "./EditGoalDialog";
import { DeleteGoalDialog } from "./DeleteGoalDialog";

import type { Goal } from "@/types/goal";

export default function GoalsList() {
  const { goals, createGoal, updateGoal, deleteGoal } = useGoals();

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);

  const handleCreateGoal = async (title: string, description?: string) => {
    await createGoal({ title, description });
    // setIsCreateOpen(false);
  };

  const handleSaveEditGoal = async (title: string, description?: string) => {
    if (!editingGoal) return;
    await updateGoal(editingGoal.id, { title, description });
    setEditingGoal(null);
  };

  const handleConfirmDeleteGoal = async () => {
    if (!deletingGoalId) return;
    await deleteGoal(deletingGoalId);
    setDeletingGoalId(null);
  };

  const toggleStatus = async (id: string, currentStatus: Goal["status"]) => {
    let nextStatus: Goal["status"] = "active";

    if (currentStatus === "active") nextStatus = "completed";
    else if (currentStatus === "completed") nextStatus = "paused";
    else if (currentStatus === "paused") nextStatus = "active";

    await updateGoal(id, { status: nextStatus });
  };

  const onDragEnd = (event: DragEndEvent) => {
    console.warn("Reordering not implemented yet");
  };

  const StatusIcon = ({ status }: { status: Goal["status"] }) => {
    const baseClass = "w-5 h-5 shrink-0 transition-transform mt-0.5";

    if (status === "completed") return <CheckCircle2 className={`${baseClass} text-emerald-500 fill-emerald-50`} />;
    if (status === "active") return <Circle className={`${baseClass} text-blue-500`} />;
    if (status === "paused") return <Clock className={`${baseClass} text-amber-500 animate-pulse`} />;
    return <Circle className={`${baseClass} text-slate-300`} />;
  };

  return (
    <div className="min-h-screen">
      {/* Add Goal Button */}
      <div className="fixed top-[35px] right-10 md:right-[calc(50%-272px)] z-50">
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg shadow-sm cursor-pointer hover:bg-primary/90"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Goal
        </button>
      </div>

      <div className="max-w-xl mx-auto relative pt-6">
        <ListProvider onDragEnd={onDragEnd} className="pointer-events-none">
          <ListGroup id="goals" className="rounded-xl shadow-sm overflow-hidden pointer-events-auto">
            <ListHeader name="2026 Goals" color="#3b82f6" />

            <ListItems>
              {goals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-6xl mb-4 opacity-50">🎯</div>
                  <p className="text-slate-400 text-xl mb-1">No goals yet</p>
                  <p className="text-slate-500 text-sm">Create your first goal to get started</p>
                </div>
              ) : (
                goals.map((goal, index) => (
                  <ListItem
                    key={goal.id}
                    id={goal.id}
                    name={goal.title}
                    index={index}
                    parent="goals"
                  >
                    <div className="flex items-start gap-3 w-full group relative">
                      <div className="text-slate-300 p-0.5 mt-0.5 shrink-0">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          toggleStatus(goal.id, goal.status);
                        }}
                        className="focus:outline-none cursor-pointer p-0.5 rounded hover:bg-slate-50 transition-colors shrink-0 relative z-30"
                      >
                        <StatusIcon status={goal.status} />
                      </button>

                      <div className="flex-1 min-w-0 select-text">
                        <p className={`font-medium text-sm transition-all ${
                          goal.status === "completed" ? "line-through text-slate-400" : "text-slate-900"
                        }`}>
                          {goal.title}
                        </p>
                        {goal.description && (
                          <p className={`text-xs mt-0.5 transition-all ${
                            goal.status === "completed" ? "text-slate-400/60" : "text-slate-500"
                          }`}>
                            {goal.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 relative z-30">
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setEditingGoal(goal);
                          }}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer transition-colors"
                          title="Edit Goal"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setDeletingGoalId(goal.id);
                          }}
                          className="p-1 hover:bg-rose-50 rounded text-rose-500 cursor-pointer transition-colors"
                          title="Delete Goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </ListItem>
                ))
              )}
            </ListItems>
          </ListGroup>
        </ListProvider>
      </div>

      {/* Dialogs */}
      <CreateGoalDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateGoal}
      />
      <EditGoalDialog
        goal={editingGoal}
        onClose={() => setEditingGoal(null)}
        onSave={handleSaveEditGoal}
      />
      <DeleteGoalDialog
        isOpen={!!deletingGoalId}
        onClose={() => setDeletingGoalId(null)}
        onConfirm={handleConfirmDeleteGoal}
      />
    </div>
  );
}
