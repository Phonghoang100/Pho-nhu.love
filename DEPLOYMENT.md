# Deployment Guide

This gets you from zero to a live wedding site with working RSVP and admin. Budget ~30 minutes. No coding experience required — you'll copy/paste a few things.

There are two systems:

1. **Supabase** — the free database + login that stores RSVPs.
2. **GitHub Pages** — the free hosting that serves the website.

Do Supabase first, because you'll paste two values from it into the site.

---

## Part 1 — Supabase (database + auth)

### 1.1 Create the project
1. Go to <https://supabase.com> and sign up (free).
2. Click **New project**. Pick a name (e.g. `phong-nhu-wedding`), set a strong database password (save it somewhere), choose the region closest to your guests, and create it. Wait ~2 minutes for it to provision.

### 1.2 Create the table, security, and functions
1. In the left sidebar, open **SQL Editor** → **New query**.
2. Open the file `db/schema.sql` from this project, copy **all** of it, paste into the editor.
3. Click **Run**. You should see “Success. No rows returned.” This created the `rsvps` table, Row Level Security, and the `submit_rsvp` function.

> **No guest list to import.** This is an open RSVP — guests simply type their name on the RSVP page, so there's nothing to seed. Skip straight to your admin login.

### 1.3 Create your admin login
1. Left sidebar → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter your email + a password, and (important) enable **Auto Confirm User** so you can log in immediately.
3. Repeat for Nhu if you both want access.
4. Recommended: **Authentication → Providers → Email** → turn **Allow new users to sign up** **OFF**, so only the accounts you create can exist.

### 1.4 Copy your API keys
1. Left sidebar → **Project Settings** (gear) → **API**.
2. Copy the **Project URL** and the **anon public** key. You'll paste both in Part 2.
   - The anon key is *meant* to be public and is safe to commit. Never use the `service_role` key on the website.

---

## Part 2 — Configure the site

1. Open `assets/js/config.js`.
2. Paste your values:
   ```js
   supabaseUrl: "https://YOUR-PROJECT-ref.supabase.co",
   supabaseAnonKey: "eyJhbGciOi...your-anon-key...",
   ```
3. Double-check the couple info, `date`, and the `schedule` list are how you want them. Save the file.

**Test locally before deploying** (optional but smart):
```bash
cd wedding-website
python3 -m http.server 8000
```
Visit <http://localhost:8000>, submit a test RSVP with any name, then log in at <http://localhost:8000/admin.html> and confirm it shows up.

---

## Part 3 — GitHub Pages (hosting)

### 3.1 Put the code on GitHub
If you use the GitHub website:
1. Create a new repository (e.g. `wedding`), keep it **public** (Pages is free for public repos).
2. On the repo page, **Add file → Upload files**, drag in the **contents** of the `wedding-website` folder (so `index.html` sits at the repo root, not inside a subfolder), and commit.

If you use the command line:
```bash
cd wedding-website
git init
git add .
git commit -m "Wedding site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/wedding.git
git push -u origin main
```

### 3.2 Turn on Pages
1. Repo → **Settings** → **Pages**.
2. Under **Build and deployment**, Source = **Deploy from a branch**.
3. Branch = **main**, folder = **/ (root)**. Save.
4. Wait 1–2 minutes. Your site appears at:
   `https://YOUR-USERNAME.github.io/wedding/`

The site uses **relative paths** throughout, so it works correctly in that `/wedding/` subfolder — no extra configuration needed.

### 3.3 Verify it live
- Open the site, check the countdown and photos load.
- Submit a test RSVP, then confirm it in `admin.html`.
- Delete the test row later from Supabase → Table Editor → `rsvps`.

---

## Optional extras

**Custom domain** (e.g. `phongandnhu.com`): Settings → Pages → **Custom domain**. Add the domain, create the DNS records your registrar shows, and add a `CNAME` file (GitHub can do this for you). With a root domain, everything still works.

**Want gatekeeping later?** This build uses an open RSVP (anyone with the link can respond). If you'd rather guests look themselves up against a pre-loaded invite list — with enforced seat limits and unique codes — that's a supported alternative; ask and it can be switched on.

**Sharing preview image:** `assets/img/og-image.jpg` is used when the link is shared in messages/social. Replace it with any 1200×630 image if you like.

---

## Troubleshooting

| Symptom | Fix |
|--------|-----|
| RSVP page says “being set up” | Supabase URL/anon key not filled in `config.js`, or still contain the `YOUR-PROJECT` placeholder. |
| RSVP won't save | Confirm `db/schema.sql` ran fully (it creates the `submit_rsvp` function). Check the browser console for the exact error. |
| Admin login fails | User not created in Supabase Auth, or **Auto Confirm** wasn't enabled. Re-create the user. |
| Admin table empty after login | No RSVPs submitted yet, or `schema.sql` didn't finish. Submit a test RSVP and refresh. |
| Photos/CSS missing on GitHub Pages | Make sure `index.html` is at the **repo root** and `.nojekyll` was uploaded. |
| Page works locally via `file://` but modules fail | Use a local server (`python3 -m http.server`) — modules don't load from `file://`. |

Questions about the data model or security are covered in the README under **How the data & security work**.
