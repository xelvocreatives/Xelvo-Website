---
version: 1
slug: "app-blog"
primary_target: "app/blog"
related_targets: ["app/admin/blog"]
---

# Blog (Read)

Scope: the public /blog listing, the /blog/[slug] article page, a "Latest from the blog" section on Home (after Testimonials, before FAQ; existing Home sections untouched), and the admin Blog module (list plus full-page Tiptap article editor) that controls all of it.
Mode: Read. The reader's question leads. Admin parts extend the established admin world (DESIGN.md, admin scope).

Confirmed with the user:
- Each post has one category (used for the filters) plus optional tags. Author defaults to "Xelvo Creatives".
- Publishing is draft, publish now, or schedule a future date. Drafts are previewable by an admin.
- The editor uses an established library (Tiptap), not a custom build. Beyond the basics (bold, italic, underline, links, headings, lists, quotes, alignment, undo/redo) it adds images in articles (Cloudinary), YouTube embeds, tables, and highlight plus text colour.
- Home shows the 3 newest published posts and a "Read all articles" link.

## Direction contract

THESIS: The blog reads like the studio's own journal. The newest piece opens large, and everything after it stacks as calm, generous entries in one column you scroll like a premium newsletter. It refuses the category default, a uniform 3-column card grid of thumbnails with "Read more" buttons (the inspiration's blog page).

OWN-WORLD: The public Xelvo world from DESIGN.md (public scope).
- Ground #111111, image wells #0b0b0b, white ink with white/55 to white/75 secondary.
- The brand gradient #E69700 to #FF6600 only on the heading word, the active category tab and the reading-progress bar.
- Plus Jakarta Sans throughout. The article body is set at 18px on a 68ch measure with 1.75 leading.
- Images have 16px corners and a white/8 ring.
- Category is muted metadata below or beside titles, never an eyebrow.
- No glass.

STORY: A visitor arrives from Home or search, sees the newest thinking first, narrows by category, and opens an article. They read it comfortably, with contents and progress always at hand, then share it or move on to a related piece, and are invited to start a project.

FIRST VIEWPORT (desktop 1440):
- Header bar, then a title row: h1 "Insights" with a gradient word, a post count and a one-line subtext.
- Category tabs and search on one row.
- The lead article as a wide 16:9 cover with title (32 to 40px), excerpt, and meta ("Category · 6 min read · 12 Nov 2026") beneath it, centred in a column about 960px wide.
- Mobile: tabs scroll horizontally and entries stack cover-over-text.
- Article page: a reading column at 68ch, the cover above, the title and meta, a sticky contents rail on the right at 1280px and wider (when the article has 2 or more headings), a thin gradient progress bar pinned under the header, share actions and tags at the end, then "Read next" (same category) and a project call to action.

SIGNATURE MOVE: the journal spine. A thin vertical hairline runs down the left of the feed, where each entry's date sits like a dateline. On the article page the same spine becomes the gradient reading-progress bar and the active contents marker. That is one system, used in exactly these places.

FORM: Journal Feed, the lead of the dealt hand (dealt 4, 7, 6; 4 led), position 4 on the ordered structure list; seed key a7838c46.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
