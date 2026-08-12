[README.md](https://github.com/user-attachments/files/30975638/README.md)[Uploading READM# BNI F&B Directory (v3c — 5 Senses Bistro re-added + named secondary contacts)

## What changed from the last zip (v3b)

- **Re-added 5 Senses Bistro** (Alliance chapter, West area) — this brand was
  present in your first two PDFs but was missing entirely from the "Full
  Master List / Halal Updated" PDF's WEST section. Not a duplicate; it was a
  gap in that source document.
- Added a second named contact for that listing — **Cheng Yuan, 9685 7276**
  — alongside the original contact (Kah Yung Chong, 6339 1435).
- `phone` parsing now supports a **named secondary contact** format:
  `"<number> / <Name> <number>"` → renders the primary tel/WhatsApp link,
  then `· <Name> <number> [WhatsApp]` for the second person. This is
  separate from the existing bare "alt WhatsApp number" format (still
  supported, e.g. Mutiara Seafood's `"<number> / WhatsApp <alt>"`).
- Now 62 entries total.

## Still open (unchanged from before, not blocking)

- **Givers → D'Legacy** conflict (Claudine vs. Daryl Nonis as owner) —
  still unresolved, still shipped with Claudine's version. Search "D'Legacy"
  in `data.json`.
- `arescollective.co` in the footer credits is still an assumed URL, not
  confirmed as Alessandra's actual domain.

## Deploying this update

Same repo, same Vercel project. 4 files changed: `index.html`, `style.css`,
`app.js`, `data.json`.

### Option A — GitHub web UI
1. Open your repo on github.com
2. For each of the 4 changed files: click it → pencil (edit) icon → select
   all, paste in the new version → commit to `main`
3. Vercel redeploys automatically within ~30–60 seconds

### Option B — Git CLI
```bash
cd bni-fnb-directory
git pull
# replace index.html, style.css, app.js, data.json
git add index.html style.css app.js data.json
git commit -m "v3c: re-add 5 Senses Bistro + named secondary contact support"
git push
```

## Adding a named secondary contact to any listing going forward

In `data.json`, format the `phone` field as:

```json
"phone": "6339 1435 / Cheng Yuan 9685 7276"
```

Primary number always comes first. Add `/ <Name> <number>` for each
additional named contact — no code change needed, this is now a supported
data pattern.
E.md…]()
