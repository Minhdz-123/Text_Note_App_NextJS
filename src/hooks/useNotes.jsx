import { useSelector, useDispatch } from "react-redux";
import { NOTE_PROPERTIES } from "@/src/utils/Constants";
import {
  addNote,
  editNote,
  changeNoteColor,
  archiveNote,
  restoreNote,
  moveToTrash,
  restoreFromTrash,
  changeNoteFormat,
  deleteNote,
  addLabelToNote,
  removeLabelFromNote,
  reorderNotes as reorderNotesAction
} from "@/src/redux/noteSlice";

export default function useNotes() {
  const dispatch = useDispatch();
  
  const notes = useSelector((state) => state.note.notes);
  const archived = useSelector((state) => state.note.archived);
  const trash = useSelector((state) => state.note.trash);

  const handleAddNote = (noteData) => dispatch(addNote(noteData));
  const handleEditNote = (updatedNote) => dispatch(editNote(updatedNote));
  const handleChangeNoteColor = (noteId, color) => dispatch(changeNoteColor({ noteId, colorClass: color.colorClass }));
  const handleArchiveNote = (noteId) => dispatch(archiveNote(noteId));
  const handleRestoreNote = (noteId) => dispatch(restoreNote(noteId));
  const handleMoveToTrash = (noteId) => dispatch(moveToTrash(noteId));
  const handleRestoreFromTrash = (noteId) => dispatch(restoreFromTrash(noteId));
  const handleChangeNoteFormat = (noteId, formatType) => dispatch(changeNoteFormat({ noteId, formatType }));
  const handleDeleteNote = (noteId) => dispatch(deleteNote(noteId));
  const handleAddLabelToNote = (noteId, labelId) => dispatch(addLabelToNote({ noteId, labelId }));
  const handleRemoveLabelFromNote = (noteId, labelId) => dispatch(removeLabelFromNote({ noteId, labelId }));
  
  const getNotesByLabel = (labelId) => {
    return notes.filter((n) => (n[NOTE_PROPERTIES.LABELS] || []).includes(labelId));
  };
  
  const handleReorderNotes = (newOrder) => dispatch(reorderNotesAction(newOrder));

  return {
    notes,
    archived,
    trash,
    addNote: handleAddNote,
    editNote: handleEditNote,
    changeNoteColor: handleChangeNoteColor,
    changeNoteFormat: handleChangeNoteFormat,
    archiveNote: handleArchiveNote,
    restoreNote: handleRestoreNote,
    moveToTrash: handleMoveToTrash,
    restoreFromTrash: handleRestoreFromTrash,
    deleteNote: handleDeleteNote,
    addLabelToNote: handleAddLabelToNote,
    removeLabelFromNote: handleRemoveLabelFromNote,
    getNotesByLabel,
    reorderNotes: handleReorderNotes,
  };
}
