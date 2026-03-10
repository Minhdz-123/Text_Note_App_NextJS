"use client";
import { useMemo } from "react";
import useLocalStorage from "@/src/hooks/useLocalStorage";
import NoteBox from "@/src/components/Commons/NoteBox";
import { useSearch } from "@/src/context/SearchContext";

export default function HomePage() {
  const [notes, setNotes] = useLocalStorage("my_notes_list", []);
  const { searchTerm } = useSearch();

  const addNote = (newNoteContent) => {
    const newNote = { id: Date.now(), content: newNoteContent };
    setNotes([newNote, ...notes]);
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) =>
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [notes, searchTerm]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4">
      <NoteBox onAddNote={addNote} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-[1200px] mt-8">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="group p-4 bg-white dark:bg-[#202124] border border-[#e0e0e0] dark:border-[#5f6368] rounded-lg shadow-sm hover:shadow-lg transition-all duration-200"
          >
            <p className="text-[#202124] dark:text-[#e8eaed] text-sm whitespace-pre-wrap">
              {note.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
