"use client";

import useNotes from "@/src/hooks/useNotes";
import NoteBox from "@/src/components/Commons/NoteBox";
import NoteGrid from "@/src/components/Commons/NoteGrid";
import useFilteredNotes from "@/src/hooks/useFilteredNotes";

export default function HomePage() {
  const noteActions = useNotes();
  const { notes, addNote } = noteActions;
  const filteredNotes = useFilteredNotes(notes);

  return (
    <div className="flex flex-col w-full min-h-screen p-4 gap-4">
      <NoteBox onAddNote={addNote} />
      <NoteGrid
        notes={filteredNotes}
        noteActions={noteActions}
        sortable
      />
    </div>
  );
}
