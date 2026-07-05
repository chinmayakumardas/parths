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
import { Task } from "@/types/task";
import { updateGoal } from "./goal";

/* ---------------- Get Tasks ---------------- */

export async function getTasks(goalId: string): Promise<Task[]> {
  const taskRef = collection(db, "goals", goalId, "tasks");

  const q = query(taskRef, orderBy("order", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Task[];
}

/* ---------------- Create Task ---------------- */

export async function createTask(
  goalId: string,
  data: Pick<Task, "title" | "order">
) {
  const taskRef = collection(db, "goals", goalId, "tasks");

  await addDoc(taskRef, {
    title: data.title,
    completed: false,
    order: data.order,
    note: "",
    dueDate: "",
    createdAt: serverTimestamp(),
  });

  await updateProgress(goalId);
}

/* ---------------- Update Task ---------------- */

export async function updateTask(
  goalId: string,
  taskId: string,
  data: Partial<Task>
) {
  const taskDoc = doc(db, "goals", goalId, "tasks", taskId);

  await updateDoc(taskDoc, data);

  await updateProgress(goalId);
}

/* ---------------- Delete Task ---------------- */

export async function deleteTask(
  goalId: string,
  taskId: string
) {
  const taskDoc = doc(db, "goals", goalId, "tasks", taskId);

  await deleteDoc(taskDoc);

  await updateProgress(goalId);
}

/* ---------------- Goal Progress ---------------- */

async function updateProgress(goalId: string) {
  const tasks = await getTasks(goalId);

  if (tasks.length === 0) {
    await updateGoal(goalId, { progress: 0 });
    return;
  }

  const completed = tasks.filter((task) => task.completed).length;

  const progress = Math.round(
    (completed / tasks.length) * 100
  );

  await updateGoal(goalId, { progress });
}