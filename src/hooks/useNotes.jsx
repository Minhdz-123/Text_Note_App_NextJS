import useLocalStorage from "./useLocalStorage";

export default function useNotes() {
  const [notes, setNotes] = useLocalStorage("my_notes_list", []);
  const [archived, setArchived] = useLocalStorage("archived_notes", []);

  const addNote = (content, title = "") => {
    const newNote = { id: Date.now(), content, title };
    setNotes([newNote, ...notes]);
  };

  const editNote = (updatedNote) => {
    setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
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

  return {
    notes,
    archived,
    addNote,
    editNote,
    archiveNote,
    restoreNote,
  };
}
