"use client";

import { useCallback, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

import {
  addGoal,
  getGoals,
  getGoal,
  updateGoal as updateGoalService,
  updateGoalProgress,
  updateGoalStatus,
  completeGoal as completeGoalService,
  deleteGoal as deleteGoalService,
} from "@/services/goalService";

import { Goal } from "@/types/goal";

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Initial Load
   */
  const loadGoals = useCallback(async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) {
        setGoals([]);
        return;
      }

      const data = await getGoals(user.uid);
      setGoals(data);
    } catch (error) {
      console.error("Failed to load goals:", error);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  /**
   * Refresh
   */
  const refresh = loadGoals;

  /**
   * Get One Goal
   */
  async function getGoalById(id: string) {
    const user = auth.currentUser;

    if (!user) return null;

    return await getGoal(user.uid, id);
  }

  /**
   * Create Goal
   */
  async function createGoal(
    data: Omit<Goal, "id" | "createdAt" | "updatedAt">
  ) {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      setSubmitting(true);

      const id = await addGoal(user.uid, data);

      setGoals((prev) => [
        {
          id,
          ...data,
          createdAt: new Date() as any,
          updatedAt: new Date() as any,
        },
        ...prev,
      ]);

      return id;
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Update Goal
   */
  async function updateGoal(
    id: string,
    data: Partial<Goal>
  ) {
    const user = auth.currentUser;

    if (!user) return;

    try {
      setSubmitting(true);

      await updateGoalService(user.uid, id, data);

      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === id
            ? {
                ...goal,
                ...data,
              }
            : goal
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Update Progress
   */
  async function updateProgress(
    id: string,
    progress: number
  ) {
    const user = auth.currentUser;

    if (!user) return;

    try {
      setSubmitting(true);

      await updateGoalProgress(
        user.uid,
        id,
        progress
      );

      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === id
            ? {
                ...goal,
                progress,
              }
            : goal
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Change Status
   */
  async function changeStatus(
    id: string,
    status: Goal["status"]
  ) {
    const user = auth.currentUser;

    if (!user) return;

    try {
      setSubmitting(true);

      await updateGoalStatus(
        user.uid,
        id,
        status
      );

      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === id
            ? {
                ...goal,
                status,
              }
            : goal
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Complete Goal
   */
  async function completeGoal(
    id: string
  ) {
    const user = auth.currentUser;

    if (!user) return;

    try {
      setSubmitting(true);

      await completeGoalService(
        user.uid,
        id
      );

      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === id
            ? {
                ...goal,
                progress: 100,
                status: "completed",
                completedAt: new Date() as any,
              }
            : goal
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Delete Goal
   */
  async function deleteGoal(id: string) {
    const user = auth.currentUser;

    if (!user) return;

    try {
      setSubmitting(true);

      await deleteGoalService(
        user.uid,
        id
      );

      setGoals((prev) =>
        prev.filter(
          (goal) => goal.id !== id
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  return {
    goals,

    loading,

    submitting,

    refresh,

    getGoalById,

    createGoal,

    updateGoal,

    updateProgress,

    changeStatus,

    completeGoal,

    deleteGoal,
  };
}