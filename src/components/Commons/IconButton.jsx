import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const IconButton = ({ icon, title, onClick, className = "", size = "w-10 h-10", textClass = "text-xl" }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`${size} rounded-full flex items-center justify-center hover:bg-gray-200/50 dark:hover:bg-[#3c3c3c] text-[#5f6368] dark:text-[#9aa0a6] transition-colors duration-200 outline-none ${className}`}
      >
        <FontAwesomeIcon icon={icon} className={textClass} />
      </button>

      {showTooltip && title && (
        <div className="absolute top-full mt-1.5 px-2 py-1 bg-[#4d4d4d] text-white text-[11px] rounded shadow-md whitespace-nowrap z-9999 pointer-events-none opacity-90 dark:bg-[#e8eaed] dark:text-[#202124]">
          {title}
        </div>
      )}
    </div>
  );
};

export default IconButton;
