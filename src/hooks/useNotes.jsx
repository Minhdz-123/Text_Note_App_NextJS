import useLocalStorage from "./useLocalStorage";
import {
  HEADING_TYPES,
  STORAGE_KEYS,
  NOTE_PROPERTIES,
} from "@/src/utils/Constants";

export default function useNotes() {
  const [notes, setNotes] = useLocalStorage(STORAGE_KEYS.NOTES, []);
  const [archived, setArchived] = useLocalStorage(STORAGE_KEYS.ARCHIVED, []);
  const [trash, setTrash] = useLocalStorage(STORAGE_KEYS.TRASH, []);

  const addNote = (content, title = "") => {
    const newNote = { id: Date.now(), content, title };
    setNotes([newNote, ...notes]);
  };

  const editNote = (updatedNote) => {
    if (notes.some((n) => n.id === updatedNote.id)) {
      setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
    } else if (archived.some((n) => n.id === updatedNote.id)) {
      setArchived(
        archived.map((n) => (n.id === updatedNote.id ? updatedNote : n)),
      );
    } else if (trash.some((n) => n.id === updatedNote.id)) {
      setTrash(trash.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
    }
  };

  const changeNoteColor = (noteId, color) => {
    const noteInNotes = notes.find((n) => n.id === noteId);
    const noteInArchived = archived.find((n) => n.id === noteId);
    const noteInTrash = trash.find((n) => n.id === noteId);

    if (noteInNotes) {
      setNotes(
        notes.map((n) =>
          n.id === noteId
            ? { ...n, [NOTE_PROPERTIES.COLOR_CLASS]: color.colorClass }
            : n,
        ),
      );
    } else if (noteInArchived) {
      setArchived(
        archived.map((n) =>
          n.id === noteId
            ? { ...n, [NOTE_PROPERTIES.COLOR_CLASS]: color.colorClass }
            : n,
        ),
      );
    } else if (noteInTrash) {
      setTrash(
        trash.map((n) =>
          n.id === noteId
            ? { ...n, [NOTE_PROPERTIES.COLOR_CLASS]: color.colorClass }
            : n,
        ),
      );
    }
  };

  const archiveNote = (noteId) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    setNotes(notes.filter((n) => n.id !== noteId));
    setArchived([note, ...archived]);
  };

  const restoreNote = (noteId) => {
    const note = archived.find((n) => n.id === noteId);
    if (!note) return;
    setArchived(archived.filter((n) => n.id !== noteId));
    setNotes([note, ...notes]);
  };

  const moveToTrash = (noteId) => {
    let note = notes.find((n) => n.id === noteId);
    let isFromArchive = false;

    if (!note) {
      note = archived.find((n) => n.id === noteId);
      isFromArchive = true;
    }

    if (!note) return;

    if (isFromArchive) {
      setArchived(archived.filter((n) => n.id !== noteId));
    } else {
      setNotes(notes.filter((n) => n.id !== noteId));
    }

    setTrash([note, ...trash]);
  };

  const restoreFromTrash = (noteId) => {
    const note = trash.find((n) => n.id === noteId);
    if (!note) return;
    setTrash(trash.filter((n) => n.id !== noteId));
    setNotes([note, ...notes]);
  };

  const changeNoteFormat = (noteId, formatType) => {
    const updateFormats = (note) => {
      if (!note[NOTE_PROPERTIES.FORMATS]) note[NOTE_PROPERTIES.FORMATS] = [];
      const formatIndex = note[NOTE_PROPERTIES.FORMATS].indexOf(formatType);
      const isHeading = HEADING_TYPES.includes(formatType);

      if (formatType === "default") {
        return { ...note, [NOTE_PROPERTIES.FORMATS]: [] };
      }

      if (formatIndex > -1) {
        return {
          ...note,
          [NOTE_PROPERTIES.FORMATS]: note[NOTE_PROPERTIES.FORMATS].filter(
            (f) => f !== formatType,
          ),
        };
      } else {
        let newFormats = [...note[NOTE_PROPERTIES.FORMATS]];

        if (isHeading) {
          newFormats = newFormats.filter((f) => !HEADING_TYPES.includes(f));
        }

        return {
          ...note,
          [NOTE_PROPERTIES.FORMATS]: [...newFormats, formatType],
        };
      }
    };

    const noteInNotes = notes.find((n) => n.id === noteId);
    const noteInArchived = archived.find((n) => n.id === noteId);
    const noteInTrash = trash.find((n) => n.id === noteId);

    if (noteInNotes) {
      setNotes(notes.map((n) => (n.id === noteId ? updateFormats(n) : n)));
    } else if (noteInArchived) {
      setArchived(
        archived.map((n) => (n.id === noteId ? updateFormats(n) : n)),
      );
    } else if (noteInTrash) {
      setTrash(trash.map((n) => (n.id === noteId ? updateFormats(n) : n)));
    }
  };

  const deleteNote = (noteId) => {
    setTrash(trash.filter((n) => n.id !== noteId));
  };

  const addLabelToNote = (noteId, labelId) => {
    const updateNoteLabels = (note) => {
      const labels = note[NOTE_PROPERTIES.LABELS] || [];
      if (!labels.includes(labelId)) {
        return { ...note, [NOTE_PROPERTIES.LABELS]: [...labels, labelId] };
      }
      return note;
    };

    const noteInNotes = notes.find((n) => n.id === noteId);
    const noteInArchived = archived.find((n) => n.id === noteId);
    const noteInTrash = trash.find((n) => n.id === noteId);

    if (noteInNotes) {
      setNotes(notes.map((n) => (n.id === noteId ? updateNoteLabels(n) : n)));
    } else if (noteInArchived) {
      setArchived(
        archived.map((n) => (n.id === noteId ? updateNoteLabels(n) : n)),
      );
    } else if (noteInTrash) {
      setTrash(trash.map((n) => (n.id === noteId ? updateNoteLabels(n) : n)));
    }
  };

  const removeLabelFromNote = (noteId, labelId) => {
    const updateNoteLabels = (note) => {
      const labels = note[NOTE_PROPERTIES.LABELS] || [];
      return {
        ...note,
        [NOTE_PROPERTIES.LABELS]: labels.filter((l) => l !== labelId),
      };
    };

    const noteInNotes = notes.find((n) => n.id === noteId);
    const noteInArchived = archived.find((n) => n.id === noteId);
    const noteInTrash = trash.find((n) => n.id === noteId);

    if (noteInNotes) {
      setNotes(notes.map((n) => (n.id === noteId ? updateNoteLabels(n) : n)));
    } else if (noteInArchived) {
      setArchived(
        archived.map((n) => (n.id === noteId ? updateNoteLabels(n) : n)),
      );
    } else if (noteInTrash) {
      setTrash(trash.map((n) => (n.id === noteId ? updateNoteLabels(n) : n)));
    }
  };

  const getNotesByLabel = (labelId) => {
    return notes.filter((n) =>
      (n[NOTE_PROPERTIES.LABELS] || []).includes(labelId),
    );
  };

  return {
    notes,
    archived,
    trash,
    addNote,
    editNote,
    changeNoteColor,
    changeNoteFormat,
    archiveNote,
    restoreNote,
    moveToTrash,
    restoreFromTrash,
    deleteNote,
    addLabelToNote,
    removeLabelFromNote,
    getNotesByLabel,
  };
}
