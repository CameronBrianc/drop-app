# Drop — App Prototype

"Tell us what you want. We'll watch for it."

`index.html` is a single, self-contained interactive prototype — no build step,
no dependencies. Deploying this folder as-is (to Vercel, Netlify, GitHub Pages,
anywhere that serves static files) works with zero configuration, since the
entry file is at the repo root.

This is a fully working **click-through design spec**: every screen, every
navigation transition, and the full "signup → alert → purchase" autoplay demo
runs live in the browser. It does **not** connect to any real store, ticketing
platform, or payment processor — there is no backend behind it. See the
project roadmap notes from the original planning conversation for what's
involved in building the real, backend-connected app from here.

## Redeploying to Vercel

Since `index.html` is at the root, no Root Directory setting is needed. Just:

```
git add .
git commit -m "Update prototype"
git push
```

Vercel will auto-redeploy on push if it's already connected to this repo.
