---
version: 1
slug: "app-portfolio"
primary_target: "app/portfolio"
related_targets: ["app/page.tsx"]
---

# Portfolio page (Experience)

Scope: the new public route /portfolio, which /projects now redirects to; the Home page project section (its ORIGINAL white case-study cards are kept as they are; only the image area gains the auto-slideshow dots and click-to-preview, per the user's correction); the shared project preview (lightbox); and the admin's multi-image project gallery that feeds them.
Mode: Experience. The work leads from the first viewport.
Audience: prospective clients judging the studio's craft.
Confirmed with the user:
- Cards are images only, with the name revealed on hover; the preview always shows the name, category and description.
- A project with several images auto-advances with navigation dots and no arrow buttons.
- Clicking a card opens a clear full preview.
- Category filters are built from the admin's categories.
- The Home page keeps its ORIGINAL white case-study card design (user correction: do not replace it). Only its image area gains the auto-slideshow dots and click-to-open preview.
Inspiration, analysed with REA and not copied: coffeeandcreative.in/portfolio.php (edge-to-edge image-only poster grid, greyscale to colour on hover, no preview, no lazy loading) and coffeeandcreative.in/blogs.php (3-column card grid).

## Direction contract

THESIS: The portfolio is a gallery that keeps moving. A stage plays the studio's chosen work, then a wall shows everything at its true shape. It refuses the category default of a heading over a row of equal cropped cards, and the inspiration's greyscale, preview-less wall.

OWN-WORLD: The public Xelvo world.
- Ground: near-black #111111, deep #0b0b0b behind images.
- Ink: warm white.
- Accent: the brand's #E69700 to #FF6600 gradient, used only on the heading word and the active filter.
- Type: Plus Jakarta Sans.
- Images: full colour, 14 to 16px corners, hairline white/8 edges.
- Dots: small pills, with the active one stretched and orange.
- No glass panels.
- The only scrim is the bottom gradient on cards and the stage, used for legibility.

STORY: A visitor lands on a moving stage of the studio's best work. They filter the wall to the kind of work they need, watch multi-image projects page themselves, and open any project into a clear, distraction-free preview with its story.

FIRST VIEWPORT (desktop 1440):
- Header bar.
- A compact title row: h1 "Our work" with a gradient word, a project count and one-line subtext.
- Below it, a full-width stage about 72vh tall. Each featured project shows contained (never cropped) on a blurred, darkened copy of itself. The project name and category sit bottom-left beside a "View project" action, with dots bottom-right. It crossfades every 5 seconds.
- Filter chips begin at the stage's lower edge.
- Mobile: the stage is about 60vh and the wall is 1 to 2 columns.

SIGNATURE MOVE: living cards. Every multi-image card crossfades through its images on a staggered clock, only while it is on screen and never under reduced motion, with pill dots showing position. One click opens the full preview: a large contained image, a thumbnail strip, keyboard and swipe navigation, and the project's story.

FORM: Featured Stage + Wall, position 2 on the ordered structure list (dealt 7, 2, 5; lead 7 was Contact Sheet + Viewer); seed key 5ec3ae25.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
