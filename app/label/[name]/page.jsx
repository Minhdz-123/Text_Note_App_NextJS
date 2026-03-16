"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import useNotes from "@/src/hooks/useNotes";
import NoteCard from "@/src/components/Commons/NoteCard";
import { useSearch } from "@/src/context/SearchContext";
import EditNoteModal from "@/src/components/Modals/EditNoteModal";
import useLocalStorage from "@/src/hooks/useLocalStorage";
import { NOTE_PROPERTIES } from "@/src/utils/Constants";

export default function LabelPage() {
  const params = useParams();
  const labelName = decodeURIComponent(params.name);

  const {
    notes,
    editNote,
    changeNoteColor,
    changeNoteFormat,
    addLabelToNote,
    removeLabelFromNote,
  } = useNotes();
  const { searchTerm } = useSearch();
  const [labels] = useLocalStorage("keep_labels", []);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);

  const label = labels.find((l) => l.name === labelName);

  const labeledNotes = useMemo(() => {
    if (!label) return [];
    return notes.filter((note) => {
      const noteLabels = note[NOTE_PROPERTIES.LABELS] || [];
      return noteLabels.includes(label.id);
    });
  }, [notes, label]);

  const filteredNotes = useMemo(() => {
    return labeledNotes.filter((note) => {
      const term = searchTerm.toLowerCase();
      return (
        (note.title && note.title.toLowerCase().includes(term)) ||
        (note.content && note.content.toLowerCase().includes(term))
      );
    });
  }, [labeledNotes, searchTerm]);

  const handleAction = (action, note, labelId = null) => {
    if (action === "edit_note") {
      setNoteToEdit(note);
      setEditModalOpen(true);
    }
    if (action === "add_label") {
      addLabelToNote(note.id, labelId);
    }
    if (action === "remove_label") {
      removeLabelFromNote(note.id, labelId);
    }
  };

  if (!label) {
    return (
      <div className="flex flex-col items-center w-full min-h-screen p-4">
        <h1 className="text-2xl font-semibold mb-6">undefined</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-6">{label.name}</h1>
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

      {filteredNotes.length === 0 && (
        <div className="text-center text-[#5f6368] dark:text-[#9aa0a6] mt-8">
          
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
