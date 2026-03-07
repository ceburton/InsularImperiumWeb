# Insular Imperium — Web

Web presence for **Insular Imperium** (Grid General): tactical turn-based strategy with Roman legions, legendary heroes, naval combat, and the Undead Legion.

## Structure

- **`/web`** — Next.js app (landing, Features overview, War Room dashboard, Media placeholder)
- **`/web/public/assets`** — Static assets (hero portraits, cover images, screenshots)

## Getting started

From the **repository root**:

```bash
npm run dev    # Start dev server (Next.js)
npm run build  # Production build
npm run start  # Run production server
```

The dev server runs at **http://localhost:3000** (or the next free port).

From the `web` folder you can also run `npm run dev` directly.

## Tech

- **Next.js 16** (App Router, static export)
- **React 19**, **Tailwind CSS 4**, **Framer Motion**
- **TypeScript**

## Before pushing to GitHub

- [ ] No `.env` or `.env.local` with secrets is committed (they are gitignored)
- [ ] Repository URL in root `package.json` matches your GitHub repo (e.g. `github.com/ceburton/InsularImperiumWeb`)
