"use client";
import { useState, useRef, useEffect } from "react";
import TextInput from "./TextInput";
import NoteEditor from "./NoteEditor";
import { NOTE_BOX_BUTTON } from "@/src/utils/Constants";
import IconButton from "./IconButton";
import { iconMap } from "../../utils/Icon";

function NoteBox({ onAddNote }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const handleAddSubNote = (noteData) => {
    if (noteData.content.trim() || noteData.title.trim()) {
      onAddNote(noteData);
      setIsExpanded(false);
    } else {
        setIsExpanded(false);
    }
  };

  if (isExpanded) {
    return (
      <div className="flex justify-center w-full px-4 mt-8" ref={containerRef}>
        <NoteEditor
          className="w-full max-w-150 border border-[#e0e0e0] dark:border-[#5f6368] rounded-lg shadow-md"
          onSave={handleAddSubNote}
          onCancel={() => setIsExpanded(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full px-4 mt-8">
      <div 
        className="w-full max-w-150 bg-white dark:bg-[#202124] border border-[#e0e0e0] dark:border-[#5f6368] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center min-h-11.5 cursor-text"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex-1 px-4 py-2">
          <TextInput
            placeholder="Ghi chú..."
            className="w-full bg-transparent border-none focus:ring-0 p-0 text-[15px] font-medium font-['Google_Sans',Roboto,Arial,sans-serif] dark:text-white pointer-events-none"
            readOnly
          />
        </div>

        <div className="flex items-center pr-2 gap-1">
          {NOTE_BOX_BUTTON.map((item) => (
            <IconButton
              key={item.id}
              icon={iconMap[item.iconKey]}
              title={item.title}
              onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default NoteBox;
