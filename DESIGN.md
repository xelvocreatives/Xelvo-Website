---
name: Xelvo Creatives Admin
description: The studio's private back office, dressed in the Xelvo brand: dark, image-led, plain-spoken.
colors:
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
typography:
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
rounded:
  sm: "8px"
  md: "12px"
  image: "14px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "32px"
  section: "56px"
  sidebar: "248px"
  content-max: "1240px"
components:
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
---

# Design System: Xelvo Creatives Admin

Scope: every `/admin` route, the admin shell and `/login`, all rendered inside the `.xa` scope. The public marketing site has its own styling and is not governed by this file, except where the admin deliberately copies it inside a live preview.

## Overview

**Creative North Star: "The Studio Wall"**

The admin looks like the work. The owner is a graphic designer, so the screen leads with large project images and client faces, and everything waiting for a reply is pinned above them. It turns down the usual back-office layout of KPI tiles over data tables. Lists exist (leads, job applications), but they are calm single panels with status pills. The full message and its actions sit on a detail page.

The material is the Xelvo brand at night: a near-black ground, slightly lifted panels separated by 1px white hairlines, warm off-white ink and one hot orange used sparingly. Depth comes from tone steps and hairlines, never from glow. Type is Plus Jakarta Sans in sentence case at bold weights with tight tracking, and every label uses plain English the owner would say out loud.

The signature is the live website preview. In the project and testimonial editors, a copy of the public site's card updates as the owner types or picks an image, so they see the website result before saving.

**Key Characteristics:**
- Image-first: projects show as 14px-cornered photo tiles, not table rows.
- One accent with a strict job list (primary action, needs-reply, logo).
- Tonal layering on near-black with 1px white hairlines.
- Sentence-case Plus Jakarta Sans, bold, tightly tracked headings, tabular numerals.
- Plain-English status vocabulary with one hue per meaning.
- Desktop sidebar, mobile top bar plus bottom tab bar.

## Colors

A near-black, warm-neutral world with a single hot orange and four quiet status hues.

### Primary
- **Xelvo Orange** (accent): primary action buttons, needs-reply signals (sidebar and tab-bar count badges, "Needs your reply" count, the "New" dot, the New status pill) and the logo. Hover lifts to **Struck Orange** (accent-hover). Text sitting on orange uses **Burnt Ink** (on-accent), a near-black brown, never white. Orange used as text on dark, as in the New pill, uses **Orange Text** (accent-text) for legibility.

### Secondary (status hues)
Each status hue appears only as a 12% tint fill with full-strength text and dot, never as a solid block.
- **Contact Blue** (status-blue): Contacted.
- **Talks Violet** (status-violet): Interested (leads) and Reviewing (applications).
- **Won Green** (status-green): Won, Hired, success toasts, the "all caught up" check.
- **Closed Red** (status-red): Closed, Not selected, validation errors, delete actions. **Danger Ember** (danger-fill) is the solid fill behind destructive buttons.
- **WhatsApp Green** (whatsapp): only on the WhatsApp contact button, as a 12% tint with a 25% border.

### Neutral
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

### Named Rules
**The Orange Reserve Rule.** Xelvo Orange means "do this" or "someone is waiting". It goes on primary actions, needs-reply state (badges, new dots, the New pill) and the logo, and on nothing else. Avatars are neutral charcoal. If orange marks something that is neither an action nor a waiting person, it is wrong. The keyboard focus ring is the one global exception (2px orange outline, 2px offset), because the build sets it in the scope stylesheet for accessibility.

**The Preview Exception Rule.** Inside a live-preview frame, the public site's styling wins: its orange-to-amber gradient title, gradient avatar and white or #121212 card. A preview has to be the public card. That styling never leaves the frame.

**The Tint, Not Block Rule.** Status hues appear as a 12% tint with full-strength text plus a 6px dot. Solid fills are reserved for the orange count badge and the active filter tab.

## Typography

**Display Font:** Plus Jakarta Sans (with sans-serif)
**Body Font:** Plus Jakarta Sans (with sans-serif)

**Character:** One family carries everything. Hierarchy comes from weight (700 headings, 600 labels, 400 body) and tight negative tracking on large sizes, not from a second face. Numerals are tabular across the whole scope.

### Hierarchy
- **Display** (700, 38px desktop / 30px mobile, 1.25, -0.02em): the Home greeting and the login welcome.
- **Headline** (700, 34px desktop / 28px mobile, 1.25, -0.02em): page titles, balanced wrapping.
- **Title** (700, 18px, -0.01em): section headings ("Needs your reply", "Your portfolio"). Dialog titles also use 18px, and the editor panel title uses 20px.
- **Body** (400, 15px, 1.625): page descriptions (max 62ch), list primary lines, input text.
- **Body small** (400, 14px): card secondary lines, dialog copy, nav footer.
- **Label** (600, 13px): form labels (14px semibold), small buttons, filter tabs, hints and errors (13px).
- **Caption** (600, 12px, line-height 1): status pills, card meta, the project category line on tiles. The count badge uses 11px bold.

### Named Rules
**The Sentence Case Rule.** Every label, button and heading is sentence case. No uppercase tracked labels, and no kicker or eyebrow line above a heading. The date above the Home greeting is content, not a label.

**The Plain Words Rule.** Statuses read New, Contacted, Interested, Won, Closed (leads) and New, Reviewing, Contacted, Hired, Not selected (applications). Navigation reads Home, Leads, Job applications, Projects, Testimonials. On mobile these shorten to Jobs and Reviews. No themed jargon.

## Layout

- **Shell:** a fixed 248px sidebar on desktop (lg and up) holds the logo, five nav items with count badges, then View website, Log out and the signed-in email. Below lg, a 56px sticky top bar (logo, view site, log out) and a fixed 64px five-column bottom tab bar take its place. Both bars use a translucent rail fill with backdrop blur.
- **Content column:** max 1240px, gutters of 16px / 24px / 40px (mobile, sm, lg), top padding 24px to 40px, and extra bottom padding on mobile to clear the tab bar.
- **Rhythm:** 56px between Home sections, 48px between board sections, 32px below a page header, 16px below a section heading, and 12px to 16px gaps inside card grids.
- **Needs-your-reply strip:** person cards in 1, 2 or 3 columns (md, xl).
- **Portfolio wall (Home):** shows 1, 2, 3 or 5 tiles. Four projects show 3, so no grid cell is ever empty. With 3 or more tiles, the first spans 2 columns and 2 rows (a 3-column or 4-column grid on lg).
- **Project boards:** two sections, "On the home page" and "On the projects page", each a 1/2/3-column grid of equal 4:3 tiles.
- **Lists:** one bordered panel with hairline-divided rows. Rows use a 6-column grid on md and collapse to three columns on mobile.
- **Editors:** a right-hand slide-over up to 1120px wide. The form column sits beside a 420px sticky preview column on lg and stacks on mobile.
- **Login:** two columns on lg. The left shows a 2x2 mosaic of featured project images with an 8px gap; the right holds a 380px form column.

### Named Rules
**The First Card Leads Rule.** On the Home wall the first tile is the hero (2 columns by 2 rows once 3 or more show), and the tile count always fills the grid: 1, 2, 3 or 5. Never span every featured project. The client marks all of them featured, and spanning each one turns the wall into a stack of equal heroes.

## Elevation & Depth

The resting surface is flat. Depth comes from tone steps (ground, then panel, then raised) and 1px hairlines. Shadows appear only on layers that float above the page, and they are always black and soft, never coloured.

### Shadow Vocabulary
- **Slide-over** (`box-shadow: -24px 0 60px -20px rgb(0 0 0 / 0.8)`): the editor panel.
- **Dialog** (`box-shadow: 0 24px 60px -12px rgb(0 0 0 / 0.8)`): confirm dialogs.
- **Popover** (`box-shadow: 0 16px 40px -12px rgb(0 0 0 / 0.85)`): action menus and toasts.
- **Field focus** (`box-shadow: 0 0 0 3px rgb(255 102 0 / 0.18)`): input focus only, with an orange border. Errors use the red equivalent.

Overlays dim the page with black at 65% to 70% and a 2px backdrop blur.

### Named Rules
**The No Glow Rule.** Primary buttons are flat orange with no coloured halo at rest or on hover. A coloured ring appears only as a focus state.

**The Scrim Only Rule.** The only gradient in the admin's own chrome is the black legibility scrim at the bottom of project tiles (black 92% to transparent over the lower three quarters). Decorative gradients do not exist outside the preview frame.

## Shapes

Corners are generous and consistent. Small controls (small and icon buttons, menu items) use 8px. Default buttons, inputs, nav items, menus and toasts use 12px. Project images and tiles use 14px. Panels, cards, dialogs and empty states use 16px. Pills, badges, filter tabs, avatars and status dots are fully round. Borders are always 1px. Empty states and "nothing here" notes use a dashed strong hairline. The public-card preview keeps its own 20px and 22px corners.

## Components

### Buttons
Solid, compact and quick to respond.
- **Shape:** 12px corners at the default 44px height, 8px corners at the small 36px height and for 36px icon buttons. Weight is 600, with 16px icons.
- **Primary:** Xelvo Orange with Burnt Ink text. Hover moves to Struck Orange. Reserved for the one main action per view ("Add project", "Save", the non-destructive confirm).
- **Secondary:** Raised Charcoal with a strong hairline border. Hover brightens the border and fill.
- **Ghost:** Stone text and no fill. Hover gives a 5% white wash and Warm Ink text.
- **Danger:** Danger Ember fill, Closed Red text and a 25% red border. Used for confirmed deletes.
- **WhatsApp:** a WhatsApp Green tint with a border, only for the WhatsApp contact button.
- **States:** colour transitions take 200ms ease-out. Press scales to 0.98. Loading shows a spinner and disables the button. Disabled is 50% opacity.

### Status pills and badges
- **Status pill:** fully round, 4px by 10px padding, 12px semibold, with a tinted fill, full-strength text and a 6px leading dot. Tone follows the Plain Words vocabulary. New is the only orange pill.
- **Count badge:** a solid orange 20px pill on nav items (16px compact on the tab bar). It shows unread counts only.
- **New dot:** an 8px orange dot beside the name on unreplied leads and applications.

### Filter tabs
Link-based, fully round, 36px chips with a strong hairline and Stone text, each with its count. The active tab inverts to a Warm Ink fill with Night Ground text. On mobile the row scrolls horizontally.

### Cards / Containers
- **Corner Style:** 16px (panels), 14px (project tiles).
- **Background:** Panel Charcoal on Night Ground.
- **Shadow Strategy:** none at rest (see Elevation & Depth).
- **Border:** 1px hairline. Hover raises it to 20% white.
- **Internal Padding:** 16px (reply cards), 20px (testimonial cards and notes).

### Project tile (portfolio wall)
A 4:3 image filling a 14px-cornered panel with a 1px hairline ring that brightens on hover. The image scales to 1.03 over 700ms with `cubic-bezier(0.16, 1, 0.3, 1)`. The bottom scrim carries the category (12px, white 75%) above the title (white bold, 16px to 18px, or 20px to 24px on the hero). An always-visible 36px "…" menu sits top right on a translucent black fill with blur, so it works on touch screens.

### Avatars
Round, in 36, 44 and 64px sizes. A neutral #242424 fill with a 10% white ring and bold initials, or the client photo. Never orange.

### Inputs / Fields
- **Style:** Well Black fill, a strong hairline border, 12px corners, 15px text and an orange caret. The label (14px semibold) sits above, with "(optional)" in Stone and an optional character counter on the right.
- **Focus:** the border turns orange with a 3px orange ring at 18%.
- **Error:** the border turns red at 70% with a red focus ring. The message below is 13px Closed Red with an alert icon and is announced to screen readers. Hints are 13px Stone.
- **Search:** a 40px field with a leading search icon and a clear button, debounced into the URL.

### Navigation
The sidebar nav items are 44px tall with 12px corners and 15px medium text. Idle items show Stone text with an Ash icon. The active item has a 7% white wash, Warm Ink text and an orange icon. Count badges sit on the right. The mobile tab bar uses five columns, 64px tall, 11px semibold labels and an orange icon when active.

### Dialogs, menus and toasts
- **Confirm dialog:** every delete and every discard of unsaved changes goes through one. It is a 16px panel up to 448px wide, with a red-tinted warning disc when destructive, a Cancel (secondary) button and a confirm (danger or primary) button that keeps the dialog open with a spinner until the action settles.
- **Action menu:** a 12px Raised Charcoal popover at least 210px wide, with 8px items, a 6% white highlight, and destructive items set apart by a hairline separator and red text.
- **Toasts:** bottom right (raised above the tab bar on mobile), Raised Charcoal with 12px corners. The icon is green for success and red for errors. Every save produces one.

### Live website preview (signature)
The live preview sits in a sticky right column of the project and testimonial editors, under a "Live preview" label. It renders the public site's own card, not an admin card. The project preview is a white 20px card with the orange-to-amber gradient title and a 180px cover. The testimonial preview is the public #121212 review card with its gradient avatar. Both update as the owner types or picks an image. The Preview Exception Rule applies: the public styling stays inside this frame.

### Empty states
A dashed strong-hairline 16px panel, centred, with a 48px round icon disc at 5% white, a bold 16px title, a short Stone description and, where useful, a primary action.

## Do's and Don'ts

### Do:
- **Do** keep Xelvo Orange to primary actions, needs-reply state (badges, new dots, the New pill) and the logo.
- **Do** show projects as image tiles with 14px corners, and let the first card lead the Home wall in a grid of 1, 2, 3 or 5 tiles with no empty cells.
- **Do** show status as a tinted pill with a dot, using the plain-English vocabulary: New, Contacted, Interested, Won, Closed / New, Reviewing, Contacted, Hired, Not selected.
- **Do** separate surfaces with tone steps and 1px white hairlines (8%, or 14% for controls).
- **Do** confirm every delete and every unsaved-changes discard in an in-app dialog, and toast every save.
- **Do** mirror the public card exactly inside a live preview, including its gradients.

### Don't:
- **Don't** put a coloured glow or halo on buttons or cards; primary buttons are flat.
- **Don't** make avatars orange or use the brand gradient anywhere outside the preview frame.
- **Don't** add kicker or eyebrow labels, uppercase tracked labels, or themed jargon names for statuses and sections.
- **Don't** span every featured project on the Home wall, or leave an empty grid cell.
- **Don't** build a KPI tile row over a data table as the Home view.
- **Don't** use Ash (faint) for text the owner has to read.
