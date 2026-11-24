"use client";

import * as React from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import * as Popover from "@radix-ui/react-popover";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  ChevronDown,
  Code,
  FileCode2,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Table2,
  Underline,
  Undo2,
  Unlink,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { articleExtensions, HIGHLIGHT_COLORS, SAFE_LINK, TEXT_COLORS } from "@/lib/blog/extensions";
import { uploadToCloudinary } from "@/lib/upload-client";
import { validateImage } from "../kit/image-picker";
import { inputClass } from "../kit/field";

/**
 * The article editor: Tiptap (ProseMirror) with the shared article extension
 * list, styled with the same `.article-body` rules as the public article page.
 */
export function RichEditor({
  initialContent,
  onChange,
  invalid,
}: {
  initialContent: Record<string, unknown> | null;
  onChange: (json: Record<string, unknown>, words: number) => void;
  invalid?: boolean;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      ...articleExtensions,
      Placeholder.configure({ placeholder: "Start writing your article… Use the toolbar or type “##” for a heading." }),
      CharacterCount,
    ],
    content: initialContent ?? "",
    editorProps: {
      attributes: {
        class: "article-body",
        "aria-label": "Article content",
        role: "textbox",
        "aria-multiline": "true",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON(), editor.storage.characterCount.words()),
    onCreate: ({ editor }) => onChange(editor.getJSON(), editor.storage.characterCount.words()),
  });

  return (
    <div
      className={cn(
        "xa-editor overflow-clip rounded-2xl bg-[#111111] ring-1 transition-shadow",
        invalid ? "ring-xa-red/60" : "ring-xa-line-strong focus-within:ring-white/25",
      )}
    >
      {editor ? <Toolbar editor={editor} /> : <div className="h-[53px] border-b border-xa-line" />}
      <div className="px-5 py-8 sm:px-10 sm:py-10">
        <div className="mx-auto max-w-[68ch]">
          {editor ? <EditorContent editor={editor} /> : <div className="h-[55vh]" aria-busy="true" />}
        </div>
      </div>
      {editor && <Footer editor={editor} />}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function Btn({
  label,
  shortcut,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  shortcut?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active ?? undefined}
      title={shortcut ? `${label} (${shortcut})` : label}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg text-xa-muted transition-colors duration-150 hover:bg-white/8 hover:text-xa-ink disabled:pointer-events-none disabled:opacity-35 [&_svg]:size-[17px]",
        active && "bg-white/12 text-xa-ink",
      )}
    >
      {children}
    </button>
  );
}

const Sep = () => <span className="mx-1 h-5 w-px shrink-0 bg-xa-line-strong" aria-hidden />;

const popoverClass =
  "xa z-[75] rounded-xl border border-xa-line-strong bg-xa-raised p-3 text-xa-ink shadow-[0_16px_40px_-12px_rgb(0_0_0/0.85)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95";

function Toolbar({ editor }: { editor: Editor }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      link: e.isActive("link"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
      image: e.isActive("image"),
      table: e.isActive("table"),
      block: e.isActive("heading", { level: 2 })
        ? "h2"
        : e.isActive("heading", { level: 3 })
          ? "h3"
          : e.isActive("heading", { level: 4 })
            ? "h4"
            : "p",
      align: (["center", "right", "justify"] as const).find((a) => e.isActive({ textAlign: a })) ?? "left",
      color: (e.getAttributes("textStyle").color as string | undefined) ?? null,
      highlight: (e.getAttributes("highlight").color as string | undefined) ?? null,
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="z-20 flex flex-wrap items-center gap-0.5 border-b border-xa-line bg-xa-panel px-2 py-2 lg:sticky lg:top-16"
    >
      <Btn label="Undo" shortcut="Ctrl+Z" disabled={!s.canUndo} onClick={() => chain().undo().run()}>
        <Undo2 />
      </Btn>
      <Btn label="Redo" shortcut="Ctrl+Shift+Z" disabled={!s.canRedo} onClick={() => chain().redo().run()}>
        <Redo2 />
      </Btn>
      <Sep />

      <label className="sr-only" htmlFor="xa-block-type">
        Text style
      </label>
      <div className="relative shrink-0">
        <select
          id="xa-block-type"
          value={s.block}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") chain().setParagraph().run();
            else chain().toggleHeading({ level: Number(v.slice(1)) as 2 | 3 | 4 }).run();
          }}
          className="h-9 appearance-none rounded-lg bg-transparent pr-7 pl-2.5 text-sm font-semibold text-xa-ink hover:bg-white/8 focus:bg-white/8"
        >
          <option value="p" className="bg-xa-raised">Paragraph</option>
          <option value="h2" className="bg-xa-raised">Heading</option>
          <option value="h3" className="bg-xa-raised">Subheading</option>
          <option value="h4" className="bg-xa-raised">Small heading</option>
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-xa-muted" />
      </div>
      <Sep />

      <Btn label="Bold" shortcut="Ctrl+B" active={s.bold} onClick={() => chain().toggleBold().run()}>
        <Bold />
      </Btn>
      <Btn label="Italic" shortcut="Ctrl+I" active={s.italic} onClick={() => chain().toggleItalic().run()}>
        <Italic />
      </Btn>
      <Btn label="Underline" shortcut="Ctrl+U" active={s.underline} onClick={() => chain().toggleUnderline().run()}>
        <Underline />
      </Btn>
      <Btn label="Strikethrough" shortcut="Ctrl+Shift+S" active={s.strike} onClick={() => chain().toggleStrike().run()}>
        <Strikethrough />
      </Btn>
      <Btn label="Inline code" shortcut="Ctrl+E" active={s.code} onClick={() => chain().toggleCode().run()}>
        <Code />
      </Btn>
      <Swatches
        label="Text colour"
        icon={<Baseline />}
        current={s.color}
        colors={TEXT_COLORS}
        onPick={(c) => (c ? chain().setColor(c).run() : chain().unsetColor().run())}
      />
      <Swatches
        label="Highlight"
        icon={<Highlighter />}
        current={s.highlight}
        colors={HIGHLIGHT_COLORS}
        onPick={(c) => (c ? chain().setHighlight({ color: c }).run() : chain().unsetHighlight().run())}
      />
      <Sep />

      <LinkButton editor={editor} active={s.link} />
      <Sep />

      <Btn label="Align left" active={s.align === "left"} onClick={() => chain().setTextAlign("left").run()}>
        <AlignLeft />
      </Btn>
      <Btn label="Align centre" active={s.align === "center"} onClick={() => chain().setTextAlign("center").run()}>
        <AlignCenter />
      </Btn>
      <Btn label="Align right" active={s.align === "right"} onClick={() => chain().setTextAlign("right").run()}>
        <AlignRight />
      </Btn>
      <Btn label="Justify" active={s.align === "justify"} onClick={() => chain().setTextAlign("justify").run()}>
        <AlignJustify />
      </Btn>
      <Sep />

      <Btn label="Bulleted list" shortcut="Ctrl+Shift+8" active={s.bullet} onClick={() => chain().toggleBulletList().run()}>
        <List />
      </Btn>
      <Btn label="Numbered list" shortcut="Ctrl+Shift+7" active={s.ordered} onClick={() => chain().toggleOrderedList().run()}>
        <ListOrdered />
      </Btn>
      <Btn label="Quote" shortcut="Ctrl+Shift+B" active={s.quote} onClick={() => chain().toggleBlockquote().run()}>
        <Quote />
      </Btn>
      <Btn label="Code block" shortcut="Ctrl+Alt+C" active={s.codeBlock} onClick={() => chain().toggleCodeBlock().run()}>
        <FileCode2 />
      </Btn>
      <Btn label="Divider line" onClick={() => chain().setHorizontalRule().run()}>
        <Minus />
      </Btn>
      <Sep />

      <ImageButton editor={editor} selected={s.image} />
      <YoutubeButton editor={editor} />
      <TableMenu editor={editor} inTable={s.table} />
      <Sep />

      <Btn label="Clear formatting" onClick={() => chain().unsetAllMarks().clearNodes().run()}>
        <RemoveFormatting />
      </Btn>
    </div>
  );
}

function Swatches({
  label,
  icon,
  current,
  colors,
  onPick,
}: {
  label: string;
  icon: React.ReactNode;
  current: string | null;
  colors: readonly { name: string; value: string | null }[];
  onPick: (value: string | null) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          aria-label={label}
          title={label}
          className="relative flex size-9 shrink-0 items-center justify-center rounded-lg text-xa-muted hover:bg-white/8 hover:text-xa-ink data-[state=open]:bg-white/12 [&_svg]:size-[17px]"
        >
          {icon}
          <span
            className="absolute bottom-1.5 left-1/2 h-[3px] w-4 -translate-x-1/2 rounded-full"
            style={{ background: current ?? "transparent" }}
            aria-hidden
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          className={popoverClass}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <p className="mb-2 text-xs font-semibold text-xa-muted">{label}</p>
          <div className="flex gap-1.5">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  onPick(c.value);
                  setOpen(false);
                }}
                aria-label={c.name}
                title={c.name}
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg ring-1 ring-white/15 transition-transform hover:scale-110",
                  current === c.value && "ring-2 ring-xa-ink",
                )}
                style={{ background: c.value ?? "transparent" }}
              >
                {!c.value && <span className="h-px w-5 rotate-45 bg-xa-red" aria-hidden />}
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function UrlPopover({
  trigger,
  title,
  placeholder,
  initial,
  submitLabel,
  validate,
  onSubmit,
  onRemove,
  open,
  setOpen,
  editor,
}: {
  editor: Editor;
  trigger: React.ReactNode;
  title: string;
  placeholder: string;
  initial: string;
  submitLabel: string;
  validate: (url: string) => string | null;
  onSubmit: (url: string) => void;
  onRemove?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [value, setValue] = React.useState(initial);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (open) {
      setValue(initial);
      setError(null);
    }
  }, [open, initial]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          className={cn(popoverClass, "w-[min(360px,calc(100vw-2rem))]")}
          onCloseAutoFocus={(e) => backToEditor(e, editor)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const url = value.trim();
              const problem = validate(url);
              if (problem) {
                setError(problem);
                return;
              }
              onSubmit(url);
              setOpen(false);
            }}
            className="space-y-2.5"
          >
            <p className="text-xs font-semibold text-xa-muted">{title}</p>
            <input
              autoFocus
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
              placeholder={placeholder}
              aria-invalid={error ? true : undefined}
              className={cn(inputClass, "h-10 text-sm")}
            />
            {error && <p className="text-xs text-xa-red">{error}</p>}
            <div className="flex justify-end gap-2">
              {onRemove && (
                <button
                  type="button"
                  onClick={() => {
                    onRemove();
                    setOpen(false);
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-xa-muted hover:bg-white/5 hover:text-xa-red"
                >
                  <Unlink className="size-3.5" />
                  Remove
                </button>
              )}
              <button
                type="submit"
                className="inline-flex h-9 items-center rounded-lg bg-xa-accent px-3.5 text-[13px] font-semibold text-xa-on-accent hover:bg-xa-accent-hover"
              >
                {submitLabel}
              </button>
            </div>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** Radix returns focus to the toolbar button on close; send it back to the text instead. */
function backToEditor(e: Event, editor: Editor) {
  e.preventDefault();
  if (!editor.isDestroyed) editor.commands.focus();
}

function normaliseUrl(raw: string) {
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(raw)) return raw;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return `mailto:${raw}`;
  return `https://${raw}`;
}

function LinkButton({ editor, active }: { editor: Editor; active: boolean }) {
  const [open, setOpen] = React.useState(false);
  const current = (editor.getAttributes("link").href as string | undefined) ?? "";
  return (
    <UrlPopover
      editor={editor}
      open={open}
      setOpen={setOpen}
      title={active ? "Edit link" : "Add link"}
      placeholder="https://example.com or name@email.com"
      initial={current}
      submitLabel={active ? "Update" : "Add link"}
      validate={(url) => (!url ? "Enter a web address." : SAFE_LINK.test(normaliseUrl(url)) ? null : "That doesn't look like a valid link.")}
      onSubmit={(url) => {
        const href = normaliseUrl(url);
        const c = editor.chain().focus().extendMarkRange("link");
        if (editor.state.selection.empty && !active) {
          c.insertContent({ type: "text", text: url, marks: [{ type: "link", attrs: { href } }] }).run();
        } else {
          c.setLink({ href }).run();
        }
      }}
      onRemove={active ? () => editor.chain().focus().extendMarkRange("link").unsetLink().run() : undefined}
      trigger={
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          aria-label="Link"
          aria-pressed={active}
          title="Link"
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg text-xa-muted hover:bg-white/8 hover:text-xa-ink [&_svg]:size-[17px]",
            active && "bg-white/12 text-xa-ink",
          )}
        >
          <Link2 />
        </button>
      }
    />
  );
}

function YoutubeButton({ editor }: { editor: Editor }) {
  const [open, setOpen] = React.useState(false);
  return (
    <UrlPopover
      editor={editor}
      open={open}
      setOpen={setOpen}
      title="Embed a YouTube video"
      placeholder="https://www.youtube.com/watch?v=…"
      initial=""
      submitLabel="Embed video"
      validate={(url) =>
        /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{6,}/i.test(url)
          ? null
          : "Paste a YouTube video link."
      }
      onSubmit={(url) => editor.chain().focus().setYoutubeVideo({ src: url.startsWith("http") ? url : `https://${url}` }).run()}
      trigger={
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          aria-label="YouTube video"
          title="YouTube video"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-xa-muted hover:bg-white/8 hover:text-xa-ink [&_svg]:size-[17px]"
        >
          <Youtube />
        </button>
      }
    />
  );
}

function ImageButton({ editor, selected }: { editor: Editor; selected: boolean }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [alt, setAlt] = React.useState("");
  const [caption, setCaption] = React.useState("");

  React.useEffect(() => {
    if (open) {
      const attrs = editor.getAttributes("image");
      setAlt((attrs.alt as string) ?? "");
      setCaption((attrs.title as string) ?? "");
    }
  }, [open, editor]);

  async function upload(file: File) {
    const problem = validateImage(file);
    if (problem) {
      toast.error(problem);
      return;
    }
    setBusy(true);
    const id = toast.loading("Uploading image…");
    try {
      const src = await uploadToCloudinary(file, "blog");
      const name = file.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ");
      editor.chain().focus().setImage({ src, alt: name }).run();
      toast.success("Image added. Select it to add alt text or a caption.", { id });
    } catch (err) {
      toast.error("The image couldn't be uploaded.", { id, description: err instanceof Error ? err.message : undefined });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Btn label="Insert image" disabled={busy} onClick={() => inputRef.current?.click()}>
        {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />}
      </Btn>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = "";
        }}
      />
      {selected && (
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              className="h-9 shrink-0 rounded-lg bg-white/8 px-2.5 text-[13px] font-semibold text-xa-ink hover:bg-white/12"
            >
              Alt text & caption
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              sideOffset={6}
              className={cn(popoverClass, "w-[min(360px,calc(100vw-2rem))]")}
              onCloseAutoFocus={(e) => backToEditor(e, editor)}
            >
              <form
                className="space-y-2.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  editor.chain().focus().updateAttributes("image", { alt: alt.trim(), title: caption.trim() || null }).run();
                  setOpen(false);
                }}
              >
                <label className="block text-xs font-semibold text-xa-muted" htmlFor="xa-img-alt">
                  Alt text <span className="font-normal">(describes the image for screen readers and Google)</span>
                </label>
                <input id="xa-img-alt" value={alt} onChange={(e) => setAlt(e.target.value)} maxLength={200} className={cn(inputClass, "h-10 text-sm")} />
                <label className="block text-xs font-semibold text-xa-muted" htmlFor="xa-img-caption">
                  Caption <span className="font-normal">(optional, shown under the image)</span>
                </label>
                <input id="xa-img-caption" value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={300} className={cn(inputClass, "h-10 text-sm")} />
                <div className="flex justify-end">
                  <button type="submit" className="inline-flex h-9 items-center rounded-lg bg-xa-accent px-3.5 text-[13px] font-semibold text-xa-on-accent hover:bg-xa-accent-hover">
                    Save
                  </button>
                </div>
              </form>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}
    </>
  );
}

function TableMenu({ editor, inTable }: { editor: Editor; inTable: boolean }) {
  const item = (label: string, run: () => void, danger?: boolean) => (
    <DropdownMenu.Item
      onSelect={run}
      className={cn(
        "cursor-pointer rounded-lg px-3 py-2 text-sm outline-none select-none",
        danger ? "text-xa-red data-[highlighted]:bg-xa-red/10" : "data-[highlighted]:bg-white/6",
      )}
    >
      {label}
    </DropdownMenu.Item>
  );
  const c = () => editor.chain().focus();
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          aria-label="Table"
          title="Table"
          className={cn(
            "flex h-9 shrink-0 items-center gap-0.5 rounded-lg px-2 text-xa-muted hover:bg-white/8 hover:text-xa-ink data-[state=open]:bg-white/12 [&_svg]:size-[17px]",
            inTable && "bg-white/12 text-xa-ink",
          )}
        >
          <Table2 />
          <ChevronDown className="!size-3" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={6}
          align="start"
          className={cn(popoverClass, "min-w-[210px] p-1.5")}
          onCloseAutoFocus={(e) => backToEditor(e, editor)}
        >
          {!inTable ? (
            item("Insert table (3 × 3)", () => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())
          ) : (
            <>
              {item("Add row above", () => c().addRowBefore().run())}
              {item("Add row below", () => c().addRowAfter().run())}
              {item("Add column left", () => c().addColumnBefore().run())}
              {item("Add column right", () => c().addColumnAfter().run())}
              {item("Toggle header row", () => c().toggleHeaderRow().run())}
              <DropdownMenu.Separator className="my-1 h-px bg-xa-line" />
              {item("Delete row", () => c().deleteRow().run(), true)}
              {item("Delete column", () => c().deleteColumn().run(), true)}
              {item("Delete table", () => c().deleteTable().run(), true)}
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function Footer({ editor }: { editor: Editor }) {
  const { words, chars } = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      words: e.storage.characterCount.words() as number,
      chars: e.storage.characterCount.characters() as number,
    }),
  });
  return (
    <div className="flex items-center justify-between border-t border-xa-line px-4 py-2.5 text-xs text-xa-muted tabular-nums">
      <span>Tip: select text to format it. Paste a YouTube link on its own line to embed it.</span>
      <span>
        {words} {words === 1 ? "word" : "words"} · {chars} characters · ~{Math.max(1, Math.round(words / 220))} min read
      </span>
    </div>
  );
}
