"use client";

import { useState, useEffect } from "react";
import IconButton from "../Commons/IconButton";
import { iconMap } from "@/src/utils/Icon";
import { SHARE_NOTE_TEXT } from "@/src/utils/Constants";
import { useNoteShare } from "@/src/hooks/useNoteShare";

const ShareModal = ({ note, ownerUid, isOpen, onClose, onUpdateNote }) => {
  const { enableShare, disableShare, loading } = useNoteShare();
  const [isShared, setIsShared] = useState(!!note.shareId);
  const [shareId, setShareId] = useState(note.shareId || "");
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/share/${shareId}` : "";

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleToggleShare = async () => {
    try {
      if (!isShared) {
        const newShareId = await enableShare(ownerUid, note);
        setShareId(newShareId);
        setIsShared(true);
        onUpdateNote({ ...note, shareId: newShareId });
      } else {
        await disableShare(shareId);
        setIsShared(false);
        setShareId("");
        onUpdateNote({ ...note, shareId: null });
      }
    } catch (error) {
      alert("Đã có lỗi xảy ra khi thay đổi trạng thái chia sẻ.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full max-w-md bg-white dark:bg-[#202124] rounded-lg shadow-xl p-6 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">{SHARE_NOTE_TEXT.TITLE}</h2>
          <IconButton icon={iconMap.close} onClick={onClose} size="w-8 h-8" />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10">
            <span className="font-medium text-gray-700 dark:text-gray-300">{SHARE_NOTE_TEXT.TOGGLE_LABEL}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isShared}
                onChange={handleToggleShare}
                disabled={loading}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {isShared && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">Link chia sẻ của bạn:</p>
              <div className="flex gap-2">
                <input 
                  readOnly 
                  value={shareUrl}
                  className="flex-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded px-3 py-2 text-sm text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button 
                  onClick={handleCopy}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap"
                >
                  {copied ? SHARE_NOTE_TEXT.COPIED_SUCCESS : SHARE_NOTE_TEXT.COPY_BUTTON}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 rounded text-sm font-medium transition-colors"
          >
            {SHARE_NOTE_TEXT.CLOSE_BUTTON}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
