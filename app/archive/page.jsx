"use client";

import { useMemo, useEffect } from "react";
import useNotes from "@/src/hooks/useNotes";
import NoteCard from "@/src/components/Commons/NoteCard";
import { useSearch } from "@/src/context/SearchContext";
import { ARCHIVE_CARD_BUTTON } from "@/src/utils/Constants";
import EditNoteModal from "@/src/components/Modals/EditNoteModal";
import useLocalStorage from "@/src/hooks/useLocalStorage";
import { usePageTitle } from "@/src/context/PageTitleContext";

import useNoteUI from "@/src/hooks/useNoteUI";

export default function ArchivePage() {
  const {
    archived,
    editNote,
    changeNoteColor,
    changeNoteFormat,
  } = useNotes();
  const { searchTerm } = useSearch();
  const [labels] = useLocalStorage("keep_labels", []);

  const {
    editModalOpen,
    setEditModalOpen,
    noteToEdit,
    handleAction,
  } = useNoteUI();

  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle("Lưu trữ");
    return () => setPageTitle(null);
  }, [setPageTitle]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-300 mt-8">
        {filtered.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onAction={handleAction}
            onColorChange={changeNoteColor}
            onFormatChange={changeNoteFormat}
            buttons={ARCHIVE_CARD_BUTTON}
            labels={labels}
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
