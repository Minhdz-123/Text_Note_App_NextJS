"use client";
import { useRef, useEffect } from "react";
import { COLOR_PALETTE } from "@/src/utils/Constants";

const ColorPicker = ({ onColorSelect, onClose }) => {
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

  const handleColorClick = (e, color) => {
    e.stopPropagation();
    onColorSelect?.(color);
    onClose?.();
  };

  return (
    <div
      className="absolute bottom-12 left-0 p-3 bg-white dark:bg-[#2d2e31] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-w-[90vw] sm:max-w-max"
      ref={pickerRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-wrap gap-2 w-max max-w-full">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color.id}
            onClick={(e) => handleColorClick(e, color)}
            className={`w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-500 hover:scale-110 transition-transform ${color.colorClass}`}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
