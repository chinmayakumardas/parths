// src/services/taskService.ts

import { db } from "@/lib/firebase";
import { Task } from "@/types/task";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

/**
 * Get the user's task collection
 */
const taskCollection = (uid: string) =>
  collection(db, "users", uid, "tasks");

/**
 * Add Task
 */
export async function addTask(
  uid: string,
  task: Omit<Task, "id" | "createdAt" | "updatedAt">
) {
  try {
    const docRef = await addDoc(taskCollection(uid), {
      ...task,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
}

/**
 * Get All Tasks
 */
export async function getTasks(uid: string): Promise<Task[]> {
  try {
    const q = query(taskCollection(uid), orderBy("order", "asc"));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Task, "id">),
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

/**
 * Get Single Task
 */
export async function getTask(
  uid: string,
  taskId: string
): Promise<Task | null> {
  try {
    const docRef = doc(db, "users", uid, "tasks", taskId);

    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...(snapshot.data() as Omit<Task, "id">),
    };
  } catch (error) {
    console.error("Error getting task:", error);
    throw error;
  }
}

/**
 * Update Task
 */
export async function updateTask(
  uid: string,
  taskId: string,
  data: Partial<Task>
) {
  try {
    const docRef = doc(db, "users", uid, "tasks", taskId);

    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

/**
 * Toggle Completion
 */
export async function toggleTaskCompletion(
  uid: string,
  taskId: string,
  completed: boolean
) {
  try {
    const docRef = doc(db, "users", uid, "tasks", taskId);

    await updateDoc(docRef, {
      completed,
      completedAt: completed ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating completion:", error);
    throw error;
  }
}

/**
 * Reorder Task
 */
export async function reorderTask(
  uid: string,
  taskId: string,
  order: number
) {
  try {
    const docRef = doc(db, "users", uid, "tasks", taskId);

    await updateDoc(docRef, {
      order,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error reordering task:", error);
    throw error;
  }
}

/**
 * Delete Task
 */
export async function deleteTask(
  uid: string,
  taskId: string
) {
  try {
    const docRef = doc(db, "users", uid, "tasks", taskId);

    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}