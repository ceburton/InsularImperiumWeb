# Insular Imperium - Web

Web presence for **Insular Imperium** (Grid General): tactical turn-based strategy with Roman legions, naval warfare, legendary heroes, and undead escalation.

## What is live in this repo

- A heavily themed "Romestead" UI direction (marble, parchment, bronze, obsidian, wax-seal interactions)
- Animated landing portal with direct navigation to Features, War Room, and Media
- Long-form Features page with section-aware sticky navigation and hero portrait stat hovers
- War Room dashboard with four tactical tabs:
	- Field Reports (Roman and Orc unit classes)
	- Blue Heroes
	- Vampire Clan
	- Naval Fleet
- Detail overlays for units and heroes via reusable reveal components
- Static-export friendly Next.js setup, ready for Firebase Hosting

## Routes

- `/` - Landing portal
- `/features` - Feature deep dive and section navigation
- `/dashboard` - Tactical War Room (tabs and dossier views)
- `/media` - Media and gallery placeholder

## Project structure

- `web/` - Next.js 16 application
- `web/src/app/` - App Router pages (`/`, `/features`, `/dashboard`, `/media`)
- `web/src/components/` - Reusable cards, detail panes, transitions
- `web/src/data/` - Game data for heroes, units, and ships
- `web/src/app/globals.css` - Global visual system and themed styles
- `web/public/assets/` - Game and marketing assets

## Run locally

**First-time setup** (install dependencies in the app folder):

```bash
cd web && npm install
```

From **repository root** (after setup):

```bash
npm run dev
```

Or from **`web/`**:

```bash
npm install   # if not done yet
npm run dev
```

Open `http://localhost:3000`.

## Scripts

Root scripts proxy into `web/`:

- `npm run dev` - Start local dev server
- `npm run build` - Build production output
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Build and deploy

This app is configured for static export in `web/next.config.ts` (`output: 'export'`).

1. Build:

```bash
npm run build
```

2. Deploy to Firebase Hosting (from `web/`):

```bash
firebase deploy
```

Firebase is configured to serve from `web/out` (`web/firebase.json`).

## Tech stack

- Next.js 16 (App Router, static export)
- React 19
- Tailwind CSS 4
- Framer Motion
- TypeScript
- Firebase Hosting
