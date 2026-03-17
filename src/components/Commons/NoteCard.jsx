"use client";
import { useState, useRef } from "react";
import {
  NOTE_CARD_BUTTON,
  MORE_OPTION_MENU,
  FORMAT_CONFIG,
  NOTE_PROPERTIES,
} from "@/src/utils/Constants";
import IconButton from "./IconButton";
import Dropdown from "./Dropdown";
import ColorPicker from "./ColorPicker";
import TextFormatPicker from "./TextFormatPicker";
import LabelSelectionDropdown from "./LabelSelectionDropdown";
import { iconMap } from "@/src/utils/Icon";

const NoteCard = ({
  note,
  onAction,
  onColorChange,
  onFormatChange,
  labels = [],
  buttons = NOTE_CARD_BUTTON,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const [showLabelSelection, setShowLabelSelection] = useState(false);
  const dropdownRef = useRef(null);

  const handleCardClick = () => {
    if (onAction) onAction("edit_note", note);
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    if (action === "choose_background") {
      setShowColorPicker(!showColorPicker);
    } else if (action === "choose_format") {
      setShowFormatPicker(!showFormatPicker);
    } else {
      if (onAction) onAction(action, note);
    }
  };

  const handleMoreOptionClick = (action) => {
    if (action === "add_labels") {
      setShowLabelSelection(true);
    } else {
      if (onAction) onAction(action, note);
    }
  };

  const handleColorSelect = (color) => {
    onColorChange?.(note.id, color);
    setShowColorPicker(false);
  };

  const handleFormatSelect = (formatType) => {
    onFormatChange?.(note.id, formatType);
  };

  const bgColor = note[NOTE_PROPERTIES.COLOR_CLASS] || "bg-white";

  const getContentRender = () => {
    const formats = note[NOTE_PROPERTIES.FORMATS] || [];
    let ContentTag = "p";
    let classes = "";

    for (const format of formats) {
      const config = FORMAT_CONFIG[format];
      if (config && config.tag) {
        ContentTag = config.tag;
        break;
      }
    }

    classes = formats
      .reduce((result, format) => {
        const config = FORMAT_CONFIG[format];
        return config ? result + " " + config.classes : result;
      }, "")
      .trim();

    return { ContentTag, classes };
  };

  const { ContentTag, classes } = getContentRender();

  return (
    <div
      className={`group flex flex-col ${bgColor} dark:bg-[#202124] border border-[#e0e0e0] dark:border-[#5f6368] rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer`}
      onClick={handleCardClick}
    >
      <div className="flex-1 p-4">
        {note.title && (
          <h4 className="text-[20px] text-[#202124] dark:text-[#e8eaed] mb-1 wrap-break-word break-all">
            {note.title}
          </h4>
        )}
        <ContentTag
          className={`text-[#202124] dark:text-[#e8eaed] whitespace-pre-wrap wrap-break-word break-all${classes ? " " + classes : ""}`}
        >
          {note.content}
        </ContentTag>
        {(note[NOTE_PROPERTIES.LABELS] || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {(note[NOTE_PROPERTIES.LABELS] || []).map((labelId) => {
              const label = labels.find((l) => l.id === labelId);
              return label ? (
                <span
                  key={labelId}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-[#5f6368] text-[#202124] dark:text-[#e8eaed]"
                >
                  {label.name}
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>
      <div className="relative flex justify-center gap-1 px-2 py-2 border-t border-[#e0e0e0] dark:border-[#5f6368] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {showLabelSelection && (
          <div
            className="absolute right-0 bottom-full mb-1 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <LabelSelectionDropdown
              labels={labels}
              noteLabels={note[NOTE_PROPERTIES.LABELS] || []}
              onLabelToggle={(labelId) => {
                if ((note[NOTE_PROPERTIES.LABELS] || []).includes(labelId)) {
                  onAction?.("remove_label", note, labelId);
                } else {
                  onAction?.("add_label", note, labelId);
                }
              }}
              onClose={() => setShowLabelSelection(false)}
            />
          </div>
        )}
        {buttons.map((item) => {
          if (item.action === "choose_format") {
            return (
              <div key={item.id} className="relative" ref={dropdownRef}>
                <IconButton
                  icon={iconMap[item.iconKey]}
                  title={item.title}
                  size="w-8 h-8"
                  textClass="text-[14px]"
                  onClick={(e) => handleButtonClick(e, item.action)}
                />
                {showFormatPicker && (
                  <TextFormatPicker
                    selectedFormats={note[NOTE_PROPERTIES.FORMATS] || []}
                    onFormatSelect={handleFormatSelect}
                    onClose={() => setShowFormatPicker(false)}
                  />
                )}
              </div>
            );
          }
          if (item.action === "choose_background") {
            return (
              <div key={item.id} className="relative" ref={dropdownRef}>
                <IconButton
                  icon={iconMap[item.iconKey]}
                  title={item.title}
                  size="w-8 h-8"
                  textClass="text-[14px]"
                  onClick={(e) => handleButtonClick(e, item.action)}
                />
                {showColorPicker && (
                  <ColorPicker
                    onColorSelect={handleColorSelect}
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
                ref={dropdownRef}
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
        })}
      </div>
    </div>
  );
};

export default NoteCard;
