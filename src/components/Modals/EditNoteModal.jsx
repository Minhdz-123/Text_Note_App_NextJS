"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import NoteEditor from "../features/notes/NoteEditor";
import ShareModal from "./ShareModal";
import { useNoteShare } from "@/src/hooks/useNoteShare";
import { NOTE_PROPERTIES } from "@/src/utils/Constants";
import BaseModal from "../Commons/BaseModal";
import IconButton from "../Commons/IconButton";
import { iconMap } from "@/src/utils/Icon";

const EditNoteModal = ({ isOpen, onClose, note, onSave, onAction }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [showShareModal, setShowShareModal] = useState(false);
  const { updateSharedNote } = useNoteShare();
  
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
            />
          </div>
        </div>
      }
      className="w-150 p-0 overflow-hidden"
      showFooter={false}
      bodyClassName=""
    >
      {isOpen && note && (
        <NoteEditor
          key={note?.id}
          initialTitle={note?.title}
          initialContent={note?.content}
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
        <ShareModal 
          note={note}
          ownerUid={userInfo?.uid}
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
