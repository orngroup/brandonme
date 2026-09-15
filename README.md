# Brandon Hall — Sales & Marketing Portal

A staff-facing sales portal for Brandon Hall Hotel & Spa. Works as a web link and installs as a mobile app (PWA). Sales & marketing tool only — the events operations system is separate.

## What it does
- **Rooms** — all 17 rooms with dimensions, capacity by layout, estimated carbon footprint, and recommended layout + equipment filtered by event type (meeting, wedding, baby shower, birthday, celebration, celebration of life, Christmas/NYE). Enter a guest count to see instantly which rooms fit.
- **Packages** — DDR, 24-hour, wedding, celebration and Christmas packages, plus à la carte beverage/food/equipment pricing.
- **Create Quote** — build a costed quote (customer details, room, package, add-ons), see a live total and carbon estimate, and download a branded PDF to email the customer yourself.
- **Enquiries** — a pipeline dashboard (New → Contacted → Quoted → Won/Lost). Log enquiries manually or share the public form link.
- **Admin** — reference tables for users, rooms and hire rates. The M&E audit import lands here.

## Logins (demo mode)
| Name | Code |
|---|---|
| Ajay Kawa | BHAK |
| Raj Kumar | BHRK |
| Alia Taub | BHAT |
| Nicola Cartwright | BHNC |

## Running it
Just open `index.html` — it runs in **demo mode** (data from `data.js`, enquiries saved in the browser). No build step.

## Hosting on GitHub Pages
1. Create a repo (e.g. `brandonhall-portal`) and upload every file, keeping the `assets/` folder.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Your portal is live at `https://<org>.github.io/brandonhall-portal/`. Share that link; on mobile, "Add to Home Screen" installs it as an app.

## Editing data
Everything is in **`data.js`** — rooms, capacities, hire rates, packages and add-ons. Edit and re-upload. Two things are stubbed:
- **Equipment recommendations** (`EVENT_EQUIPMENT`) — DUMMY placeholders, flagged in the UI. Replace from the M&E audit list.
- **Carbon** — estimated by `carbonModel()` from floor area + occupancy + event type. Benchmarks are marked in comments; adjust as needed.

## Connecting Firebase (when ready)
Demo mode stores enquiries in the browser only. To make them shared and persistent:
1. Create a Firebase project; enable **Authentication (Email/Password)** and **Firestore**.
2. Paste your web config into `firebase-config.js`.
3. Create the four users in Auth (passwords must be ≥6 chars, so pad the codes e.g. `BHAK01`).
4. Set `USE_FIREBASE = true` at the top of `app.js` and add the Firebase SDK script tags to `index.html` (Firestore read/write for enquiries and quotes is the next build step).

## Files
- `index.html` — shell, styles, login
- `app.js` — all logic
- `data.js` — **all editable data**
- `firebase-config.js` — Firebase credentials (placeholder)
- `manifest.json`, `sw.js` — PWA
- `assets/` — logo + icons
