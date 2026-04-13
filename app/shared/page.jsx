"use client";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import NoteGrid from "@/src/components/features/notes/NoteGrid";
import { useSharedNotes } from "@/src/hooks/useSharedNotes";
import { useNoteShare } from "@/src/hooks/useNoteShare";
import { useVisitedShares } from "@/src/hooks/useVisitedShares";

export default function SharedNotesPage() {
  const router = useRouter();
  const user = useSelector((state) => state.user.userInfo);
  const { sharedNotes, loading: loadingInvited } = useSharedNotes(user?.email);
  const { visitedShares, loading: loadingVisited, cleanupDeadLinks, removeVisit } = useVisitedShares();
  const { leaveSharedNote } = useNoteShare();

  const mergedNotes = useMemo(() => {
    const map = new Map();
    
    sharedNotes.forEach(n => map.set(n.id, n));
    
    visitedShares.forEach(v => {
      if (!map.has(v.shareId)) {
        map.set(v.shareId, {
          id: v.shareId,
          title: v.title,
          colorClass: v.colorClass,
          ownerUid: v.ownerUid,
          isVisitedHistory: true
        });
      }
    });
    
    return Array.from(map.values());
  }, [sharedNotes, visitedShares]);

  useEffect(() => {
    if (!loadingInvited && !loadingVisited) {
      cleanupDeadLinks();
    }
  }, [loadingInvited, loadingVisited]);

  const handleAction = async (action, note) => {
    if (action === "edit_note") {
      router.push(`/share/${note.id}`);
    } else if (action === "move_to_trash" || action === "delete_permanently") {
      try {
        if (note.isVisitedHistory) {
          await removeVisit(note.id);
        } else {
          await leaveSharedNote(note.id, user?.email);
        }
      } catch (err) {
        console.error("Failed to remove/leave shared note:", err);
      }
    }
  };

  const loading = loadingInvited || loadingVisited;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
      </div>
    );
  }

  if (mergedNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 dark:text-gray-400">
        <p className="text-lg">Chưa có ghi chú nào được chia sẻ với bạn</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen p-4 gap-4">
      <h1 className="text-xl font-medium px-4 py-2 text-gray-700 dark:text-gray-300">
        Ghi chú được chia sẻ
      </h1>
      <NoteGrid 
        notes={mergedNotes} 
        showModal={false}
        noteActions={{
          onEdit: (note) => handleAction("edit_note", note),
          moveToTrash: (id) => {
            const note = mergedNotes.find(n => n.id === id);
            handleAction("move_to_trash", note);
          },
          archiveNote: () => {},
          changeNoteColor: () => {}, 
        }} 
      />
    </div>
  );
}
