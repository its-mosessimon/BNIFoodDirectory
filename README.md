# BNI F&B Directory

Static referral-partner directory for BNI F&B members, grouped by area, with
Google Maps links on every address. No backend, no build step — just static
files served by Vercel.

## Files

- `index.html` — page structure
- `style.css` — all styling
- `app.js` — search, area filtering, card rendering
- `data.json` — **the directory listings. Edit this file to update the directory.**
- `vercel.json` — hosting config (clean URLs)

## Updating the directory

Open `data.json` and add/edit/remove entries. Each listing looks like:

```json
{
  "area": "Central / City",
  "chapter": "Champions",
  "brand": "EC Coffee Bar",
  "cuisine": "Café",
  "owner": "Tony Chin",
  "location": "Clarke Quay — 40 Carpenter St"
}
```

Notes:
- `area` must be one of: `Central / City`, `West`, `East`, `North / North-East`,
  `South / South-West`, `Location TBC` (these drive the filter chips and section
  order — add a new value in `AREA_ORDER` at the top of `app.js` if you introduce
  a new area).
- `location` format is `Neighbourhood — Full address`. The part before the em
  dash (`—`) is shown as the bold heading on the card; the part after becomes
  the clickable Google Maps link.
- If the real address isn't known yet, write `Location TBC` — the app
  recognizes "TBC" and skips generating a (broken) maps link for it.
- Save the file as valid JSON (commas between entries, no trailing comma on
  the last one) — a JSON validator (e.g. jsonlint.com) catches typos fast.

## Deploy: GitHub → Vercel

**1. Push this folder to GitHub**

```bash
cd bni-fnb-directory
git init
git add .
git commit -m "Initial BNI F&B directory"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

(Create the empty repo on GitHub first at github.com/new — don't initialize it
with a README, or the push above will conflict.)

**2. Connect Vercel**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repo you just pushed
3. Framework preset: **Other** (it's static — no build command needed)
4. Click **Deploy**

Vercel will give you a live URL (e.g. `bni-fnb-directory.vercel.app`) within
about a minute.

**3. Future updates**

Every time you edit `data.json` (or any file) and push to `main`, Vercel
redeploys automatically — no dashboard steps needed.

```bash
git add data.json
git commit -m "Add new referral partner"
git push
```

## Local preview (optional)

Any static server works, e.g.:

```bash
npx serve .
```

Then open the printed localhost URL. (Opening `index.html` directly via
`file://` won't work — the `fetch('./data.json')` call requires an actual
HTTP server.)
