# Ente Itinerary — mobile prototype (web)

Clickable prototype for a new Ente mobile feature, built as a web app at phone resolution.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Two presentation modes (automatic)

| Where you open it | What you see |
|-------------------|--------------|
| **Laptop / wide browser** | Phone frame on a dark stage — **360×800** (Android reference) |
| **Real phone** (or narrow viewport ≤480px) | Full screen, no frame (device mode) |

Force the frame on a phone for screenshots: add `?demo=1` to the URL.

## Project layout

```
src/
  components/   PhoneShell, AppBar, TripCard
  screens/      TripListScreen, TripDetailScreen
  data/         mockTrips.ts — edit mock data here
  theme/        tokens.css — Ente Photos colors & fonts
  hooks/        usePresentationMode.ts
```

## Next steps

1. Replace mock copy and screens with your real itinerary flow.
2. Add screens under `src/screens/` and routes in `App.tsx`.
3. Deploy with `npm run build` → Vercel/Netlify; share the link for phone testing.

This repo is intentionally separate from `ente/mobile` and `ente/web`.
