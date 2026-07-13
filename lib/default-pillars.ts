import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  writeBatch,
} from "firebase/firestore";

export async function createDefaultPillars(uid: string) {
  const batch = writeBatch(db);

  const pillars = [
    {
      id: "health",
      name: "Health",
      color: "#22C55E",
      order: 1,
    },
    {
      id: "career",
      name: "Career",
      color: "#3B82F6",
      order: 2,
    },
    {
      id: "finance",
      name: "Finance",
      color: "#EAB308",
      order: 3,
    },
    {
      id: "relationships",
      name: "Relationships",
      color: "#EC4899",
      order: 4,
    },
    {
      id: "learning",
      name: "Learning",
      color: "#8B5CF6",
      order: 5,
    },
  ];

  for (const pillar of pillars) {
    batch.set(
      doc(collection(db, "users", uid, "pillars"), pillar.id),
      {
        name: pillar.name,
        color: pillar.color,
        order: pillar.order,
        active: true,
      }
    );
  }

  await batch.commit();
}