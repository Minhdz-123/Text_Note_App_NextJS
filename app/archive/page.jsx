"use client";

import { useMemo, useState } from "react";
import useNotes from "@/src/hooks/useNotes";
import NoteCard from "@/src/components/Commons/NoteCard";
import { useSearch } from "@/src/context/SearchContext";
import { ARCHIVE_CARD_BUTTON } from "@/src/utils/Constants";
import EditNoteModal from "@/src/components/Modals/EditNoteModal";

export default function ArchivePage() {
  const { archived, restoreNote, editNote, moveToTrash, changeNoteColor } = useNotes();
  const { searchTerm } = useSearch();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);

  const handleAction = (action, note) => {
    if (action === "restore") {
      restoreNote(note.id);
    }
    if (action === "move_to_trash") {
      moveToTrash(note.id);
    }
    if (action === "edit_note") {
      setNoteToEdit(note);
      setEditModalOpen(true);
    }
  };

  const filtered = useMemo(() => {
    return archived.filter((note) => {
      const term = searchTerm.toLowerCase();
      return (
        (note.title && note.title.toLowerCase().includes(term)) ||
        (note.content && note.content.toLowerCase().includes(term))
      );
    });
  }, [archived, searchTerm]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-6">Lưu trữ</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-300 mt-8">
        {filtered.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onAction={handleAction}
            onColorChange={changeNoteColor}
            buttons={ARCHIVE_CARD_BUTTON}
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
