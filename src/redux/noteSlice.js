import { createSlice } from "@reduxjs/toolkit";
import { NOTE_PROPERTIES, HEADING_TYPES } from "@/src/utils/Constants";

const getInitialState = () => {
  return { notes: [], archived: [], trash: [], labels: [], lastUpdated: 0, syncStatus: "synced" };
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
      const newNote = { id: Date.now(), ...data, updatedAt: Date.now() };
      state.notes.unshift(newNote);
      state.lastUpdated = Date.now();
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
      state.lastUpdated = Date.now();
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
      state.lastUpdated = Date.now();
    },
    archiveNote: (state, action) => {
      const noteId = action.payload;
      const index = state.notes.findIndex((n) => n.id === noteId);
      if (index !== -1) {
        const [note] = state.notes.splice(index, 1);
        if (!state.archived.some((n) => n.id === noteId)) {
          state.archived.unshift(note);
        }
        state.lastUpdated = Date.now();
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
        state.lastUpdated = Date.now();
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
      state.lastUpdated = Date.now();
    },
    restoreFromTrash: (state, action) => {
      const noteId = action.payload;
      const index = state.trash.findIndex((n) => n.id === noteId);
      if (index !== -1) {
        const [note] = state.trash.splice(index, 1);
        if (!state.notes.some((n) => n.id === noteId)) {
          state.notes.unshift(note);
        }
        state.lastUpdated = Date.now();
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
      state.lastUpdated = Date.now();
    },
    deleteNote: (state, action) => {
      const noteId = action.payload;
      state.trash = state.trash.filter((n) => n.id !== noteId);
      state.lastUpdated = Date.now();
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
      state.lastUpdated = Date.now();
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
      state.lastUpdated = Date.now();
    },
    reorderNotes: (state, action) => {
      state.notes = action.payload;
      state.lastUpdated = Date.now();
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
      state.lastUpdated = Date.now();
    },
    setLabels: (state, action) => {
      state.labels = action.payload;
      state.lastUpdated = Date.now();
    },
    cleanDuplicateData: (state) => {
      state.notes = deduplicate(state.notes);
      state.archived = deduplicate(state.archived);
      state.trash = deduplicate(state.trash);
      state.lastUpdated = Date.now();
    },
    setAllData: (state, action) => {
      const { notes, archived, trash, labels, lastUpdated } = action.payload;
      if (notes) state.notes = notes;
      if (archived) state.archived = archived;
      if (trash) state.trash = trash;
      if (labels) state.labels = labels;
      if (lastUpdated) state.lastUpdated = lastUpdated;
    },
    setSyncStatus: (state, action) => {
      state.syncStatus = action.payload;
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
  setSyncStatus,
} = noteSlice.actions;

export default noteSlice.reducer;
