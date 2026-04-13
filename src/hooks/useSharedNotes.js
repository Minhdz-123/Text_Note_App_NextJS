"use client";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export const useSharedNotes = (userEmail) => {
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) {
      setSharedNotes([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "sharedNotes"),
      where("allowedEmails", "array-contains", userEmail)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map((d) => ({
        id: d.id,
        isShared: true,
        ...d.data(),
      }));
      setSharedNotes(notes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userEmail]);

  return { sharedNotes, loading };
};
