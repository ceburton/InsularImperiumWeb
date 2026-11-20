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

## The books: reader and audiobook

There are three books, each with its own reader, audiobook page and podcast feed (the list is in `src/lib/books.ts`, and `scripts/books.mjs` for the scripts). Book Three is coming out a chapter at a time.

| | Book One | Book Two | Book Three |
|---|---|---|---|
| Title | The Coward's Answer | The Heir's Promise | The King's Table |
| Reader | `/media/story` | `/media/story/book-two` | `/media/story/book-three` |
| Reading copy | `public/stories/Insular-Imperium.md` | `public/stories/Insular-Imperium-Book-Two.md` | `public/stories/Insular-Imperium-Book-Three.md` |
| Chapters in GridGeneral | `documentation/story-bible/chapters/ch*.md` | `documentation/story-bible/chapters/book2/ch*.md` | `documentation/story-bible/chapters/book3/ch*.md` |
| Audiobook | `/media/audiobook` | `/media/audiobook/book-two` | `/media/audiobook/book-three` |
| Podcast feed | `/media/audiobook/feed.xml` | `/media/audiobook/book-two/feed.xml` | `/media/audiobook/book-three/feed.xml` |
| Chapter list | `src/data/audiobook.json` | `src/data/audiobook-book2.json` | `src/data/audiobook-book3.json` |
| MP3s in the generator | `C:\insular-imperium-audio\audiobook` | `C:\insular-imperium-audio\audiobook-book2` | `C:\insular-imperium-audio\audiobook-book3` |
| MP3s on Bunny | `v/<hash>/<chapter>.mp3` | `book2/v/<hash>/<chapter>.mp3` | `book3/v/<hash>/<chapter>.mp3` |

Each book saves its own reading and listening place in browser storage. A book opens in the reader look chosen for the nearest earlier book (Book Three from Book Two, then Book One) until it has a place of its own; the listening voice and speed are shared. The reader's menu, its toolbar on screens wider than 940px, and each audiobook page link to the other two books.

After editing chapters in any book, run `npm run audio:release` in `web` (`-- --book 3` for one book). It rebuilds the reading copies from the story-bible chapters (`npm run story:sync`), lists the chapters whose narration changed, asks, renders them through the generator's `wsl\render.ps1`, uploads the changed MP3s to Bunny (`npm run audio:publish`) and rewrites the chapter lists. Then commit the files it names and push to deploy. Adding a chapter changes the track total in the tags of every earlier chapter of that book (1/2 becomes 1/3), so those MP3s are uploaded again to new folders, with the same audio; the old copies stay on Bunny until pruned. `npm run audio:prune -- --dry-run` lists old MP3 versions it would delete from Bunny for every book.

To add another book, add it to `src/lib/books.ts` and `scripts/books.mjs` (chapters in `chapters/book<N>/`, MP3s in `audiobook-book<N>`, `book<N>/v/` on Bunny), give it reader and audiobook pages and a feed route like Book Three's, an empty `src/data/audiobook-book<N>.json` (`{ "chapters": [] }`) until its first chapter is published, and a card on the media page. The generator needs the book's title in `BOOK_TITLES` in `make_audiobook.py`.

Keep chapter headings in the form `# Chapter ...`; the reader builds its chapter menu from those headings. A chapter's file name (its stem, such as `ch01-the-dullest-day`) must be different from every chapter in the other books, since the render and the WSL launch alert name chapters by stem alone.

The reader fits pages to the viewport, recalculates them for font and screen changes, and shows two pages when there is enough room. The menu includes an option to always show one page. Bookmarks use text offsets in browser storage, so changing the layout keeps the current passage visible.

To run the reader browser checks from `web`, run `npm run build` followed by `npm run test:reader`. The tests use installed Google Chrome in headless mode and start the production server on port 3100.

Assets live in **`public/assets`** (hero portraits, cover images, etc.). They are served at `/assets/...` (e.g. `/assets/hero-marcus.png`).

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- React 19, Tailwind CSS 4, Framer Motion, TypeScript

## When

- 03/07/2026 10:25 AM
