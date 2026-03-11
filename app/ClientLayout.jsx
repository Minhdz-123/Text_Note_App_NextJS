"use client";

import { useState } from "react";
import Navbar from "../src/components/AppBar/Navbar";
import Sidebar from "../src/components/AppBar/Sidebar";
import useLocalStorage from "@/src/hooks/useLocalStorage";
import EditLabelsModal from "@/src/components/Modals/EditLabelsModal";
import ShortcutModal from "@/src/components/Modals/ShortcutModal";
import { SearchProvider } from "@/src/context/SearchContext";

export default function ClientLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen, sidebarLoaded] = useLocalStorage(
    "sidebar_open",
    true,
  );

  const [labels, setLabels] = useLocalStorage("keep_labels", []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const sidebarOpen = sidebarLoaded ? isSidebarOpen : false;

  return (
    <SearchProvider>
      <Navbar
        onToggleSidebar={toggleSidebar}
        onOpenShortcutModal={() => setIsShortcutModalOpen(true)}
      />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          labels={labels}
          onEditLabels={() => setIsModalOpen(true)}
        />

        <main
          className={`flex-1 transition-all duration-150 pt-16 ${
            sidebarOpen ? "ml-70" : "ml-18"
          }`}
        >
          <div className="p-4">{children}</div>
        </main>
      </div>

      <EditLabelsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        labels={labels}
        setLabels={setLabels}
      />

      <ShortcutModal
        isOpen={isShortcutModalOpen}
        onClose={() => setIsShortcutModalOpen(false)}
      />
    </SearchProvider>
  );
}
