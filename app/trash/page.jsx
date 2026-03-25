"use client";

import { useEffect } from "react";
import useNotes from "@/src/hooks/useNotes";
import NoteGrid from "@/src/components/features/notes/NoteGrid";
import useFilteredNotes from "@/src/hooks/useFilteredNotes";
import { TRASH_CARD_BUTTON } from "@/src/utils/Constants";
import { usePageTitle } from "@/src/context/PageTitleContext";

export default function TrashPage() {
  const noteActions = useNotes();
  const { trash } = noteActions;
  const filtered = useFilteredNotes(trash);
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle("Thùng rác");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 gap-4">
      <NoteGrid
        notes={filtered}
        noteActions={noteActions}
        buttons={TRASH_CARD_BUTTON}
        showModal={false}
      />
    </div>
  );
}
