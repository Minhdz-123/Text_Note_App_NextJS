"use client";

import { useState } from "react";
import BaseModal from "../Commons/BaseModal";
import IconButton from "../Commons/IconButton";
import { iconMap } from "@/src/utils/Icon";

const EditNoteModal = ({ isOpen, onClose, note, onSave }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  const handleSave = () => {
    if (note) {
      onSave({ ...note, title, content });
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      className="w-96"
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
          className="w-full h-40 resize-none bg-transparent border-none outline-none text-sm dark:text-[#e8eaed]"
        />
      </div>
      <div className="flex justify-end mt-4">
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
