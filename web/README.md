# Insular Imperium — Web App

Next.js app for the Insular Imperium site: landing page, Features overview, War Room (unit/hero/ship dossiers), and Media placeholder.

## File structure

```
web/
├── public/                 # Static files (served at /)
│   ├── assets/             # Hero portraits, cover images, tiles
│   │   └── tiles/          # Tile / map data
│   └── *.svg               # Favicon and default SVGs
│
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx      # Root layout and metadata
│   │   ├── page.tsx        # Landing page
│   │   ├── globals.css     # Global styles and theme
│   │   ├── dashboard/      # War Room (units, heroes, vampires, fleet)
│   │   │   └── page.tsx
│   │   ├── features/       # Features overview (scroll sections)
│   │   │   └── page.tsx
│   │   └── media/          # Media / gallery placeholder
│   │       └── page.tsx
│   │
│   ├── components/         # Reusable UI
│   │   ├── HeroCard.tsx
│   │   ├── HeroDetail.tsx
│   │   ├── UnitCard.tsx
│   │   ├── UnitDetail.tsx
│   │   ├── ShipCard.tsx
│   │   └── ScrollReveal.tsx
│   │
│   ├── data/               # Game data (no API)
│   │   ├── heroes.ts       # Blue + vampire heroes
│   │   └── units.ts        # Roman, Orc, ship classes
│   │
│   └── lib/
│       └── soundStubs.ts   # Placeholder sound hooks
│
├── package.json
├── package-lock.json
├── next.config.ts          # unoptimized images (Vercel)
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md               # This file
```

Generated at build/dev (not committed): `node_modules/`, `.next/`, `out/`.

## Running locally

From the **repo root** (recommended):

```bash
npm run dev
```

Or from this `web` folder:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script         | Description           |
|----------------|-----------------------|
| `npm run dev`  | Start dev server      |
| `npm run build`| Production build     |
| `npm run start`| Run production build |
| `npm run lint` | Run ESLint           |

## Static assets

The Sunstone Saga lives in `public/stories/The-Sunstone-Saga.md` and is linked from Media at `/media/story`. Replace this Markdown file and rebuild to update the story. Keep chapter headings in the form `# Chapter ...`; the reader builds its chapter menu from those headings.

The reader fits pages to the viewport, recalculates them for font and screen changes, and shows two pages when there is enough room. The menu includes an option to always show one page. Bookmarks use text offsets in browser storage, so changing the layout keeps the current passage visible.

To run the reader browser checks from `web`, run `npm run build` followed by `npm run test:reader`. The tests use installed Google Chrome in headless mode and start the production server on port 3100.

Assets live in **`public/assets`** (hero portraits, cover images, etc.). They are served at `/assets/...` (e.g. `/assets/hero-marcus.png`).

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- React 19, Tailwind CSS 4, Framer Motion, TypeScript

## When

- 03/07/2026 10:25 AM
