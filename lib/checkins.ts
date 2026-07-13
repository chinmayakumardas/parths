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

export type Checkin = {
  id: string;
  date: string;
  mood: string;
  note: string;

  health: number;
  career: number;
  finance: number;
  learning: number;
  relationships: number;
};

export async function createCheckin(
  uid: string,
  checkin: Omit<Checkin, "id">
) {
  await addDoc(collection(db, "users", uid, "checkins"), {
    ...checkin,
    createdAt: serverTimestamp(),
  });
}

export async function updateCheckin(
  uid: string,
  id: string,
  data: Partial<Checkin>
) {
  await updateDoc(
    doc(db, "users", uid, "checkins", id),
    data
  );
}

export async function deleteCheckin(
  uid: string,
  id: string
) {
  await deleteDoc(
    doc(db, "users", uid, "checkins", id)
  );
}

export function subscribeCheckins(
  uid: string,
  callback: (checkins: Checkin[]) => void
) {
  return onSnapshot(
    collection(db, "users", uid, "checkins"),
    (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Checkin, "id">),
        }))
      );
    }
  );
}