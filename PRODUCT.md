# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Public site visitors:** prospective clients, mostly Muslim-owned businesses, evaluating Xelvo Creatives for branding, social graphics, web design and marketing.
- **Admin (primary for the admin panel):** the agency owner, a graphic designer by profession and not technical. Uses the admin on **both desktop and phone**: desktop for adding portfolio work and testimonials, phone for checking and following up on new leads and applications on the go.
- **Developer (secondary admin):** logs in occasionally for support. The system supports at most two admin accounts.

## Product Purpose

Xelvo Creatives is a Shariah-compliant design and marketing agency (Islamabad, Pakistan) whose website wins new clients and hires talent.

The admin panel exists so the owner can, without developer help:

1. **Respond to new leads:** see contact-form inquiries quickly, contact them (WhatsApp, email), and track each lead through its status.
2. **Manage portfolio projects:** add, edit, feature and remove case studies with images shown on the public site.
3. **Manage testimonials:** add, edit and remove client reviews with photo, rating and social platform.
4. **Review job applications:** read applications, open CVs, and move candidates through statuses.

All four jobs matter equally day to day. Success means the owner does all of this confidently, never loses a lead, and never breaks the public site by mistake.

## Positioning

The agency's distinguishing position is Shariah-compliant, values-aligned branding and marketing for businesses competing in global markets.

## Operating Context

- Leads come from the home page contact form (name, email, phone, company, service, message). An automatic "insight" line (urgency, budget interest, Shariah focus, B2B) is generated on submit.
- Lead statuses: new, contacted, qualified, converted, rejected.
- Applications come from the /career form (name, email, WhatsApp, position, experience level, remote/onsite plus location, CV file, bio, motivation), with a similar automatic insight line.
- Application statuses: new, reviewing, contacted, rejected, hired.
- Projects marked "featured" appear on the home page (up to 4, newest first); non-featured projects appear on /projects.
- The home page shows the 9 newest testimonials.
- Follow-up happens outside the app via WhatsApp and email links.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind CSS v4, shadcn/ui (Radix) components, lucide-react icons, sonner available for toasts.
- Data in MongoDB Atlas; images and CVs in Cloudinary, uploaded directly from the browser (max 10 MB per file; large photos are scaled down client-side).
- Auth.js credentials login; admin accounts are defined in environment variables, so there is no user management UI.
- Admin routes: /login, /admin (dashboard), /admin/projects, /admin/testimonials, /admin/inquiries (+ detail), /admin/careers (+ detail).
- Terminology: the admin must use plain, everyday language (e.g. "Projects", "Testimonials", "Leads", "Job applications", "Log out"), not invented jargon.
- Out of scope for admin work: the public client-facing site, which is considered finished.

## Brand Commitments

- Name: **Xelvo Creatives** (wordmark "XELVO." with an orange period).
- The existing brand colour scheme must be kept: near-black dark surfaces with **#FF6600 orange** as the accent. Typeface: **Plus Jakarta Sans**.
- Voice: professional, warm, values-led; never gimmicky.

## Evidence on Hand

- Live content in MongoDB: 3 projects (all featured), 7 testimonials (1 with photo), 2 leads, 1 job application.
- Brand assets: `public/images/brand-logo.svg`, `public/images/brand-logo.png`, favicons in `app/`.
- No analytics or metrics data is available inside the admin; do not fabricate charts, trends or KPIs beyond real counts.

## Product Principles

1. **Plain language over cleverness:** every label, button and message should be understood by a non-technical designer on first read.
2. **Never lose a lead:** new and unanswered leads and applications are always the most visible thing.
3. **Safe by default:** destructive actions always ask for confirmation in-app, forms validate before saving, and every save shows clear success or failure.
4. **Same quality on phone and desktop:** every admin job must be fully doable on a phone.
5. **The work is the hero:** project images and client photos are shown prominently, as a designer would expect.
