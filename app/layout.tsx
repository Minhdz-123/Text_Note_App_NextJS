"use client";

import "@/src/lib/fontawesome";
import "./globals.css";
import { useState } from "react";
import Navbar from "../src/components/AppBar/Navbar";
import Sidebar from "../src/components/AppBar/Sidebar";
import useLocalStorage from "@/src/hooks/useLocalStorage";
import EditLabelsModal from "@/src/components/Modals/EditLabelsModal";
import ShortcutModal from "@/src/components/Modals/ShortcutModal";
import { SearchProvider } from "@/src/context/SearchContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage(
    "sidebar_open",
    true,
  );
  const [labels, setLabels] = useLocalStorage("keep_labels", []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <html lang="vi">
      <body className="min-h-screen bg-white dark:bg-[#202124] transition-colors duration-200">
        <SearchProvider>
          <Navbar
            onToggleSidebar={toggleSidebar}
            onOpenShortcutModal={() => setIsShortcutModalOpen(true)}
          />

          <div className="flex">
            <Sidebar
              isOpen={isSidebarOpen}
              labels={labels}
              onEditLabels={() => setIsModalOpen(true)}
            />

            <main
              className={`flex-1 transition-all duration-150 pt-16 ${
                isSidebarOpen ? "ml-70" : "ml-18"
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
      </body>
    </html>
  );
}
