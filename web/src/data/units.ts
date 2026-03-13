// ═══════════════════════════════════════════════════════════════
// INSULAR IMPERIUM — Sacred Ledger: Unit Classes
// Extracted from config.js (the game's canonical data source)
// ═══════════════════════════════════════════════════════════════

export interface BonusAgainst {
  target: string;
  targetName: string;
  bonus: number;
}

export interface DamageFactor {
  attackerKey: string;
  attackerName: string;
  factor: number;
}

export interface UnitClass {
  key: string;
  name: string;
  range: number;
  minRange: number;
  moves: number;
  stats: { hp: number; atk: number; def: number; isHealer?: boolean };
  growth: { hp: number; atk: number; def: number };
  attackType: 'physical' | 'magic';
  cost: number;
  maintenance: number;
  bonusAgainst?: BonusAgainst[];
  receiveDamageFactorFrom?: DamageFactor[];
  damageReduction?: { magic: number };
  engineerSkills?: string[];
  canBoardShip?: boolean;
  bonusAgainstLocation?: { type: string; bonusPercent: number }[];
  faction: 'roman' | 'orc';
  description: string;
  lore: string;
}

export const ROMAN_UNITS: UnitClass[] = [
  {
    key: 'unit-infantry', name: 'Infantry', range: 1, minRange: 1, moves: 5,
    stats: { hp: 50, atk: 15, def: 5 },
    growth: { hp: 10, atk: 3, def: 2 },
    attackType: 'physical', cost: 220, maintenance: 5,
    faction: 'roman',
    description: 'The backbone of the Legion. Sturdy, reliable, and cheap to field.',
    lore: 'Drawn from the provinces, these men form the iron wall of Rome. They hold the line so others may strike.'
  },
  {
    key: 'unit-knight', name: 'Knight', range: 1, minRange: 1, moves: 7,
    stats: { hp: 40, atk: 20, def: 4 },
    growth: { hp: 8, atk: 4, def: 1 },
    attackType: 'physical', cost: 365, maintenance: 12,
    bonusAgainst: [
      { target: 'unit-archer', targetName: 'Archer', bonus: 5 },
      { target: 'unit-healer', targetName: 'Healer', bonus: 5 },
      { target: 'unit-mage', targetName: 'Mage', bonus: 5 },
    ],
    faction: 'roman',
    description: 'Heavy cavalry. Fast, deadly, and devastating against ranged units.',
    lore: 'The thunder of hooves heralds the Equestrian charge. Archers flee; mages cower. Only the spear stands firm.'
  },
  {
    key: 'unit-archer', name: 'Archer', range: 3, minRange: 2, moves: 5,
    stats: { hp: 30, atk: 12, def: 3 },
    growth: { hp: 6, atk: 3, def: 1 },
    attackType: 'physical', cost: 200, maintenance: 7,
    faction: 'roman',
    description: 'Ranged skirmisher. Strikes from afar but fragile in melee.',
    lore: 'From Cretan auxiliaries to Balearic slingers, Rome\'s ranged arm rains death before the legions close.'
  },
  {
    key: 'unit-mage', name: 'Mage', range: 2, minRange: 1, moves: 4,
    stats: { hp: 25, atk: 25, def: 2 },
    growth: { hp: 5, atk: 5, def: 1 },
    attackType: 'magic', cost: 250, maintenance: 10,
    damageReduction: { magic: 0.5 },
    faction: 'roman',
    description: 'Arcane artillery. Devastating magic damage, but paper-thin armor.',
    lore: 'Forbidden arts practiced in the shadows of the Collegium. Their lightning cracks the sky and the enemy\'s resolve alike.'
  },
  {
    key: 'unit-healer', name: 'Healer', range: 2, minRange: 1, moves: 5,
    stats: { hp: 30, atk: 10, def: 3, isHealer: true },
    growth: { hp: 7, atk: 2, def: 2 },
    attackType: 'magic', cost: 295, maintenance: 8,
    faction: 'roman',
    description: 'Field medicus. Restores allies within range. Weak in combat.',
    lore: 'The Medici of the Legion. Their salves and prayers keep the wounded fighting. A wise general guards them well.'
  },
  {
    key: 'unit-spear', name: 'Spearman', range: 1, minRange: 1, moves: 5,
    stats: { hp: 35, atk: 12, def: 4 },
    growth: { hp: 7, atk: 3, def: 2 },
    attackType: 'physical', cost: 180, maintenance: 6,
    bonusAgainst: [
      { target: 'unit-knight', targetName: 'Knight', bonus: 10 },
      { target: 'unit-orc-rider-no-bg', targetName: 'Orc Rider', bonus: 10 },
    ],
    receiveDamageFactorFrom: [
      { attackerKey: 'unit-knight', attackerName: 'Knight', factor: 0.5 },
      { attackerKey: 'unit-orc-rider-no-bg', attackerName: 'Orc Rider', factor: 0.5 },
    ],
    faction: 'roman',
    description: 'Anti-cavalry specialist. Takes half damage from mounted units.',
    lore: 'The Hastati plant their spears and dare the horsemen to charge. Against cavalry, there is no finer wall.'
  },
  {
    key: 'unit-catapult', name: 'Catapult', range: 4, minRange: 2, moves: 2,
    stats: { hp: 20, atk: 16, def: 0 },
    growth: { hp: 2, atk: 3, def: 1 },
    attackType: 'physical', cost: 400, maintenance: 20,
    canBoardShip: true,
    bonusAgainstLocation: [
      { type: 'FORT', bonusPercent: 100 },
      { type: 'PORT', bonusPercent: 100 },
      { type: 'ORC_CAMP', bonusPercent: 100 },
    ],
    faction: 'roman',
    description: 'Siege engine. Long range, double damage to buildings. Fragile and slow.',
    lore: 'The Onager hurls stone and fire over fortress walls. Cities crumble; garrisons despair.'
  },
  {
    key: 'unit-ballista', name: 'Ballista', range: 3, minRange: 1, moves: 3,
    stats: { hp: 30, atk: 25, def: 2 },
    growth: { hp: 6, atk: 1, def: 1 },
    attackType: 'physical', cost: 300, maintenance: 15,
    canBoardShip: true,
    faction: 'roman',
    description: 'Precision siege weapon. High ATK, ship-mountable.',
    lore: 'The Scorpio\'s iron bolts punch through shield and armor alike. Mounted on ship decks, they rule the waves.'
  },
  {
    key: 'unit-engineer', name: 'Engineer', range: 1, minRange: 1, moves: 5,
    stats: { hp: 34, atk: 13, def: 3 },
    growth: { hp: 7, atk: 2, def: 1 },
    attackType: 'physical', cost: 320, maintenance: 10,
    engineerSkills: ['build_road', 'build_workshop', 'build_castra', 'repair'],
    faction: 'roman',
    description: 'Builder unit. Constructs roads, workshops, castra, and repairs buildings.',
    lore: 'Rome\'s true weapon is not the sword but the road. The Fabri build the empire\'s sinews of war.'
  },
];

export const ORC_UNITS: UnitClass[] = [
  {
    key: 'unit-orc-infantry-no-bg', name: 'Orc Infantry', range: 1, minRange: 1, moves: 5,
    stats: { hp: 60, atk: 18, def: 7 },
    growth: { hp: 12, atk: 4, def: 3 },
    attackType: 'physical', cost: 150, maintenance: 5,
    faction: 'orc',
    description: 'Brutish foot soldiers. Tougher than Roman infantry but undisciplined.',
    lore: 'Where Rome has order, the Orcs have fury. Their warriors are born in battle and die the same way.'
  },
  {
    key: 'unit-orc-mage-no-bg', name: 'Orc Mage', range: 2, minRange: 1, moves: 4,
    stats: { hp: 40, atk: 28, def: 3 },
    growth: { hp: 8, atk: 6, def: 1 },
    attackType: 'magic', cost: 350, maintenance: 10,
    damageReduction: { magic: 0.5 },
    faction: 'orc',
    description: 'Savage spellcaster. Even deadlier magic than Roman mages.',
    lore: 'The Shamans channel the rage of the Waaagh into bolts of green destruction. Their power is crude but immense.'
  },
  {
    key: 'unit-orc-rider-no-bg', name: 'Orc Rider', range: 1, minRange: 1, moves: 7,
    stats: { hp: 70, atk: 20, def: 8 },
    growth: { hp: 15, atk: 5, def: 4 },
    attackType: 'physical', cost: 450, maintenance: 15,
    faction: 'orc',
    description: 'Mounted beast-rider. The heaviest cavalry on the field.',
    lore: 'Atop war-boars and dire wolves, the Orc Riders crash through shield walls like an avalanche of tusks and steel.'
  },
  {
    key: 'unit-orc-spear-no-bg', name: 'Orc Spearman', range: 1, minRange: 1, moves: 5,
    stats: { hp: 55, atk: 15, def: 8 },
    growth: { hp: 11, atk: 3, def: 3 },
    attackType: 'physical', cost: 180, maintenance: 6,
    receiveDamageFactorFrom: [
      { attackerKey: 'unit-knight', attackerName: 'Knight', factor: 0.5 },
      { attackerKey: 'unit-orc-rider-no-bg', attackerName: 'Orc Rider', factor: 0.5 },
    ],
    faction: 'orc',
    description: 'Orc anti-cavalry. High DEF, halves cavalry damage.',
    lore: 'Even Orcs respect the charge of a mounted foe. Their spearbearers brace with grim determination.'
  },
  {
    key: 'unit-orc-healer-no-bg', name: 'Orc Healer', range: 2, minRange: 1, moves: 5,
    stats: { hp: 45, atk: 12, def: 4, isHealer: true },
    growth: { hp: 9, atk: 2, def: 2 },
    attackType: 'magic', cost: 280, maintenance: 8,
    faction: 'orc',
    description: 'Tribal shaman with healing arts. Tougher than Roman healers.',
    lore: 'The bone-rattlers and blood-mixers of the tribes. Their medicine is foul, but it works.'
  },
];

export const SHIP_CLASSES = [
  {
    key: 'ship-liburna', name: 'Liburna', tiles: 1,
    deckSlots: 1, capacity: 3, moves: 18,
    hullHp: 40, shipAtk: 8, shipDef: 3, bombardRange: 3,
    cost: 300, maintenance: 15,
    description: 'Light scout vessel. Fast and cheap, but fragile.',
    lore: 'The Liburna cuts the waves like a knife. Favored by pirates and admirals alike for its speed.',
  },
  {
    key: 'ship-galley', name: 'Galley', tiles: 2,
    deckSlots: 2, capacity: 6, moves: 12,
    hullHp: 80, shipAtk: 15, shipDef: 6, bombardRange: 3,
    cost: 600, maintenance: 30,
    description: 'Standard warship. Balanced speed, firepower, and troop capacity.',
    lore: 'The backbone of Rome\'s navy. Its bronze ram has sent a thousand enemy vessels to Neptune\'s embrace.',
  },
  {
    key: 'ship-trireme', name: 'Trireme', tiles: 3,
    deckSlots: 3, capacity: 10, moves: 9,
    hullHp: 130, shipAtk: 24, shipDef: 10, bombardRange: 3,
    cost: 1000, maintenance: 50,
    description: 'Capital ship. Massive hull, devastating bombardment, huge crew.',
    lore: 'The Trireme is a floating fortress. Three banks of oars drive it forward; three decks of soldiers man its rails.',
  },
];

/** Map unit keys to sprite icon paths in /assets (for War Room unit cards). */
export const UNIT_SPRITE: Record<string, string> = {
  'unit-infantry': '/assets/unit-infantry-blue.png',
  'unit-knight': '/assets/unit-knight-blue.png',
  'unit-archer': '/assets/unit-archer-blue.png',
  'unit-mage': '/assets/unit-mage-blue.png',
  'unit-healer': '/assets/unit-healer-blue.png',
  'unit-spear': '/assets/unit-spear-blue.png',
  'unit-catapult': '/assets/unit-catapult-blue.png',
  'unit-ballista': '/assets/unit-ballista-blue.png',
  'unit-engineer': '/assets/unit-engineer-blue.png',
  'unit-orc-infantry-no-bg': '/assets/unit-orc-infantry.png',
  'unit-orc-mage-no-bg': '/assets/unit-orc-mage.png',
  'unit-orc-rider-no-bg': '/assets/unit-orc-rider.png',
  'unit-orc-spear-no-bg': '/assets/unit-orc-spear.png',
  'unit-orc-healer-no-bg': '/assets/unit-orc-healer.png',
};

export function getUnitSpriteSrc(unitKey: string): string | null {
  return UNIT_SPRITE[unitKey] ?? null;
}