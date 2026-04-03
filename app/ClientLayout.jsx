"use client";

import { useState, useEffect } from "react";
import Navbar from "../src/components/AppBar/Navbar";
import Sidebar from "../src/components/AppBar/Sidebar";
import EditLabelsModal from "@/src/components/Modals/EditLabelsModal";
import ShortcutModal from "@/src/components/Modals/ShortcutModal";
import { usePathname } from "next/navigation";
import { SearchProvider } from "@/src/context/SearchContext";
import { PageTitleProvider } from "@/src/context/PageTitleContext";
import {
  Provider as ReduxProvider,
  useSelector,
  useDispatch,
} from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/src/redux/store";
import { toggleSidebar } from "@/src/redux/uiSlice";
import { setLabels, mergeLabels } from "@/src/redux/noteSlice";
import { useFirebaseSync } from "@/src/hooks/useFirebaseSync";

function LayoutContent({ children }) {
  useFirebaseSync();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isSharePage = pathname?.startsWith("/share/");
  
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);
  const labels = useSelector((state) => state.note.labels);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleSidebar = () => dispatch(toggleSidebar());
  const handleSetLabels = (newLabels) => dispatch(setLabels(newLabels));
  const handleMergeLabels = (oldId, newId) => dispatch(mergeLabels({ oldLabelId: oldId, newLabelId: newId }));

  const sidebarOpen = mounted ? isSidebarOpen : false;

  if (isSharePage) {
    return <main className="min-h-screen bg-white dark:bg-[#202124]">{children}</main>;
  }

  return (
    <>
      <Navbar
        onToggleSidebar={handleToggleSidebar}
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
        setLabels={handleSetLabels}
        onMergeLabels={handleMergeLabels}
      />

      <ShortcutModal
        isOpen={isShortcutModalOpen}
        onClose={() => setIsShortcutModalOpen(false)}
      />
    </>
  );
}

export default function ClientLayout({ children }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PageTitleProvider>
          <SearchProvider>
            <LayoutContent>{children}</LayoutContent>
          </SearchProvider>
        </PageTitleProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
