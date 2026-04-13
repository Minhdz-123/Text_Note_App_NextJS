"use client";
import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useSelector } from "react-redux";

export const useVisitedShares = () => {
  const user = useSelector((state) => state.user.userInfo);
  const [visitedShares, setVisitedShares] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVisited = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setVisitedShares(data.visitedSharedNotes || []);
      }
    } catch (err) {
      console.error("useVisitedShares: Error fetching:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchVisited();
  }, [fetchVisited]);

  const recordVisit = async (shareId, metadata) => {
    if (!user?.uid || !shareId) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const currentVisited = userDoc.data()?.visitedSharedNotes || [];
      
      const existing = currentVisited.find(v => v.shareId === shareId);
      
      if (existing) {
        await updateDoc(userRef, {
          visitedSharedNotes: arrayRemove(existing)
        });
      }

      const newEntry = {
        shareId,
        ...metadata,
        visitedAt: Date.now()
      };

      await updateDoc(userRef, {
        visitedSharedNotes: arrayUnion(newEntry)
      });
      
      setVisitedShares(prev => {
        const filtered = prev.filter(v => v.shareId !== shareId);
        return [newEntry, ...filtered];
      });
    } catch (err) {
      console.error("useVisitedShares: Error recording:", err);
    }
  };

  const removeVisit = async (shareId) => {
    if (!user?.uid) return;
    try {
      const userRef = doc(db, "users", user.uid);
      const entryToRemove = visitedShares.find(v => v.shareId === shareId);
      if (entryToRemove) {
        await updateDoc(userRef, {
          visitedSharedNotes: arrayRemove(entryToRemove)
        });
        setVisitedShares(prev => prev.filter(v => v.shareId !== shareId));
      }
    } catch (err) {
      console.error("useVisitedShares: Error removing:", err);
    }
  };

  const cleanupDeadLinks = async (activeShareIds) => {
    if (!user?.uid || visitedShares.length === 0) return;
    
    try {
      const userRef = doc(db, "users", user.uid);
      const toRemove = [];

      for (const visit of visitedShares) {
        const docRef = doc(db, "sharedNotes", visit.shareId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          toRemove.push(visit);
        }
      }

      for (const entry of toRemove) {
        await updateDoc(userRef, {
          visitedSharedNotes: arrayRemove(entry)
        });
      }

      if (toRemove.length > 0) {
        setVisitedShares(prev => prev.filter(v => !toRemove.find(tr => tr.shareId === v.shareId)));
      }
    } catch (err) {
      console.error("useVisitedShares: Error cleaning up:", err);
    }
  };

  return { visitedShares, loading, recordVisit, removeVisit, cleanupDeadLinks };
};
