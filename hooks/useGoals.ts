"use client";

import { useEffect, useState } from "react";

import {
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
} from "@/firebase/goal";

import { Goal } from "@/types/goal";

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchGoals() {
    setLoading(true);

    const data = await getGoals();

    setGoals(data);
    setLoading(false);
  }

  async function addGoal(title: string, description = "") {
    await createGoal({ title, description });
    await fetchGoals();
  }

  async function editGoal(id: string, data: Partial<Goal>) {
    await updateGoal(id, data);
    await fetchGoals();
  }

  async function removeGoal(id: string) {
    await deleteGoal(id);
    await fetchGoals();
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    loading,

    fetchGoals,

    addGoal,
    editGoal,
    removeGoal,
  };
}