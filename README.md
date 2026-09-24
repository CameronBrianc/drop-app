# Drop — Web App

A working web app: real request parsing, a persistent watchlist, and
real email verification — all backed by two small Vercel serverless
functions. Nothing here connects to real retailers/ticketing or moves
real money; those parts are clearly labeled wherever simulated.

## Files
- `index.html` — the whole app
- `api/parse-request.js` — real AI parsing of your typed request (Anthropic API)
- `api/send-code.js` — real email verification code (Resend)
- `api/verify-code.js` — checks the entered code

If any of these aren't configured, the app falls back gracefully and tells
you so on screen — it never silently pretends something is real.

## Environment variables (Vercel → Settings → Environment Variables)

- `ANTHROPIC_API_KEY` — from console.anthropic.com (API Keys). Powers real
  request parsing on the Dashboard.
- `RESEND_API_KEY` — from resend.com (free tier). Powers real email
  verification codes.
- `EMAIL_SECRET` — any long random string you make up yourself (not a key
  from anywhere — it just signs the verification token). Generate one with:
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

After adding/changing env vars, redeploy (Deployments tab → ⋯ on latest → Redeploy).
