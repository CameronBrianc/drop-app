# Drop — Web App

A working web app with a persistent, localStorage-backed watchlist and
optional real email verification via Vercel serverless functions + Resend.

## Files
- `index.html` — the whole app, self-contained
- `api/send-code.js` — sends a real 6-digit verification code by email
- `api/verify-code.js` — checks the entered code

If the two `api/` functions aren't deployed or configured, the app
automatically falls back to a labeled demo mode (shows the code on screen
instead of emailing it) — so it never breaks, it just tells you which mode
it's in.

## Turning on real email verification

1. Create a free account at https://resend.com and grab an API key
   (Dashboard → API Keys).
2. In your Vercel project: Settings → Environment Variables, add:
   - `RESEND_API_KEY` — the key from step 1
   - `EMAIL_SECRET` — any long random string (this signs the verification
     token; it is NOT your Resend key). You can generate one locally with:
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. Redeploy. Resend's default sender `onboarding@resend.dev` works without
   verifying your own domain, but can only send to the email address you
   signed up to Resend with until you verify a domain — fine for testing,
   verify a real domain in Resend before giving this to other users.
