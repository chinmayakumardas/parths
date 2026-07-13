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

export type Habit = {
  id: string;
  title: string;
  pillarId: string;
  frequency: "daily" | "weekly";
  streak: number;
  active: boolean;
};

export async function createHabit(
  uid: string,
  habit: Omit<Habit, "id">
) {
  await addDoc(collection(db, "users", uid, "habits"), {
    ...habit,
    createdAt: serverTimestamp(),
  });
}

export async function updateHabit(
  uid: string,
  habitId: string,
  data: Partial<Habit>
) {
  await updateDoc(
    doc(db, "users", uid, "habits", habitId),
    data
  );
}

export async function deleteHabit(
  uid: string,
  habitId: string
) {
  await deleteDoc(
    doc(db, "users", uid, "habits", habitId)
  );
}

export function subscribeHabits(
  uid: string,
  callback: (habits: Habit[]) => void
) {
  return onSnapshot(
    collection(db, "users", uid, "habits"),
    (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Habit, "id">),
        }))
      );
    }
  );
}