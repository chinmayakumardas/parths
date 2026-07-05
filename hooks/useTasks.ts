"use client";

import { useEffect, useState } from "react";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "@/firebase/task";

import { Task } from "@/types/task";

export function useTasks(goalId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTasks() {
    if (!goalId) return;

    setLoading(true);

    const data = await getTasks(goalId);

    setTasks(data);
    setLoading(false);
  }

  async function addTask(title: string) {
    if (!goalId) return;

    await createTask(goalId, {
      title,
      order: tasks.length,
    });

    await fetchTasks();
  }

  async function editTask(
    taskId: string,
    data: Partial<Task>
  ) {
    if (!goalId) return;

    await updateTask(goalId, taskId, data);

    await fetchTasks();
  }

  async function removeTask(taskId: string) {
    if (!goalId) return;

    await deleteTask(goalId, taskId);

    await fetchTasks();
  }

  useEffect(() => {
    if (goalId) {
      fetchTasks();
    }
  }, [goalId]);

  return {
    tasks,
    loading,

    fetchTasks,

    addTask,
    editTask,
    removeTask,
  };
}