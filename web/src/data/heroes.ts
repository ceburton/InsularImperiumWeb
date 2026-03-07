// ═══════════════════════════════════════════════════════════════
// INSULAR IMPERIUM — Sacred Ledger: Heroes
// Extracted from config.js HEROES section
// ═══════════════════════════════════════════════════════════════

export interface HeroAura {
  range: number;
  bonuses: Record<string, number>;
  caps: Record<string, number>;
  undeadOnly?: boolean;
}

export interface HeroAbility {
  id: string;
  name: string;
  description: string;
  targetType: string;
  shape: string;
  range: number;
  duration: number;
  cooldown: number;
}

export interface Hero {
  id: string;
  name: string;
  title?: string;
  portraitKey: string;
  baseClass: string;
  cost: number;
  maintenance: number;
  vampireHero?: boolean;
  bonusStats: { hp: number; atk: number; def: number; mov: number; rng: number };
  growth: { hp: number; atk: number; def: number };
  aura: HeroAura;
  ability: HeroAbility;
  lore: string;
}

export const BLUE_HEROES: Hero[] = [
  {
    id: 'MARCUS', name: 'Marcus', title: 'the Centurion',
    portraitKey: 'hero-marcus', baseClass: 'INFANTRY',
    cost: 500, maintenance: 15,
    bonusStats: { hp: 15, atk: 5, def: 3, mov: 1, rng: 0 },
    growth: { hp: 12, atk: 4, def: 3 },
    aura: {
      range: 4,
      bonuses: { mov: 1, rng: 1, atk: 2, def: 3, hp: 2 },
      caps: { mov: 5, rng: 5, atk: 7, def: 9, hp: 7 },
    },
    ability: {
      id: 'TESTUDO', name: 'Testudo',
      description: '+10 DEF, no crits, MOV clamped to 2 for all units in 3×3 square. Lasts 2 turns.',
      targetType: 'friendly', shape: 'square', range: 1,
      duration: 2, cooldown: 4,
    },
    lore: 'Marcus earned his vine-staff in the mud of Britannia. Where he plants his standard, the line does not break. His Testudo is legendary—a wall of shields that turns aside even the gods\' wrath.',
  },
  {
    id: 'VALERIA', name: 'Valeria', title: 'the Shield Maiden',
    portraitKey: 'hero-valeria', baseClass: 'SPEAR',
    cost: 480, maintenance: 12,
    bonusStats: { hp: 10, atk: 4, def: 4, mov: 1, rng: 0 },
    growth: { hp: 10, atk: 3, def: 3 },
    aura: {
      range: 4,
      bonuses: { mov: 1, rng: 1, atk: 1, def: 2, hp: 3 },
      caps: { mov: 5, rng: 5, atk: 5, def: 7, hp: 9 },
    },
    ability: {
      id: 'BULWARK', name: 'Bulwark',
      description: '+8 DEF to allies within 2 tiles, +12 DEF to Valeria for 2 turns.',
      targetType: 'friendly', shape: 'radius', range: 2,
      duration: 2, cooldown: 4,
    },
    lore: 'Valeria fights not for glory but for the soldiers beside her. Her Bulwark turns their flesh to iron and their fear to fire. Cavalry charges shatter against her spear-wall like waves on stone.',
  },
  {
    id: 'RODERIC', name: 'Roderic', title: 'the Cavalier',
    portraitKey: 'hero-roderic', baseClass: 'KNIGHT',
    cost: 600, maintenance: 18,
    bonusStats: { hp: 10, atk: 6, def: 2, mov: 1, rng: 0 },
    growth: { hp: 10, atk: 5, def: 2 },
    aura: {
      range: 4,
      bonuses: { mov: 2, rng: 1, atk: 3, def: 1, hp: 1 },
      caps: { mov: 7, rng: 5, atk: 9, def: 5, hp: 5 },
    },
    ability: {
      id: 'LUNGE', name: 'Lunge',
      description: 'Dash to enemy within 3 tiles, strike at 2× ATK. Kill grants Canto.',
      targetType: 'enemy', shape: 'single', range: 3,
      duration: 0, cooldown: 3,
    },
    lore: 'Roderic is a tempest on horseback. His Lunge is not a charge—it is an execution. Those who survive his first pass rarely survive his second, for a kill grants him Canto to ride on.',
  },
  {
    id: 'SYLARA', name: 'Sylara', title: 'the Hawkeye',
    portraitKey: 'hero-sylara', baseClass: 'ARCHER',
    cost: 520, maintenance: 14,
    bonusStats: { hp: 8, atk: 5, def: 2, mov: 0, rng: 1 },
    growth: { hp: 8, atk: 4, def: 1 },
    aura: {
      range: 4,
      bonuses: { mov: 1, rng: 3, atk: 2, def: 1, hp: 1 },
      caps: { mov: 5, rng: 9, atk: 7, def: 5, hp: 5 },
    },
    ability: {
      id: 'VOLLEY', name: 'Volley',
      description: 'AoE damage in 3×3 area within range 6. Enemies that move next turn take bleed damage.',
      targetType: 'enemy', shape: 'square', range: 6,
      duration: 1, cooldown: 4,
    },
    lore: 'Sylara does not miss. Her Volley darkens the sky and leaves the earth stained red. Those who survive her arrows find their wounds reopen when they dare to move.',
  },
  {
    id: 'ALANA', name: 'Alana', title: 'the Battlemage',
    portraitKey: 'hero-alana', baseClass: 'MAGE',
    cost: 560, maintenance: 16,
    bonusStats: { hp: 10, atk: 6, def: 2, mov: 1, rng: 0 },
    growth: { hp: 7, atk: 6, def: 1 },
    aura: {
      range: 4,
      bonuses: { mov: 1, rng: 1, atk: 3, def: 1, hp: 2 },
      caps: { mov: 5, rng: 5, atk: 9, def: 5, hp: 7 },
    },
    ability: {
      id: 'RUNEBLAST', name: 'Runeblast',
      description: '20 magic damage ignoring DEF (2× vs Mages). Weakens target ATK by 4 for 2 turns.',
      targetType: 'enemy', shape: 'single', range: 4,
      duration: 2, cooldown: 4,
    },
    lore: 'Alana speaks the forbidden tongue. Her Runeblast bypasses all armor—a pure expression of arcane destruction. Enemy mages fear her most, for she turns their own affinity against them.',
  },
  {
    id: 'LIORA', name: 'Liora', title: 'the Saint',
    portraitKey: 'hero-liora', baseClass: 'HEALER',
    cost: 540, maintenance: 14,
    bonusStats: { hp: 12, atk: 3, def: 3, mov: 1, rng: 0 },
    growth: { hp: 9, atk: 2, def: 2 },
    aura: {
      range: 4,
      bonuses: { mov: 1, rng: 1, atk: 1, def: 2, hp: 3 },
      caps: { mov: 5, rng: 5, atk: 5, def: 7, hp: 9 },
    },
    ability: {
      id: 'BLESSING', name: 'Blessing',
      description: 'Target ally gains +15 DEF and heals 50% missing HP for 1 turn.',
      targetType: 'friendly', shape: 'single', range: 3,
      duration: 1, cooldown: 5,
    },
    lore: 'Where Liora walks, the dying rise. Her Blessing is not mere medicine—it is divine intercession. A single touch can turn a broken soldier into an unbreakable wall.',
  },
  {
    id: 'GAIUS', name: 'Gaius', title: 'the Siege Master',
    portraitKey: 'hero-gaius', baseClass: 'ENGINEER',
    cost: 580, maintenance: 16,
    bonusStats: { hp: 10, atk: 4, def: 3, mov: 1, rng: 0 },
    growth: { hp: 9, atk: 3, def: 2 },
    aura: {
      range: 4,
      bonuses: { mov: 1, rng: 1, atk: 2, def: 3, hp: 1 },
      caps: { mov: 5, rng: 5, atk: 7, def: 9, hp: 5 },
    },
    ability: {
      id: 'FORTIFY', name: 'Fortify',
      description: 'Restore 50% tile HP on a friendly building. Units on location gain +4 ATK/DEF for 2 turns.',
      targetType: 'tile', shape: 'single', range: 3,
      duration: 2, cooldown: 4,
    },
    lore: 'Gaius builds what the legions need and destroys what the enemy holds. His Fortify can restore a crumbling fortress mid-siege. He is Rome\'s architect of victory.',
  },
  {
    id: 'BRENNUS', name: 'Brennus', title: 'the Berserker',
    portraitKey: 'hero-brennus', baseClass: 'INFANTRY',
    cost: 550, maintenance: 15,
    bonusStats: { hp: 20, atk: 8, def: 0, mov: 2, rng: 0 },
    growth: { hp: 14, atk: 5, def: 1 },
    aura: {
      range: 4,
      bonuses: { mov: 1, rng: 1, atk: 3, def: 1, hp: 2 },
      caps: { mov: 5, rng: 5, atk: 9, def: 5, hp: 7 },
    },
    ability: {
      id: 'BLOODRAGE', name: 'Bloodrage',
      description: 'Next attack deals 2× ATK. Kill → heal 30% HP + bonus attack. No kill → 10% self-damage.',
      targetType: 'self', shape: 'self', range: 0,
      duration: 0, cooldown: 3,
    },
    lore: 'Brennus does not know retreat. His Bloodrage is a double-edged sword—a killing blow heals and empowers him, but failure draws his own blood. He is Rome\'s berserker, feared by friend and foe.',
  },
  {
    id: 'THALASSA', name: 'Thalassa', title: 'the Tidesage',
    portraitKey: 'hero-thalassa', baseClass: 'MAGE',
    cost: 600, maintenance: 18,
    bonusStats: { hp: 8, atk: 7, def: 1, mov: 0, rng: 1 },
    growth: { hp: 7, atk: 6, def: 1 },
    aura: {
      range: 4,
      bonuses: { mov: 1, rng: 3, atk: 2, def: 1, hp: 1 },
      caps: { mov: 5, rng: 9, atk: 7, def: 5, hp: 5 },
    },
    ability: {
      id: 'MAELSTROM', name: 'Maelstrom',
      description: '15 magic damage to all enemies within 3 tiles (2× on water/bridge/port). Frozen: MOV=0 for 1 turn.',
      targetType: 'enemy', shape: 'radius', range: 3,
      duration: 1, cooldown: 5,
    },
    lore: 'Thalassa commands the sea itself. Her Maelstrom drowns armies and freezes ships in their wakes. On water, her power doubles. She is the empire\'s admiral of the arcane.',
  },
];

export const VAMPIRE_HEROES: Hero[] = [
  {
    id: 'LIVIA', name: 'Livia', title: 'the Soul Siphon',
    portraitKey: 'hero-livia', baseClass: 'MAGE',
    cost: 0, maintenance: 0, vampireHero: true,
    bonusStats: { hp: 15, atk: 8, def: 3, mov: 1, rng: 0 },
    growth: { hp: 7, atk: 6, def: 1 },
    aura: {
      range: 6,
      bonuses: { atk: 3, rng: 2 },
      caps: { atk: 9, rng: 7 },
      undeadOnly: true,
    },
    ability: {
      id: 'SOUL_SIPHON', name: 'Soul Siphon',
      description: '25 magic damage to single target. Livia + adjacent undead heal 50% of damage dealt.',
      targetType: 'enemy', shape: 'single', range: 4,
      duration: 0, cooldown: 4,
    },
    lore: 'Livia was a senator\'s daughter before the darkness took her. Now she drains life from the living to sustain her undead legion. Her Soul Siphon is a kiss of death—lethal and nourishing in equal measure.',
  },
  {
    id: 'TIBERIUS', name: 'Tiberius', title: 'the Plague Lord',
    portraitKey: 'hero-tiberius', baseClass: 'INFANTRY',
    cost: 0, maintenance: 0, vampireHero: true,
    bonusStats: { hp: 20, atk: 6, def: 4, mov: 1, rng: 0 },
    growth: { hp: 12, atk: 4, def: 3 },
    aura: {
      range: 6,
      bonuses: { hp: 3, atk: 2 },
      caps: { hp: 9, atk: 7 },
      undeadOnly: true,
    },
    ability: {
      id: 'PLAGUE_CLOUD', name: 'Plague Cloud',
      description: '3×3 toxic cloud. Enemies gain DISEASED (10% max HP/turn for 2 turns).',
      targetType: 'enemy', shape: 'square', range: 3,
      duration: 2, cooldown: 4,
    },
    lore: 'Tiberius was once a legionnaire who fell to plague in a distant campaign. Death did not take him—it transformed him. His Plague Cloud is the disease that killed him, weaponized and eternal.',
  },
  {
    id: 'DRUSILLA', name: 'Drusilla', title: 'the Terror Knight',
    portraitKey: 'hero-drusilla', baseClass: 'KNIGHT',
    cost: 0, maintenance: 0, vampireHero: true,
    bonusStats: { hp: 12, atk: 7, def: 3, mov: 2, rng: 0 },
    growth: { hp: 10, atk: 5, def: 2 },
    aura: {
      range: 6,
      bonuses: { mov: 3, atk: 2 },
      caps: { mov: 9, atk: 7 },
      undeadOnly: true,
    },
    ability: {
      id: 'TERROR_CHARGE', name: 'Terror Charge',
      description: 'Dash to enemy within 4 tiles, deal combat damage, apply FEARED (MOV=1, no counter) for 1 turn.',
      targetType: 'enemy', shape: 'single', range: 4,
      duration: 1, cooldown: 3,
    },
    lore: 'Drusilla rides a skeletal destrier that breathes green fire. Her Terror Charge paralyzes foes with supernatural dread. Those who survive cannot run, cannot fight back—they can only wait for the second pass.',
  },
  {
    id: 'OCTAVIA', name: 'Octavia', title: 'the Bone Archer',
    portraitKey: 'hero-octavia', baseClass: 'ARCHER',
    cost: 0, maintenance: 0, vampireHero: true,
    bonusStats: { hp: 10, atk: 6, def: 3, mov: 0, rng: 1 },
    growth: { hp: 8, atk: 4, def: 1 },
    aura: {
      range: 6,
      bonuses: { rng: 3, def: 2 },
      caps: { rng: 9, def: 7 },
      undeadOnly: true,
    },
    ability: {
      id: 'BONE_BARRAGE', name: 'Bone Barrage',
      description: '3×3 bone arrows at range 6. Immediate damage. Tiles gain DESECRATED (15 dmg to Blue) for 2 turns.',
      targetType: 'enemy', shape: 'square', range: 6,
      duration: 0, cooldown: 4,
    },
    lore: 'Octavia fires arrows carved from the bones of fallen legionnaires. Her Bone Barrage desecrates the ground itself, turning the battlefield into a killing field where the living dare not tread.',
  },
];