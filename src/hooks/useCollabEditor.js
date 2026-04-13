"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useEditor, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { FORMAT_CONFIG } from "@/src/utils/Constants";
import { encodeSnapshot, isCaptain, getCaptainId } from "@/src/utils/Yjsutils";

const CustomHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level;
    const classes = FORMAT_CONFIG[`h${level}`]?.classes || "";
    return [
      "h" + level,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: classes,
      }),
      0,
    ];
  },
});

const createCustomMark = (BaseMark, tag, configKey) =>
  BaseMark.extend({
    renderHTML({ HTMLAttributes }) {
      return [
        tag,
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          class: FORMAT_CONFIG[configKey]?.classes || "",
        }),
        0,
      ];
    },
  });

const CustomBold = createCustomMark(Bold, "strong", "strong").extend({ name: "customBold" });
const CustomItalic = createCustomMark(Italic, "em", "em").extend({ name: "customItalic" });
const CustomUnderline = createCustomMark(Underline, "u", "u").extend({ name: "customUnderline" });

export default function useCollabEditor({
  ydoc,
  provider,
  initialContent,
  collabProfile,
  yjsSnapshot,
  onSaveDebounced,
  onCaptainElected,
  onCaptainLeft,
}) {
  const debounceRef = useRef(null);
  const [isUserCaptain, setIsUserCaptain] = useState(false);
  const [captainInfo, setCaptainInfo] = useState(null);
  const [onlineCount, setOnlineCount] = useState(1);

  const extensions = useMemo(() => {
    const baseExtensions = [
      StarterKit.configure({
        history: false,
        heading: false,
        bold: false,
        italic: false,
        strike: false,
        code: false,
        blockquote: false,
      }),
      CustomHeading.configure({ levels: [1, 2] }),
      CustomBold,
      CustomItalic,
      CustomUnderline,
    ];

    if (ydoc && provider) {
      baseExtensions.push(
        Collaboration.configure({
          document: ydoc,
        })
      );
    }

    return baseExtensions;
  }, [ydoc, provider]);

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions,
      content: "",
      editorProps: {
        attributes: {
          class:
            "outline-none min-h-[5rem] max-h-[20rem] overflow-y-auto w-full text-sm",
        },
      },
    },
    [extensions]
  );

  useEffect(() => {
    if (!editor || !initialContent || yjsSnapshot) return;

    const timer = setTimeout(() => {
      if (editor.isInitialized && editor.state && editor.isEmpty) {
        editor.commands.setContent(initialContent);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [editor, initialContent, yjsSnapshot]);

  const updateCaptainInfo = useCallback((awareness, captainId) => {
    if (captainId === null) {
      setCaptainInfo(null);
      return;
    }
    const captainState = awareness.getStates().get(captainId);
    if (captainState?.user) {
      setCaptainInfo((prev) => {
        if (
          prev?.name === captainState.user.name &&
          prev?.color === captainState.user.color
        ) {
          return prev;
        }
        return {
          name: captainState.user.name,
          color: captainState.user.color,
        };
      });
    }
  }, []);

  const callbacksRef = useRef({ onCaptainElected, onCaptainLeft });
  useEffect(() => {
    callbacksRef.current = { onCaptainElected, onCaptainLeft };
  }, [onCaptainElected, onCaptainLeft]);

  useEffect(() => {
    if (!provider?.awareness) return;

    const awareness = provider.awareness;
    let prevCaptainId = getCaptainId(awareness);

    const handleAwarenessChange = () => {
      const newCaptainId = getCaptainId(awareness);
      const amICaptain = String(ydoc.clientID) === String(newCaptainId);
      const statesCount = awareness.getStates().size;

      setIsUserCaptain(amICaptain);
      setOnlineCount(statesCount);
      updateCaptainInfo(awareness, newCaptainId);

      if (newCaptainId !== prevCaptainId && prevCaptainId !== null) {
        if (!awareness.getStates().has(prevCaptainId)) {
          callbacksRef.current.onCaptainLeft?.();
        }
        if (amICaptain) {
          callbacksRef.current.onCaptainElected?.();
        }
      }

      prevCaptainId = newCaptainId;
    };

    awareness.on("change", handleAwarenessChange);

    return () => {
      awareness.off("change", handleAwarenessChange);
    };
  }, [provider, updateCaptainInfo]);

  useEffect(() => {
    if (!editor || !ydoc || !provider) return;

    const handleUpdate = () => {
      const awareness = provider.awareness;

      if (!isCaptain(awareness, ydoc.clientID)) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        if (!isCaptain(awareness, ydoc.clientID)) return;

        const content = editor.getHTML();
        const snapshotBase64 = encodeSnapshot(ydoc);
        onSaveDebounced({ content, yjsSnapshot: snapshotBase64 });
      }, 3000);
    };

    ydoc.on("update", handleUpdate);
    return () => {
      ydoc.off("update", handleUpdate);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [editor, onSaveDebounced, provider, ydoc]);

  return { editor, isUserCaptain, captainInfo, onlineCount };
}
