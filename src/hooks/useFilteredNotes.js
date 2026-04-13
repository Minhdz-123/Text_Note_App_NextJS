import { useMemo } from "react";
import { useSearch } from "@/src/context/SearchContext";

function useFilteredNotes(notes = []) {
  const { searchTerm } = useSearch();

  return useMemo(() => {
    if (!Array.isArray(notes)) return [];
    if (!searchTerm) return notes;

    const term = searchTerm.toLowerCase();
    return notes.filter(
      (note) =>
        (note.title && note.title.toLowerCase().includes(term)) ||
        (note.content && note.content.toLowerCase().includes(term)),
    );
  }, [notes, searchTerm]);
}
export default useFilteredNotes;
