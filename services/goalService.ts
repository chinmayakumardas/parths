// src/services/goalService.ts

import { db } from "@/lib/firebase";
import { Goal } from "@/types/goal";

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
 * Get the user's goal collection
 */
const goalCollection = (uid: string) =>
  collection(db, "users", uid, "goals");

/**
 * Add Goal
 */
export async function addGoal(
  uid: string,
  goal: Omit<Goal, "id" | "createdAt" | "updatedAt">
) {
  try {
    const docRef = await addDoc(goalCollection(uid), {
      ...goal,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding goal:", error);
    throw error;
  }
}

/**
 * Get All Goals
 */
export async function getGoals(uid: string): Promise<Goal[]> {
  try {
    const q = query(goalCollection(uid), orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Goal, "id">),
    }));
  } catch (error) {
    console.error("Error fetching goals:", error);
    throw error;
  }
}

/**
 * Get Single Goal
 */
export async function getGoal(
  uid: string,
  goalId: string
): Promise<Goal | null> {
  try {
    const docRef = doc(db, "users", uid, "goals", goalId);

    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...(snapshot.data() as Omit<Goal, "id">),
    };
  } catch (error) {
    console.error("Error getting goal:", error);
    throw error;
  }
}

/**
 * Update Goal
 */
export async function updateGoal(
  uid: string,
  goalId: string,
  data: Partial<Goal>
) {
  try {
    const docRef = doc(db, "users", uid, "goals", goalId);

    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating goal:", error);
    throw error;
  }
}

/**
 * Update Progress
 */
export async function updateGoalProgress(
  uid: string,
  goalId: string,
  progress: number
) {
  try {
    const docRef = doc(db, "users", uid, "goals", goalId);

    await updateDoc(docRef, {
      progress,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating goal progress:", error);
    throw error;
  }
}

/**
 * Change Goal Status
 */
export async function updateGoalStatus(
  uid: string,
  goalId: string,
  status: Goal["status"]
) {
  try {
    const docRef = doc(db, "users", uid, "goals", goalId);

    await updateDoc(docRef, {
      status,
      completedAt: status === "completed" ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating goal status:", error);
    throw error;
  }
}

/**
 * Complete Goal
 */
export async function completeGoal(
  uid: string,
  goalId: string
) {
  try {
    const docRef = doc(db, "users", uid, "goals", goalId);

    await updateDoc(docRef, {
      progress: 100,
      status: "completed",
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error completing goal:", error);
    throw error;
  }
}

/**
 * Delete Goal
 */
export async function deleteGoal(
  uid: string,
  goalId: string
) {
  try {
    const docRef = doc(db, "users", uid, "goals", goalId);

    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting goal:", error);
    throw error;
  }
}