import "server-only";
import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";
import { isOwnUploadUrl } from "@/lib/cloudinary";
import type { PostHeading } from "@/types";
import { articleExtensions, SAFE_LINK } from "./extensions";

/*
 * Server-side pipeline for article bodies: clean the Tiptap JSON against an
 * allow-list, render HTML with the same extensions the editor uses, then add
 * heading anchors, table wrappers, captions and safe external links.
 */

const NODES = new Set([
  "doc", "paragraph", "text", "heading", "bulletList", "orderedList", "listItem", "blockquote",
  "codeBlock", "horizontalRule", "hardBreak", "image", "table", "tableRow", "tableCell",
  "tableHeader", "youtube",
]);
const MARKS = new Set(["bold", "italic", "underline", "strike", "code", "link", "highlight", "textStyle"]);
const COLOR = /^(#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+))?\s*\))$/i;
const YOUTUBE = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.be)\//i;
const MAX_JSON_CHARS = 600_000;

function cleanMarks(marks: JSONContent["marks"]) {
  const out: NonNullable<JSONContent["marks"]> = [];
  for (const mark of marks ?? []) {
    if (!MARKS.has(mark.type)) continue;
    const attrs = { ...(mark.attrs ?? {}) };
    if (mark.type === "link") {
      if (typeof attrs.href !== "string" || !SAFE_LINK.test(attrs.href)) continue;
      out.push({ type: "link", attrs: { href: attrs.href } });
      continue;
    }
    if (mark.type === "highlight" || mark.type === "textStyle") {
      if (attrs.color != null && !(typeof attrs.color === "string" && COLOR.test(attrs.color))) {
        attrs.color = null;
      }
    }
    out.push({ type: mark.type, attrs });
  }
  return out.length ? out : undefined;
}

function cleanNode(node: JSONContent): JSONContent | null {
  if (!node || typeof node.type !== "string" || !NODES.has(node.type)) return null;
  const attrs = { ...(node.attrs ?? {}) };

  if (node.type === "image") {
    if (!isOwnUploadUrl(attrs.src, "blog")) return null;
    return {
      type: "image",
      attrs: {
        src: attrs.src,
        alt: typeof attrs.alt === "string" ? attrs.alt.slice(0, 200) : "",
        title: typeof attrs.title === "string" ? attrs.title.slice(0, 300) : null,
      },
    };
  }
  if (node.type === "youtube" && !(typeof attrs.src === "string" && YOUTUBE.test(attrs.src))) return null;
  if (node.type === "heading" && ![2, 3, 4].includes(Number(attrs.level))) attrs.level = 2;
  if (node.type === "text") {
    return typeof node.text === "string" && node.text.length
      ? { type: "text", text: node.text, marks: cleanMarks(node.marks) }
      : null;
  }

  const content = (node.content ?? []).map(cleanNode).filter((n): n is JSONContent => n !== null);
  return { type: node.type, attrs, ...(content.length ? { content } : {}) };
}

export function sanitizeDoc(raw: unknown): JSONContent | string {
  if (!raw || typeof raw !== "object") return "The article body is empty.";
  if (JSON.stringify(raw).length > MAX_JSON_CHARS) return "This article is too long to save. Split it into two posts.";
  const doc = cleanNode(raw as JSONContent);
  if (!doc || doc.type !== "doc") return "The article body couldn't be read. Please try again.";
  return doc;
}

function textOf(node: JSONContent): string {
  if (node.type === "text") return node.text ?? "";
  return (node.content ?? []).map(textOf).join(node.type === "paragraph" || node.type === "heading" ? "" : " ");
}

export function plainText(doc: JSONContent): string {
  return (doc.content ?? []).map(textOf).join("\n").replace(/\s+/g, " ").trim();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function collectHeadings(doc: JSONContent): PostHeading[] {
  const out: PostHeading[] = [];
  const used = new Map<string, number>();
  const walk = (node: JSONContent) => {
    if (node.type === "heading") {
      const level = Number(node.attrs?.level ?? 2);
      const text = textOf(node).trim();
      if ((level === 2 || level === 3) && text) {
        const base = slugify(text) || "section";
        const n = used.get(base) ?? 0;
        used.set(base, n + 1);
        out.push({ id: n ? `${base}-${n + 1}` : base, text, level });
      } else {
        out.push({ id: "", text, level });
      }
      return;
    }
    node.content?.forEach(walk);
  };
  walk(doc);
  return out;
}

export function renderArticle(doc: JSONContent) {
  const all = collectHeadings(doc);
  let html = generateHTML(doc, articleExtensions);

  // Anchor ids on h2/h3 in document order, for the contents rail.
  let i = 0;
  html = html.replace(/<h([2-4])(\s[^>]*)?>/g, (match, level: string, rest = "") => {
    const heading = all[i++];
    return heading?.id && level !== "4" ? `<h${level} id="${heading.id}"${rest}>` : match;
  });

  // Wide tables scroll inside their own box on small screens.
  html = html.replace(/<table/g, '<div class="table-wrap"><table').replace(/<\/table>/g, "</table></div>");

  // An image's title becomes its visible caption.
  html = html.replace(/<img([^>]*?)title="([^"]+)"([^>]*)>/g, (_m, a: string, caption: string, b: string) =>
    `<figure><img${a}${b}><figcaption>${caption}</figcaption></figure>`,
  );

  // External links open in a new tab.
  html = html.replace(/<a ([^>]*?)href="(https?:\/\/[^"]+)"([^>]*)>/g, (_m, a: string, href: string, b: string) => {
    const attrs = `${a}href="${href}"${b}`.replace(/\s*target="[^"]*"/g, "");
    return `<a ${attrs} target="_blank">`;
  });

  // Empty paragraphs left at the end of the editor add dead space.
  html = html.replace(/(<p(\s[^>]*)?><\/p>)+$/, "");

  const text = plainText(doc);
  const words = text ? text.split(/\s+/).length : 0;
  return {
    html,
    headings: all.filter((h) => h.id),
    readingMinutes: Math.max(1, Math.round(words / 220)),
    words,
    text,
  };
}
