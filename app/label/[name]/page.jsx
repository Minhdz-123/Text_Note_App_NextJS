"use client";

import { useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import useNotes from "@/src/hooks/useNotes";
import NoteCard from "@/src/components/features/notes/NoteCard";
import { useSearch } from "@/src/context/SearchContext";
import EditNoteModal from "@/src/components/Modals/EditNoteModal";
import { useSelector } from "react-redux";
import { usePageTitle } from "@/src/context/PageTitleContext";
import { NOTE_PROPERTIES, ARCHIVE_CARD_BUTTON } from "@/src/utils/Constants";
import useNoteUI from "@/src/hooks/useNoteUI";

export default function LabelPage() {
  const params = useParams();
  const labelName = decodeURIComponent(params.name);

  const noteActions = useNotes();
  const {
    notes,
    archived,
    editNote,
    changeNoteColor,
    changeNoteFormat,
  } = noteActions;
  const { searchTerm } = useSearch();
  const labels = useSelector((state) => state.note.labels);

  const {
    editModalOpen,
    setEditModalOpen,
    noteToEdit,
    handleAction,
  } = useNoteUI(noteActions);

  const label = labels.find((l) => l.name === labelName);
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    if (label) {
      setPageTitle(label.name);
    }
    return () => setPageTitle(null);
  }, [label, setPageTitle]);

  const labeledNotes = useMemo(() => {
    if (!label) return [];
    return notes.filter((note) => {
      const noteLabels = note[NOTE_PROPERTIES.LABELS] || [];
      return noteLabels.includes(label.id);
    });
  }, [notes, label]);

  const labeledArchived = useMemo(() => {
    if (!label) return [];
    return archived.filter((note) => {
      const noteLabels = note[NOTE_PROPERTIES.LABELS] || [];
      return noteLabels.includes(label.id);
    });
  }, [archived, label]);

  const filteredNotes = useMemo(() => {
    if (!searchTerm) return labeledNotes;
    const term = searchTerm.toLowerCase();
    return labeledNotes.filter((note) => {
      return (
        (note.title && note.title.toLowerCase().includes(term)) ||
        (note.content && note.content.toLowerCase().includes(term))
      );
    });
  }, [labeledNotes, searchTerm]);

  const filteredArchived = useMemo(() => {
    if (!searchTerm) return labeledArchived;
    const term = searchTerm.toLowerCase();
    return labeledArchived.filter((note) => {
      return (
        (note.title && note.title.toLowerCase().includes(term)) ||
        (note.content && note.content.toLowerCase().includes(term))
      );
    });
  }, [labeledArchived, searchTerm]);



  if (!label) {
    return (
      <div className="flex flex-col items-center w-full min-h-screen p-4">
        <h1 className="text-2xl font-semibold mb-6"></h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4">
      {/* Active Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-300 mt-8">
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onAction={handleAction}
            onColorChange={changeNoteColor}
            onFormatChange={changeNoteFormat}
            labels={labels}
          />
        ))}
      </div>

      {/* Archived Notes Section */}
      {filteredArchived.length > 0 && (
        <div className="w-full max-w-300 mt-12">
          <h2 className="text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider mb-4 ml-2">
            Lưu trữ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            {filteredArchived.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onAction={handleAction}
                onColorChange={changeNoteColor}
                onFormatChange={changeNoteFormat}
                labels={labels}
                buttons={ARCHIVE_CARD_BUTTON}
              />
            ))}
          </div>
        </div>
      )}

      {filteredNotes.length === 0 && filteredArchived.length === 0 && (
        <div className="text-center text-[#5f6368] dark:text-[#9aa0a6] mt-8">
          Không có ghi chú nào có nhãn này
        </div>
      )}

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
