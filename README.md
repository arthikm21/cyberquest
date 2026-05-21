# CyberQuest: The CC Journey

Interactive prep app for the ISC2 Certified in Cybersecurity (CC) certification — Duolingo × HackTheBox × graphic novel. React SPA, no backend (yet). Progress persists in the browser via IndexedDB. PWA-installable, offline-capable.

> Not affiliated with, endorsed by, or sponsored by (ISC)². CC, CISSP, and related marks are trademarks of (ISC)².

## Tech

- Vite + React 18 + TypeScript (strict)
- Tailwind CSS, custom keyframes
- Zustand (state) + idb-keyval (persistence) with schema-versioned migrations
- React Router (route-level code splitting via `React.lazy`)
- Recharts (lazy-loaded for score screens)
- Lucide icons (tree-shaken)
- vite-plugin-pwa (Workbox) — auto-update SW, offline shell

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build
npm run preview      # serve the built bundle
```

## Architecture

- `src/store.ts` — Zustand store. All persisted fields mirror `PersistedState` in `src/lib/storage.ts`. Saves are debounced and round-tripped through IndexedDB.
- `src/lib/storage.ts` — IDB primary store. Schema versioned. Includes JSON export.
- `src/content/*` — hardcoded question bank, flashcards, glossary, story, domain modules.
- `src/pages/*` — one file per route. Heavy routes are lazy-loaded from `src/App.tsx`.
- `src/games/*` — self-contained mini-games, each lazy-loaded by `GameRunner.tsx`.
- `src/components/*` — shared UI: Layout, Modal, Onboarding, Toaster, ErrorBoundary, StoryArt, RadarReview.
- `public/_headers` — security headers (CSP, HSTS, X-CTO, Permissions-Policy) for Cloudflare Pages / Netlify deploys.

## Deploy

Any static host works. Recommended: Cloudflare Pages or Netlify, both honor `public/_headers`. Bundle is ~code-split per route; initial JS is well under the 180 KB gzip budget noted in the prompt.

## Roadmap (Auth scaffold today, full Auth later)

A stable anon `userId` UUID is generated on first launch. The Sign-In button opens a "coming soon" modal. Persistence is abstracted in `src/lib/storage.ts`, so the future swap from IDB-only → IDB + remote sync is a single-file change. No existing user loses progress.

## Data portability

Settings → Your Data:
- Export progress as JSON
- Import progress from JSON (e.g., moving browsers)
- Delete all my data (wipes IndexedDB)
