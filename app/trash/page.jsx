"use client";

import { useMemo, useEffect } from "react";
import useNotes from "@/src/hooks/useNotes";
import NoteCard from "@/src/components/Commons/NoteCard";
import { useSearch } from "@/src/context/SearchContext";
import { TRASH_CARD_BUTTON } from "@/src/utils/Constants";
import useLocalStorage from "@/src/hooks/useLocalStorage";
import { usePageTitle } from "@/src/context/PageTitleContext";
import useNoteUI from "@/src/hooks/useNoteUI";

export default function TrashPage() {
  const { trash, changeNoteColor, changeNoteFormat } = useNotes();
  const { searchTerm } = useSearch();
  const [labels] = useLocalStorage("keep_labels", []);
  const { setPageTitle } = usePageTitle();
  const { handleAction } = useNoteUI();

  useEffect(() => {
    setPageTitle("Thùng rác");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const filtered = useMemo(() => {
    return trash.filter((note) => {
      const term = searchTerm.toLowerCase();
      return (
        (note.title && note.title.toLowerCase().includes(term)) ||
        (note.content && note.content.toLowerCase().includes(term))
      );
    });
  }, [trash, searchTerm]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-300 mt-8">
          {filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onAction={handleAction}
              onColorChange={changeNoteColor}
              onFormatChange={changeNoteFormat}
              buttons={TRASH_CARD_BUTTON}
              labels={labels}
            />
          ))}
        </div>
      
    </div>
  );
}

