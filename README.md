# Drop — Web App

Real request parsing, real email verification, and real ticket-event search
— all backed by small Vercel serverless functions. No connection to real
retailers (Target/Walmart/etc.) or real purchasing anywhere; those remain
clearly labeled as demo/simulated.

## Files
- `index.html` — the whole app
- `api/parse-request.js` — real AI parsing of typed requests (Anthropic API)
- `api/ticketmaster-search.js` — real live event search (Ticketmaster Discovery API)
- `api/send-code.js` / `api/verify-code.js` — real email verification (Resend)

Each falls back gracefully with an on-screen explanation if not configured.

## Environment variables (Vercel → Settings → Environment Variables)

- `ANTHROPIC_API_KEY` — console.anthropic.com → API Keys
- `TICKETMASTER_API_KEY` — developer.ticketmaster.com → free account → create an app,
  the "Consumer Key" is your API key
- `RESEND_API_KEY` — resend.com (free tier)
- `EMAIL_SECRET` — any long random string you make up (not a real key from anywhere)

Redeploy after adding/changing env vars (Deployments tab → ⋯ on latest → Redeploy).

## What's real vs. not

- Ticket search results, dates, venues, and prices: real, live from Ticketmaster.
- "Open real event page" link: goes to the actual Ticketmaster page — real purchases happen there, on their site, by you.
- Collectibles/general "New watch": real AI parsing, but no live retailer stock-checking behind it (no such public API exists for Target/Walmart/etc. — see project notes).
- "Check now (demo)" / "Buy now (demo)" on non-ticket watches: explicitly simulated, no real retailer contacted.
