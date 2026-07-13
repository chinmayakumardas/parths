"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";

type Pillar = {
  id: string;
  name: string;
  color: string;
  order: number;
  active: boolean;
};

export default function PillarsPage() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "users", user.uid, "pillars"),
        orderBy("order")
      );

      const snapshot = await getDocs(q);

      const data: Pillar[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Pillar, "id">),
      }));

      setPillars(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto p-8">
        <p>Loading pillars...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Pillars</h1>
        <p className="text-muted-foreground">
          These are the core areas of your life.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {pillars.map((pillar) => (
          <Card key={pillar.id}>
            <CardContent className="flex items-center justify-between p-5">

              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: pillar.color }}
                />

                <div>
                  <h2 className="font-semibold">
                    {pillar.name}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {pillar.active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

    </main>
  );
}