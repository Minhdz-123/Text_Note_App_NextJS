"use client";
import { useMemo, useState } from "react";
import useNotes from "@/src/hooks/useNotes";
import NoteBox from "@/src/components/Commons/NoteBox";
import NoteCard from "@/src/components/Commons/NoteCard";
import { useSearch } from "@/src/context/SearchContext";
import EditNoteModal from "@/src/components/Modals/EditNoteModal";
import useLocalStorage from "@/src/hooks/useLocalStorage";

import useNoteUI from "@/src/hooks/useNoteUI";

export default function HomePage() {
  const noteActions = useNotes();
  const { notes, addNote, editNote, changeNoteColor, changeNoteFormat } = noteActions;
  const { searchTerm } = useSearch();
  const [labels] = useLocalStorage("keep_labels", []);

  const {
    editModalOpen,
    setEditModalOpen,
    noteToEdit,
    handleAction,
  } = useNoteUI(noteActions);

  const handleAdd = (newNoteContent) => {
    addNote(newNoteContent);
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
    <div className="flex flex-col w-full min-h-screen p-4 gap-4">
      <NoteBox onAddNote={handleAdd} />

      <div className="keep-masonry">
        {filteredNotes.map((note) => (
          <div className="keep-masonry-item" key={note.id}>
            <NoteCard
              key={note.id}
              note={note}
              onAction={handleAction}
              onColorChange={changeNoteColor}
              onFormatChange={changeNoteFormat}
              labels={labels}
            />
          </div>
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

