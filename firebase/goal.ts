import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import { Goal } from "@/types/goal";

const goalRef = collection(db, "goals");

// Get all goals
export async function getGoals(): Promise<Goal[]> {
  const q = query(goalRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Goal[];
}

// Create goal
export async function createGoal(
  data: Pick<Goal, "title" | "description">
) {
  await addDoc(goalRef, {
    title: data.title,
    description: data.description || "",
    progress: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// Update goal
export async function updateGoal(
  id: string,
  data: Partial<Goal>
) {
  await updateDoc(doc(db, "goals", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete goal
export async function deleteGoal(id: string) {
  await deleteDoc(doc(db, "goals", id));
}