"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NoteEditorCollab from "@/src/components/features/notes/NoteEditorCollab";
import InviteShareModal from "@/src/components/Modals/InviteShareModal";
import { editNote } from "@/src/redux/noteSlice";
import { useNoteShare } from "@/src/hooks/useNoteShare";
import { NOTE_PROPERTIES } from "@/src/utils/Constants";
import IconButton from "@/src/components/Commons/IconButton";
import { iconMap } from "@/src/utils/Icon";
import { db } from "@/src/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function TestCollaborationPage() {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.note.notes);
  const user = useSelector((state) => state.user.userInfo);
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id || null);
  const [showShareModal, setShowShareModal] = useState(false);
  const selectedNote = notes.find((n) => n.id === selectedNoteId);
  const { updateSharedNote } = useNoteShare();

  useEffect(() => {
    if (!selectedNote?.shareId) return;

    const unsubscribe = onSnapshot(doc(db, "sharedNotes", selectedNote.shareId), (docSnap) => {
      if (docSnap.exists()) {
        const remoteData = docSnap.data();
        if (remoteData.updatedAt > (selectedNote.updatedAt || 0) && remoteData.lastEditorUid !== user?.uid) {
           dispatch(editNote({ 
             ...selectedNote, 
             title: remoteData.title, 
             content: remoteData.content, 
             yjsSnapshot: remoteData.yjsSnapshot,
             updatedAt: remoteData.updatedAt 
           }));
        }
      }
    });

    return () => unsubscribe();
  }, [selectedNote?.shareId, selectedNote?.id, dispatch, user?.uid]);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-4xl mx-auto pt-8">


        <div className="flex flex-col gap-8">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`
                  shrink-0 w-48 p-4 rounded-xl border transition-all duration-200 text-left
                  ${selectedNoteId === note.id
                    ? "border-amber-400 bg-amber-50/50 dark:bg-amber-900/10 shadow-md transform -translate-y-1"
                    : "border-gray-200 dark:border-white/5 bg-white dark:bg-[#2c2d30] hover:border-gray-300 dark:hover:border-white/20"
                  }
                `}
              >
                <h3 className="text-sm font-medium text-[#202124] dark:text-[#e8eaed] truncate mb-1">
                  {note.title || ""}
                </h3>
                <div
                  className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: note.content || "<i></i>",
                  }}
                />
              </button>
            ))}
            {notes.length === 0 && (
              <div className="text-sm text-gray-400 italic py-4"></div>
            )}
          </div>

          <main className="relative">
            {selectedNote ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Editing:
                    </span>
                    <span className="text-sm text-gray-400 font-mono">
                      {selectedNote.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconButton
                      icon={iconMap.share}
                      title="Lấy link chia sẻ"
                      className="hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-600"
                      onClick={() => setShowShareModal(true)}
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-[#202124] rounded-2xl shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_2px_6px_2px_rgba(60,64,67,0.15)] border border-transparent dark:border-[#5f6368] overflow-hidden">
                  <NoteEditorCollab
                    key={selectedNote.id}
                    noteId={selectedNote.shareId || selectedNote.id}
                    ownerUid={user?.uid}
                    initialTitle={selectedNote.title}
                    initialContent={selectedNote.content}
                    initialYjsSnapshot={selectedNote.yjsSnapshot}
                    initialColorClass={
                      selectedNote[NOTE_PROPERTIES.COLOR_CLASS]
                    }
                    onSave={(updatedData) => {
                      dispatch(editNote({ ...selectedNote, ...updatedData }));
                      if (selectedNote.shareId) {
                        updateSharedNote(selectedNote.shareId, {
                          ...updatedData,
                          lastEditorUid: user?.uid,
                          updatedAt: Date.now(),
                        });
                      }
                    }}
                    onCancel={() => setSelectedNoteId(null)}
                  />
                </div>
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl bg-gray-50/50 dark:bg-white/5">
                <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-full mb-4">
                  <IconButton icon={iconMap.plus} className="text-gray-400" />
                </div>
                <p className="text-[#5f6368] dark:text-gray-400 font-medium">

                </p>
              </div>
            )}
          </main>
        </div>

        {selectedNote && showShareModal && (
          <InviteShareModal
            note={selectedNote}
            ownerUid={user?.uid}
            currentUser={user}
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            onUpdateNote={(updatedNote) => {
              dispatch(editNote(updatedNote));
            }}
          />
        )}
      </div>
    </div>
  );
}
