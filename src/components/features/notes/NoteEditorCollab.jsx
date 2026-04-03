"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { EditorContent } from "@tiptap/react";
import useCollabEditor from "@/src/hooks/useCollabEditor";
import TiptapToolbar from "../../Commons/TiptapToolbar";
import IconButton from "../../Commons/IconButton";
import { iconMap } from "@/src/utils/Icon";
import ColorPicker from "../../Commons/ColorPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import {
  NOTE_PROPERTIES,
  EDIT_NOTE_TEXT,
  NOTE_CARD_BUTTON,
  COLLAB_TEXT,
} from "@/src/utils/Constants";
import { encodeSnapshot, decodeSnapshot } from "@/src/utils/Yjsutils";

const CollabToast = ({ message, type }) => {
  if (!message) return null;
  const anim = "transition-all duration-300 transform translate-y-0 opacity-100";
  const isSuccess = type === "success";
  const bgColor = isSuccess
    ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-800"
    : "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-200 dark:border-red-800";
  
  return (
    <div
      className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg border shadow-lg text-sm font-medium flex items-center gap-2 ${bgColor} ${anim}`}
    >
      <FontAwesomeIcon icon={isSuccess ? iconMap.crown : iconMap.warning} />
      {message}
    </div>
  );
};

const EditorWithProvider = ({
  ydoc,
  provider,
  initialTitle = "",
  initialContent = "",
  initialYjsSnapshot = null,
  initialColorClass = "bg-white",
  showTimestamp = false,
  timestamp,
  collabProfile,
  onSave,
  onCancel,
  className = "",
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [colorClass, setColorClass] = useState(initialColorClass);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const [toast, setToast] = useState(null);

  const titleRef = useRef(title);
  const colorRef = useRef(colorClass);

  useEffect(() => {
    titleRef.current = title;
  }, [title]);
  useEffect(() => {
    colorRef.current = colorClass;
  }, [colorClass]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleSaveDebounced = useCallback(
    ({ content, yjsSnapshot }) => {
      onSave?.({
        title: titleRef.current,
        content,
        yjsSnapshot,
        [NOTE_PROPERTIES.COLOR_CLASS]: colorRef.current,
      });
    },
    [onSave],
  );

  const { editor, isUserCaptain, captainInfo, onlineCount } = useCollabEditor({
    ydoc,
    provider,
    initialContent,
    collabProfile,
    yjsSnapshot: initialYjsSnapshot,
    onSaveDebounced: handleSaveDebounced,
    onCaptainElected: () => showToast(COLLAB_TEXT.CAPTAIN_ELECTED, "success"),
    onCaptainLeft: () => showToast(COLLAB_TEXT.CAPTAIN_LEFT, "error"),
  });

  useEffect(() => {
    if (!ydoc) return;
    const metadata = ydoc.getMap("metadata");

    const handleMetaChange = () => {
      const newTitle = metadata.get("title");
      const newColor = metadata.get("colorClass");
      if (newTitle !== undefined && newTitle !== titleRef.current)
        setTitle(newTitle);
      if (newColor !== undefined && newColor !== colorRef.current)
        setColorClass(newColor);
    };

    metadata.observe(handleMetaChange);

    if (metadata.get("title") === undefined && initialTitle)
      metadata.set("title", initialTitle);
    if (metadata.get("colorClass") === undefined && initialColorClass)
      metadata.set("colorClass", initialColorClass);

    return () => metadata.unobserve(handleMetaChange);
  }, [ydoc, initialTitle, initialColorClass]);

  const updateMeta = useCallback(
    (key, value) => {
      if (!ydoc) return;
      ydoc.getMap("metadata").set(key, value);
    },
    [ydoc],
  );

  const handleClose = () => {
    if (editor && ydoc && typeof window !== "undefined") {
      onSave?.({
        title: titleRef.current,
        content: editor.getHTML(),
        yjsSnapshot: encodeSnapshot(ydoc),
        [NOTE_PROPERTIES.COLOR_CLASS]: colorRef.current,
      });
    }
    onCancel?.();
  };

  if (!editor) return null;

  const finalBg =
    colorClass === "bg-white" ? "bg-white dark:bg-[#202124]" : colorClass;

  return (
    <div
      className={`relative flex flex-col ${finalBg} ${className} transition-colors duration-200 overflow-hidden rounded-lg shadow-lg border border-[#e0e0e0] dark:border-[#5f6368]`}
    >
      <CollabToast message={toast?.message} type={toast?.type} />
      <style>{`
        .collaboration-cursor__caret { position: relative; border-left: 2px solid; border-right: 2px solid; margin-left: -1px; margin-right: -1px; pointer-events: none; word-break: normal; }
        .collaboration-cursor__label { position: absolute; top: -1.4em; left: -2px; font-size: 11px; font-weight: 600; font-family: sans-serif; font-style: normal; color: #fff; padding: 1px 3px; border-radius: 3px 3px 3px 0; white-space: nowrap; z-index: 10; user-select: none; }
      `}</style>

      <div className="flex justify-between items-center px-4 py-2 bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5">
        <div className="text-xs font-medium text-gray-500 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          {onlineCount} {COLLAB_TEXT.ONLINE_SUFFIX}
          {isUserCaptain ? (
            <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 rounded text-[10px] font-bold border border-yellow-300 dark:border-yellow-700 uppercase tracking-tighter flex items-center gap-1">
              <FontAwesomeIcon icon={iconMap.crown} />
              {COLLAB_TEXT.CAPTAIN_BADGE}
            </span>
          ) : captainInfo ? (
            <span className="ml-2 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-[10px] font-bold border border-blue-200 dark:border-blue-800 uppercase tracking-tighter">
              {COLLAB_TEXT.SYNCING_BY} {captainInfo.name}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: collabProfile.color }}
          ></div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {collabProfile.name}
          </span>
        </div>
      </div>

      <div className="flex flex-col p-4 pb-2 text-[#202124] dark:text-[#e8eaed]">
        {showTimestamp && timestamp && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {EDIT_NOTE_TEXT.TIMESTAMP_PREFIX}{" "}
            {new Date(timestamp).toLocaleString()}
          </p>
        )}
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            titleRef.current = e.target.value;
            updateMeta("title", e.target.value);
          }}
          placeholder={EDIT_NOTE_TEXT.PLACEHOLDER_TITLE}
          className="w-full bg-transparent border-none outline-none text-[20px] font-medium dark:text-[#e8eaed] mb-3"
          autoFocus={!initialTitle && !initialContent}
        />
        <div className="mt-2 cursor-text min-h-[150px]">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="flex justify-between items-center px-4 py-2 mt-auto border-t border-black/5 dark:border-white/5">
        <div className="flex gap-2">
          <div className="relative">
            <IconButton
              icon={iconMap.palette}
              title={NOTE_CARD_BUTTON[2]?.title}
              onClick={() => setShowColorPicker(!showColorPicker)}
              size="w-8 h-8"
            />
            {showColorPicker && (
              <ColorPicker
                activeColorClass={colorClass}
                onColorSelect={(color) => {
                  setColorClass(color.colorClass);
                  colorRef.current = color.colorClass;
                  setShowColorPicker(false);
                  updateMeta("colorClass", color.colorClass);
                }}
                onClose={() => setShowColorPicker(false)}
              />
            )}
          </div>
          <div className="relative">
            <IconButton
              icon={iconMap.font}
              title={NOTE_CARD_BUTTON[1]?.title}
              onClick={() => setShowFormatPicker(!showFormatPicker)}
              size="w-8 h-8"
            />
            {showFormatPicker && (
              <TiptapToolbar
                editor={editor}
                onClose={() => setShowFormatPicker(false)}
              />
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {onCancel && (
            <button
              onClick={handleClose}
              className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-sm font-medium transition-colors dark:text-[#e8eaed]"
            >
              {COLLAB_TEXT.CLOSE_BUTTON}
            </button>
          )}
          <IconButton
            icon={iconMap.check}
            title={EDIT_NOTE_TEXT.TOOLTIP_SAVE}
            onClick={handleClose}
            size="w-8 h-8"
            textClass="text-[14px]"
          />
        </div>
      </div>
    </div>
  );
};

const NoteEditorCollab = (props) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [instances, setInstances] = useState(null);
  const [collabProfile, setCollabProfile] = useState({
    name: COLLAB_TEXT.DEFAULT_USER_NAME,
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    isOwner: false,
  });

  useEffect(() => {
    if (userInfo) {
      const ownerStatus = !!(props.ownerUid && String(userInfo.uid) === String(props.ownerUid));
      console.log(`[Collab] UserUID: ${userInfo.uid}, OwnerUID: ${props.ownerUid}, Match: ${ownerStatus}`);
      setCollabProfile({
        name: userInfo.displayName || userInfo.email?.split("@")[0] || COLLAB_TEXT.DEFAULT_USER_NAME,
        color: collabProfile.color,
        isOwner: ownerStatus,
      });
    }
  }, [userInfo, props.ownerUid]);

  const initialSnapshotRef = useRef(props.initialYjsSnapshot);

  useEffect(() => {
    const doc = new Y.Doc();

    if (initialSnapshotRef.current && typeof window !== "undefined") {
      try {
        const binary = decodeSnapshot(initialSnapshotRef.current);
        Y.applyUpdate(doc, binary);
      } catch (e) {}
    }

    const signalingUrls = [
      "wss://y-webrtc-signaling.p-p.dev",
      "wss://y-webrtc.fly.dev",
      "wss://signaling.yjs.dev",
      "wss://y-webrtc-signaling.up.railway.app",
    ];

    const roomName = `note-room-${props.noteId}`;
    console.log(`[Collab] Joining room: ${roomName} | isOwner: ${collabProfile.isOwner}`);

    const peerOpts = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
      ],
    };

    const prov = new WebrtcProvider(roomName, doc, {
      signalingUrls,
      peerOpts,
    });

    if (typeof window !== "undefined") {
      prov.awareness.setLocalStateField("user", {
        name: collabProfile.name,
        color: collabProfile.color,
        isOwner: collabProfile.isOwner,
      });
    }

    setInstances({ ydoc: doc, provider: prov });

    return () => {
      prov.destroy();
      doc.destroy();
      setInstances(null);
    };
  }, [props.noteId, collabProfile.name, collabProfile.color, collabProfile.isOwner]);

  useEffect(() => {
    if (
      instances?.ydoc &&
      props.initialYjsSnapshot &&
      typeof window !== "undefined"
    ) {
      try {
        const binary = decodeSnapshot(props.initialYjsSnapshot);
        Y.applyUpdate(instances.ydoc, binary);
      } catch (e) {}
    }
  }, [props.initialYjsSnapshot, instances?.ydoc]);

  if (!instances) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-8 bg-white dark:bg-[#202124] ${props.className || ""} overflow-hidden rounded-lg shadow-lg border border-[#e0e0e0] dark:border-[#5f6368] min-h-75`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-sm text-gray-500">{COLLAB_TEXT.CONNECTING_ROOM}</p>
      </div>
    );
  }

  return (
    <EditorWithProvider
      ydoc={instances.ydoc}
      provider={instances.provider}
      collabProfile={collabProfile}
      {...props}
    />
  );
};

export default NoteEditorCollab;
