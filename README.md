# Phong &amp; Nhu — Wedding Website

A luxury, passport / travel–themed wedding website built as a static site for **GitHub Pages**, with a **Supabase** backend powering RSVP and a private admin dashboard.

> Our greatest journey begins · December 20, 2026 · Duluth, Georgia

---

## What's included

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero slideshow, live countdown, welcome, RSVP call-to-action |
| Our Story | `story.html` | Relationship timeline + photo gallery with lightbox |
| Wedding Details | `details.html` | Day-of schedule, venues, Google Maps directions |
| RSVP | `rsvp.html` | Open form: name, accept/decline, plus-one, children + names, dietary, message, contact. Re-submitting the same name **updates** the entry (edit anytime) |
| Guest Portal | `portal.html` | Itinerary, **download .ics** + Add to Google Calendar, dress code, parking, FAQ |
| Admin | `admin.html` | Login-protected dashboard: stats, search, filters, sort, **CSV export** |

Everything is plain HTML / CSS / vanilla JS — **no build step, no framework, no npm install.** It runs directly on GitHub Pages.

---

## Folder structure

```
wedding-website/
├── index.html            # Home
├── story.html            # Our Story
├── details.html          # Wedding Details
├── rsvp.html             # RSVP
├── portal.html           # Guest Portal
├── admin.html            # Admin dashboard (private)
├── 404.html              # Friendly not-found page
├── .nojekyll             # Tells GitHub Pages to serve files as-is
├── README.md
├── DEPLOYMENT.md         # Step-by-step deploy + Supabase setup
├── assets/
│   ├── css/styles.css    # Complete design system
│   ├── js/
│   │   ├── config.js         # ← EDIT THIS: couple info, date, Supabase keys, schedule
│   │   ├── supabase-client.js
│   │   ├── main.js           # nav, countdown, reveal, gallery, FAQ
│   │   ├── ics.js            # calendar download / Google Calendar link
│   │   ├── rsvp.js           # RSVP flow
│   │   └── admin.js          # Admin dashboard
│   └── img/              # Optimized photos + favicon + OG image
└── db/
    └── schema.sql        # Run once in Supabase (table, security, functions)
```

---

## New to GitHub? Start here

If you've never used GitHub before, follow **[GETTING-STARTED.md](./GETTING-STARTED.md)** — a plain-English, click-by-click walkthrough that takes you from zero to a live site, entirely on the free tier. The steps below are the condensed version.

## Quick start (3 steps)

1. **Set up Supabase** — create a project, run `db/schema.sql`, add your admin login. (No guest list to import — it's an open RSVP.) Full walkthrough in **[DEPLOYMENT.md](./DEPLOYMENT.md)**.
2. **Edit `assets/js/config.js`** — paste your Supabase URL + anon key. Couple names, date, and the day-of schedule are already filled in; adjust as needed.
3. **Push to GitHub and enable Pages.** See DEPLOYMENT.md.

You can open the site locally first (see below). The RSVP/Admin pages need the Supabase keys before they work; the rest of the site works immediately.

---

## Run it locally

Because the site uses JavaScript modules, open it through a local server (not `file://`):

```bash
cd wedding-website
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## Customizing content

Almost everything lives in **`assets/js/config.js`**:

- **Couple & date** — names, `date` (ISO, drives the countdown), display strings.
- **`schedule`** — the day-of events (time, title, address, Google Maps link, note). The Details and Portal pages render straight from this list, so you only edit it once.

Other edits:

- **Photos** — replace files in `assets/img/`. Keep the same filenames, or update the `src`/`data-full` paths in the HTML.
- **Our Story timeline** — the milestones in `story.html` are elegant placeholders (marked with `20XX`). Replace the dates and words with your real story.
- **FAQ / dress code / parking** — plain text in `portal.html`.

---

## How the data & security work

GitHub Pages only serves static files, so the database lives in **Supabase** and the browser talks to it with the **public "anon" key** (safe to commit — it's designed to be public). Security is enforced in the database, not by hiding keys:

- **Row Level Security (RLS)** blocks the anon key from reading or writing the `rsvps` table directly, so no visitor can view or scrape everyone else's responses.
- Guests submit only through one `SECURITY DEFINER` function, `submit_rsvp(...)`, which writes a single row. Re-submitting with the same name **updates** that row instead of creating a duplicate — that's how "edit later" works with no login.
- The **admin dashboard** reads data only after a real Supabase **email/password login** (the `authenticated` role). Un-authenticated visitors to `admin.html` see a login screen and can't read anything.

**Trade-offs to know (open RSVP):** anyone with the link can submit — there's no check against an invite list, and nothing technically prevents a duplicate or fake entry. Because responses are keyed on the exact name typed, two real guests with the same name would collide on one row, and a guest who mistypes their name on a second visit creates a second entry instead of editing the first. For a wedding this is almost always fine. If you later want gatekeeping (a pre-loaded guest list with lookup by name/code and enforced seat limits), that's a straightforward switch back — ask and it can be restored.

---

## Browser support

Modern evergreen browsers (Chrome, Safari, Firefox, Edge) on desktop and mobile. Fully responsive, mobile-first. Respects `prefers-reduced-motion`.

---

## Credits

Design & build: custom luxury passport theme. Fonts via Google Fonts (Cormorant Garamond, Playfair Display, Pinyon Script, Jost). Backend: Supabase. Hosting: GitHub Pages.
