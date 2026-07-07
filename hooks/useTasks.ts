"use client";

import { useCallback, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

import {
  addTask,
  getTasks,
  getTask,
  updateTask as updateTaskService,
  toggleTaskCompletion,
  reorderTask as reorderTaskService,
  deleteTask as deleteTaskService,
} from "@/services/taskService";

import { Task } from "@/types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Initial Load
   */
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) {
        setTasks([]);
        return;
      }

      const data = await getTasks(user.uid);
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  /**
   * Refresh
   */
  const refresh = loadTasks;

  /**
   * Get Single Task
   */
  async function getTaskById(id: string) {
    const user = auth.currentUser;

    if (!user) return null;

    return await getTask(user.uid, id);
  }

  /**
   * Create Task
   */
  async function createTask(
    data: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      setSubmitting(true);

      const id = await addTask(user.uid, data);

      setTasks((prev) => [
        ...prev,
        {
          id,
          ...data,
          createdAt: new Date() as any,
          updatedAt: new Date() as any,
        },
      ]);

      return id;
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Update Task
   */
  async function updateTask(
    id: string,
    data: Partial<Task>
  ) {
    const user = auth.currentUser;

    if (!user) return;

    try {
      setSubmitting(true);

      await updateTaskService(user.uid, id, data);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                ...data,
              }
            : task
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Toggle Completion
   */
  async function toggleComplete(
    id: string,
    completed: boolean
  ) {
    const user = auth.currentUser;

    if (!user) return;

    try {
      setSubmitting(true);

      await toggleTaskCompletion(
        user.uid,
        id,
        completed
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                completed,
                completedAt: completed
                  ? (new Date() as any)
                  : null,
              }
            : task
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Reorder Task
   */
  async function reorderTask(
    id: string,
    order: number
  ) {
    const user = auth.currentUser;

    if (!user) return;

    try {
      await reorderTaskService(
        user.uid,
        id,
        order
      );

      setTasks((prev) =>
        prev
          .map((task) =>
            task.id === id
              ? {
                  ...task,
                  order,
                }
              : task
          )
          .sort((a, b) => a.order - b.order)
      );
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Delete Task
   */
  async function deleteTask(id: string) {
    const user = auth.currentUser;

    if (!user) return;

    try {
      setSubmitting(true);

      await deleteTaskService(
        user.uid,
        id
      );

      setTasks((prev) =>
        prev.filter(
          (task) => task.id !== id
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  return {
    tasks,

    loading,

    submitting,

    refresh,

    getTaskById,

    createTask,

    updateTask,

    toggleComplete,

    reorderTask,

    deleteTask,
  };
}