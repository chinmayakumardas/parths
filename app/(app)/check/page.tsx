"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  Checkin,
  createCheckin,
  updateCheckin,
  deleteCheckin,
  subscribeCheckins,
} from "@/lib/checkins";

import CheckinForm from "@/components/checkins/checkin-form";
import CheckinCard from "@/components/checkins/checkin-card";

export default function CheckinsPage() {
  const [uid, setUid] = useState("");
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [editing, setEditing] = useState<Checkin | null>(null);

  useEffect(() => {
    let unsubCheckins: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      setUid(user.uid);

      unsubCheckins = subscribeCheckins(
        user.uid,
        setCheckins
      );
    });

    return () => {
      unsubAuth();
      if (unsubCheckins) unsubCheckins();
    };
  }, []);

  if (!uid) {
    return (
      <main className="p-8">
        Loading...
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8 space-y-8">

      <h1 className="text-3xl font-bold">
        Daily Check-ins
      </h1>

      <CheckinForm
        initialData={editing ?? undefined}
        onCancel={() => setEditing(null)}
        onSave={async (data) => {
          if (editing) {
            await updateCheckin(
              uid,
              editing.id,
              data
            );
            setEditing(null);
          } else {
            await createCheckin(uid, data);
          }
        }}
      />

      <div className="space-y-4">

        {checkins.length === 0 && (
          <p>No check-ins yet.</p>
        )}

        {checkins.map((checkin) => (
          <CheckinCard
            key={checkin.id}
            checkin={checkin}
            onEdit={setEditing}
            onDelete={async (id) => {
              await deleteCheckin(uid, id);
            }}
          />
        ))}

      </div>

    </main>
  );
}