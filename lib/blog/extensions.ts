import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import { TableKit } from "@tiptap/extension-table";
import Youtube from "@tiptap/extension-youtube";

/**
 * The ONE extension list for blog articles. The admin editor and the server
 * renderer both use it, so what the owner sees while writing is exactly what
 * gets published, and nothing outside this schema can be stored.
 */
export const SAFE_LINK = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;

export const articleExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3, 4] },
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      isAllowedUri: (url) => SAFE_LINK.test(url),
      HTMLAttributes: { rel: "noopener noreferrer", target: null },
    },
  }),
  Image.configure({ allowBase64: false, HTMLAttributes: { loading: "lazy" } }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Highlight.configure({ multicolor: true }),
  TextStyle,
  Color,
  TableKit.configure({ table: { resizable: false } }),
  Youtube.configure({ nocookie: true, controls: true, width: 640, height: 360, addPasteHandler: true }),
];

/** Brand-safe swatches offered in the editor. */
export const TEXT_COLORS = [
  { name: "Default", value: null },
  { name: "Orange", value: "#FF6600" },
  { name: "Amber", value: "#E69700" },
  { name: "Muted", value: "#A3A3A3" },
  { name: "Green", value: "#4ADE80" },
  { name: "Blue", value: "#60A5FA" },
  { name: "Red", value: "#F87171" },
] as const;

export const HIGHLIGHT_COLORS = [
  { name: "None", value: null },
  { name: "Orange", value: "rgba(255,102,0,0.28)" },
  { name: "Yellow", value: "rgba(250,204,21,0.30)" },
  { name: "Green", value: "rgba(74,222,128,0.25)" },
  { name: "Blue", value: "rgba(96,165,250,0.25)" },
] as const;
