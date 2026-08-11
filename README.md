[Uploading RE# BNI F&B Directory (v3b — attribution credits + halal status)

## What changed from the last zip

- Added attribution credits, placed under the page title (not in a footer):
  - **Built by** Moses Simon (Momo) — AI Educator · Momo DigiLearn · BNI
    Signature, with a WhatsApp link to +65 9670 1344
  - **Content collated by** Alessandra Ong — Marketing Consultant, linked to
    [arescollective.co](https://arescollective.co) · BNI Signature, with a
    WhatsApp link to +65 9002 2519
- Everything from the previous package is unchanged: halal tags, Halal Only
  toggle, multi-outlet brand grouping, Google Maps links, tel:/WhatsApp
  contact parsing.

**Double-check `arescollective.co` is actually Alessandra's real domain** —
I linked it based on the company name you gave me, not a URL you confirmed.
If it's wrong (different domain, subdomain, or she doesn't have a site live
yet), the link lives in `index.html` inside the `#topCredits` block — one
line to fix.

## ⚠️ Still-unresolved data conflict (carried over from before)

**Givers → D'Legacy** has two contradictory versions in the source data —
owner "Claudine" (kept, currently live) vs. owner "Daryl Nonis" with a
different halal status. See `data.json`, search "D'Legacy". Not blocking
deployment, but worth fixing once you know which is correct.

## Deploying this update

Same repo, same Vercel project. 4 files changed: `index.html`, `style.css`,
`app.js`, `data.json`. (`vercel.json` and `.gitignore` untouched.)

### Option A — GitHub web UI
1. Open your repo on github.com
2. For each of the 4 changed files: click it → pencil (edit) icon → select
   all, paste in the new version → commit to `main`
3. Vercel redeploys automatically within ~30–60 seconds of your last commit

### Option B — Git CLI
```bash
cd bni-fnb-directory        # your existing local clone
git pull
# replace index.html, style.css, app.js, data.json with the ones here
git add index.html style.css app.js data.json
git commit -m "v3b: attribution credits (Momo + Alessandra) at top of page"
git push
```

## Updating data going forward

Still `data.json` only for regular edits — same shape as before (`area`,
`chapter`, `brand`, `cuisine`, `owner`, `location`, `phone`, `halal`).
ADME.md…]()
