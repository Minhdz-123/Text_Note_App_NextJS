"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import NoteCard from "./NoteCard";

export default function SortableNoteCard({
  note,
  onAction,
  onColorChange,
  onFormatChange,
  buttons,
  labels,
  className = "",
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      {...attributes}
      {...listeners}
    >
      <NoteCard
        note={note}
        onAction={onAction}
        onColorChange={onColorChange}
        onFormatChange={onFormatChange}
        buttons={buttons}
        labels={labels}
      />
    </div>
  );
}
