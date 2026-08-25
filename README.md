# BNI F&B Directory (v3d — YENNEY Restaurant resolved)

## What changed from v3c

- Resolved the long-standing **Elite / "Vietnamese Restaurant"** placeholder
  (owner "Crystal", location "not provided") into a real listing:
  **YENNEY Restaurant** — Vietnamese, Marina One B2-50 East Tower S018935,
  Director Crystal Nguyen, +65 9326 2779.
- Moved out of "Location TBC" into **Central / City** (Marina One sits in
  the Downtown Core, same bucket as your other CBD listings).
- Net entry count unchanged (62) — this replaced the placeholder, it's not
  an additional row.

## Still open (unchanged, not blocking)

- **Givers → D'Legacy** owner conflict (Claudine vs. Daryl Nonis) — still
  shipped with Claudine's version.
- `arescollective.co` in the header credits is still an assumed URL for
  Alessandra's site, not confirmed.

## Deploying this update

Your repo (`its-mosessimon/BNIFoodDirectory`, live at
bni-food-directory.vercel.app) is public but I don't have write access to
it — no GitHub connector is available to me. You'll need to push this
yourself. Same 4 files as every update so far: `index.html`, `style.css`,
`app.js`, `data.json`.

### Option A — GitHub web UI
1. Open https://github.com/its-mosessimon/BNIFoodDirectory
2. For each of the 4 changed files: click it → pencil (edit) icon → select
   all, paste in the new version → commit to `main`
3. Vercel redeploys automatically within ~30–60 seconds

### Option B — Git CLI
```bash
cd BNIFoodDirectory
git pull
# replace index.html, style.css, app.js, data.json
git add index.html style.css app.js data.json
git commit -m "v3d: resolve YENNEY Restaurant (was Elite placeholder)"
git push
```
