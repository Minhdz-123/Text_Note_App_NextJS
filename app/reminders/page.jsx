"use client";

import React, { useEffect } from "react";
import { usePageTitle } from "@/src/context/PageTitleContext";

const RemindersPage = () => {
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle("Lời nhắc");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4">
      {/* Placeholder for reminders */}
    </div>
  );
};

export default RemindersPage;
