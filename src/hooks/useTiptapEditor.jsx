"use client";

import { useEditor, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import { FORMAT_CONFIG } from "@/src/utils/Constants";

const CustomHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level;
    const classes = FORMAT_CONFIG[`h${level}`]?.classes || "";
    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: classes,
      }),
      0,
    ];
  },
});

const CustomBold = Bold.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "strong",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: FORMAT_CONFIG.strong?.classes || "",
      }),
      0,
    ];
  },
});

const CustomItalic = Italic.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "em",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: FORMAT_CONFIG.em?.classes || "",
      }),
      0,
    ];
  },
});

const CustomUnderline = Underline.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "u",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: FORMAT_CONFIG.u?.classes || "",
      }),
      0,
    ];
  },
});

export default function useTiptapEditor(initialContent, onUpdate) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        bold: false,
        italic: false,
      }),
      CustomHeading.configure({ levels: [1, 2] }),
      CustomBold,
      CustomItalic,
      CustomUnderline,
    ],
    content: initialContent || "",
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "outline-none min-h-[5rem] max-h-[20rem] overflow-y-auto w-full text-sm",
      },
    },
  });

  return editor;
}
