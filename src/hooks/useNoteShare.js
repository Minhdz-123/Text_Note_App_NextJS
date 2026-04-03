"use client";

import { useState } from "react";
import { doc, setDoc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export const useNoteShare = () => {
  const [loading, setLoading] = useState(false);

  const generateShareId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const enableShare = async (ownerUid, note) => {
    setLoading(true);
    try {
      const shareId = note.shareId || generateShareId();
      const shareDocRef = doc(db, "sharedNotes", shareId);
      
      await setDoc(shareDocRef, {
        noteId: note.id,
        ownerUid: ownerUid || "anonymous",
        title: note.title || "",
        content: note.content || "",
        yjsSnapshot: note.yjsSnapshot || null,
        colorClass: note.colorClass || "bg-white",
        createdAt: Date.now(),
      });

      setLoading(false);
      return shareId;
    } catch (error) {
      console.error("Error enabling share:", error);
      setLoading(false);
      throw error;
    }
  };

  const disableShare = async (shareId) => {
    setLoading(true);
    try {
      const shareDocRef = doc(db, "sharedNotes", shareId);
      await deleteDoc(shareDocRef);
      setLoading(false);
    } catch (error) {
      console.error("Error disabling share:", error);
      setLoading(false);
      throw error;
    }
  };

  const getSharedNote = async (shareId) => {
    try {
      const shareDocRef = doc(db, "sharedNotes", shareId);
      const snap = await getDoc(shareDocRef);
      return snap.exists() ? snap.data() : null;
    } catch (error) {
      console.error("useNoteShare: Firestore error:", error);
      return null;
    }
  };

  const updateSharedNote = async (shareId, data) => {
    try {
      const shareDocRef = doc(db, "sharedNotes", shareId);
      const updateData = { updatedAt: Date.now() };
      if (data.title !== undefined) updateData.title = data.title;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.yjsSnapshot !== undefined) updateData.yjsSnapshot = data.yjsSnapshot;
      if (data.colorClass !== undefined) updateData.colorClass = data.colorClass;
      if (data.lastEditorUid !== undefined) updateData.lastEditorUid = data.lastEditorUid;
      
      await updateDoc(shareDocRef, updateData);
    } catch (error) {
      console.error("useNoteShare: Error updating shared note:", error);
    }
  };

  return { enableShare, disableShare, getSharedNote, updateSharedNote, loading };
};
