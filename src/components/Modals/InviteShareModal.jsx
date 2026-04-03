"use client";

import { useState } from "react";
import BaseModal from "../Commons/BaseModal";
import TextInput from "../Commons/TextInput";
import { iconMap } from "@/src/utils/Icon";
import { SHARE_NOTE_TEXT, INVITATION_TEXT } from "@/src/utils/Constants";
import { useNoteShare } from "@/src/hooks/useNoteShare";
import { useInvitations } from "@/src/hooks/useInvitations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InviteShareModal = ({ note, ownerUid, isOpen, onClose, onUpdateNote, currentUser }) => {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { enableShare, disableShare, loading: shareLoading } = useNoteShare();
  const { sendInvite, sendLoading } = useInvitations();

  const handleToggleShare = async (e) => {
    const isEnabled = e.target.checked;
    if (isEnabled) {
      try {
        const newShareId = await enableShare(ownerUid, note);
        onUpdateNote({ ...note, shareId: newShareId });
      } catch (err) {}
    } else {
      if (note.shareId) {
        try {
          await disableShare(note.shareId);
          const updatedNote = { ...note };
          delete updatedNote.shareId;
          onUpdateNote(updatedNote);
        } catch (err) {}
      }
    }
  };

  const handleCopy = async () => {
    if (!note.shareId) return;
    const url = `${window.location.origin}/share/${note.shareId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!email) return;

    try {
      const newShareId = await sendInvite(email, currentUser, note);
      setSuccessMsg(INVITATION_TEXT.SUCCESS_SENT);
      setEmail("");
      setTimeout(() => setSuccessMsg(""), 3000);

      if (newShareId && !note.shareId) {
        onUpdateNote({ ...note, shareId: newShareId });
      }
    } catch (err) {
      setErrorMsg(err.message || INVITATION_TEXT.ERROR_GENERIC);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={SHARE_NOTE_TEXT.TITLE} className="w-[450px]">
      <div className="flex flex-col gap-6">
        
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {INVITATION_TEXT.TITLE}
          </span>
          <form onSubmit={handleSendInvite} className="flex gap-2">
            <div className="flex-1">
              <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={INVITATION_TEXT.PLACEHOLDER_EMAIL}
                type="email"
                disabled={sendLoading}
              />
            </div>
            <button
              type="submit"
              disabled={sendLoading || !email}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {sendLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <FontAwesomeIcon icon={iconMap.send} />
                  {INVITATION_TEXT.BUTTON_SEND}
                </>
              )}
            </button>
          </form>
          {errorMsg && <span className="text-xs text-red-500">{errorMsg}</span>}
          {successMsg && <span className="text-xs text-green-500">{successMsg}</span>}
        </div>

        <div className="w-full h-px bg-gray-200 dark:bg-white/10"></div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {SHARE_NOTE_TEXT.TOGGLE_LABEL}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={!!note.shareId}
              onChange={handleToggleShare}
              disabled={shareLoading}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {note.shareId && (
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
            <div className="flex-1 text-xs text-gray-500 truncate overflow-hidden bg-transparent outline-none">
              {`${window.location.origin}/share/${note.shareId}`}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md transition-colors"
            >
              {copied ? (
                <>
                  <FontAwesomeIcon icon={iconMap.check} className="text-green-500" />
                  <span className="text-green-500">{SHARE_NOTE_TEXT.COPIED_SUCCESS}</span>
                </>
              ) : (
                <>
                  {SHARE_NOTE_TEXT.COPY_BUTTON}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default InviteShareModal;
