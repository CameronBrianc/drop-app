# Drop — App Prototype

"Tell us what you want. We'll watch for it."

This repo contains the **interactive HTML/CSS/JS prototype** for Drop, a consumer
subscription app for finding and buying limited-drop collectibles and primary-sale
tickets. It is a **click-through design spec**, not the production app — there is
no real backend, no live monitoring, and no actual checkout. Everything you see
is hardcoded demo data.

## What's here

```
drop-app/
├── README.md
├── .gitignore
└── prototype/
    └── index.html   ← the whole prototype, self-contained
```

## Running it

No build step, no dependencies. Just open the file:

```
open prototype/index.html          # macOS
start prototype\index.html         # Windows (cmd)
```

Or serve it locally so it behaves like a real hosted page:

```
cd prototype
python3 -m http.server 8080
# then visit http://localhost:8080
```

## What the prototype demonstrates

- Full screen-by-screen UI: onboarding, home/dashboard, natural-language request
  flow, purchase rules, drop calendar, live alert, checkout status, and the
  upgrade/paywall flow.
- Real navigation patterns (push screens with back buttons, a modal sheet,
  native swipe only where it belongs — onboarding slides and calendar months).
- A "▶ Watch full flow" button that auto-plays the entire signup → alert →
  purchase journey in real time, for demos.

## What this is *not*

- Not connected to any retailer, ticketing platform, or payment processor.
- Not a mobile app binary — it's a web page shaped like one, for design review.
- Not legally reviewed — the copy reflects a "human always taps to confirm the
  purchase" model (see project notes on the BOTS Act and retailer ToS), but an
  actual lawyer should review this before any real checkout code is written.

## Suggested next steps

1. Legal review of the purchase-assist model, per retailer/category.
2. Stand up the backend core (rule engine, NL parsing via the Claude API,
   one monitor source, push notifications) with no UI — prove alert latency
   before building more screens.
3. Rebuild this spec as a real React Native (Expo) app, using this file as the
   interaction/visual reference rather than shipping the HTML itself.
4. Wire up one real, manual-confirm checkout path before attempting any
   assisted automation.

## License / ownership

This is a private product spec. Add your own license here before making the
repo public.
