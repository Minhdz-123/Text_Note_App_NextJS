"use client";
import { useState, useRef, useEffect } from "react";

const LabelSelectionDropdown = ({
  labels = [],
  noteLabels = [],
  onLabelToggle,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute bottom-12 right-0 bg-white dark:bg-[#2d2e31] border border-[#e0e0e0] dark:border-[#5f6368] rounded-lg shadow-lg z-50 min-w-48 max-h-64 overflow-y-auto custom-scrollbar"
    >
      {labels.length === 0 ? (
        <div className="p-3 text-center text-sm text-[#5f6368] dark:text-[#9aa0a6]">
          Không có nhãn nào
        </div>
      ) : (
        labels.map((label) => {
          const isSelected = noteLabels.includes(label.id);
          return (
            <div
              key={label.id}
              className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#41331c] cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onLabelToggle(label.id);
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                className="mr-3 w-4 h-4 cursor-pointer"
              />
              <span className="text-sm text-[#202124] dark:text-[#e8eaed]">
                {label.name}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default LabelSelectionDropdown;
