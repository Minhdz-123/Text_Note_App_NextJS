"use client";

import { useState, useEffect } from "react";
import { EditorContent } from "@tiptap/react";
import useTiptapEditor from "@/src/hooks/useTiptapEditor";
import TiptapToolbar from "./TiptapToolbar";
import IconButton from "./IconButton";
import { iconMap } from "@/src/utils/Icon";
import ColorPicker from "./ColorPicker";
import { NOTE_PROPERTIES, EDIT_NOTE_TEXT } from "@/src/utils/Constants";

const NoteEditor = ({
  initialTitle = "",
  initialContent = "",
  initialColorClass = "bg-white",
  onSave,
  onCancel,
  showTimestamp = false,
  timestamp,
  className = "",
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [colorClass, setColorClass] = useState(initialColorClass);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFormatPicker, setShowFormatPicker] = useState(false);

  const editor = useTiptapEditor(initialContent, (html) => {
    setContent(html);
  });

  const handleSave = () => {
    onSave({
      title,
      content,
      [NOTE_PROPERTIES.COLOR_CLASS]: colorClass,
    });
  };

  const finalBg =
    colorClass === "bg-white" ? "bg-white dark:bg-[#202124]" : colorClass;

  return (
    <div
      className={`flex flex-col ${finalBg} ${className} transition-colors duration-200 overflow-hidden`}
    >
      <div className="flex flex-col p-4 text-[#202124] dark:text-[#e8eaed]">
        {showTimestamp && timestamp && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {EDIT_NOTE_TEXT.TIMESTAMP_PREFIX}{" "}
            {new Date(timestamp).toLocaleString()}
          </p>
        )}

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={EDIT_NOTE_TEXT.PLACEHOLDER_TITLE}
          className="w-full bg-transparent border-none outline-none text-[20px] font-medium dark:text-[#e8eaed] mb-3"
          autoFocus={!initialTitle && !initialContent}
        />

        <div className="mt-2 cursor-text">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="flex justify-between items-center px-4 py-2 mt-auto border-t border-black/5 dark:border-white/5">
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
                activeColorClass={colorClass}
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
              <TiptapToolbar
                editor={editor}
                onClose={() => setShowFormatPicker(false)}
              />
            )}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-sm font-medium transition-colors dark:text-[#e8eaed]"
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
