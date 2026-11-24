---
name: Xelvo Creatives
description: One brand, two scoped worlds. The admin is the studio's private back office (dark, image-led, plain-spoken); the public site is a near-black gallery where the work leads.
# SCOPES. Unprefixed tokens belong to the ADMIN world and apply only inside `.xa`
# (app/admin/**, app/login/**, components/admin/**). Tokens prefixed `public-`
# belong to the PUBLIC world and apply to every other route and component
# (app/page.tsx, app/portfolio/**, app/career/**, app/blog/**, components/** outside admin).
# The machine-readable scope map lives in .impeccable/design.json -> extensions.scopes.
colors:
  # --- Admin world (.xa) ---
  ground: "#0b0b0b"
  rail: "#0e0e0e"
  field: "#101010"
  panel: "#141414"
  raised: "#1c1c1c"
  line: "rgb(255 255 255 / 0.08)"
  line-strong: "rgb(255 255 255 / 0.14)"
  ink: "#f4f1ec"
  muted: "#a19c95"
  faint: "#6f6a63"
  placeholder: "#8a857e"
  accent: "#ff6600"
  accent-hover: "#ff7a1f"
  accent-text: "#ff8a3d"
  on-accent: "#170a00"
  status-blue: "#7cb4ff"
  status-violet: "#b9a2ff"
  status-green: "#5fd68b"
  status-red: "#ff7a72"
  danger-fill: "#3a1512"
  whatsapp: "#25d366"
  # --- Public world ---
  public-ground: "#111111"
  public-deep: "#0b0b0b"
  public-aside: "#0d0d0d"
  public-viewer: "#070707"
  public-control: "#1c1c1c"
  public-ink: "#ffffff"
  public-muted: "rgb(255 255 255 / 0.7)"
  public-muted-soft: "rgb(255 255 255 / 0.55)"
  public-line: "rgb(255 255 255 / 0.08)"
  public-line-control: "rgb(255 255 255 / 0.12)"
  public-capsule: "rgb(11 11 11 / 0.75)"
  public-brand-from: "#e69700"
  public-brand-to: "#ff6600"
  public-cta-to: "#ff7700"
  public-on-brand: "#160a00"
  public-link: "#ff8a3d"
  public-article-ink: "rgb(255 255 255 / 0.86)"
  public-home-subtext: "#b9b9b9"
  public-case-card: "#ffffff"
  public-case-text: "#000000"
typography:
  # --- Admin world (.xa) ---
  display:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "38px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: "tnum"
  body-sm:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.4
  caption:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1
  editor-title:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  # --- Public world ---
  public-display:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "60px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  public-section:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.1
  public-headline:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.25
  public-title:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.375
  public-body:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  public-label:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
  public-meta:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
  public-caption:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
  public-section-home:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.25
  public-article-title:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  public-lead:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  public-lead-sm:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  public-entry-title:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "-0.01em"
  public-entry-title-sm:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "-0.01em"
  public-standfirst:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.625
  public-article-body:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.75
  public-lead-excerpt:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.625
  public-label-lg:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.4
  public-dateline:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.375
rounded:
  # --- Admin world (.xa) ---
  sm: "8px"
  md: "12px"
  image: "14px"
  lg: "16px"
  full: "9999px"
  # --- Public world ---
  public-thumb: "8px"
  public-cta: "10px"
  public-action: "12px"
  public-image: "16px"
  public-case-card: "20px"
  public-empty: "24px"
  public-full: "9999px"
spacing:
  # --- Admin world (.xa) ---
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "32px"
  section: "56px"
  sidebar: "248px"
  content-max: "1240px"
  editor-bar: "64px"
  editor-aside: "340px"
  # --- Public world ---
  public-wall-gap: "20px"
  public-wall-gap-sm: "16px"
  public-stage-to-wall: "20px"
  public-hit-min: "24px"
  public-aside: "380px"
  public-content-max: "1400px"
  public-feed-max: "1120px"
  public-spine: "132px"
  public-article-column: "820px"
  public-article-wide: "1040px"
  public-measure: "68ch"
  public-toc: "220px"
components:
  # --- Admin world (.xa) ---
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-primary-sm:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "36px"
  button-secondary:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  button-ghost:
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  button-danger:
    backgroundColor: "{colors.danger-fill}"
    textColor: "{colors.status-red}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
  panel-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  project-tile:
    backgroundColor: "{colors.panel}"
    textColor: "#ffffff"
    rounded: "{rounded.image}"
  gallery-thumb:
    backgroundColor: "{colors.field}"
    rounded: "{rounded.md}"
  status-pill:
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  filter-tab:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 14px"
    height: "36px"
  filter-tab-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  nav-item:
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "44px"
  nav-item-active:
    backgroundColor: "rgb(255 255 255 / 0.07)"
    textColor: "{colors.ink}"
  count-badge:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.full}"
    height: "20px"
  avatar:
    backgroundColor: "#242424"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: "44px"
  editor-top-bar:
    backgroundColor: "{colors.ground}"
    height: "{spacing.editor-bar}"
  editor-toolbar:
    backgroundColor: "{colors.panel}"
    padding: "8px"
  editor-toolbar-button:
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    size: "36px"
  editor-toolbar-button-active:
    backgroundColor: "rgb(255 255 255 / 0.12)"
    textColor: "{colors.ink}"
  editor-canvas:
    backgroundColor: "{colors.public-ground}"
    textColor: "{colors.public-article-ink}"
    typography: "{typography.public-article-body}"
    rounded: "{rounded.lg}"
    padding: "40px"
  editor-title-field:
    textColor: "{colors.ink}"
    typography: "{typography.editor-title}"
  # --- Public world ---
  public-portfolio-card:
    backgroundColor: "{colors.public-deep}"
    textColor: "{colors.public-ink}"
    typography: "{typography.public-title}"
    rounded: "{rounded.public-image}"
  public-stage:
    backgroundColor: "{colors.public-deep}"
    textColor: "{colors.public-ink}"
    typography: "{typography.public-headline}"
    rounded: "{rounded.public-image}"
    height: "72svh"
  public-stage-action:
    backgroundColor: "{colors.public-ink}"
    textColor: "{colors.public-ground}"
    typography: "{typography.public-label}"
    rounded: "{rounded.public-action}"
    padding: "12px 20px"
  public-cta:
    textColor: "{colors.public-ink}"
    typography: "{typography.public-label}"
    rounded: "{rounded.public-cta}"
    padding: "16px 32px"
  public-filter-chip:
    textColor: "{colors.public-muted}"
    typography: "{typography.public-label}"
    rounded: "{rounded.public-full}"
    padding: "0 16px"
    height: "40px"
  public-filter-chip-active:
    textColor: "{colors.public-on-brand}"
  public-dot-capsule:
    backgroundColor: "{colors.public-capsule}"
    rounded: "{rounded.public-full}"
    padding: "0 4px"
    height: "24px"
  public-preview-aside:
    backgroundColor: "{colors.public-aside}"
    textColor: "{colors.public-ink}"
    typography: "{typography.public-body}"
    padding: "40px 32px"
    width: "380px"
  public-preview-thumb:
    rounded: "{rounded.public-thumb}"
    size: "64px"
  public-close-button:
    backgroundColor: "{colors.public-control}"
    textColor: "{colors.public-ink}"
    rounded: "{rounded.public-full}"
    size: "44px"
  public-case-card:
    backgroundColor: "{colors.public-case-card}"
    textColor: "{colors.public-case-text}"
    rounded: "{rounded.public-case-card}"
    padding: "15px 40px"
  public-feed-lead:
    backgroundColor: "{colors.public-deep}"
    textColor: "{colors.public-ink}"
    typography: "{typography.public-lead}"
    rounded: "{rounded.public-image}"
  public-feed-entry:
    backgroundColor: "{colors.public-deep}"
    textColor: "{colors.public-ink}"
    typography: "{typography.public-entry-title}"
    rounded: "{rounded.public-image}"
  public-article-body:
    textColor: "{colors.public-article-ink}"
    typography: "{typography.public-article-body}"
    width: "{spacing.public-measure}"
  public-reading-progress:
    height: "3px"
  public-search:
    textColor: "{colors.public-ink}"
    rounded: "{rounded.public-full}"
    padding: "0 16px 0 44px"
    height: "44px"
  public-tag:
    textColor: "{colors.public-muted}"
    typography: "{typography.public-dateline}"
    rounded: "{rounded.public-full}"
    padding: "0 12px"
    height: "32px"
  public-share-button:
    textColor: "{colors.public-ink}"
    rounded: "{rounded.public-full}"
    size: "44px"
  public-load-more:
    textColor: "{colors.public-ink}"
    rounded: "{rounded.public-full}"
    padding: "0 28px"
    height: "48px"
  public-outline-link:
    textColor: "{colors.public-ink}"
    rounded: "{rounded.public-cta}"
    padding: "14px 28px"
  public-closing-cta:
    backgroundColor: "{colors.public-deep}"
    textColor: "{colors.public-ink}"
    rounded: "{rounded.public-empty}"
    padding: "40px"
---

# Design System: Xelvo Creatives

Scope: this file governs two worlds that share one brand and one typeface but keep separate tokens.

- **Admin world.** Every `/admin` route (including the Blog list and article editor), the admin shell and `/login`, all rendered inside the `.xa` scope (`app/admin/**`, `app/login/**`, `components/admin/**`). It uses the unprefixed tokens. Everything under "Admin world" below is unchanged in meaning from the admin-only edition of this file.
- **Public world.** Every other route and component: Home (`app/page.tsx`), Portfolio (`app/portfolio/**`), Careers (`app/career/**`), Blog (`app/blog/**`), and `components/**` outside `components/admin`, including `components/portfolio/**`, `components/blog/**` and `components/BlogHighlights.tsx`. It uses the `public-` tokens.

Admin sizes and colours must not be used to judge public files, and public tokens must not be used to judge admin files. The one deliberate crossing is the admin's live preview, where public components render inside the admin frame (The Preview Exception Rule).

## Overview

### Admin world

**Creative North Star: "The Studio Wall"**

The admin looks like the work. The owner is a graphic designer, so the screen leads with large project images and client faces, and everything waiting for a reply is pinned above them. It turns down the usual back-office layout of KPI tiles over data tables. Lists exist (leads, job applications), but they are calm single panels with status pills. The full message and its actions sit on a detail page.

The material is the Xelvo brand at night: a near-black ground, slightly lifted panels separated by 1px white hairlines, warm off-white ink and one hot orange used sparingly. Depth comes from tone steps and hairlines, never from glow. Type is Plus Jakarta Sans in sentence case at bold weights with tight tracking, and every label uses plain English the owner would say out loud.

The signature is the live website preview. In the project and testimonial editors, a copy of the public site's card updates as the owner types or picks an image, so they see the website result before saving.

The article editor follows the same idea. The owner writes on the public article's own dark page and reading column, so what they type is what readers will see.

**Key Characteristics:**
- Image-first: projects show as 14px-cornered photo tiles, not table rows.
- One accent with a strict job list (primary action, needs-reply, logo).
- Tonal layering on near-black with 1px white hairlines.
- Sentence-case Plus Jakarta Sans, bold, tightly tracked headings, tabular numerals.
- Plain-English status vocabulary with one hue per meaning.
- Desktop sidebar, mobile top bar plus bottom tab bar.
- A full-page article editor that writes on the public reading column.

### Public world

**Creative North Star: "The Gallery That Keeps Moving"**

The public site is a near-black gallery where the work leads. On the Portfolio page, a stage plays the studio's chosen projects one at a time, each shown whole, and below it a wall shows every project at its true shape. Multi-image projects page through their own images on staggered clocks, and any project opens into a quiet, opaque viewer with its story.

The material is charcoal (#111111) with a deeper black (#0b0b0b) behind images, white ink with translucent-white secondary text, full-colour images in 16px corners with a faint white hairline, and the brand's amber-to-orange gradient kept to a few marked places. Capsules and controls are solid dark fills, never glass. Plus Jakarta Sans carries everything, bold for headings.

The blog reads like the studio's journal. The newest article opens large, and the rest follow as calm entries in one column. A thin hairline, the journal spine, runs down the left of the feed with each entry's date on it. On the article page the same spine becomes the gradient reading-progress bar and the contents rail's active marker.

**Key Characteristics:**
- The work leads: images at their own shape, full colour, nothing laid over them except a legibility scrim.
- The brand gradient appears on the heading word, the active filter chip, the reading-progress bar and the contents marker, and the CTA gradient on CTAs; nowhere decorative.
- Pill dots show position: the active dot stretches and turns orange.
- Solid dark capsules and controls, no backdrop blur.
- Category is quiet metadata under the title, never an eyebrow above it.
- Motion runs only while on screen, pauses on hover, and stops under reduced motion.
- Articles read at 18px on a 68ch measure, with the journal spine tying the feed and the article together.

## Colors

### Admin world

A near-black, warm-neutral world with a single hot orange and four quiet status hues.

#### Primary
- **Xelvo Orange** (accent): primary action buttons, needs-reply signals (sidebar and tab-bar count badges, "Needs your reply" count, the "New" dot, the New status pill) and the logo. Hover lifts to **Struck Orange** (accent-hover). Text sitting on orange uses **Burnt Ink** (on-accent), a near-black brown, never white. Orange used as text on dark, as in the New pill, uses **Orange Text** (accent-text) for legibility.

#### Secondary (status hues)
Each status hue appears only as a 12% tint fill with full-strength text and dot, never as a solid block.
- **Contact Blue** (status-blue): Contacted.
- **Talks Violet** (status-violet): Interested (leads) and Reviewing (applications).
- **Won Green** (status-green): Won, Hired, success toasts, the "all caught up" check.
- **Closed Red** (status-red): Closed, Not selected, validation errors, delete actions. **Danger Ember** (danger-fill) is the solid fill behind destructive buttons.
- **WhatsApp Green** (whatsapp): only on the WhatsApp contact button, as a 12% tint with a 25% border.

#### Neutral
- **Night Ground** (ground): the page.
- **Rail Black** (rail): sidebar, mobile tab bar, login image column.
- **Well Black** (field): input wells, set slightly below the panel.
- **Panel Charcoal** (panel): cards, list panels, the reply strip.
- **Raised Charcoal** (raised): secondary buttons, menus, toasts.
- **Hairline** (line) and **Hairline Strong** (line-strong): 1px borders. The regular hairline divides panels and rows; the strong one marks controls (inputs, secondary buttons, dialogs, dashed empty states).
- **Warm Ink** (ink): headings and primary text. It is also the fill of the active filter tab.
- **Stone** (muted): secondary text, descriptions, inactive nav.
- **Ash** (faint): idle icons, counters, unfilled stars. Use it for decoration only; never for text the owner has to read.
- **Placeholder Grey** (placeholder): input placeholders.

#### Named Rules
**The Orange Reserve Rule.** Xelvo Orange means "do this" or "someone is waiting". It goes on primary actions, needs-reply state (badges, new dots, the New pill) and the logo, and on nothing else. Avatars are neutral charcoal. If orange marks something that is neither an action nor a waiting person, it is wrong. The keyboard focus ring is the one global exception (2px orange outline, 2px offset), because the build sets it in the scope stylesheet for accessibility. The article editor's caret, gap cursor and selected-block outline (2px, 3px offset) are the same focus device.

**The Preview Exception Rule.** Inside a live-preview frame, the public site's styling wins: the real public PortfolioCard on its #111111 ground in the project editor, the gradient avatar on the #121212 review card in the testimonial editor, and the article editor's writing canvas (Charcoal Ground with the public article body rules, including Link Orange links and list markers). A preview has to be the public card. That styling never leaves the frame.

**The Tint, Not Block Rule.** Status hues appear as a 12% tint with full-strength text plus a 6px dot. Solid fills are reserved for the orange count badge and the active filter tab.

### Public world

Charcoal and black, white ink, and one brand gradient used in a few named places.

#### Primary
- **Brand Gradient** (public-brand-from to public-brand-to, amber to orange): the GradientText heading word (a left-to-right gradient clipped to text, such as "work" in "Our work" or "insights" in "Studio insights"), the fill of the active filter chip and the active blog category tab (135deg), the article's 3px reading-progress bar (90deg) and the contents rail's 2px active marker (top to bottom). Text sitting on the gradient uses **Ember Ink** (public-on-brand), never white.
- **CTA Gradient** (public-brand-to to public-cta-to, 135deg): the public call-to-action buttons ("Book Your Free Consultation", "Start your success journey", "Start a project"), with white text and an orange glow (see Elevation & Depth).
- **Signal Orange** (public-brand-to, solid): the active pill dot, the active preview thumbnail ring and the 2px focus outline.
- **Link Orange** (public-link): inline text links on dark, such as "tell us about your project". In the article body, links carry a 45% Link Orange underline that turns solid on hover, and list markers use Link Orange. Highlighted text and selection use Signal Orange tints (28% and 35%).

#### Neutral
- **Charcoal Ground** (public-ground): the page behind every public route.
- **Deep Black** (public-deep): what sits behind images. It fills the card and stage frames, and the Header bar at 95%.
- **Viewer Black** (public-viewer): the opaque full-screen backdrop of the project preview.
- **Story Black** (public-aside): the preview's story column.
- **Control Charcoal** (public-control): the preview's round close button.
- **White Ink** (public-ink): headings, titles and the stage's "View project" fill.
- **Muted White** (public-muted, white at 70%) and **Soft White** (public-muted-soft, white at 55%): secondary text. Body copy runs white at 65% to 75%, category metadata white at 70%, counts and hints white at 55%. Inactive chip counts at 40% are decoration only.
- **Hairline** (public-line, white at 8%): the ring around images and the dividers in the preview. **Control Line** (public-line-control, white at 12%): inactive filter chip borders.
- **Capsule Black** (public-capsule, #0b0b0b at 75%): the solid dot capsule that sits on images.
- **Case Card White** (public-case-card) with **Case Text Black** (public-case-text): the Home case-study cards only.
- **Article Ink** (public-article-ink, white at 86%): the article body text. Headings and bold text inside it are White Ink.
- **Home Subtext Grey** (public-home-subtext): the one-line subtext under Home section titles (Testimonials, Latest from the blog).

#### Named Rules
**The Gradient Places Rule.** The brand gradient has exactly four jobs: the GradientText heading word, the active filter chip (and the blog's active category tab), the article's reading-progress bar and the contents rail's active marker. The CTA gradient has one: public call-to-action buttons. Neither is a background, a border or a decoration. The journal spine's hairline is a neutral white fade (22% to 5%), not the brand gradient.

**The Glow Belongs Outside Rule.** The orange glow on public CTA buttons is a public-world device. The admin's No Glow Rule stays in force inside `.xa`, and the glow never enters the admin's own chrome.

## Typography

### Admin world

**Display Font:** Plus Jakarta Sans (with sans-serif)
**Body Font:** Plus Jakarta Sans (with sans-serif)

**Character:** One family carries everything. Hierarchy comes from weight (700 headings, 600 labels, 400 body) and tight negative tracking on large sizes, not from a second face. Numerals are tabular across the whole scope.

#### Hierarchy
- **Display** (700, 38px desktop / 30px mobile, 1.25, -0.02em): the Home greeting and the login welcome.
- **Headline** (700, 34px desktop / 28px mobile, 1.25, -0.02em): page titles, balanced wrapping.
- **Title** (700, 18px, -0.01em): section headings ("Needs your reply", "Your portfolio"). Dialog titles also use 18px, and the editor panel title uses 20px.
- **Body** (400, 15px, 1.625): page descriptions (max 62ch), list primary lines, input text.
- **Body small** (400, 14px): card secondary lines, dialog copy, nav footer.
- **Label** (600, 13px): form labels (14px semibold), small buttons, filter tabs, hints and errors (13px).
- **Caption** (600, 12px, line-height 1): status pills, card meta, the project category line on tiles. The count badge uses 11px bold.
- **Editor title** (editor-title, 700, 30px mobile / 38px from sm, -0.02em): the article title field in the article editor, set borderless on the page like the finished headline.

#### Named Rules
**The Sentence Case Rule.** Every label, button and heading is sentence case. No uppercase tracked labels, and no kicker or eyebrow line above a heading. The date above the Home greeting is content, not a label.

**The Plain Words Rule.** Statuses read New, Contacted, Interested, Won, Closed (leads), New, Reviewing, Contacted, Hired, Not selected (applications) and Draft, Scheduled, Published (articles). Navigation reads Home, Leads, Job applications, Projects, Testimonials, Blog. On mobile these shorten to Jobs and Reviews. No themed jargon.

### Public world

**Display Font:** Plus Jakarta Sans (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Plus Jakarta Sans (same stack)

**Character:** The same single family as the admin, set larger and tighter. `font-sans` maps to the brand face in the global theme, so public components inherit it without extra classes.

#### Hierarchy
- **Display** (public-display, 700, 60px desktop / 36px mobile, 1.05, -0.03em): the Portfolio page h1 "Our work", with the gradient word. The project count beside it is 18px / 16px medium in Soft White, tabular.
- **Section** (public-section, 700, 48px desktop / 30px mobile): Home section headings such as the case-study heading, with a GradientText phrase.
- **Headline** (public-headline, 700, 32px desktop / 24px mobile, 1.25, balanced): the stage's project name. The preview title uses 28px / 24px.
- **Title** (public-title, 600, 18px, 1.375, balanced): the portfolio card's hover title.
- **Body** (public-body, 400, 15px, 1.625): page subtext (max about 36rem) and the preview description.
- **Label** (public-label, 600, 14px): filter chips, the "View project" action and CTAs. Hero and Services CTAs use 16px.
- **Meta** (public-meta, 500, 14px): the category under the stage and preview titles, and the preview's "2 / 5" counter (tabular).
- **Caption** (public-caption, 500, 12px): the category under the card title and the preview keyboard tip.

Home and blog steps:
- **Home section** (public-section-home, 700, 40px desktop / 30px mobile): the Testimonials, FAQ and "Latest from the blog" section titles, with a GradientText word. Their subtext is 18px / 16px in Home Subtext Grey.
- **Article title** (public-article-title, 700, 48px from sm / 32px mobile, 1.1, -0.025em, balanced): the article h1. The standfirst below it is 20px / 18px (public-standfirst) at white 70%.
- **Lead** (public-lead, 700, 40px from sm, 1.15, -0.02em, balanced): the newest article's title on the blog feed. Below sm it drops to **Lead small** (public-lead-sm, 28px). Lead small is also the Home blog lead title on lg (24px below lg, 1.375).
- **Lead excerpt** (public-lead-excerpt, 400, 17px, 1.625): the feed lead's excerpt at white 70%, capped at 68ch.
- **Entry title** (public-entry-title, 700, 24px from sm, 1.375, -0.01em): later feed entries. Below sm, **Entry title small** (public-entry-title-sm, 22px). Read next and Home side-entry titles use the 18px Title size.
- **Article body** (public-article-body, 400, 18px, 1.75, Article Ink, 68ch): the reading column. Inside it, h2 is 28px, h3 22px and h4 18px (700, 1.25, -0.015em), quotes are 20px italic white, tables 15px and figure captions 14px at white 55%.
- **Large label** (public-label-lg, 600, 16px): full-size public CTAs, including the article's "Start a project".
- **Dateline** (public-dateline, 500, 13px, tabular): the feed's spine dates (white 55%) and the article's tag chips.
- Entry meta ("Category · 6 min read · 12 Nov 2026") uses the 14px size at white 55% to 60%.

#### Named Rules
**The Metadata Below Rule.** A project's category always sits under its title as muted metadata (white at 70%, medium weight). It never sits above the title as a kicker or eyebrow. Blog entries follow the same rule: category, reading time and date sit in one meta line under the excerpt.

**The Reading Column Rule.** Article text is 18px with 1.75 leading on a 68ch measure, set by one shared article-body stylesheet. The public article page and the admin editor canvas both use it, so the owner writes exactly what readers see. Never restyle article text in only one of the two.

## Layout

### Admin world

- **Shell:** a fixed 248px sidebar on desktop (lg and up) holds the logo, six nav items with count badges, then View website, Log out and the signed-in email. Below lg, a 56px sticky top bar (logo, view site, log out) and a fixed 64px six-column bottom tab bar take its place. Both bars use a translucent rail fill with backdrop blur.
- **Content column:** max 1240px, gutters of 16px / 24px / 40px (mobile, sm, lg), top padding 24px to 40px, and extra bottom padding on mobile to clear the tab bar.
- **Rhythm:** 56px between Home sections, 48px between board sections, 32px below a page header, 16px below a section heading, and 12px to 16px gaps inside card grids.
- **Needs-your-reply strip:** person cards in 1, 2 or 3 columns (md, xl).
- **Portfolio wall (Home):** shows 1, 2, 3 or 5 tiles. Four projects show 3, so no grid cell is ever empty. With 3 or more tiles, the first spans 2 columns and 2 rows (a 3-column or 4-column grid on lg).
- **Project boards:** two sections, "On the home page" and "Portfolio only", each a 1/2/3-column grid of equal 4:3 tiles. Every project shows on the public Portfolio page; the home section marks the ones that also show on Home.
- **Lists:** one bordered panel with hairline-divided rows. Rows use a 6-column grid on md and collapse to three columns on mobile.
- **Editors:** a right-hand slide-over up to 1120px wide. The form column sits beside a sticky preview column on lg (400px in the project editor, 420px in the testimonial editor) and stacks on mobile.
- **Gallery:** project images sit in a 2-column (3 on sm) grid of 4:3 thumbnails with 12px gaps, up to 12 images. Drag reorders them; the first is the cover.
- **Article list:** the standard list panel. Each row has a 16:10 cover thumbnail (96px, 128px from sm), the title (15px semibold) over a meta line (category, reading time, edited / goes live / published date), the status pill from sm, and the row's action menu.
- **Article editor:** a full page, not a slide-over. A 64px top bar (back link, save state, Preview, Save draft, the primary publish action) sticks to the top on lg and stacks above the form on mobile. The writing column sits beside a 340px settings aside on xl (sticky, scrolling on its own); below xl the aside follows the writing column. The aside is a stack of 16px panels: Publishing, Cover image, Summary, Category and tags, Author and link, Search preview.
- **Login:** two columns on lg. The left shows a 2x2 mosaic of featured project images with an 8px gap; the right holds a 380px form column.

#### Named Rules
**The First Card Leads Rule.** On the Home wall the first tile is the hero (2 columns by 2 rows once 3 or more show), and the tile count always fills the grid: 1, 2, 3 or 5. Never span every featured project. The client marks all of them featured, and spanning each one turns the wall into a stack of equal heroes.

### Public world

- **Portfolio column:** max 1400px, gutters 16px / 24px / 32px (mobile, sm, lg), top padding 112px / 128px to clear the fixed Header, bottom padding 96px.
- **Title row:** the h1 and project count on the left with a one-line subtext on the right (stacked on mobile), 32px / 40px above the stage.
- **Stage:** full column width, 72svh tall on sm and up (max 780px), 62svh on mobile (min 420px). It shows the featured (home-page) projects. The wall starts 20px below it.
- **Filters:** a chip row 24px / 32px above the wall. It scrolls horizontally edge to edge on mobile and wraps on sm and up. It appears only when there are two or more categories.
- **Wall:** CSS masonry columns, 1 / 2 / 3 (mobile, sm, lg), with 16px / 20px gaps. Every card keeps its own height.
- **Preview:** full screen. The image area fills the space with 16px / 32px padding and a thumbnail strip below. The story column is 380px on the right on lg, and a bottom panel capped at 38dvh below lg.
- **Home case studies:** a 1280px column of full-width white cards with 20px gaps. The text alternates sides, and the image area is 670px by 220px.
- **Blog feed:** a 1120px column with the same top padding as Portfolio. A title row (h1 with count, subtext on the right) sits over a row of category tabs and a 288px search field, divided from the feed by a hairline. On lg the feed is a two-column grid: a 132px dateline gutter, the spine hairline on its edge, and the entries indented 40px. The lead entry's cover is 2:1 on lg and 16:9 below. Later entries split cover (16:10) and text side by side from md, divided by hairlines with 40px above each; below md they stack cover over text. Eight entries show, then "Load more articles" adds eight. On mobile the category tabs scroll horizontally edge to edge and the date joins the meta line.
- **Article:** an 820px column for the header, body and footer. When the article has two or more headings, the column widens to 1040px on xl with a 220px sticky contents rail on the right; header, body and footer still share one left edge. The 16:9 cover spans 1040px. The body and its footer cap at 68ch. Below the article, "Read next" is a 1, 2 or 3-column grid (sm, lg) of up to three same-category articles, then the closing CTA panel.
- **Home blog section:** after Testimonials and before FAQ, in a 1280px column. A centred title and subtext sit over the newest article (16:10 cover) beside the next two stacked (16:11 covers), split 1.25 to 1 on lg; with a single article it centres at 768px. The section renders nothing until an article is published. A "Read all articles" outline link closes it.

#### Named Rules
**The True Shape Rule.** The wall shows each project at its cover's real proportions in masonry columns. A multi-image card takes its height from the cover, and later images crop to that cover's shape. Never force the wall into equal cropped cells.

**The Admin Categories Rule.** Filter chips are built from the categories the owner types in the admin, exactly as typed (trimmed, grouped case-insensitively, shown with the first spelling and a count), after an "All" chip. No invented taxonomy.

**The One Portfolio Route Rule.** `/portfolio` is the portfolio. `/projects` permanently redirects (308) to it.

**The Journal Spine Rule.** The spine is one system used in exactly three places: the feed's 1px hairline (white 22% fading to 5%) with a 13px dateline and a 9px hollow node (Charcoal Ground with a white-30% ring) level with each cover's top, on lg only; the article's 3px brand-gradient reading-progress bar, pinned to the bottom edge of the fixed Header; and the contents rail, which repeats the same hairline with a 2px brand-gradient marker on the section being read. Do not add it anywhere else.

## Elevation & Depth

### Admin world

The resting surface is flat. Depth comes from tone steps (ground, then panel, then raised) and 1px hairlines. Shadows appear only on layers that float above the page, and they are always black and soft, never coloured.

#### Shadow Vocabulary
- **Slide-over** (`box-shadow: -24px 0 60px -20px rgb(0 0 0 / 0.8)`): the editor panel.
- **Dialog** (`box-shadow: 0 24px 60px -12px rgb(0 0 0 / 0.8)`): confirm dialogs.
- **Popover** (`box-shadow: 0 16px 40px -12px rgb(0 0 0 / 0.85)`): action menus and toasts.
- **Field focus** (`box-shadow: 0 0 0 3px rgb(255 102 0 / 0.18)`): input focus only, with an orange border. Errors use the red equivalent.

Overlays dim the page with black at 65% to 70% and a 2px backdrop blur.

#### Named Rules
**The No Glow Rule.** Primary buttons are flat orange with no coloured halo at rest or on hover. A coloured ring appears only as a focus state. This rule is admin-only (`.xa`).

**The Scrim Only Rule.** The only gradient in the admin's own chrome is the black legibility scrim at the bottom of project tiles (black 92% to transparent over the lower three quarters). Decorative gradients do not exist outside the preview frame.

### Public world

Flat dark surfaces with three depth devices: a soft black lift on hover, a black drop shadow under the stage image, and the orange glow on CTAs.

#### Shadow Vocabulary
- **CTA glow** (`box-shadow: 0 4px 20px rgba(255, 102, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)`): public gradient CTA buttons.
- **Card lift** (`box-shadow: 0 24px 50px -20px rgb(0 0 0 / 0.9)` with a 4px rise): portfolio card hover.
- **Stage drop** (`filter: drop-shadow(0 30px 40px rgb(0 0 0 / 0.55))`): the contained stage image over its blurred backdrop.

The blog adds no shadows. Covers sit flat in their ring and zoom slightly on hover (1.02 for leads, 1.03 for entries, 700ms). Only the article's closing CTA button carries the CTA glow.

#### Named Rules
**The Legibility Scrim Rule.** The only gradient laid over an image is a bottom legibility scrim: on cards, black 85% to 40% at 55% to transparent; on the stage caption, #0b0b0b at 92% to 60% at 60% to transparent. It exists so text can be read, never for mood.

**The No Glass Rule.** Public capsules and controls are solid dark fills: the dot capsule is #0b0b0b at 75%, the Header is #0b0b0b at 95%, and the preview backdrop is opaque. No backdrop blur.

## Shapes

### Admin world

Corners are generous and consistent. Small controls (small and icon buttons, menu items) use 8px. Default buttons, inputs, nav items, menus and toasts use 12px. Project images and tiles use 14px. Panels, cards, dialogs and empty states use 16px. Pills, badges, filter tabs, avatars and status dots are fully round. Borders are always 1px. Empty states and "nothing here" notes use a dashed strong hairline. The public-card preview keeps the public card's own corners (16px for the portfolio card, 20px and 22px for the review card). In the article editor, the writing canvas uses 16px corners with a strong hairline ring (white 25% on focus, red on error), toolbar buttons use 8px, publish-mode options 12px, and the article list's cover thumbnails 8px.

### Public world

Images and image frames (cards, stage, case-study image areas) use 16px corners with a 1px white-8% ring (case-study images carry no ring). Preview thumbnails use 8px. The stage action and the preview CTA use 12px, and the Home and Services CTAs use 10px. Home case-study cards use 20px and the empty state uses 24px with a dashed white-15% border. Chips, dots, dot capsules and the close button are fully round. Dots are 6px pills on cards and 8px on the stage; the active dot stretches to 20px (cards) or 28px (stage). Blog covers (feed, article, Read next, Home) use the 16px image corner with the white-8% ring. Category tabs, the search field, tag chips, share buttons and "Load more articles" are fully round; the closing CTA panel uses 24px and the Home "Read all articles" outline link 10px. Inside the article body, images and video embeds use 16px, code blocks 14px, inline code 6px and highlights 4px.

## Components

### Admin world

#### Buttons
Solid, compact and quick to respond.
- **Shape:** 12px corners at the default 44px height, 8px corners at the small 36px height and for 36px icon buttons. Weight is 600, with 16px icons.
- **Primary:** Xelvo Orange with Burnt Ink text. Hover moves to Struck Orange. Reserved for the one main action per view ("Add project", "Save", the non-destructive confirm).
- **Secondary:** Raised Charcoal with a strong hairline border. Hover brightens the border and fill.
- **Ghost:** Stone text and no fill. Hover gives a 5% white wash and Warm Ink text.
- **Danger:** Danger Ember fill, Closed Red text and a 25% red border. Used for confirmed deletes.
- **WhatsApp:** a WhatsApp Green tint with a border, only for the WhatsApp contact button.
- **States:** colour transitions take 200ms ease-out. Press scales to 0.98. Loading shows a spinner and disables the button. Disabled is 50% opacity.

#### Status pills and badges
- **Status pill:** fully round, 4px by 10px padding, 12px semibold, with a tinted fill, full-strength text and a 6px leading dot. Tone follows the Plain Words vocabulary. New is the only orange pill.
- **Count badge:** a solid orange 20px pill on nav items (16px compact on the tab bar). It shows unread counts only.
- **New dot:** an 8px orange dot beside the name on unreplied leads and applications.
- **Article status:** Draft (neutral: white 8% fill, Stone text), Scheduled (Contact Blue, a published article with a future date) and Published (Won Green), in the standard pill shape.

#### Filter tabs
Link-based, fully round, 36px chips with a strong hairline and Stone text, each with its count. The active tab inverts to a Warm Ink fill with Night Ground text. On mobile the row scrolls horizontally.

#### Cards / Containers
- **Corner Style:** 16px (panels), 14px (project tiles).
- **Background:** Panel Charcoal on Night Ground.
- **Shadow Strategy:** none at rest (see Elevation & Depth).
- **Border:** 1px hairline. Hover raises it to 20% white.
- **Internal Padding:** 16px (reply cards), 20px (testimonial cards and notes).

#### Project tile (portfolio wall)
A 4:3 image filling a 14px-cornered panel with a 1px hairline ring that brightens on hover. The image scales to 1.03 over 700ms with `cubic-bezier(0.16, 1, 0.3, 1)`. The bottom scrim carries the category (12px, white 75%) above the title (white bold, 16px to 18px, or 20px to 24px on the hero). An always-visible 36px "…" menu sits top right on a translucent black fill with blur, so it works on touch screens. Multi-image projects add a small round image-count badge (layers icon, 11px bold white on black 60%).

#### Gallery picker
The project editor's Images field. Saved and newly picked images show as 4:3 thumbnails with 12px corners on Well Black with a hairline ring, in drag-to-reorder order. Each has a 36px remove button (8px corners, black 55%, red on hover) and a drag handle when there is more than one. The first carries a small "Cover" pill. The add zone is a dashed strong-hairline 12px well (16:9 when empty) reading "Add images" or "Add more images" with a count of up to 12; the border turns red on error. Several files can be picked or dropped at once, and each is validated with a plain-English message.

#### Avatars
Round, in 36, 44 and 64px sizes. A neutral #242424 fill with a 10% white ring and bold initials, or the client photo. Never orange.

#### Inputs / Fields
- **Style:** Well Black fill, a strong hairline border, 12px corners, 15px text and an orange caret. The label (14px semibold) sits above, with "(optional)" in Stone and an optional character counter on the right.
- **Focus:** the border turns orange with a 3px orange ring at 18%.
- **Error:** the border turns red at 70% with a red focus ring. The message below is 13px Closed Red with an alert icon and is announced to screen readers. Hints are 13px Stone.
- **Search:** a 40px field with a leading search icon and a clear button, debounced into the URL.

#### Navigation
The sidebar nav items are 44px tall with 12px corners and 15px medium text. Idle items show Stone text with an Ash icon. The active item has a 7% white wash, Warm Ink text and an orange icon. Count badges sit on the right. The mobile tab bar uses six columns, 64px tall, 11px semibold labels and an orange icon when active.

#### Dialogs, menus and toasts
- **Confirm dialog:** every delete and every discard of unsaved changes goes through one. It is a 16px panel up to 448px wide, with a red-tinted warning disc when destructive, a Cancel (secondary) button and a confirm (danger or primary) button that keeps the dialog open with a spinner until the action settles.
- **Action menu:** a 12px Raised Charcoal popover at least 210px wide, with 8px items, a 6% white highlight, and destructive items set apart by a hairline separator and red text.
- **Toasts:** bottom right (raised above the tab bar on mobile), Raised Charcoal with 12px corners. The icon is green for success and red for errors. Every save produces one.

#### Live website preview (signature)
The live preview sits in a sticky right column of the project and testimonial editors, under a "Live preview" label. It renders the public site's own components, not an admin card. The project preview renders the real public PortfolioCard (with its label always shown) inside a 320px #111111 frame, beside a small pill saying "Home + Portfolio" or "Portfolio page". With no images yet it shows a dashed placeholder. The testimonial preview is the public #121212 review card with its gradient avatar. Both update as the owner types or picks an image. The Preview Exception Rule applies: the public styling stays inside this frame.

#### Article editor
A full page for writing one article.
- **Top bar:** Night Ground, 64px, sticky on lg. A back link (with an unsaved-changes confirm) and a quiet save-state line on the left; Preview or View live (ghost), Save draft (secondary) and the publish action (primary, small) on the right.
- **Title field:** a borderless, auto-growing textarea in the Editor title size with a white-25% placeholder.
- **Writing canvas:** Charcoal Ground (#111111) with 16px corners and a strong hairline ring, padded 32px by 20px (40px from sm). The text sits in a centred 68ch column with the public article body rules, under the Preview Exception Rule. A footer strip shows word count and reading time in 12px tabular Stone.
- **Formatting toolbar:** a Panel Charcoal strip under a hairline. It wraps onto more rows at every width (no horizontal scroll) and sticks under the top bar only on lg. Controls are 36px with 8px corners, Stone icons at 17px, a 8% white hover, and a 12% white fill plus Warm Ink when active (`aria-pressed`). Groups are split by 20px strong-hairline separators. It holds undo/redo, a block-type select (Paragraph, Heading, Subheading, Small heading), marks, lists and quote, alignment, link, colour and highlight swatches (each showing the current colour as a 3px bar), image, YouTube and a table menu. Link and image settings open as Raised Charcoal popovers with a small primary button.
- **Settings aside:** 16px Panel Charcoal panels with 14px bold titles. Publish timing is a two-option radio group (12px rows; the chosen one gets a white-25% border and 6% white fill). Category suggestions are small round chips that invert to Warm Ink when chosen, like filter tabs. The search preview is the one white card, imitating a Google result.

#### Empty states
A dashed strong-hairline 16px panel, centred, with a 48px round icon disc at 5% white, a bold 16px title, a short Stone description and, where useful, a primary action.

### Public world

#### Portfolio card (living card, signature)
Images only. The cover sets the card's natural height (block image at full width). Later images layer over it with `object-cover`, so they crop to the cover's shape. The card is a 16px Deep Black frame with a white-8% ring.
- **Auto-advance:** multi-image cards crossfade (900ms) every 3.8s. Each card's first change waits for 0.9s plus 0.65s times its position (cycling every six cards), so the wall never flips in unison.
- **Hover:** the card rises 4px with the card-lift shadow, the image scales to 1.025, the clock pauses, and the label rises in: the title (18px semibold white) over its category (12px medium, white 70%) on the legibility scrim.
- **Action:** the whole card is one button ("View project: …") that opens the preview at the current image, with a 2px orange focus outline.
- **Dots:** top right, on a solid round Capsule Black capsule. Each dot is a 24px hit area around a 6px pill (white 60%, white on hover). The active dot stretches to 20px in Signal Orange.

#### Featured stage
The Portfolio page's opener for the featured (home-page) projects. Each project's cover shows contained (never cropped) over a blurred (blur-2xl), 125% scaled, 45% opacity copy of itself, darkened at the edges. The image settles from 0.97 to 1 over 6s and carries the stage drop shadow. Projects crossfade (1.1s) every 5.2s. The stage pauses on hover. At the bottom, on the caption scrim, the project name (headline) sits over its category (meta, white 70%), announced politely. On the right are the stage dots (8px pills in 24px by 32px hit areas, active 28px orange) and the "View project" action: a white 12px button with #111 text, an arrow icon, and a scale of 1.02 on hover and 0.98 on press.

#### Filter chips
40px fully round chips with 14px semibold text and a count (tabular). Idle chips have a Control Line border, white 70% text and a white 40% count; hover brightens the border to 30% and the text to white. The active chip fills with the Brand Gradient (135deg) in Ember Ink, with its count at 70%. Chips are toggle buttons (`aria-pressed`), and colour changes take 300ms. The wall re-keys and fades in (500ms) on every change.

#### Project preview (viewer)
A full-screen dialog on opaque Viewer Black that fades and settles from 0.98.
- **Image:** contained, never cropped, crossfading (500ms) between images.
- **Thumbnails:** a strip of 56px / 64px 8px-cornered thumbnails at 55% opacity. The current one is full opacity with a 2px orange ring.
- **Navigation:** arrow keys and a 50px horizontal swipe move between images, wrapping at the ends.
- **Story aside:** on Story Black with a hairline divider, it holds the title (28px / 24px bold) over the category (meta, white 70%) and the "n / total" counter, then the description (15px, white 75%). Below a hairline sits the prompt "Want work like this for your brand?" and the gradient "Start a project" CTA, which links to the Home contact section. A keyboard tip shows on lg.
- **Close:** a 44px round Control Charcoal button with a white-15% ring, top right.

#### Public CTA button
The CTA Gradient (135deg) with white 16px semibold text, 10px corners, 16px by 32px padding and the CTA glow, with a trailing arrow that nudges right on hover. It scales to 1.02 on hover and 0.98 on press. The preview's "Start a project" is a compact 14px, 12px-cornered variant. The article's closing "Start a project" is the full 16px button with an up-right arrow.

#### Home case-study cards
The Home "How Muslim Brands Like Yours Scaled Globally" section keeps its original design. White 20px cards up to 250px tall, with the GradientText project name (40px bold) and black description, alternate sides beside a 670px by 220px, 16px-cornered image area, closing with the "This Could Be You" CTA card and its dashed orange placeholder. The only additions are in the image area: multi-image projects crossfade (900ms, every 3.8s, pausing on hover) with the same solid dot capsule (bottom centre), and clicking opens the shared project preview with a zoom-in cursor.

#### Journal feed (blog)
The /blog page. Category tabs are the filter-chip look as links (`aria-current`), built from the admin's categories with counts. The search field is a 44px round field on a white-3% fill with a white-12% border and a leading icon; focus turns the border Signal Orange with a 2px ring at 25%. Each entry is one link (the title's link covers the whole entry). The lead shows its cover, the Lead title, the Lead excerpt and the meta line; later entries show cover, Entry title, a 15px excerpt clamped to three lines at white 65% and the meta line. Datelines ride the spine on lg (The Journal Spine Rule). "Load more articles" is a 48px round outline button (white-15% border, 40% on hover) with "Showing n of total" below. The empty state is the dashed 24px panel with a Link Orange link.

#### Article page
- **Header:** an "All articles" back link (14px medium, white 60%), the Article title, the standfirst when the owner wrote one, then a meta line: the author (semibold, white 85%), date, category (a link to the filtered feed) and reading time, separated by trailing dots so a wrapped line never starts with one.
- **Reading progress:** a 3px bar fixed to the bottom edge of the Header (it follows the Header as it shrinks). The brand gradient fills it from the left as the body is read.
- **Contents rail:** "On this page" (14px semibold) over the heading list on the spine hairline. Items are 14px at white 55% (white 85% on hover); subheadings indent 28px. The section being read turns white medium with the 2px gradient marker on the hairline.
- **Footer:** a hairline, tag chips (32px round, white-12% border, 13px medium, white 70%, linking to a tag search), then "Share this article" with 44px round share buttons (WhatsApp, LinkedIn, X, Copy link) in white-12% borders that brighten on hover. Copy link confirms with a check and a polite announcement.
- **Read next:** a 24px bold heading over up to three entries: 16:10 cover, 18px bold title and a meta line.
- **Closing CTA:** a Deep Black 24px panel with a hairline, a 30px / 24px bold prompt, a line of white-65% copy and the full Public CTA button.

#### Latest from the blog (Home)
The Home section for the three newest articles (Home blog section in Layout). The lead shows its cover, title, a two-line 15px excerpt and the meta line with date; the side entries show a smaller cover beside an 18px title, a two-line excerpt (hidden on mobile) and the meta line. Whole entries are links, covers zoom on hover, and the section closes with "Read all articles": a 10px-cornered outline link with a white-15% border and a trailing arrow.

#### Navigation (Header)
A fixed Header that is transparent at the top of the page and turns to Deep Black at 95% once scrolled. The mobile menu is opaque Deep Black.

## Do's and Don'ts

### Admin world

#### Do:
- **Do** keep Xelvo Orange to primary actions, needs-reply state (badges, new dots, the New pill) and the logo.
- **Do** show projects as image tiles with 14px corners, and let the first card lead the Home wall in a grid of 1, 2, 3 or 5 tiles with no empty cells.
- **Do** show status as a tinted pill with a dot, using the plain-English vocabulary: New, Contacted, Interested, Won, Closed / New, Reviewing, Contacted, Hired, Not selected.
- **Do** separate surfaces with tone steps and 1px white hairlines (8%, or 14% for controls).
- **Do** confirm every delete and every unsaved-changes discard in an in-app dialog, and toast every save.
- **Do** mirror the public card exactly inside a live preview, including its gradients, by rendering the real public component.
- **Do** show article status as Draft, Scheduled or Published pills, and write articles on the shared article-body canvas.

#### Don't:
- **Don't** put a coloured glow or halo on buttons or cards; primary buttons are flat.
- **Don't** make avatars orange or use the brand gradient anywhere outside the preview frame.
- **Don't** add kicker or eyebrow labels, uppercase tracked labels, or themed jargon names for statuses and sections.
- **Don't** span every featured project on the Home wall, or leave an empty grid cell.
- **Don't** build a KPI tile row over a data table as the Home view.
- **Don't** use Ash (faint) for text the owner has to read.

### Public world

#### Do:
- **Do** set public pages on Charcoal Ground (#111111) with Deep Black (#0b0b0b) behind images.
- **Do** frame images in 16px corners with a 1px white-8% ring, and show the wall at each cover's true shape.
- **Do** show the stage and preview images contained, never cropped.
- **Do** keep the brand gradient to the GradientText heading word and the active filter chip, and the CTA gradient with its glow to public CTAs.
- **Do** mark position with pill dots: the active dot stretched and orange, every hit area at least 24px.
- **Do** put the category under the title as muted metadata.
- **Do** run auto-advance only while on screen (35% visible), pause it on hover and in hidden tabs, stop it under reduced motion, and restart the full interval after a manual pick.
- **Do** build filter chips from the admin's categories exactly as typed.
- **Do** keep the Home case-study cards in their original white design; only their image area plays and opens the preview.
- **Do** set article text at 18px with 1.75 leading on a 68ch measure, from the shared article-body rules.
- **Do** keep the journal spine to the feed's dateline hairline, the reading-progress bar and the contents marker.

#### Don't:
- **Don't** use backdrop blur or glass panels on public capsules and controls; use solid dark fills.
- **Don't** lay any gradient over an image except the bottom legibility scrim.
- **Don't** put the category above a title as an eyebrow.
- **Don't** crop the stage or preview image, or force the wall into equal cropped cells.
- **Don't** replace the Home case-study cards with portfolio cards.
- **Don't** carry the public CTA glow or brand gradient into the admin's own chrome.
- **Don't** paint the spine hairline itself with the brand gradient; it is a neutral white fade.
