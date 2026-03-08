# Export: Logo & Title Box for Game Project

Use this folder as a reference when copying assets into your game project.

---

## 1. Logo image

**File to copy:**  
`web/public/assets/insularimperium.png`

- Used as the main “Insular Imperium” logo on the landing page and in the header.
- In the web app it’s shown at about **250×75** (header) and up to **480×144** (landing). For the game, use whatever size fits your UI (the PNG scales).

**Optional:**  
`web/public/assets/InsularImperiumStart.png` — alternate/start screen asset if you use it.

**Steps:**
1. Copy `insularimperium.png` from `web/public/assets/` into your game’s assets folder (e.g. `Assets/Art/UI/` or equivalent).
2. In your game, create a sprite/UI image that uses this texture and place it where you want the logo.

---

## 2. Title box (stone slab + logo + text)

The landing page “title box” is built from:

- A **stone slab** background with a **bronze frame** and **four corner rivets**
- The **logo** image (same as above)
- **Engraved title text**: “Insular” / “Imperium” (two lines)
- **Decorative filigree**: horizontal lines and a ✦ under the title

You can either **export a single image** or **recreate it** in the game.

### Option A: Export as one image (easiest)

1. Run the web app: `npm run dev` in the `web` folder and open the landing page.
2. Use the browser’s full-page screenshot (e.g. DevTools → … → “Capture full size screenshot”) or a tool like **Puppeteer** / **Playwright** to capture only the title box area.
3. Crop to the stone slab + logo + “Insular Imperium” + filigree.
4. Save as PNG (e.g. `title-box.png`) and import that into your game as a single sprite/UI texture.

This gives you one asset that looks exactly like the web version.

### Option B: Recreate in the game

Use these specs to draw a similar frame and text in your engine.

**Stone slab background**
- Base: dark grey gradient, e.g. `#2c2a32` → `#383640` → `#2a282e` → `#343238`
- Extra: radial gradient for “dust” — e.g. `rgba(70,65,75,0.95)` at center to `rgba(42,40,48,0.98)`
- Optional: very subtle light scratch lines for surface detail

**Bronze frame (border)**
- 5px border
- Gradient colors: `#d4a84a`, `#b08d57`, `#8a6a30`, `#7a5a20`
- Inner shadow: dark brown tint; outer shadow for depth

**Rivets (4 corners)**
- 14×14 px circles at the four corners
- Metallic gradient: highlight ~`#d4a84a`, mid `#8a6a30`, dark `#5a4018`–`#3e2a10`
- Small inner shadow and thin dark outline

**Title text “Insular Imperium”**
- Font: serif, “engraved” look (e.g. Cinzel or similar)
- Color: `#c4a87a`
- Two lines: “Insular” then “Imperium”
- Letter spacing: wide (e.g. 0.2–0.25em)
- Shadow: dark underneath and slight glow — e.g. `0 -2px 0 black`, `0 -3px 6px black`, soft glow `0 0 20px rgba(176,141,87,0.15)`

**Filigree under title**
- Two short horizontal lines (gradient from transparent to `#b08d57`)
- Small ✦ (or similar symbol) in the center, color `#b08d57`

**Layout (for reference)**
- Padding: roughly 48–80 px horizontal, 40–56 px vertical around the content
- Order from top: [logo] → [title text] → [filigree]

**CSS references in this repo**
- Frame: `web/src/app/globals.css` — `.bronze-frame`, `.rivet`
- Slab background: `web/src/app/page.tsx` — the `style={{ background: ... }}` on the stone slab div
- Title style: `.engraved-deep` in `globals.css`
- Colors: `--color-bronze`, `--color-bronze-light`, `--color-parchment-dark` in `globals.css`

---

## Quick checklist

- [ ] Copy `web/public/assets/insularimperium.png` into the game project.
- [ ] Either capture the title box as one image (Option A) or recreate it from the specs (Option B).
- [ ] In the game, place the logo (and optional title box image) in your main menu or title screen.

If your game project lives in a different repo or folder, copy the PNG and (if you use Option A) the captured title-box image into that project’s asset directory.
