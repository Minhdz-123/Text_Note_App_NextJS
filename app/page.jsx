"use client";
import { useMemo, useState } from "react";
import useNotes from "@/src/hooks/useNotes";
import NoteBox from "@/src/components/Commons/NoteBox";
import NoteCard from "@/src/components/Commons/NoteCard";
import { useSearch } from "@/src/context/SearchContext";
import EditNoteModal from "@/src/components/Modals/EditNoteModal";

export default function HomePage() {
  const { notes, addNote, archiveNote, editNote, moveToTrash, changeNoteColor } = useNotes();
  const { searchTerm } = useSearch();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);

  const handleAdd = (newNoteContent) => {
    addNote(newNoteContent);
  };

  const handleAction = (action, note) => {
    if (action === "move_to_storage") {
      archiveNote(note.id);
    }
    if (action === "move_to_trash") {
      moveToTrash(note.id);
    }
    if (action === "edit_note") {
      setNoteToEdit(note);
      setEditModalOpen(true);
    }
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const term = searchTerm.toLowerCase();
      return (
        (note.title && note.title.toLowerCase().includes(term)) ||
        (note.content && note.content.toLowerCase().includes(term))
      );
    });
  }, [notes, searchTerm]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4">
      <NoteBox onAddNote={handleAdd} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-300 mt-8">
        {filteredNotes.map((note) => (
          <NoteCard 
            key={note.id} 
            note={note} 
            onAction={handleAction}
            onColorChange={changeNoteColor}
          />
        ))}
      </div>

      <EditNoteModal
        key={`${editModalOpen}-${noteToEdit?.id}`}
        isOpen={editModalOpen}
        note={noteToEdit}
        onClose={() => setEditModalOpen(false)}
        onSave={(updated) => {
          editNote(updated);
          setEditModalOpen(false);
        }}
      />
    </div>
  );
}

