"use client";

import { useState } from "react";

export default function useNoteUI(actions = {}) {
  const {
    archiveNote,
    restoreNote,
    moveToTrash,
    addLabelToNote,
    removeLabelFromNote,
    restoreFromTrash,
    deleteNote,
    editNote,
  } = actions;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);

  const handleAction = (action, note, labelId = null) => {
    switch (action) {
      case "edit_note":
        setNoteToEdit(note);
        setEditModalOpen(true);
        break;
      case "move_to_storage":
        archiveNote(note.id);
        break;
      case "restore":
        restoreNote(note.id);
        break;
      case "move_to_trash":
        moveToTrash(note.id);
        break;
      case "add_label":
        addLabelToNote(note.id, labelId);
        break;
      case "remove_label":
        removeLabelFromNote(note.id, labelId);
        break;
      case "restore_from_trash":
        restoreFromTrash(note.id);
        break;
      case "delete_permanently":
        deleteNote(note.id);
        break;
      case "update_note":
        editNote(note);
        setNoteToEdit((prev) => (prev?.id === note.id ? note : prev));
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  return {
    editModalOpen,
    setEditModalOpen,
    noteToEdit,
    setNoteToEdit,
    handleAction,
  };
}
