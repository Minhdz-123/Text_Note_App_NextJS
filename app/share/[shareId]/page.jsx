"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useNoteShare } from "@/src/hooks/useNoteShare";
import NoteEditorCollab from "@/src/components/features/notes/NoteEditorCollab";
import { useVisitedShares } from "@/src/hooks/useVisitedShares";
import { db } from "@/src/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function SharedNotePage() {
  const { shareId } = useParams();
  const router = useRouter();
  const user = useSelector((state) => state.user?.userInfo);
  const { getSharedNote, updateSharedNote } = useNoteShare();
  const [noteData, setNoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { recordVisit } = useVisitedShares();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !shareId) return;

    let unsubscribe = () => {};

    const loadNote = async () => {
      const data = await getSharedNote(shareId);
      if (data) {
        setNoteData(data);
        setLoading(false);

        unsubscribe = onSnapshot(doc(db, "sharedNotes", shareId), (docSnap) => {
          if (docSnap.exists()) {
            setNoteData(docSnap.data());
          } else {
            setError(true);
          }
        });
      } else {
        setError("Không tìm thấy ghi chú.");
        setLoading(false);
      }
    };

    loadNote();
    return () => unsubscribe();
  }, [shareId, mounted]);

  useEffect(() => {
    if (!noteData || !shareId || !user?.uid) return;

    const timer = setTimeout(() => {
      recordVisit(shareId, {
        noteId: noteData.noteId,
        title: noteData.title,
        colorClass: noteData.colorClass,
        ownerUid: noteData.ownerUid
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [shareId, noteData, user?.uid, recordVisit]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#202124]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Đang tải</p>
      </div>
    );
  }

  if (error || !noteData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#202124] p-4 text-center">
        <div className="w-24 h-24 text-gray-200 dark:text-gray-800 mb-6"></div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Không tìm thấy ghi chú
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          {error || "Liên kết này đã hết hạn "}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#171717] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-3"></div>
        
        </div>

        <NoteEditorCollab
          noteId={shareId}
          ownerUid={noteData.ownerUid}
          initialTitle={noteData.title}
          initialContent={noteData.content}
          initialYjsSnapshot={noteData.yjsSnapshot}
          initialColorClass={noteData.colorClass}
          onSave={({ title, content, yjsSnapshot, colorClass }) => {
            updateSharedNote(shareId, {
              title,
              content,
              yjsSnapshot,
              colorClass,
              lastEditorUid: user?.uid || "anonymous_guest",
            });
          }}
          onCancel={() => router.push("/")}
        />
      </div>
    </div>
  );
}
