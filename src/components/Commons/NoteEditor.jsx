"use client";

import { useState, useMemo, useEffect } from "react";
import IconButton from "./IconButton";
import { iconMap } from "@/src/utils/Icon";
import ColorPicker from "./ColorPicker";
import TextFormatPicker from "./TextFormatPicker";
import {
  NOTE_PROPERTIES,
  FORMAT_CONFIG,
  HEADING_TYPES,
  EDIT_NOTE_TEXT,
} from "@/src/utils/Constants";

const DEFAULT_FORMATS = [];

const NoteEditor = ({
  initialTitle = "",
  initialContent = "",
  initialColorClass = "bg-white",
  initialFormats = DEFAULT_FORMATS,
  onSave,
  onCancel,
  showTimestamp = false,
  timestamp,
  className = "",
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [colorClass, setColorClass] = useState(initialColorClass);
  const [formats, setFormats] = useState(initialFormats);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFormatPicker, setShowFormatPicker] = useState(false);

  const handleSave = () => {
    onSave({
      title,
      content,
      [NOTE_PROPERTIES.COLOR_CLASS]: colorClass,
      [NOTE_PROPERTIES.FORMATS]: formats,
    });
  };

  const handleFormatSelect = (type) => {
    if (type === "default") {
      setFormats([]);
      return;
    }
    setFormats((prev) => {
      const isHeading = HEADING_TYPES.includes(type);
      if (prev.includes(type)) {
        return prev.filter((f) => f !== type);
      } else {
        let newFormats = [...prev];
        if (isHeading) {
          newFormats = newFormats.filter((f) => !HEADING_TYPES.includes(f));
        }
        return [...newFormats, type];
      }
    });
  };

  const contentClasses = useMemo(() =>
    formats.reduce((result, format) => {
      const config = FORMAT_CONFIG[format];
      return config ? `${result} ${config.classes}` : result;
    }, "").trim()
  , [formats]);

  const finalBg = colorClass === "bg-white" ? "bg-white dark:bg-[#202124]" : colorClass;

  return (
    <div className={`flex flex-col ${finalBg} ${className} transition-colors duration-200`}>
      <div className="flex flex-col gap-3 p-4 text-[#202124] dark:text-[#e8eaed]">
        {showTimestamp && timestamp && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {EDIT_NOTE_TEXT.TIMESTAMP_PREFIX} {new Date(timestamp).toLocaleString()}
          </p>
        )}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={EDIT_NOTE_TEXT.PLACEHOLDER_TITLE}
          className="w-full bg-transparent border-none outline-none text-[20px] font-medium dark:text-[#e8eaed]"
          autoFocus={!initialTitle && !initialContent}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={EDIT_NOTE_TEXT.PLACEHOLDER_CONTENT}
          className={`w-full min-h-20 max-h-80 grow resize-none bg-transparent border-none outline-none text-sm dark:text-[#e8eaed] ${contentClasses}`}
        />
      </div>

      <div className="flex justify-between items-center px-4 py-2 mt-auto">
        <div className="flex gap-2">
          <div className="relative">
            <IconButton
              icon={iconMap.palette}
              title="Lựa chọn nền"
              onClick={() => setShowColorPicker(!showColorPicker)}
              size="w-8 h-8"
              textClass="text-[14px]"
            />
            {showColorPicker && (
              <ColorPicker
                onColorSelect={(color) => {
                    setColorClass(color.colorClass);
                    setShowColorPicker(false);
                }}
                onClose={() => setShowColorPicker(false)}
              />
            )}
          </div>
          <div className="relative">
            <IconButton
              icon={iconMap.font}
              title="Các tùy chọn định dạng"
              onClick={() => setShowFormatPicker(!showFormatPicker)}
              size="w-8 h-8"
              textClass="text-[14px]"
            />
            {showFormatPicker && (
              <TextFormatPicker
                selectedFormats={formats}
                onFormatSelect={handleFormatSelect}
                onClose={() => setShowFormatPicker(false)}
              />
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
            {onCancel && (
                <button
                    onClick={onCancel}
                    className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-sm font-medium transition-colors"
                >
                    Đóng
                </button>
            )}
            <IconButton
                icon={iconMap.check}
                title={EDIT_NOTE_TEXT.TOOLTIP_SAVE}
                onClick={handleSave}
                size="w-8 h-8"
                textClass="text-[14px]"
            />
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
