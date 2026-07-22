# Getting Your Wedding Site Live — Beginner's Walkthrough

Written for someone who has **never used GitHub before**. Everything here is **100% free**. No credit card, no paid plans. Take it slow — plan for about 45 minutes, and it's fine to stop and come back.

You'll do this in three stages:

1. **Supabase** — the free database that stores RSVPs (about 15 min).
2. **GitHub** — the free hosting that puts your site on the internet (about 20 min).
3. **Keep-alive + test** — a free auto-ping so the site never breaks, then a test RSVP (about 10 min).

Do them in order. Stage 2 needs two values you copy from Stage 1.

> **Tip:** Keep this page open in one browser tab and do the work in another. Check off each box as you go.

---

## What you're about to build, and why it's free

- Your website files (photos, pages) are hosted by **GitHub Pages** — free for anyone, forever, on public projects.
- Your RSVP data lives in **Supabase** — their free tier is free forever and never auto-charges you.
- **The one catch:** Supabase puts a free database "to sleep" after 7 days with no activity. If that happens, your RSVP form stops working until you wake it up. So in Stage 3 you'll switch on a free auto-ping that pokes the database twice a week and keeps it awake. Don't skip it.

You will **never be asked for payment** in this guide. If any screen asks for a credit card, you took a wrong turn — stop and re-read the step.

---

## STAGE 1 — Supabase (your free database)

### 1.1 — Create your account
1. Go to **https://supabase.com** and click **Start your project** (or **Sign in**).
2. Sign up with your email or your Google/GitHub account. It's free.

### 1.2 — Create a project
1. Click **New project**.
2. If it asks you to create an "organization" first, give it any name (e.g. `Wedding`) and choose the **Free** plan. Click through.
3. Now fill in the project:
   - **Name:** `phong-nhu-wedding`
   - **Database Password:** click **Generate a password**, then **copy it and paste it somewhere safe** (a notes app is fine). You likely won't need it again, but don't lose it.
   - **Region:** pick the one closest to Georgia, USA (e.g. *East US*).
4. Click **Create new project**. Wait about 2 minutes while it sets up. ☕

### 1.3 — Build the database (copy-paste one time)
1. On the left sidebar, click **SQL Editor** (icon looks like `</>`).
2. Click **New query**.
3. Open the file **`db/schema.sql`** from your wedding-site folder (double-click it; it opens in a text app). Select **all** the text (Ctrl+A / Cmd+A) and copy it (Ctrl+C / Cmd+C).
4. Click into the big empty box in Supabase and paste (Ctrl+V / Cmd+V).
5. Click the green **Run** button (bottom right).
6. ✅ You should see **"Success. No rows returned."** at the bottom. That means your database, security rules, and RSVP function are all created. If you see a red error, make sure you copied the *entire* file, then run again.

### 1.4 — Create your admin login
This is the email + password you'll use to see who has RSVP'd.
1. Left sidebar → **Authentication** → **Users**.
2. Click **Add user** → **Create new user**.
3. Enter **your email** and a **password you'll remember** (write it down).
4. **Important:** turn ON **Auto Confirm User** (a toggle or checkbox). Without it, you can't log in.
5. Click **Create user**.
6. *(Optional)* Repeat for Nhu if you both want access.
7. *(Recommended, keeps strangers out)* Left sidebar → **Authentication** → **Providers** → click **Email** → turn **OFF** "Allow new users to sign up" → **Save**. Now only the logins you created can exist.

### 1.5 — Copy your two keys (you'll need these next)
1. Left sidebar → click the **gear icon** (Project Settings) → **API**.
2. You'll see two things to copy. Paste both into your notes app for a minute:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **Project API keys → `anon` `public`** — a long string starting with `eyJ...`
3. That's it for Supabase. Leave this tab open.

> The `anon public` key is **meant to be public** — it's safe to put on the internet. (Never copy the one labeled `service_role` — you won't need it here.)

---

## STAGE 2 — GitHub (put the site online)

### 2.1 — Create your GitHub account
1. Go to **https://github.com** and click **Sign up**.
2. Pick a username (this becomes part of your web address, e.g. `phongandnhu`), enter your email, create a password, and verify. Choose the **Free** plan if asked.

### 2.2 — Create the repository ("repo" = a project folder on GitHub)
1. Once logged in, click the **+** in the top-right → **New repository**.
2. Fill in:
   - **Repository name:** `wedding` (simple and clean)
   - **Public** — leave this selected. *(Public is required for free hosting. Don't worry — people can only see the website, and your RSVP data stays locked in Supabase, not on GitHub.)*
   - Leave everything else unchecked.
3. Click **Create repository**.

### 2.3 — Upload your website files
You'll now put your files into that repo using only your web browser.

1. On the new repo page, find the link that says **"uploading an existing file"** (or click **Add file → Upload files**).
2. Open your **wedding-site folder** on your computer in a Finder/Explorer window.
3. Select these items **inside** the folder — **not the folder itself**:
   - `index.html`, `story.html`, `details.html`, `rsvp.html`, `portal.html`, `admin.html`, `404.html`
   - `README.md`, `DEPLOYMENT.md`, `GETTING-STARTED.md`
   - the **`assets`** folder
   - the **`db`** folder
4. Drag them all onto the GitHub upload area (or use **choose your files**).
5. Wait for the file list to finish loading. Near the bottom, click the green **Commit changes**.

> **Why "not the folder itself"?** GitHub needs `index.html` to sit at the top level of the repo so it becomes your home page. If you upload the whole `wedding-website` folder, your address ends up wrong. Uploading the *contents* fixes this.

> **Two special files come next** (`.nojekyll` and the auto-ping). They start with a dot, and drag-and-drop often skips those — so you'll create them by hand in the next steps. That's normal.

### 2.4 — Paste your Supabase keys into the site
1. In your repo, click the **`assets`** folder → **`js`** folder → click **`config.js`**.
2. Click the **pencil icon** (top right of the file) to edit it.
3. Find these two lines near the top:
   ```js
   supabaseUrl: "https://YOUR-PROJECT-ref.supabase.co",
   supabaseAnonKey: "YOUR-ANON-PUBLIC-KEY",
   ```
4. Replace the placeholder text **inside the quotes** with the two values you copied in Step 1.5. Keep the quotes and the comma. It should look like:
   ```js
   supabaseUrl: "https://abcdefgh.supabase.co",
   supabaseAnonKey: "eyJhbGciOi...your-long-key...",
   ```
5. Click **Commit changes** (green button, top right) → **Commit changes** again to confirm.

### 2.5 — Turn on the website (GitHub Pages)
1. In your repo, click **Settings** (top menu) → **Pages** (left sidebar).
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Under **Branch**, choose **main**, keep the folder as **/ (root)**, and click **Save**.
4. Wait 1–2 minutes, then refresh the page. A green box appears with your live address:
   **`https://YOUR-USERNAME.github.io/wedding/`**
5. Click it. Your wedding site is live! 🎉 (The RSVP page works once you finish Stage 3's test — but the home, story, and details pages should look perfect right now.)

---

## STAGE 3 — Keep it awake, then test

### 3.1 — Add your two keys as GitHub "secrets"
The auto-ping needs to know your Supabase address and key. You store them privately here.
1. In your repo: **Settings** → (left sidebar) **Secrets and variables** → **Actions**.
2. Click **New repository secret**.
   - **Name:** `SUPABASE_URL`
   - **Secret:** paste your Project URL (e.g. `https://abcdefgh.supabase.co`)
   - Click **Add secret**.
3. Click **New repository secret** again.
   - **Name:** `SUPABASE_ANON_KEY`
   - **Secret:** paste your `anon public` key (the long `eyJ...` string)
   - Click **Add secret**.

### 3.2 — Add the auto-ping file
1. Go back to your repo's main page (click the repo name at the top-left).
2. Click **Add file → Create new file**.
3. In the filename box, type exactly this (the slashes create folders automatically):
   ```
   .github/workflows/keep-alive.yml
   ```
4. Open the file **`.github/workflows/keep-alive.yml`** from your wedding-site folder on your computer, copy all of it, and paste it into the big box on GitHub.
   *(If you can't see that folder on your computer because it's hidden, no problem — copy the block from the bottom of this guide instead.)*
5. Click **Commit changes** → **Commit changes**.
6. Click the **Actions** tab at the top. You'll see "Keep Supabase awake." Click it → **Run workflow** → **Run workflow** to test it now. After a few seconds it should show a green check ✅. From now on it runs automatically twice a week.

### 3.3 — (Optional) Add the `.nojekyll` file
Your site should already work without this, but it's a harmless safety net:
1. **Add file → Create new file**, name it exactly `.nojekyll`, type a single space in the box, and **Commit changes**.

### 3.4 — Test everything for real
1. Open your live site: `https://YOUR-USERNAME.github.io/wedding/`
2. Go to **RSVP**, enter a test name (e.g. "Test Guest"), choose **Joyfully Accept**, and submit. You should see the "We can't wait" confirmation.
3. Go to `https://YOUR-USERNAME.github.io/wedding/admin.html`, log in with the email/password from Step 1.4, and confirm **Test Guest** appears in the table.
4. Clean up the test: in Supabase → **Table Editor** → **rsvps** → delete that test row.

**You're done.** Share your link with your guests. 💍

---

## Making changes later

- **Change wording, dates, schedule:** edit `assets/js/config.js` on GitHub (pencil icon → Commit). Changes go live in about a minute.
- **Swap a photo:** upload a new image into `assets/img` with the **same filename** to replace it.
- **See who's coming:** just visit `admin.html` and log in anytime.

---

## If something's not right

| What you see | What to do |
|---|---|
| RSVP page says "being set up" | Your keys aren't saved. Re-check Step 2.4 — the values must be inside the quotes and not the `YOUR-PROJECT` placeholder. |
| Photos or styling missing | Make sure you uploaded the **contents** of the folder (so `index.html` is at the top level), not the folder itself. |
| Can't log in to admin | The user wasn't created with **Auto Confirm** on. Redo Step 1.4. |
| RSVP won't save | Re-run `db/schema.sql` (Step 1.3) and make sure it said "Success." |
| Auto-ping shows a red X in Actions | Re-check the two secret **names** are exactly `SUPABASE_URL` and `SUPABASE_ANON_KEY` (Step 3.1). |
| Site address gives a 404 | Give Pages 2–3 minutes after enabling it, then refresh. Confirm Branch = **main**, folder = **/ (root)**. |

---

## Copy of the auto-ping file (in case you can't find it on your computer)

Paste this into `.github/workflows/keep-alive.yml` in Step 3.2:

```yaml
name: Keep Supabase awake

on:
  schedule:
    - cron: "17 13 * * 1,4"
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping the database
        run: |
          curl -sS -X POST "$SUPABASE_URL/rest/v1/rpc/ping" \
            -H "apikey: $SUPABASE_ANON_KEY" \
            -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
            -H "Content-Type: application/json" \
            -d '{}'
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

---

## Want your own web address? (optional, small yearly cost)

The free `github.io` address works perfectly. If you'd rather have something like `phongandnhu.com`, you'd buy that name from a registrar (Namecheap, Google Domains, etc.) — usually ~$12/year — then connect it in **Settings → Pages → Custom domain**. This is the only thing in this whole setup that costs money, and it's entirely optional.
