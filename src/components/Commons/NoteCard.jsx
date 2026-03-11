"use client";
import { NOTE_CARD_BUTTON } from "@/src/utils/Constants";
import IconButton from "./IconButton";
import { iconMap } from "@/src/utils/Icon";

const NoteCard = ({ note, onAction, buttons = NOTE_CARD_BUTTON }) => {
  const handleCardClick = () => {
    if (onAction) onAction("edit_note", note);
  };

  return (
    <div
      className="group flex flex-col bg-white dark:bg-[#202124] border border-[#e0e0e0] dark:border-[#5f6368] rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex-1 p-4">
        {note.title && (
          <h4 className="font-semibold text-[#202124] dark:text-[#e8eaed] mb-1">
            {note.title}
          </h4>
        )}
        <p className="text-[#202124] dark:text-[#e8eaed] text-sm whitespace-pre-wrap break-words">
          {note.content}
        </p>
      </div>
      <div className="flex justify-center gap-1 px-2 py-2 border-t border-[#e0e0e0] dark:border-[#5f6368] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {buttons.map((item) => {
          return (
            <IconButton
              key={item.id}
              icon={iconMap[item.iconKey]}
              title={item.title}
              size="w-8 h-8"
              textClass="text-[14px]"
              onClick={(e) => {
                e.stopPropagation();
                if (onAction) onAction(item.action, note);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NoteCard;
