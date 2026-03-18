"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useState } from "react";

import SortableNoteCard from "@/src/components/Commons/SortableNotecard";
import NoteCard from "@/src/components/Commons/NoteCard";
import EditNoteModal from "@/src/components/Modals/EditNoteModal";
import useLocalStorage from "@/src/hooks/useLocalStorage";
import useNoteUI from "@/src/hooks/useNoteUI";

export default function NoteGrid({
  notes,
  noteActions,
  buttons,
  masonry = false,
  sortable = false,
  showModal = true,
}) {
  const { editNote, changeNoteColor, changeNoteFormat, reorderNotes } =
    noteActions;
  const [labels] = useLocalStorage("keep_labels", []);
  const [activeNote, setActiveNote] = useState(null);

  const { editModalOpen, setEditModalOpen, noteToEdit, handleAction } =
    useNoteUI(noteActions);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragStart = ({ active }) => {
    setActiveNote(notes.find((n) => n.id === active.id) ?? null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveNote(null);
    if (!over || active.id === over.id) return;
    const oldIndex = notes.findIndex((n) => n.id === active.id);
    const newIndex = notes.findIndex((n) => n.id === over.id);
    reorderNotes(arrayMove(notes, oldIndex, newIndex));
  };

  const sharedCardProps = (note) => ({
    note,
    onAction: handleAction,
    onColorChange: changeNoteColor,
    onFormatChange: changeNoteFormat,
    buttons,
    labels,
  });

  const gridClass = masonry
    ? "keep-masonry w-full max-w-300 mt-8 mx-auto"
    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-300 mt-8 mx-auto";

  const itemClass = masonry ? "keep-masonry-item" : "";

  if (!notes || notes.length === 0) return null;

  const gridContent = (
    <div className={gridClass}>
      {notes.map((note) =>
        sortable ? (
          <SortableNoteCard
            key={note.id}
            className={itemClass}
            {...sharedCardProps(note)}
          />
        ) : (
          <div key={note.id} className={itemClass}>
            <NoteCard {...sharedCardProps(note)} />
          </div>
        ),
      )}
    </div>
  );

  return (
    <>
      {sortable ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={notes.map((n) => n.id)}
            strategy={rectSortingStrategy}
          >
            {gridContent}
          </SortableContext>

          <DragOverlay>
            {activeNote ? (
              <div style={{ opacity: 0.9, pointerEvents: "none" }}>
                <NoteCard {...sharedCardProps(activeNote)} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        gridContent
      )}

      {showModal && (
        <EditNoteModal
          isOpen={editModalOpen}
          note={noteToEdit}
          onClose={() => setEditModalOpen(false)}
          onSave={(updated) => {
            editNote(updated);
            setEditModalOpen(false);
          }}
        />
      )}
    </>
  );
}
