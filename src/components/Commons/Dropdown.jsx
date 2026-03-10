import { useEffect, useState, useRef } from "react";

function Dropdown({ options = [], trigger, width = "225px" }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          className="absolute right-0 mt-2 py-2 bg-white dark:bg-[#2d2e31] border border-gray-200 dark:border-none rounded-lg shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_2px_6px_2px_rgba(60,64,67,0.15)] z-2000"
          style={{ width }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                option.onClick?.();
                setOpen(false);
              }}
              className="px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-[14px] text-[#3c4043] dark:text-[#e8eaed] font-medium transition-colors"
            >
              {option.label || option.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Dropdown;
