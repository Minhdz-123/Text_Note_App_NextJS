"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import InviteShareModal from "../../Modals/InviteShareModal";
import {
  NOTE_CARD_BUTTON,
  MORE_OPTION_MENU,
  NOTE_PROPERTIES,
} from "@/src/utils/Constants";
import IconButton from "@/src/components/Commons/IconButton";
import Dropdown from "@/src/components/Commons/Dropdown";
import ColorPicker from "@/src/components/Commons/ColorPicker";
import LabelSelectionDropdown from "../labels/LabelSelectionDropdown";
import { iconMap } from "@/src/utils/Icon";

const NoteCard = ({
  note,
  onAction,
  onColorChange,
  labels = [],
  buttons = NOTE_CARD_BUTTON,
  className = "",
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLabelSelection, setShowLabelSelection] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);

  const noteLabels = note[NOTE_PROPERTIES.LABELS] || [];
  const bgColor = note[NOTE_PROPERTIES.COLOR_CLASS] || "bg-white";
  const isCustomColor = bgColor !== "bg-white" && bgColor !== "bg-transparent";

  const handleCardClick = () => onAction?.("edit_note", note);

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    if (action === "choose_background") {
      setShowColorPicker((prev) => !prev);
    } else {
      onAction?.(action, note);
    }
  };

  const handleMoreOptionClick = (action) => {
    if (action === "add_labels") {
      setShowLabelSelection(true);
    } else if (action === "share_note") {
      setShowShareModal(true);
    } else {
      onAction?.(action, note);
    }
  };

  const handleLabelToggle = (labelId) => {
    const action = noteLabels.includes(labelId) ? "remove_label" : "add_label";
    onAction?.(action, note, labelId);
  };

  const renderButton = (item) => {
    if (item.action === "choose_format") return null;

    const iconBtn = (
      <IconButton
        icon={iconMap[item.iconKey]}
        title={item.title}
        size="w-8 h-8"
        textClass="text-[14px]"
        onClick={(e) => handleButtonClick(e, item.action)}
      />
    );

    if (item.action === "choose_background") {
      return (
        <div key={item.id} className="relative">
          {iconBtn}
          {showColorPicker && (
            <ColorPicker
              activeColorClass={bgColor}
              onColorSelect={(color) => {
                onColorChange?.(note.id, color);
                setShowColorPicker(false);
              }}
              onClose={() => setShowColorPicker(false)}
            />
          )}
        </div>
      );
    }

    if (item.action === "more_option") {
      return (
        <div
          key={item.id}
          className="relative"
          onClick={(e) => e.stopPropagation()}
        >
          <Dropdown
            options={MORE_OPTION_MENU.map((option) => ({
              label: option.label,
              onClick: () => handleMoreOptionClick(option.action),
            }))}
            trigger={
              <IconButton
                icon={iconMap[item.iconKey]}
                title={item.title}
                size="w-8 h-8"
                textClass="text-[14px]"
              />
            }
            width="225px"
          />
        </div>
      );
    }

    return (
      <IconButton
        key={item.id}
        icon={iconMap[item.iconKey]}
        title={item.title}
        size="w-8 h-8"
        textClass="text-[14px]"
        onClick={(e) => handleButtonClick(e, item.action)}
      />
    );
  };

  return (
    <div
      className={`
        ${className} group flex flex-col rounded-lg shadow-sm hover:shadow-lg
        transition-all duration-200 cursor-pointer
        border border-[#e0e0e0] dark:border-[#5f6368]
        ${bgColor} ${!isCustomColor ? "dark:bg-[#202124]" : ""}
      `}
      onClick={handleCardClick}
    >
      <div className="flex-1 p-4">
        {note.title && (
          <h4 className="text-[20px] text-[#202124] dark:text-[#e8eaed] mb-1 wrap-break-word break-all font-medium">
            {note.title}
          </h4>
        )}

        <div
          className="text-[#202124] dark:text-[#e8eaed] text-[14px] whitespace-pre-wrap break-all"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />

        {noteLabels.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {noteLabels.map((labelId) => {
              const label = labels.find((l) => l.id === labelId);
              return label ? (
                <span
                  key={labelId}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/5 dark:bg-[#5f6368] text-[#202124] dark:text-[#e8eaed]"
                >
                  {label.name}
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>

      <div
        className={`
          relative flex justify-center gap-1 px-2 py-2 border-t border-[#e0e0e0] dark:border-[#5f6368] 
          transition-opacity duration-200
          ${
            showColorPicker || showLabelSelection
              ? "opacity-100"
              : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
          }
        `}
      >
        {showLabelSelection && (
          <div
            className="absolute right-0 bottom-full mb-1 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <LabelSelectionDropdown
              labels={labels}
              noteLabels={noteLabels}
              onLabelToggle={handleLabelToggle}
              onClose={() => setShowLabelSelection(false)}
            />
          </div>
        )}
        {buttons.map(renderButton)}
      </div>

      {showShareModal && (
        <InviteShareModal
          note={note}
          ownerUid={userInfo?.uid}
          currentUser={userInfo}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onUpdateNote={(updatedNote) => {
            onAction?.("update_note", updatedNote);
          }}
        />
      )}
    </div>
  );
};

export default NoteCard;
