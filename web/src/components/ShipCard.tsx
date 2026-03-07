'use client';

import { motion } from 'framer-motion';

interface ShipClass {
  key: string;
  name: string;
  tiles: number;
  deckSlots: number;
  capacity: number;
  moves: number;
  hullHp: number;
  shipAtk: number;
  shipDef: number;
  bombardRange: number;
  cost: number;
  maintenance: number;
  description: string;
  lore: string;
}

interface ShipCardProps {
  ship: ShipClass;
  index: number;
}

function statIcon(label: string) {
  switch (label) {
    case 'HULL': return '🛡';
    case 'ATK': return '⚔';
    case 'DEF': return '🏛';
    case 'MOV': return '🦶';
    default: return '⬦';
  }
}

export default function ShipCard({ ship, index }: ShipCardProps) {
  return (
    <motion.div
      className="parchment-card p-6 relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      whileHover={{
        y: -5,
        boxShadow: '4px 6px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Corner rivets */}
      <div className="rivet top-1.5 left-1.5" />
      <div className="rivet top-1.5 right-1.5" />
      <div className="rivet bottom-1.5 left-1.5" />
      <div className="rivet bottom-1.5 right-1.5" />

      {/* ── Ship header ── */}
      <div className="mb-4 pb-3 relative" style={{ borderBottom: '2px solid #8a6a30' }}>
        <div className="flex items-center gap-3">
          <div className="text-4xl" style={{
            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))',
          }}>⚓</div>
          <div>
            <h3 className="text-xl font-black tracking-wider" style={{
              fontFamily: "'Cinzel', serif",
              color: '#4a6080',
              textShadow: '0 1px 0 rgba(255,255,255,0.3), 0 -1px 0 rgba(0,0,0,0.1)',
            }}>
              {ship.name}
            </h3>
            <p className="text-[10px] uppercase tracking-widest opacity-45 mt-0.5" style={{
              fontFamily: "'Cinzel', serif",
            }}>
              {ship.tiles}-tile vessel ⬦ {ship.deckSlots} deck slots ⬦ Cap: {ship.capacity}
            </p>
          </div>
        </div>
        {/* Bronze accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent, #b08d57 30%, #b08d57 70%, transparent)',
          opacity: 0.4,
        }} />
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {([
          { label: 'HULL', value: ship.hullHp, color: '#4a6080' },
          { label: 'ATK', value: ship.shipAtk, color: '#9a031e' },
          { label: 'DEF', value: ship.shipDef, color: '#5a7040' },
          { label: 'MOV', value: ship.moves, color: '#806040' },
        ] as const).map((s) => (
          <div key={s.label} className="text-center py-2.5 px-1.5" style={{
            background: 'rgba(74,96,128,0.06)',
            border: '1px solid #d4c49c',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.04)',
          }}>
            <div className="text-[10px] mb-0.5 opacity-35">{statIcon(s.label)}</div>
            <div className="text-lg font-black" style={{ color: s.color, fontFamily: "'Cinzel', serif" }}>{s.value}</div>
            <div className="text-[8px] uppercase tracking-widest opacity-40" style={{ fontFamily: "'Cinzel', serif" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Description ── */}
      <p className="text-sm italic mb-2" style={{
        color: '#4a3a2a',
        fontFamily: "'EB Garamond', serif",
        lineHeight: '1.65',
      }}>
        {ship.description}
      </p>

      {/* ── Lore ── */}
      <p className="text-xs leading-relaxed px-3 py-2" style={{
        fontFamily: "'EB Garamond', serif",
        fontStyle: 'italic',
        opacity: 0.55,
        borderLeft: '2px solid rgba(176,141,87,0.3)',
      }}>
        &ldquo;{ship.lore}&rdquo;
      </p>

      {/* ── Footer ── */}
      <div className="mt-4 pt-2 flex justify-between text-[10px] uppercase tracking-widest opacity-35" style={{
        borderTop: '1px solid rgba(176,141,87,0.25)',
        fontFamily: "'Cinzel', serif",
      }}>
        <span>{ship.cost}g ⬦ {ship.maintenance}g/turn</span>
        <span>Bombard: {ship.bombardRange}</span>
      </div>
    </motion.div>
  );
}
