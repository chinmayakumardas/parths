"use client";

import { useEffect, useState } from "react";
import {
  collectionGroup,
  onSnapshot,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { Task } from "@/types/task";

export function useToday() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collectionGroup(db, "tasks"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Task, "id">),
      }));

      // Filter for today's tasks later
      setTasks(allTasks);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    tasks,
    loading,
  };
}