"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SIDEBAR_MENU } from "@/src/utils/Constants";
import { iconMap } from "@/src/utils/Icon";

const Sidebar = ({ isOpen, labels = [], onEditLabels }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isOpen || isHovered;
  const pathname = usePathname();
  const renderSidebarItem = (id, icon, label, path, onClick = null) => {
    const itemContent = (
      <>
        <span className="w-12 h-12 shrink-0 flex items-center justify-center">
          <FontAwesomeIcon
            icon={icon}
            className="text-[1.2rem] transition-colors text-[#5f6368] dark:text-[#9aa0a6]"
          />
        </span>
        <span
          className={`font-['Google_Sans',Roboto,Arial,sans-serif] text-[0.875rem] font-medium tracking-wide text-[#202124] dark:text-[#e8eaed] whitespace-nowrap transition-all duration-150 ${
            isExpanded ? "opacity-100 ml-3" : "opacity-0 w-0 overflow-hidden"
          }`}
        >
          {label}
        </span>
      </>
    );

    const baseClass = `group select-none flex items-center h-12 cursor-pointer outline-none relative transition-all duration-150 ${
      isExpanded ? "rounded-r-full mr-0" : "rounded-full mx-2"
    }`;

    if (path) {
      const isActive = pathname === path;

      return (
        <Link
          key={id}
          href={path}
          className={`${baseClass} ${
            isActive
              ? "bg-[#feefc3] dark:bg-[#41331c]"
              : "hover:bg-gray-100 dark:hover:bg-[#2d2e31]"
          }`}
        >
          {itemContent}
        </Link>
      );
    }

    return (
      <span
        key={id}
        onClick={onClick}
        className={`${baseClass} hover:bg-gray-100 dark:hover:bg-[#2d2e31]`}
      >
        {itemContent}
      </span>
    );
  };

  return (
    <div
      onMouseEnter={() => !isOpen && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white dark:bg-[#202124] flex flex-col h-[calc(100vh-64px)] fixed top-16 left-0 overflow-x-hidden pt-2 z-985 transition-all duration-150 ease-in-out shadow-sm ${
        isExpanded ? "w-70 shadow-xl" : "w-18"
      }`}
    >
      <div className="flex-[1_0_auto]">
        {SIDEBAR_MENU.filter((item) => item.action !== "edit_labels").map(
          (item) =>
            renderSidebarItem(
              item.id,
              iconMap[item.icon],
              item.label,
              item.path,
            ),
        )}

        {labels.map((label) =>
          renderSidebarItem(
            label.id,
            iconMap.label,
            label.name,
            `/label/${label.name}`,
          ),
        )}

        {SIDEBAR_MENU.filter((item) => item.action === "edit_labels").map(
          (item) =>
            renderSidebarItem(
              item.id,
              iconMap[item.icon],
              item.label,
              null,
              onEditLabels,
            ),
        )}
      </div>
    </div>
  );
};

export default Sidebar;
