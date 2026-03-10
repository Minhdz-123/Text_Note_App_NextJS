"use client";
import { useState } from "react";
import TextInput from "./TextInput";
import { NOTE_BOX_BUTTON } from "@/src/utils/Constants";
import IconButton from "./IconButton";
import { iconMap } from "../../utils/Icon";

function NoteBox({ onAddNote }) {
  const [content, setContent] = useState("");

  const handleAdd = () => {
    if (content.trim()) {
      onAddNote(content);
      setContent("");
    }
  };

  return (
    <div className="flex justify-center w-full px-4 mt-8">
      <div className="w-full max-w-150 bg-white dark:bg-[#202124] border border-[#e0e0e0] dark:border-[#5f6368] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center min-h-11.5">
        <div className="flex-1 px-4 py-2">
          <TextInput
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ghi chú..."
            className="w-full bg-transparent border-none focus:ring-0 p-0 text-[15px] font-['Google_Sans',Roboto,Arial,sans-serif] dark:text-white"
          />
        </div>

        <div className="flex items-center pr-2 gap-1">
          <IconButton icon={iconMap.check} onClick={handleAdd} title="Lưu" />
          {NOTE_BOX_BUTTON.map((item) => (
            <IconButton
              key={item.id}
              icon={iconMap[item.iconKey]}
              title={item.title}
              onClick={() => console.log(`Action: ${item.action}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default NoteBox;
