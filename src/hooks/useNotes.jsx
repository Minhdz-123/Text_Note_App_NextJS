import useLocalStorage from "./useLocalStorage";

export default function useNotes() {
  const [notes, setNotes] = useLocalStorage("my_notes_list", []);
  const [archived, setArchived] = useLocalStorage("archived_notes", []);
  const [trash, setTrash] = useLocalStorage("trash_notes", []);

  const addNote = (content, title = "") => {
    const newNote = { id: Date.now(), content, title };
    setNotes([newNote, ...notes]);
  };

  const editNote = (updatedNote) => {
    setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  };

  const changeNoteColor = (noteId, color) => {
    const noteInNotes = notes.find((n) => n.id === noteId);
    const noteInArchived = archived.find((n) => n.id === noteId);
    const noteInTrash = trash.find((n) => n.id === noteId);

    if (noteInNotes) {
      setNotes(
        notes.map((n) =>
          n.id === noteId ? { ...n, colorClass: color.colorClass } : n
        )
      );
    } else if (noteInArchived) {
      setArchived(
        archived.map((n) =>
          n.id === noteId ? { ...n, colorClass: color.colorClass } : n
        )
      );
    } else if (noteInTrash) {
      setTrash(
        trash.map((n) =>
          n.id === noteId ? { ...n, colorClass: color.colorClass } : n
        )
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
    // Tìm note từ notes hoặc archived
    let note = notes.find((n) => n.id === noteId);
    let isFromArchive = false;

    if (!note) {
      note = archived.find((n) => n.id === noteId);
      isFromArchive = true;
    }

    if (!note) return;

    // Xóa từ nơi hiện tại
    if (isFromArchive) {
      setArchived(archived.filter((n) => n.id !== noteId));
    } else {
      setNotes(notes.filter((n) => n.id !== noteId));
    }

    // Thêm vào trash
    setTrash([note, ...trash]);
  };

  const restoreFromTrash = (noteId) => {
    const note = trash.find((n) => n.id === noteId);
    if (!note) return;
    setTrash(trash.filter((n) => n.id !== noteId));
    setNotes([note, ...notes]);
  };

  const deleteNote = (noteId) => {
    setTrash(trash.filter((n) => n.id !== noteId));
  };

  return {
    notes,
    archived,
    trash,
    addNote,
    editNote,
    changeNoteColor,
    archiveNote,
    restoreNote,
    moveToTrash,
    restoreFromTrash,
    deleteNote,
  };
}
