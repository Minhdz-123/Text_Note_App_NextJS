"use client";

import { useEffect } from "react";
import useNotes from "@/src/hooks/useNotes";
import NoteGrid from "@/src/components/features/notes/NoteGrid";
import useFilteredNotes from "@/src/hooks/useFilteredNotes";
import { ARCHIVE_CARD_BUTTON } from "@/src/utils/Constants";
import { usePageTitle } from "@/src/context/PageTitleContext";

export default function ArchivePage() {
  const noteActions = useNotes();
  const { archived } = noteActions;
  const filtered = useFilteredNotes(archived);
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle("Lưu trữ");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  return (
    <div className="flex flex-col w-full min-h-screen p-4 gap-4">
      <NoteGrid
        notes={filtered}
        noteActions={noteActions}
        buttons={ARCHIVE_CARD_BUTTON}
      />
    </div>
  );
}
