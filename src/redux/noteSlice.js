import { createSlice } from "@reduxjs/toolkit";
import { NOTE_PROPERTIES, HEADING_TYPES } from "@/src/utils/Constants";

const getInitialState = () => {
  if (typeof window === "undefined") {
    return { notes: [], archived: [], trash: [], labels: [] };
  }
  try {
    const notes = JSON.parse(window.localStorage.getItem("keep_notes")) || [];
    const archived =
      JSON.parse(window.localStorage.getItem("keep_archived")) || [];
    const trash = JSON.parse(window.localStorage.getItem("keep_trash")) || [];
    const labels = JSON.parse(window.localStorage.getItem("keep_labels")) || [];
    return { notes, archived, trash, labels };
  } catch (e) {
    return { notes: [], archived: [], trash: [], labels: [] };
  }
};

const initialState = getInitialState();

const deduplicate = (arr) => {
  const seen = new Set();
  return arr.filter((item) => {
    if (!item || !item.id) return false;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    addNote: (state, action) => {
      const data =
        typeof action.payload === "string"
          ? { content: action.payload }
          : action.payload;
      const newNote = { id: Date.now(), ...data };
      state.notes.unshift(newNote);
    },
    editNote: (state, action) => {
      const updatedNote = action.payload;
      const indexInNotes = state.notes.findIndex(
        (n) => n.id === updatedNote.id,
      );
      if (indexInNotes !== -1) {
        state.notes[indexInNotes] = updatedNote;
        return;
      }
      const indexInArchived = state.archived.findIndex(
        (n) => n.id === updatedNote.id,
      );
      if (indexInArchived !== -1) {
        state.archived[indexInArchived] = updatedNote;
        return;
      }
      const indexInTrash = state.trash.findIndex(
        (n) => n.id === updatedNote.id,
      );
      if (indexInTrash !== -1) {
        state.trash[indexInTrash] = updatedNote;
      }
    },
    changeNoteColor: (state, action) => {
      const { noteId, colorClass } = action.payload;
      const updateColor = (arr) => {
        const index = arr.findIndex((n) => n.id === noteId);
        if (index !== -1) {
          arr[index][NOTE_PROPERTIES.COLOR_CLASS] = colorClass;
          return true;
        }
        return false;
      };
      if (!updateColor(state.notes)) {
        if (!updateColor(state.archived)) {
          updateColor(state.trash);
        }
      }
    },
    archiveNote: (state, action) => {
      const noteId = action.payload;
      const index = state.notes.findIndex((n) => n.id === noteId);
      if (index !== -1) {
        const [note] = state.notes.splice(index, 1);
        if (!state.archived.some((n) => n.id === noteId)) {
          state.archived.unshift(note);
        }
      }
    },
    restoreNote: (state, action) => {
      const noteId = action.payload;
      const index = state.archived.findIndex((n) => n.id === noteId);
      if (index !== -1) {
        const [note] = state.archived.splice(index, 1);
        if (!state.notes.some((n) => n.id === noteId)) {
          state.notes.unshift(note);
        }
      }
    },
    moveToTrash: (state, action) => {
      const noteId = action.payload;
      let note;
      const indexInNotes = state.notes.findIndex((n) => n.id === noteId);
      if (indexInNotes !== -1) {
        [note] = state.notes.splice(indexInNotes, 1);
      } else {
        const indexInArchived = state.archived.findIndex(
          (n) => n.id === noteId,
        );
        if (indexInArchived !== -1) {
          [note] = state.archived.splice(indexInArchived, 1);
        }
      }
      if (note && !state.trash.some((n) => n.id === noteId)) {
        state.trash.unshift(note);
      }
    },
    restoreFromTrash: (state, action) => {
      const noteId = action.payload;
      const index = state.trash.findIndex((n) => n.id === noteId);
      if (index !== -1) {
        const [note] = state.trash.splice(index, 1);
        if (!state.notes.some((n) => n.id === noteId)) {
          state.notes.unshift(note);
        }
      }
    },
    changeNoteFormat: (state, action) => {
      const { noteId, formatType } = action.payload;
      const updateFormat = (arr) => {
        const index = arr.findIndex((n) => n.id === noteId);
        if (index !== -1) {
          const note = arr[index];
          if (!note[NOTE_PROPERTIES.FORMATS])
            note[NOTE_PROPERTIES.FORMATS] = [];
          const isHeading = HEADING_TYPES.includes(formatType);

          if (formatType === "default") {
            note[NOTE_PROPERTIES.FORMATS] = [];
          } else if (note[NOTE_PROPERTIES.FORMATS].includes(formatType)) {
            note[NOTE_PROPERTIES.FORMATS] = note[
              NOTE_PROPERTIES.FORMATS
            ].filter((f) => f !== formatType);
          } else {
            let newFormats = [...note[NOTE_PROPERTIES.FORMATS]];
            if (isHeading) {
              newFormats = newFormats.filter((f) => !HEADING_TYPES.includes(f));
            }
            newFormats.push(formatType);
            note[NOTE_PROPERTIES.FORMATS] = newFormats;
          }
          return true;
        }
        return false;
      };

      if (!updateFormat(state.notes)) {
        if (!updateFormat(state.archived)) {
          updateFormat(state.trash);
        }
      }
    },
    deleteNote: (state, action) => {
      const noteId = action.payload;
      state.trash = state.trash.filter((n) => n.id !== noteId);
    },
    addLabelToNote: (state, action) => {
      const { noteId, labelId } = action.payload;
      const addLabel = (arr) => {
        const index = arr.findIndex((n) => n.id === noteId);
        if (index !== -1) {
          const note = arr[index];
          if (!note[NOTE_PROPERTIES.LABELS]) note[NOTE_PROPERTIES.LABELS] = [];
          if (!note[NOTE_PROPERTIES.LABELS].includes(labelId)) {
            note[NOTE_PROPERTIES.LABELS].push(labelId);
          }
          return true;
        }
        return false;
      };
      if (!addLabel(state.notes)) {
        if (!addLabel(state.archived)) {
          addLabel(state.trash);
        }
      }
    },
    removeLabelFromNote: (state, action) => {
      const { noteId, labelId } = action.payload;
      const removeLabel = (arr) => {
        const index = arr.findIndex((n) => n.id === noteId);
        if (index !== -1) {
          const note = arr[index];
          if (note[NOTE_PROPERTIES.LABELS]) {
            note[NOTE_PROPERTIES.LABELS] = note[NOTE_PROPERTIES.LABELS].filter(
              (l) => l !== labelId,
            );
          }
          return true;
        }
        return false;
      };
      if (!removeLabel(state.notes)) {
        if (!removeLabel(state.archived)) {
          removeLabel(state.trash);
        }
      }
    },
    reorderNotes: (state, action) => {
      state.notes = action.payload;
    },
    mergeLabels: (state, action) => {
      const { oldLabelId, newLabelId } = action.payload;

      const replaceLabel = (arr) => {
        arr.forEach((note) => {
          if (note[NOTE_PROPERTIES.LABELS]?.includes(oldLabelId)) {
            note[NOTE_PROPERTIES.LABELS] = note[NOTE_PROPERTIES.LABELS].filter(
              (l) => l !== oldLabelId,
            );
            if (!note[NOTE_PROPERTIES.LABELS].includes(newLabelId)) {
              note[NOTE_PROPERTIES.LABELS].push(newLabelId);
            }
          }
        });
      };

      replaceLabel(state.notes);
      replaceLabel(state.archived);
      replaceLabel(state.trash);

      state.labels = state.labels.filter((l) => l.id !== oldLabelId);
    },
    setLabels: (state, action) => {
      state.labels = action.payload;
    },
    cleanDuplicateData: (state) => {
      state.notes = deduplicate(state.notes);
      state.archived = deduplicate(state.archived);
      state.trash = deduplicate(state.trash);
    },
    setAllData: (state, action) => {
      const { notes, archived, trash, labels } = action.payload;
      if (notes) state.notes = notes;
      if (archived) state.archived = archived;
      if (trash) state.trash = trash;
      if (labels) state.labels = labels;
    },
  },
});

export const {
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
  reorderNotes,
  mergeLabels,
  setLabels,
  cleanDuplicateData,
  setAllData,
} = noteSlice.actions;

export default noteSlice.reducer;
