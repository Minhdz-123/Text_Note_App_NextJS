"use client";

import { useState, useMemo } from "react";
import BaseModal from "../Commons/BaseModal";
import IconButton from "../Commons/IconButton";
import { iconMap } from "@/src/utils/Icon";
import ColorPicker from "../Commons/ColorPicker";
import TextFormatPicker from "../Commons/TextFormatPicker";
import {
  NOTE_PROPERTIES,
  FORMAT_CONFIG,
  HEADING_TYPES,
} from "@/src/utils/Constants";

const EditNoteModal = ({ isOpen, onClose, note, onSave }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [colorClass, setColorClass] = useState(
    note?.[NOTE_PROPERTIES.COLOR_CLASS] || "bg-white",
  );
  const [formats, setFormats] = useState(note?.[NOTE_PROPERTIES.FORMATS] || []);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFormatPicker, setShowFormatPicker] = useState(false);

  const handleSave = () => {
    if (note) {
      onSave({
        ...note,
        title,
        content,
        [NOTE_PROPERTIES.COLOR_CLASS]: colorClass,
        [NOTE_PROPERTIES.FORMATS]: formats,
      });
    }
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

  const contentStyles = useMemo(() => {
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
  }, [formats]);

  const { ContentTag, classes } = contentStyles;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      className={`w-150 ${colorClass} transition-colors duration-200`}
      showFooter={false}
    >
      <div className="flex flex-col gap-3">
        {note?.id && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Đã gửi vào {new Date(note.id).toLocaleString()}
          </p>
        )}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề"
          className="w-full bg-transparent border-none outline-none text-lg font-semibold dark:text-[#e8eaed]"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ghi chú..."
          className={`w-full h-40 resize-none bg-transparent border-none outline-none text-sm dark:text-[#e8eaed] ${classes}`}
        />
      </div>
      <div className="flex justify-between items-center mt-4">
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
                onColorSelect={(color) => setColorClass(color.colorClass)}
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
        <IconButton
          icon={iconMap.check}
          title="Lưu"
          onClick={handleSave}
          size="w-8 h-8"
          textClass="text-[14px]"
        />
      </div>
    </BaseModal>
  );
};

export default EditNoteModal;
