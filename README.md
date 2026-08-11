[README.md](https://github.com/user-attachments/files/30922083/README.md)# BNI F&B Directory (v3 — halal status + full master list)

## What changed from v2

- Every listing now has a `halal` field: `"HALAL ✓"`, `"HALAL ✓*"` (hotel/
  food-operation certification context), `"MUSLIM-OWNED ✓"` (not
  automatically MUIS-certified — shown as a distinct tag from HALAL, not
  merged into it), `"NON-HALAL"`, or `"Not verified"`.
- Halal badge renders on every card *except* "Not verified" — showing a
  badge for "unknown" would read as a claim either way, so those stay quiet.
- New **"🕌 Halal Only" toggle** next to search — filters to HALAL ✓ and
  MUSLIM-OWNED ✓ entries only.
- `phone` parsing now also handles `"TBC"` as a placeholder (grayed out, not
  clickable) and multi-number formats like `"6816 3030 / WhatsApp 90924454"`
  (renders both the main tel: link and a separate WhatsApp link for the alt
  number).
- 15 new brands/outlets added from the master list (Carousel, Flakyhaus,
  Gui Zhou Grilled Fish, Master Zhu, Shan Yu Zong Hotpot, Cayenne's Cafe,
  Mutiara Seafood, Raisugood By Emma's Kitchen, Fong Fu Food Industries,
  wagyubeefsingapore, Royal Plaza on Scotts, and more).

## ⚠️ One unresolved data conflict — check before you rely on this

**Givers → D'Legacy** appears twice in the source PDF with the same phone
number but contradictory details:
- Owner **Claudine**, halal status "Not verified" — *this is the version
  currently in `data.json`*
- Owner **Daryl Nonis**, halal status **NON-HALAL**

I kept the Claudine version since it matches your earlier PDFs, but I can't
tell if this is a business handover, a data-entry error, or two different
people being conflated. Find the entry in `data.json` (search "D'Legacy")
and correct it once you know which is right.

Also silently resolved (formatting-only duplicates, not conflicts): merged
duplicate rows for MasterMind Carousel, Prosperity Master Zhu, Blaze
Cayenne's Cafe, and Synergy Mutiara Seafood — each appeared twice in the PDF
with only punctuation or contact-format differences.

## Deploying this update

Same repo, same Vercel project — you're replacing files, not creating
anything new. 4 files changed: `index.html`, `style.css`, `app.js`,
`data.json`. (`vercel.json` and `.gitignore` are untouched.)

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
git commit -m "v3: halal status tags + halal-only filter + full master list"
git push
```

## Updating data going forward

`data.json` only, same as before. New field shape:

```json
{
  "area": "Central / City",
  "chapter": "Ascend",
  "brand": "13 Miles",
  "cuisine": "Halal Fusion",
  "owner": "Marcus Du",
  "location": "Bugis / Kampong Glam — 749 North Bridge Rd",
  "phone": "6022 1133",
  "halal": "HALAL ✓"
}
```

Valid `halal` values: `"HALAL ✓"`, `"HALAL ✓*"`, `"MUSLIM-OWNED ✓"`,
`"NON-HALAL"`, `"Not verified"`. Anything else won't render a badge.

