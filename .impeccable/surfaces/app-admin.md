---
version: 1
slug: "app-admin"
primary_target: "app/admin"
related_targets: ["app/login"]
---

# Admin panel (Operate)

Scope: every /admin route, the admin shell (sidebar, mobile bars) and /login. The public site is out of scope.
Mode: Operate. User: the agency owner, a graphic designer and non-technical, working on desktop and phone. Jobs: reply to leads, manage projects, manage testimonials, review job applications (equal weight).
Constraints: keep the brand palette (near-black, #FF6600) and Plus Jakarta Sans; use plain-English labels; confirm every delete in-app; validate inline; give toast feedback on every save; keep the existing server actions, data and routes.

## Direction contract

THESIS: The admin looks like the work. Projects and client faces fill the screen as large image cards, and everything waiting for a reply is pinned above them. It refuses the category default of a KPI tile row over data tables and themed jargon.

OWN-WORLD: The Xelvo brand world. Near-black ground #0B0B0B, raised panels #141414 with 1px white/8 hairlines, warm off-white ink #F4F1EC, and muted ink #9A958E. Orange #FF6600 is reserved for primary actions, the "needs reply" state and the wordmark period. Status hues: blue = contacted, violet = qualified/reviewing, green = won/hired, dim red = closed/rejected. Plus Jakarta Sans in sentence case. Images use 14px corners. No glows, gradients or tracked-caps labels.

STORY: The owner opens the admin and sees who needs a reply, replying in one tap (WhatsApp or email). Below, the portfolio appears exactly as on the site, and adding or editing work shows a live preview. Leads and applications are calm lists with status pills; detail pages hold the full message and actions.

FIRST VIEWPORT (Home, desktop 1440): a 248px sidebar (wordmark; Home, Leads [count], Job applications [count], Projects, Testimonials; then View website and Log out). Main column: greeting with date, then a "Needs your reply" strip of person cards (name, Lead/Job chip, time ago, WhatsApp and Email icon buttons, Open), or "You're all caught up". Below that, "Your portfolio" with a primary "+ Add project" button, followed by a wall where featured projects span 2 columns with an "On home page" badge. Mobile: top bar plus a bottom tab bar (Home, Leads, Jobs, Projects, Reviews).

SIGNATURE MOVE: the live website preview. In the project and testimonial editors, a preview card rendered in the public site's own card style updates as the owner types or picks an image.

FORM: Portfolio Wall, position 2 on the ordered structure list; seed key 290cd41b.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
