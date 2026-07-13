import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export type Goal = {
  id: string;
  title: string;
  description: string;
  pillarId: string;
  progress: number;
  status: "active" | "completed";
  targetDate: string;
};

export async function createGoal(
  uid: string,
  goal: Omit<Goal, "id">
) {
  await addDoc(collection(db, "users", uid, "goals"), {
    ...goal,
    createdAt: serverTimestamp(),
  });
}

export async function updateGoal(
  uid: string,
  goalId: string,
  data: Partial<Goal>
) {
  await updateDoc(
    doc(db, "users", uid, "goals", goalId),
    data
  );
}

export async function deleteGoal(
  uid: string,
  goalId: string
) {
  await deleteDoc(
    doc(db, "users", uid, "goals", goalId)
  );
}

export function subscribeGoals(
  uid: string,
  callback: (goals: Goal[]) => void
) {
  return onSnapshot(
    collection(db, "users", uid, "goals"),
    (snapshot) => {
      const goals = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Goal, "id">),
      }));

      callback(goals);
    }
  );
}