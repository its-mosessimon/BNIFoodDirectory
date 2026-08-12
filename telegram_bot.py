"""
BNI F&B Directory — Telegram bot (read-only)

Fetches data.json directly from your public GitHub repo's raw URL.
No GitHub token needed since the repo is public.

Setup:
  pip install python-telegram-bot requests --break-system-packages

Fill in:
  - BOT_TOKEN: from @BotFather on Telegram
  - RAW_DATA_URL: your repo's raw data.json URL
"""

import requests
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

BOT_TOKEN = "YOUR_BOT_TOKEN_HERE"
RAW_DATA_URL = "https://raw.githubusercontent.com/<your-username>/<repo-name>/main/data.json"

# simple in-memory cache so every message doesn't hit GitHub —
# refetches at most once every 5 minutes (raw.githubusercontent.com
# itself also caches for a few minutes, so this is just being polite)
_cache = {"data": None, "fetched_at": 0}
CACHE_SECONDS = 300

def get_listings():
    import time
    now = time.time()
    if _cache["data"] is None or (now - _cache["fetched_at"]) > CACHE_SECONDS:
        resp = requests.get(RAW_DATA_URL, timeout=10)
        resp.raise_for_status()
        _cache["data"] = resp.json()
        _cache["fetched_at"] = now
    return _cache["data"]

async def search(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = " ".join(context.args).strip().lower()
    if not query:
        await update.message.reply_text("Usage: /search <area, brand, cuisine, or owner>")
        return

    listings = get_listings()
    matches = [
        d for d in listings
        if query in (d["area"] + " " + d["brand"] + " " + d["cuisine"] + " " + d["owner"] + " " + d["chapter"]).lower()
    ]

    if not matches:
        await update.message.reply_text(f"No matches for '{query}'.")
        return

    lines = []
    for d in matches[:10]:  # cap so one message doesn't blow past Telegram's length limit
        halal = f" [{d['halal']}]" if d.get("halal") and d["halal"] != "Not verified" else ""
        lines.append(f"• {d['brand']} ({d['chapter']}){halal}\n  {d['location']}\n  {d['owner']} · {d['phone']}")

    reply = "\n\n".join(lines)
    if len(matches) > 10:
        reply += f"\n\n…and {len(matches) - 10} more. Try a narrower search."

    await update.message.reply_text(reply)

async def halal(update: Update, context: ContextTypes.DEFAULT_TYPE):
    listings = get_listings()
    matches = [d for d in listings if str(d.get("halal", "")).startswith(("HALAL", "MUSLIM-OWNED"))]
    lines = [f"• {d['brand']} — {d['location']} [{d['halal']}]" for d in matches[:15]]
    await update.message.reply_text("\n".join(lines) or "No halal-flagged listings found.")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "BNI F&B Directory bot\n\n"
        "/search <term> — search by area, brand, cuisine, chapter, or owner\n"
        "/halal — list all HALAL / MUSLIM-OWNED entries"
    )

if __name__ == "__main__":
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("search", search))
    app.add_handler(CommandHandler("halal", halal))
    print("Bot running...")
    app.run_polling()
