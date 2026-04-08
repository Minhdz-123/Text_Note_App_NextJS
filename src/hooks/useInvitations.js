"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { INVITATION_TEXT, COLLAB_TEXT } from "@/src/utils/Constants";
import { useNoteShare } from "./useNoteShare";

export const useInvitations = (userEmail) => {
  const [invitations, setInvitations] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const [respondLoading, setRespondLoading] = useState(false);
  const { enableShare } = useNoteShare();

  useEffect(() => {
    if (!userEmail) {
      setInvitations([]);
      setFetching(false);
      return;
    }

    const q = query(
      collection(db, "invitations"),
      where("receiverEmail", "==", userEmail),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const invites = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setInvitations(invites);
      setFetching(false);
    });

    return () => unsubscribe();
  }, [userEmail]);

  const sendInvite = async (receiverEmail, sender, note) => {
    if (!sender?.email || !receiverEmail) return;
    if (sender.email === receiverEmail) {
      throw new Error(INVITATION_TEXT.ERROR_SELF);
    }

    setSendLoading(true);
    try {

      const duplicateQuery = query(
        collection(db, "invitations"),
        where("senderEmail", "==", sender.email),
        where("receiverEmail", "==", receiverEmail),
        where("noteId", "==", note.id),
        where("status", "==", "pending")
      );
      const duplicateSnapshot = await getDocs(duplicateQuery);

      if (!duplicateSnapshot.empty) {
        throw new Error(INVITATION_TEXT.ERROR_ALREADY_INVITED);
      }

      const shareId = note.shareId || (await enableShare(sender.uid, note));

      await addDoc(collection(db, "invitations"), {
        senderUid: sender.uid,
        senderEmail: sender.email,
        senderName: sender.displayName || COLLAB_TEXT.DEFAULT_USER_NAME,
        receiverEmail,
        noteId: note.id,
        noteTitle: note.title || "",
        shareId,
        status: "pending",
        createdAt: Date.now(),
      });

      const shareRef = doc(db, "sharedNotes", shareId);
      await updateDoc(shareRef, {
        allowedEmails: arrayUnion(receiverEmail),
      }).catch(() => {});

      return shareId;
    } finally {
      setSendLoading(false);
    }
  };

  const respondToInvite = async (inviteId, action) => {
    setRespondLoading(true);
    try {
      const inviteRef = doc(db, "invitations", inviteId);
      await updateDoc(inviteRef, {
        status: action,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setRespondLoading(false);
    }
  };

  return {
    invitations,
    fetching,
    sendLoading,
    respondLoading,
    sendInvite,
    respondToInvite,
  };
};
