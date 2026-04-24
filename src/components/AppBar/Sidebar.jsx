"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SIDEBAR_MENU } from "@/src/utils/Constants";
import { iconMap } from "@/src/utils/Icon";
import { useInvitations } from "@/src/hooks/useInvitations";

const INVITATIONS_PATH = "/test-collaboration/invitations";

const Sidebar = ({ isOpen, labels = [], onEditLabels, onClose }) => {
  const [isHovered, setIsHovered] = useState(false);
  const userEmail = useSelector((state) => state.user.userInfo?.email);
  const { invitations } = useInvitations(userEmail);
  const pendingCount = invitations.length;

  const isExpanded = isOpen || isHovered;
  const pathname = usePathname();

  const renderSidebarItem = (id, icon, label, path, onClick = null) => {
    const isInvitationsItem = path === INVITATIONS_PATH;

    const itemContent = (
      <>
        <span className="w-12 h-12 shrink-0 flex items-center justify-center relative">
          <FontAwesomeIcon
            icon={icon}
            className="text-[1.2rem] transition-colors text-[#5f6368] dark:text-[#9aa0a6]"
          />
          {isInvitationsItem && pendingCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
              {pendingCount > 9 ? "9+" : pendingCount}
            </span>
          )}
        </span>
        <span
          className={`font-['Google_Sans',Roboto,Arial,sans-serif] text-[0.875rem] font-medium tracking-wide text-[#202124] dark:text-[#e8eaed] whitespace-nowrap transition-all duration-150 ${isExpanded ? "opacity-100 ml-3" : "opacity-0 w-0 overflow-hidden"
            }`}
        >
          {label}
          {isInvitationsItem && pendingCount > 0 && isExpanded && (
            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full leading-none">
              {pendingCount > 9 ? "9+" : pendingCount}
            </span>
          )}
        </span>
      </>
    );

    const baseClass = `group select-none flex items-center h-12 cursor-pointer outline-none relative transition-all duration-150 ${isExpanded ? "rounded-r-full mr-0" : "rounded-full mx-2"
      }`;

    if (path) {
      const isActive = pathname === path;

      return (
        <Link
          key={id}
          href={path}
          className={`${baseClass} ${isActive
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
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-[980] md:hidden"
          onClick={onClose}
        />
      )}
      <div
        onMouseEnter={() => !isOpen && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`bg-white dark:bg-[#202124] flex flex-col h-[calc(100vh-64px)] fixed top-16 left-0 overflow-x-hidden pt-2 z-[985] transition-all duration-150 ease-in-out shadow-sm ${isExpanded ? "w-70 shadow-xl" : "w-0 md:w-18"
          }`}
      >
        <div className="flex-[1_0_auto]">
          {SIDEBAR_MENU.filter((item) => item.action !== "edit_labels").map(
            (item) =>
              renderSidebarItem(
                item.id,
                iconMap[item.iconKey],
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
                iconMap[item.iconKey],
                item.label,
                null,
                onEditLabels,
              ),
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
