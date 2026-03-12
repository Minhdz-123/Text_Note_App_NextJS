"use client";
import { useRef, useEffect } from "react";
import { FONT_TYPES } from "@/src/utils/Constants";
import { iconMap } from "@/src/utils/Icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TextFormatPicker = ({
  selectedFormats = [],
  onFormatSelect,
  onClose,
}) => {
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

  const handleFormatClick = (e, format) => {
    e.stopPropagation();
    onFormatSelect?.(format);
  };

  const isSelected = (type) => selectedFormats.includes(type);

  const renderButtonContent = (format) => {
    const { display } = format;

    if (display.useIcon) {
      return (
        <FontAwesomeIcon icon={iconMap[format.iconKey]} className="w-4 h-4" />
      );
    }

    return (
      <span className={`text-sm ${display.style || ""}`}>{display.label}</span>
    );
  };

  return (
    <div
      className="absolute bottom-12 left-0 p-2 bg-white dark:bg-[#2d2e31] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50"
      ref={pickerRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex gap-1 flex-wrap w-max">
        {FONT_TYPES.map((format) => (
          <button
            key={format.id}
            onClick={(e) => handleFormatClick(e, format.type)}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
              isSelected(format.type)
                ? "bg-blue-500 text-white dark:bg-blue-600"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
            title={format.name}
          >
            {renderButtonContent(format)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TextFormatPicker;
