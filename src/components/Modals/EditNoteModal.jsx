"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import NoteEditorCollab from "../features/notes/NoteEditorCollab";
import InviteShareModal from "./InviteShareModal";
import { useNoteShare } from "@/src/hooks/useNoteShare";
import { NOTE_PROPERTIES } from "@/src/utils/Constants";
import BaseModal from "../Commons/BaseModal";
import IconButton from "../Commons/IconButton";
import { iconMap } from "@/src/utils/Icon";
import { db } from "@/src/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const EditNoteModal = ({ isOpen, onClose, note, onSave, onAction }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [showShareModal, setShowShareModal] = useState(false);
  const { updateSharedNote } = useNoteShare();
  
  useEffect(() => {
    if (!note?.shareId || !isOpen) return;

    const unsubscribe = onSnapshot(doc(db, "sharedNotes", note.shareId), (docSnap) => {
      if (docSnap.exists()) {
        const remoteData = docSnap.data();
        if (
          remoteData.updatedAt > (note.updatedAt || 0) &&
          remoteData.lastEditorUid !== userInfo?.uid
        ) {
          if (onAction) {
            onAction("update_note", {
              ...note,
              title: remoteData.title,
              content: remoteData.content,
              yjsSnapshot: remoteData.yjsSnapshot,
              updatedAt: remoteData.updatedAt,
            });
          }
        }
      }
    });

    return () => unsubscribe();
  }, [note?.shareId, note?.id, isOpen, userInfo?.uid, onAction]);
  
  if (!isOpen || !note) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex justify-between items-center w-full pr-10">
          <div className="flex items-center gap-2">
            <IconButton 
              icon={iconMap.share} 
              onClick={() => setShowShareModal(true)} 
              size="w-8 h-8"
              title="Chia sẻ ghi chú"
              className={note.shareId ? "text-blue-500" : ""}
            />
          </div>
        </div>
      }
      className="w-150 p-0 overflow-hidden"
      showFooter={false}
      bodyClassName=""
    >
      {isOpen && note && (
        <NoteEditorCollab
          key={note?.id}
          noteId={note?.id}
          ownerUid={userInfo?.uid}
          initialTitle={note?.title}
          initialContent={note?.content}
          initialYjsSnapshot={note?.yjsSnapshot}
          initialColorClass={note?.[NOTE_PROPERTIES.COLOR_CLASS]}
          timestamp={note?.updatedAt || note?.createdAt}
          showTimestamp={true}
          onSave={(updatedData) => {
            if (onAction) onAction("update_note", { ...note, ...updatedData });
            if (note?.shareId && updateSharedNote) {
              updateSharedNote(note.shareId, { 
                ...updatedData, 
                lastEditorUid: userInfo?.uid,
                updatedAt: Date.now() 
              });
            }
          }}
          onCancel={onClose}
        />
      )}

      {showShareModal && (
        <InviteShareModal 
          note={note}
          ownerUid={userInfo?.uid}
          currentUser={userInfo}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onUpdateNote={(updatedNote) => {
            if (onAction) onAction("update_note", updatedNote);
          }}
        />
      )}
    </BaseModal>
  );
};

export default EditNoteModal;
