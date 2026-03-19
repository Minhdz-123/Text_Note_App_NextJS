import { useEffect, useRef } from "react";
import { iconMap } from "@/src/utils/Icon";
import IconButton from "./IconButton";
import { FONT_TYPES } from "@/src/utils/Constants";

const TiptapToolbar = ({ editor, onClose }) => {
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!editor) return null;

  const handleAction = (type) => {
    const chain = editor.chain().focus();
    switch (type) {
      case "h1":
        return chain.toggleHeading({ level: 1 }).run();
      case "h2":
        return chain.toggleHeading({ level: 2 }).run();
      case "strong":
        return chain.toggleBold().run();
      case "em":
        return chain.toggleItalic().run();
      case "u":
        return chain.toggleUnderline().run();
      case "p":
        return chain.setParagraph().run();
      case "default":
        return chain.unsetAllMarks().clearNodes().run();
      default:
        return;
    }
  };

  const isBtnActive = (type) => {
    if (type === "h1") return editor.isActive("heading", { level: 1 });
    if (type === "h2") return editor.isActive("heading", { level: 2 });
    if (type === "strong") return editor.isActive("bold");
    if (type === "em") return editor.isActive("italic");
    if (type === "u") return editor.isActive("underline");
    if (type === "p") return editor.isActive("paragraph");
    return false;
  };

  return (
    <div
      className="absolute bottom-12 left-0 p-2 bg-white dark:bg-[#2d2e31] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 w-max"
      ref={pickerRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-wrap gap-1">
        {FONT_TYPES.map((item) => (
          <IconButton
            key={item.id}
            icon={iconMap[item.iconKey]}
            title={item.name}
            size="w-8 h-8"
            textClass="text-[14px]"
            onClick={(e) => {
              e.preventDefault();
              handleAction(item.type);
            }}
            className={`transition-colors ${
              isBtnActive(item.type) ? "bg-gray-200 dark:bg-[#5f6368]" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TiptapToolbar;
