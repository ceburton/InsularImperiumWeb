# Insular Imperium — User Guide Reference

> This document is a comprehensive reference for building a player-facing user guide for **Insular Imperium**, a turn-based medieval fantasy tactics/strategy game. It contains all gameplay mechanics, unit stats, hero abilities, and asset references. Assume all image paths are relative to `assets/`.

---

## 1. Game Overview

Insular Imperium is a turn-based squad and naval tactics game set on procedurally generated islands. The player commands the **Blue** faction against the **Red** AI faction and **Orc** tribal camps. Conquer islands using land units, heroes, ships, and engineer-built infrastructure.

![Game Logo](assets/insularimperium.png)

### Objective

The game supports two victory conditions (selectable in Game Options > Settings):

- **Defeat All Units** (default) — Destroy every enemy unit on the map.
- **Capture All Forts & Ports** — Capture every fort and port location on the map.

You lose if all your units are destroyed.

---

## 2. Getting Started

### New Game Flow

1. **Main Menu** — Click "New Game" or "Skirmish"
2. **Difficulty Selection** — Choose Easy, Normal, or Hard
3. **Map Size** — Choose from Micro (25x25), Small (50x50), Medium (75x75), or Large (100x100)
4. **Hero Selection** — Pick up to 2 heroes from a roster of 9
5. **Army Assembly** — Spend your 2,500 gold budget to recruit your starting army
6. **Ship Placement** — Place your starting ships on the water
7. **Begin!** — The game starts on your turn (Blue)

### Turn Order

Each round cycles through three factions:
1. **Blue** (Player) — Move units, attack, heal, build, produce
2. **Red** (AI Enemy) — AI-controlled opponent with forts and armies
3. **Orc** (AI Enemy) — Tribal camps that spawn warriors

---

## 3. Map & Terrain

The map is a procedurally generated island grid. Different terrain types affect movement, combat, and healing.

### Terrain Types

| Terrain | Image | Move Cost | Special Effects |
|---------|-------|-----------|-----------------|
| Grass | ![Grass](assets/tile-grass.png) | 1 | None |
| Forest | ![Forest](assets/tile-forest.png) | 2 | 25% damage reduction for units standing here |
| Mountain | ![Mountain](assets/tile-mountain.png) | Impassable | Cannot be traversed |
| Sand | ![Sand](assets/tile-sand.png) | 2 | None |
| Road | ![Road](assets/tile-road.png) | 0.5 | Fast travel; built by Engineers |
| Bridge | ![Bridge](assets/tile-bridge.png) | 0.5 | 25% increased damage taken by units standing here |
| Water | ![Water](assets/tile-water.png) | Impassable (land) | Ships only |
| Fort | ![Fort](assets/tile-fort.png) | 1 | 50% damage reduction, +3 DEF, heals 20% HP/turn |
| Port | ![Port](assets/tile-port.png) | 1 | Heals 10% HP/turn; builds ships |
| Orc Camp | ![Orc Camp](assets/tile-orc-camp.png) | 1 | Spawns Orc units |
| Workshop | ![Workshop](assets/tile-workshop.png) | 1 | Produces siege weapons (Ballista, Catapult) |
| Castra | ![Castra](assets/tile-castra.png) | 1 | 25% damage reduction, +2 DEF, heals 10% HP/turn |
| Jetty | ![Jetty](assets/tile-jetty.png) | 0.5 | Boarding/disembarking point for ships; repairs ships |

---

## 4. Units

### Blue Team Units

| Unit | Image | HP | ATK | DEF | RNG | MOV | Cost | Upkeep | Special |
|------|-------|-----|-----|-----|-----|-----|------|--------|---------|
| Infantry | ![Infantry](assets/unit-infantry-blue.png) | 50 | 15 | 5 | 1 | 5 | 220g | 7g/turn | Standard melee fighter |
| Knight | ![Knight](assets/unit-knight-blue.png) | 40 | 20 | 4 | 1 | 7 | 365g | 12g/turn | Canto (move after attacking); +5 bonus vs Archers, Healers, Mages; 50% ATK penalty on fort tiles |
| Archer | ![Archer](assets/unit-archer-blue.png) | 30 | 12 | 3 | 2-3 | 5 | 200g | 6g/turn | Ranged attacker; minimum range 2 (cannot shoot adjacent) |
| Spearman | ![Spearman](assets/unit-spear-blue.png) | 35 | 12 | 4 | 1 | 5 | 180g | 5g/turn | Anti-cavalry: +10 ATK bonus vs Knights/Riders; takes 50% damage from cavalry |
| Mage | ![Mage](assets/unit-mage-blue.png) | 25 | 25 | 2 | 1-2 | 4 | 250g | 10g/turn | Magic damage; 50% magic damage reduction |
| Healer | ![Healer](assets/unit-healer-blue.png) | 30 | 6 | 3 | 1-2 | 5 | 295g | 8g/turn | Heals allies for 65% of ATK; area heal for 25% in 2-tile radius |
| Engineer | ![Engineer](assets/unit-engineer-blue.png) | 34 | 8 | 3 | 1 | 5 | 320g | 10g/turn | Builds roads, workshops, castra; repairs buildings and ships |
| Catapult | ![Catapult](assets/unit-catapult-blue.png) | 20 | 16 | 0 | 2-4 | 2 | 400g | 20g/turn | Siege weapon; 100% bonus damage vs Forts, Ports, and Orc Camps; can board ships |
| Ballista | ![Ballista](assets/unit-ballista-blue.png) | 30 | 25 | 2 | 1-3 | 3 | 300g | 15g/turn | Ranged siege weapon; can board ships |

### Orc Units

| Unit | Image | HP | ATK | DEF | RNG | MOV | Special |
|------|-------|-----|-----|-----|-----|-----|---------|
| Orc Infantry | ![Orc Infantry](assets/unit-orc-infantry.png) | 60 | 18 | 7 | 1 | 5 | Frenzy: +50% ATK when below 50% HP |
| Orc Rider | ![Orc Rider](assets/unit-orc-rider.png) | 70 | 20 | 8 | 1 | 7 | Fast cavalry with Frenzy |
| Orc Spearman | ![Orc Spearman](assets/unit-orc-spear.png) | 55 | 15 | 8 | 1 | 5 | Anti-cavalry; Frenzy |
| Orc Mage | ![Orc Mage](assets/unit-orc-mage.png) | 40 | 28 | 3 | 1-2 | 4 | Magic damage; 50% magic resistance |
| Orc Healer | ![Orc Healer](assets/unit-orc-healer.png) | 45 | 12 | 4 | 1-2 | 5 | Heals allies; Frenzy |

### Red Team Units

Red team uses the same unit types as Blue with identical base stats. They are visually distinguished by red-tinted sprites.

| Unit | Image |
|------|-------|
| Infantry | ![Red Infantry](assets/unit-infantry-red.png) |
| Knight | ![Red Knight](assets/unit-knight-red.png) |
| Archer | ![Red Archer](assets/unit-archer-red.png) |
| Mage | ![Red Mage](assets/unit-mage-red.png) |
| Healer | ![Red Healer](assets/unit-healer-red.png) |
| Spearman | ![Red Spearman](assets/unit-spear-red.png) |
| Engineer | ![Red Engineer](assets/unit-engineer-red.png) |

---

## 5. Combat System

### Basic Damage Formula

```
Base Damage = Attacker's ATK - Defender's DEF
```

Damage is always at least 1.

### Attack Types

- **Physical** — Used by Infantry, Knights, Archers, Spearmen, Engineers, siege units
- **Magic** — Used by Mages and Healers. Mages/Healers have 50% magic damage reduction.

### Terrain Modifiers

| Terrain | Effect |
|---------|--------|
| Forest | Defender takes 25% less damage |
| Fort | Defender takes 50% less damage; +3 DEF bonus |
| Bridge | Defender takes 25% more damage |
| Castra | Defender takes 25% less damage; +2 DEF bonus |

### Flanking

When multiple units surround an enemy, flanking bonuses apply:
- Units positioned on opposite or adjacent sides of a target gain flanking damage bonuses
- More flanking units = higher bonus damage
- Flanked units deal reduced counter-attack damage

### Counter-Attacks

After being attacked, if the defender survives and the attacker is within the defender's attack range, the defender automatically counter-attacks at **50% damage**. Counter-attacks do not trigger against ranged attackers who are outside the defender's range.

### Defending

A unit that has not moved or attacked can choose to **Defend**, gaining +2 DEF for the turn.

### Healing

- **Single Target Heal**: Healers restore 65% of their ATK as HP to one ally
- **Area Heal**: Healers can heal all allies within 2 tiles for 25% of ATK
- **Fort Healing**: Units on friendly fort tiles heal 20% of max HP at the start of each turn
- **Port Healing**: Units on port tiles heal 10% of max HP at the start of each turn

### Leveling & Experience

- Units earn **10 EXP** per attack/hit
- Units earn **25 EXP** per kill
- First level requires **100 EXP**; each subsequent level requires 1.5x more
- On level-up, units gain stat growth (HP, ATK, DEF increase based on unit class)

---

## 6. Heroes

Heroes are powerful named units with passive aura buffs and active abilities. You may recruit up to **2 heroes** at game start. Heroes have a golden badge and portrait displayed in the UI.

### Blue Heroes

#### Marcus, the Centurion
![Marcus](assets/hero-marcus.png) ![Marcus Portrait](assets/hero-marcus-close.png)

| Base Class | Cost | Upkeep | Aura Range |
|------------|------|--------|------------|
| Infantry | 500g | 15g/turn | 4 tiles |

- **Aura Bonuses**: +1 MOV, +1 RNG, +2 ATK, +3 DEF, +2 HP to nearby allies
- **Ability — Testudo** (Cooldown: 4 turns): All units in a 3x3 square gain +10 DEF, MOV clamped to 2, no critical hits. Lasts 2 turns.

---

#### Valeria, the Shield Maiden
![Valeria](assets/hero-valeria.png) ![Valeria Portrait](assets/hero-valeria-close.png)

| Base Class | Cost | Upkeep | Aura Range |
|------------|------|--------|------------|
| Spearman | 480g | 12g/turn | 4 tiles |

- **Aura Bonuses**: +1 MOV, +1 RNG, +1 ATK, +2 DEF, +3 HP to nearby allies
- **Ability — Bulwark** (Cooldown: 4 turns): Allies within 2 tiles gain +8 DEF; Valeria gains +12 DEF. Lasts 2 turns.

---

#### Roderic, the Cavalier
![Roderic](assets/hero-roderic.png) ![Roderic Portrait](assets/hero-roderic-close.png)

| Base Class | Cost | Upkeep | Aura Range |
|------------|------|--------|------------|
| Knight | 600g | 18g/turn | 4 tiles |

- **Aura Bonuses**: +2 MOV, +1 RNG, +3 ATK, +1 DEF, +1 HP to nearby allies
- **Ability — Lunge** (Cooldown: 3 turns): Dash to an enemy within 3 tiles and strike at 2x ATK. Kill grants Canto (free movement after).

---

#### Sylara, the Hawkeye
![Sylara](assets/hero-sylara.png) ![Sylara Portrait](assets/hero-sylara-close.png)

| Base Class | Cost | Upkeep | Aura Range |
|------------|------|--------|------------|
| Archer | 520g | 14g/turn | 4 tiles |

- **Aura Bonuses**: +1 MOV, +3 RNG, +2 ATK, +1 DEF, +1 HP to nearby allies
- **Ability — Volley** (Cooldown: 4 turns): AoE damage in a 3x3 area within range 6. Enemies that move next turn take bleed damage. Lasts 1 turn.

---

#### Alana, the Battlemage
![Alana](assets/hero-alana.png) ![Alana Portrait](assets/hero-alana-close.png)

| Base Class | Cost | Upkeep | Aura Range |
|------------|------|--------|------------|
| Mage | 560g | 16g/turn | 4 tiles |

- **Aura Bonuses**: +1 MOV, +1 RNG, +3 ATK, +1 DEF, +2 HP to nearby allies
- **Ability — Runeblast** (Cooldown: 4 turns): 20 magic damage ignoring DEF (2x vs Mages). Weakens target ATK by 4 for 2 turns.

---

#### Liora, the Saint
![Liora](assets/hero-liora.png) ![Liora Portrait](assets/hero-liora-close.png)

| Base Class | Cost | Upkeep | Aura Range |
|------------|------|--------|------------|
| Healer | 540g | 14g/turn | 4 tiles |

- **Aura Bonuses**: +1 MOV, +1 RNG, +1 ATK, +2 DEF, +3 HP to nearby allies
- **Ability — Blessing** (Cooldown: 5 turns): Target ally gains +15 DEF and heals 50% of missing HP. Lasts 1 turn.

---

#### Gaius, the Siege Master
![Gaius](assets/hero-gaius.png) ![Gaius Portrait](assets/hero-gaius-close.png)

| Base Class | Cost | Upkeep | Aura Range |
|------------|------|--------|------------|
| Engineer | 580g | 16g/turn | 4 tiles |

- **Aura Bonuses**: +1 MOV, +1 RNG, +2 ATK, +3 DEF, +1 HP to nearby allies
- **Ability — Fortify** (Cooldown: 4 turns): Restore 50% tile HP on a friendly building. Units on location gain +4 ATK/DEF for 2 turns.

---

#### Brennus, the Berserker
![Brennus](assets/hero-brennus.png) ![Brennus Portrait](assets/hero-brennus-close.png)

| Base Class | Cost | Upkeep | Aura Range |
|------------|------|--------|------------|
| Infantry | 550g | 15g/turn | 4 tiles |

- **Aura Bonuses**: +1 MOV, +1 RNG, +3 ATK, +1 DEF, +2 HP to nearby allies
- **Ability — Bloodrage** (Cooldown: 3 turns): Next attack deals 2x ATK. If kill, heal 30% max HP + bonus attack. If no kill, take 10% max HP self-damage.

---

#### Thalassa, the Tidesage
![Thalassa](assets/hero-thalassa.png) ![Thalassa Portrait](assets/hero-thalassa-close.png)

| Base Class | Cost | Upkeep | Aura Range |
|------------|------|--------|------------|
| Mage | 600g | 18g/turn | 4 tiles |

- **Aura Bonuses**: +1 MOV, +3 RNG, +2 ATK, +1 DEF, +1 HP to nearby allies
- **Ability — Maelstrom** (Cooldown: 5 turns): 15 magic damage to all enemies within 3 tiles (2x on water/bridge/port tiles). Applies Frozen (MOV=0) for 1 turn.

---

## 7. Undead Legion (Late Game Threat)

After your army grows strong, **Vampire Heroes** may appear leading an undead legion. They corrupt nearby Red units into powerful undead soldiers.

### Vampire Heroes

| Hero | Portrait | Base Class | Ability |
|------|----------|------------|---------|
| Tiberius | ![Tiberius](assets/hero-tiberius.png) | Infantry | **Plague Cloud** — 3x3 toxic cloud. Enemies gain DISEASED (10% max HP/turn for 2 turns) |
| Drusilla | ![Drusilla](assets/hero-drusilla.png) | Knight | **Terror Charge** — Dash to enemy within 4 tiles, deal damage, apply FEARED (MOV=1, no counter) for 1 turn |
| Livia | ![Livia](assets/hero-livia.png) | Mage | **Soul Siphon** — 25 magic damage to single target. Livia + adjacent undead heal 50% of damage dealt |
| Octavia | ![Octavia](assets/hero-octavia.png) | Archer | **Bone Barrage** — 3x3 bone arrows at range 6. Tiles gain DESECRATED (15 dmg to Blue) for 2 turns |

### Undead Corruption

- Vampire Heroes corrupt non-hero Red units within **6 tiles** — 50% chance per turn
- Corrupted units gain a green tint and receive **1.5x HP, ATK, and DEF**
- Corrupted Healers become **Necromancers** who can raise Zombie Infantry from corpses
- Undead units are immune to further corruption

### Countering the Undead

- **Engineers** deal 2x damage against undead units
- **Sanctified Tiles**: Blue hero aura zones deal 10 damage to undead units standing in them
- Kill the Vampire Hero to stop further corruption

---

## 8. Naval System

### Ship Classes

| Ship | Image (North) | Tiles | Hull HP | ATK | DEF | MOV | Bombard Range | Deck Slots | Capacity | Cost | Upkeep |
|------|--------------|-------|---------|-----|-----|-----|---------------|------------|----------|------|--------|
| Liburna | ![Liburna](assets/ship-liburna-n.png) | 1 | 40 | 8 | 3 | 18 | 3 | 1 | 3 | 300g | 15g/turn |
| Galley | ![Galley Bow](assets/ship-galley-n-bow.png) | 2 | 80 | 15 | 6 | 12 | 3 | 2 | 6 | 600g | 30g/turn |
| Trireme | ![Trireme Bow](assets/ship-trireme-n-bow.png) | 3 | 130 | 24 | 10 | 9 | 3 | 3 | 10 | 1000g | 50g/turn |

### Ship Mechanics

- **Deck Slots**: Units on deck can attack/be attacked. Each ship tile has one deck slot.
- **Below Deck**: Units stored below deck are safe from combat but cannot act.
- **Capacity**: Total units a ship can carry (deck + below deck).
- **Embarking**: Move a land unit onto a ship tile or adjacent jetty to board.
- **Disembarking**: Move a unit from the ship to an adjacent land or jetty tile.
- **Bombardment**: Ships can bombard land or sea targets within their bombard range.
- **Turning**: Ships cost 1 movement point to change facing direction.
- **Sinking**: When hull HP reaches 0, the ship begins sinking (3 turns to evacuate). After sinking, it becomes derelict for 1 turn before disappearing.
- **Repair**: Ships can be repaired at Jetties (20% hull HP restored).

### Ship Production

Ships are built at **Ports** you control:

| Ship | Build Time |
|------|------------|
| Liburna | 2 turns |
| Galley | 4 turns |
| Trireme | 6 turns |

---

## 9. Economy

### Income Sources

| Source | Amount |
|--------|--------|
| Fort Tile (per tile owned) | 20g/turn |
| Orc Camp (per camp owned) | Varies |
| Tile Capture Loot | 25-100g per tile |
| Fort Capture Bonus | 200g |
| Orc Camp Capture Bonus | 350g |

### Expenses

- **Unit Upkeep**: Each unit costs maintenance gold per turn (see unit tables above)
- **Ship Upkeep**: Each ship costs maintenance gold per turn
- **Construction**: Roads (10g), Workshops (150g), Castra (200g)
- **Production**: Building new units/ships costs their listed purchase price

### Starting Resources

| Resource | Amount |
|----------|--------|
| Initial Gold Pool | 3,000g |
| Army Assembly Budget | 2,500g |

---

## 10. Locations & Production

### Fort Capture

Forts, Ports, Workshops, and Castra are multi-tile locations. Each tile has HP (Forts: 100 HP, Ports/Workshops/Castra: 50 HP). To capture:

1. Attack location tiles to reduce their HP to 0
2. Move a unit onto the tile to capture it
3. When you control the majority of tiles in a location, the entire location flips to your team

### Production at Forts

Forts produce land units. Larger forts can build more unit types:

| Fort Size | Available Units |
|-----------|----------------|
| 9 tiles | All unit types (Infantry through Engineer) |
| 8 tiles | All unit types |
| 7 tiles | Infantry, Archer, Mage, Healer, Spearman, Ballista, Engineer |
| 6 tiles | Infantry, Archer, Healer, Spearman, Engineer |
| 5 tiles | Infantry, Archer, Spearman |
| 4 tiles | Infantry, Spearman |
| 3 tiles or less | Infantry only |

### Workshops

Workshops produce siege weapons:
- **Ballista** — 2 turns to build
- **Catapult** — 4 turns to build

---

## 11. Engineer Actions

Engineers are versatile support units that can:

- **Build Roads** (10g) — Reduces terrain movement cost to 0.5; can be built on Grass, Forest, Sand, and Mountain tiles
- **Build Workshops** (150g) — Creates a workshop for siege unit production
- **Build Castra** (200g) — Builds a fortified camp with defensive bonuses and healing
- **Repair** — Restores HP to damaged buildings (25% per action) and ships (25% hull HP)

---

## 12. Controls

### Mouse
- **Left Click** — Select unit, move to tile, attack target
- **Right Click** — Deselect / cancel action
- **Scroll Wheel** — Zoom in/out
- **Click and Drag** — Pan the map

### Keyboard
- **Arrow Keys / WASD** — Scroll the map
- **Escape** — Close current panel / cancel action
- **F5** — Quick Save
- **F9** — Quick Load
- **Tab** — Cycle through units
- **Space** — End turn
- **D** — Defend with selected unit
- **Shift** — Hold to hide land units (view terrain)

### Unit Actions
- Select a unit, then click a highlighted tile to move
- Click an enemy in red-highlighted range to attack
- Click an ally in green-highlighted range to heal (Healers only)
- Use the action buttons in the UI panel for special actions (Defend, Build, Repair, Ability)

---

## 13. Difficulty Settings

| Setting | Easy | Normal | Hard |
|---------|------|--------|------|
| Enemy HP | 80% | 100% | 120% |
| Enemy ATK | 85% | 100% | 115% |
| Enemy DEF | 85% | 100% | 115% |
| Red Aggro Range | 10 tiles | 15 tiles | 20 tiles |
| Orc Aggro Range | 7 tiles | 10 tiles | 14 tiles |
| City Defense Chance | 15% | 25% | 40% |
| Island Defense Chance | 15% | 25% | 35% |
| Enemy Production | Slow, cheap units | Normal | Fast, elite units |

---

## 14. Map Sizes

| Size | Dimensions | Description |
|------|-----------|-------------|
| Micro | 25x25 | Lightning Round — fast games |
| Small | 50x50 | Quick Skirmish |
| Medium | 75x75 | Standard Battle |
| Large | 100x100 | Full Campaign |

All map generation parameters (fort count, terrain features, distances) scale proportionally with map size.

---

## 15. Save & Load

Access the save/load system through **Game Options** (Escape key or menu button):

- **Quick Save (F5)** — Instant save to a dedicated quick save slot
- **Quick Load (F9)** — Instantly load from the quick save slot
- **Autosave** — The game automatically saves at the start of each turn
- **Named Slots** — 10 named save slots with custom names; click a save name to rename it

Saves are stored locally and persist between sessions.

---

## 16. Tips & Strategy

- **Use terrain**: Position units in forests (+25% damage reduction) and forts (+50% damage reduction) for defensive advantage.
- **Avoid bridges**: Units on bridges take 25% more damage.
- **Counter cavalry with Spearmen**: Spearmen take half damage from Knights/Riders and deal +10 bonus damage to them.
- **Knights are glass cannons**: High ATK and mobility but low HP/DEF. Use Canto to attack and retreat.
- **Protect your Healers**: They are fragile but essential for sustaining your army.
- **Engineers win wars**: Roads allow rapid army movement across the map. Workshops let you produce siege weapons closer to the front line.
- **Use Catapults on forts**: They deal 100% bonus damage to fort/port tiles, making captures much faster.
- **Flank enemies**: Surround enemies for flanking bonuses and reduced counter-attack damage.
- **Watch upkeep costs**: A large army drains your gold. Balance army size with income.
- **Hero auras stack**: Position heroes near your main force for maximum stat bonuses.
- **Prepare for the undead**: Engineers deal 2x damage to undead. Keep some ready when Vampire Heroes appear.

---

## 17. Asset Reference

All images below are available in the `assets/` directory. Use the filenames listed to embed in the user guide.

### Team Banners
| Team | Image |
|------|-------|
| Blue | ![Blue Banner](assets/banner-blue.png) |
| Red | ![Red Banner](assets/banner-red.png) |
| Orc | ![Orc Banner](assets/banner-orc.png) |

### UI Elements
| Element | Image |
|---------|-------|
| Cover Art | `assets/cover1.jpg` |
| Game Logo | `assets/insularimperium.png` |
| Main Menu Background | `assets/insularimperiumStart.png` |
| Medieval Panel Background | `assets/medieval-panel-bg.webp` |
| Medieval Button Background | `assets/medieval-button-bg.webp` |
| Selection Cursor | `assets/selection-cursor.webp` |
| Unit Selector Ring | `assets/unit-selector-ring.webp` |

### Complete Unit Sprite Reference

**Blue Team**: `unit-infantry-blue.png`, `unit-knight-blue.png`, `unit-archer-blue.png`, `unit-mage-blue.png`, `unit-healer-blue.png`, `unit-spear-blue.png`, `unit-catapult-blue.png`, `unit-ballista-blue.png`, `unit-engineer-blue.png`

**Red Team**: `unit-infantry-red.png`, `unit-knight-red.png`, `unit-archer-red.png`, `unit-mage-red.png`, `unit-healer-red.png`, `unit-spear-red.png`, `unit-catapult-red.png`, `unit-ballista-red.png`, `unit-engineer-red.png`

**Orc Team**: `unit-orc-infantry.png`, `unit-orc-rider.png`, `unit-orc-spear.png`, `unit-orc-mage.png`, `unit-orc-healer.png`

### Hero Portraits (Standard + Close-up)

**Blue Heroes**: `hero-marcus.png` / `hero-marcus-close.png`, `hero-valeria.png` / `hero-valeria-close.png`, `hero-roderic.png` / `hero-roderic-close.png`, `hero-sylara.png` / `hero-sylara-close.png`, `hero-alana.png` / `hero-alana-close.png`, `hero-liora.png` / `hero-liora-close.png`, `hero-gaius.png` / `hero-gaius-close.png`, `hero-brennus.png` / `hero-brennus-close.png`, `hero-thalassa.png` / `hero-thalassa-close.png`

**Vampire Heroes**: `hero-tiberius.png` / `hero-tiberius-close.png`, `hero-drusilla.png` / `hero-drusilla-close.png`, `hero-livia.png` / `hero-livia-close.png`, `hero-octavia.png` / `hero-octavia-close.png`

### Ship Sprites

Ships have 4 directional variants (n/e/s/w). Multi-tile ships have bow/mid/stern segments.

**Liburna (1-tile)**: `ship-liburna-{n,e,s,w}.png`

**Galley (2-tile)**: `ship-galley-{n,e,s,w}-bow.png`, `ship-galley-{n,e,s,w}-stern.png`

**Trireme (3-tile)**: `ship-trireme-{n,e,s,w}-bow.png`, `ship-trireme-{n,e,s,w}-mid.png`, `ship-trireme-{n,e,s,w}-stern.png`

### Terrain Tiles

Base tiles: `tile-grass.png`, `tile-forest.png`, `tile-mountain.png`, `tile-sand.png`, `tile-water.png`, `tile-road.png`, `tile-bridge.png`, `tile-fort.png`, `tile-port.png`, `tile-orc-camp.png`, `tile-jetty.png`, `tile-workshop.png`, `tile-castra.png`

Tilesets (spritesheets for autotiling): `grass-tileset.png`, `forest-tileset.png`, `mountain-tileset.png`, `road-tileset.png`, `fort-tileset.png`, `sand-tileset.png`, `tiles/shoreline_blob.png`
