# Major's Bets

A single-page, flashy landing spot for Major's monster FanDuel parlays. The site is static (HTML/CSS/JS) and runs anywhere you can host plain files (Netlify, Vercel, GitHub Pages, S3, etc.).

## Update workflow

1. **Edit parlays** – Update `data/parlays.json` with the latest spotlight parlay, daily cards, weekly stacks, and history notes. The UI reads directly from this file, so publishing new numbers is as simple as changing JSON and redeploying.
2. **Odds feed** – `data/odds.json` is the default odds source. Swap this file for a script or endpoint that returns the same shape, then set up a cron/serverless job to pull FanDuel odds and save them over this file before redeploying. If you have an API key (e.g., FanDuel partner, The Odds API, OddsJam), point `oddsSource` in `assets/js/main.js` at your proxy endpoint to keep requests private and deal with CORS.
3. **Promo snippets** – Add/replace strings in the `teasers` array inside `data/parlays.json` to control the auto-generated copy used on the site and the "Copy today's teaser" button.
4. **Manual builder** – Use the "Personal Builder" panel on the page to upload photos, set odds, and add each leg by hand. Nothing is persisted, so copy data out once you've mocked it up.

## Deploying on Netlify

1. Create a new Netlify site from Git (or drag-and-drop the folder). No build command is required because everything is precompiled HTML/CSS/JS.
2. Keep the default publish directory pointed at the repo root (Netlify reads `netlify.toml` and serves `/` as-is).
3. When you update `data/parlays.json` or `data/odds.json`, commit/push and Netlify will redeploy instantly. For headless odds automation, point Netlify to a branch that only changes the JSON files.
4. Optional: add a scheduled Netlify Build hook plus a script that fetches odds and writes into `data/odds.json` before the build kicks off.

## Recommended automation

- **Serverless odds refresher** – Use a simple worker (Cloudflare Worker, AWS Lambda, Vercel cron) that fetches FanDuel markets you care about, trims the payload to the schema in `data/odds.json`, and writes it to object storage or KV. Point the front-end fetch to that hosted JSON.
- **Content deploy** – Keep this repo connected to Netlify/Vercel so that every push instantly rebuilds the static site. For day-to-day updates you only need to touch `data/parlays.json` and `data/odds.json`.
- **X account** – The teasers section in the UI is fed by the JSON file. You can reuse the same text manually on X now, and later automate posting through the API.

## Local development

```bash
# optional local server
npx serve
# or
python -m http.server 4173
```

Then open `http://localhost:4173` (or whichever port your server prints).

## Structure

```
index.html             # layout + sections
assets/css/style.css   # neon gradient styling
assets/js/main.js      # data fetch, rendering, interactivity
data/parlays.json      # spotlight + card data
data/odds.json         # odds feed placeholder
SAM_0591.jpeg          # hero image
```

## Next steps

- Replace the placeholder email in the footer with your contact.
- Hook `assets/js/main.js` to your hosted odds JSON endpoint once you have the API/proxy in place.
- Customize copy/legs as you build your daily card.
