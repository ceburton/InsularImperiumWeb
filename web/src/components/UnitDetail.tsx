'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { UnitClass } from '@/data/units';
import { getUnitSpriteSrc } from '@/data/units';

interface UnitDetailProps {
  unit: UnitClass;
}

/* ── Wax-drop HP row ── */
function WaxDropRow({ hp }: { hp: number }) {
  const drops = Math.ceil(hp / 10);
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {[...Array(drops)].map((_, i) => (
        <div key={i} className="wax-drop-lg" />
      ))}
    </div>
  );
}

/* ── Stat icon helper ── */
function statIcon(label: string) {
  switch (label) {
    case 'ATK': return '⚔';
    case 'DEF': return '🏛';
    case 'MOV': return '🦶';
    case 'RNG': return '🎯';
    default: return '⬦';
  }
}

/* ── Section heading ── */
function SectionHead({ text, isOrc }: { text: string; isOrc: boolean }) {
  return (
    <h4 className="text-sm font-bold uppercase tracking-wider mb-2" style={{
      fontFamily: "'Cinzel', serif",
      color: isOrc ? '#3a8a3a' : '#8a6a3a',
      textShadow: '0 1px 0 rgba(0,0,0,0.15)',
    }}>
      ─ {text} ─
    </h4>
  );
}

export default function UnitDetail({ unit }: UnitDetailProps) {
  const isOrc = unit.faction === 'orc';
  const accent = isOrc ? '#3a8a3a' : '#b08d57';
  const accentFaint = isOrc ? 'rgba(0,255,65,0.05)' : 'rgba(176,141,87,0.06)';
  const borderThin = isOrc ? '#1a3a1a' : '#d4c49c';

  const spriteSrc = getUnitSpriteSrc(unit.key);

  return (
    <div className="space-y-6" style={{ color: isOrc ? '#c4d4c8' : '#3a2a1a' }}>

      {/* ── Unit sprite icon ── */}
      {spriteSrc && (
        <div className="flex justify-center">
          <div
            className="w-24 h-24 flex items-center justify-center rounded-lg overflow-hidden"
            style={{
              background: isOrc ? 'rgba(0,0,0,0.4)' : 'rgba(176,141,87,0.15)',
              border: `2px solid ${isOrc ? '#1a3a1a' : '#8a6a30'}`,
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <Image
              src={spriteSrc}
              alt=""
              width={96}
              height={96}
              className="w-full h-full object-contain"
              unoptimized
              aria-hidden
            />
          </div>
        </div>
      )}

      {/* ── Lore blockquote ── */}
      <blockquote className="px-5 py-4 relative" style={{
        borderLeft: `4px solid ${accent}`,
        background: `linear-gradient(135deg, ${accentFaint}, transparent 60%)`,
        fontFamily: "'EB Garamond', serif",
        fontStyle: 'italic',
        fontSize: '1.05rem',
        lineHeight: '1.75',
        boxShadow: 'inset 2px 0 8px rgba(0,0,0,0.08)',
      }}>
        <span style={{ fontSize: '1.6rem', lineHeight: 0, verticalAlign: '-0.25em', opacity: 0.3 }}>&ldquo;</span>
        {unit.lore}
        <span style={{ fontSize: '1.6rem', lineHeight: 0, verticalAlign: '-0.25em', opacity: 0.3 }}>&rdquo;</span>
      </blockquote>

      {/* ── HP / Vitae ── */}
      <div>
        <SectionHead text={`Vitae — ${unit.stats.hp} HP`} isOrc={isOrc} />
        <WaxDropRow hp={unit.stats.hp} />
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-4 gap-3">
        {([
          { label: 'ATK', value: unit.stats.atk, color: isOrc ? '#cc6666' : '#9a031e' },
          { label: 'DEF', value: unit.stats.def, color: isOrc ? '#6688aa' : '#4a6080' },
          { label: 'MOV', value: unit.moves, color: isOrc ? '#88aa66' : '#5a7040' },
          { label: 'RNG', value: `${unit.minRange}-${unit.range}`, color: isOrc ? '#aa8866' : '#806040' },
        ] as const).map((s) => (
          <motion.div
            key={s.label}
            className="text-center py-3 px-2 relative"
            style={{
              background: accentFaint,
              border: `1px solid ${borderThin}`,
              boxShadow: `inset 0 1px 3px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.04)`,
            }}
            whileHover={{ scale: 1.06, boxShadow: `inset 0 1px 3px rgba(0,0,0,0.18), 0 0 8px ${accentFaint}` }}
          >
            <div className="text-xs mb-1 opacity-40">{statIcon(s.label)}</div>
            <div className="text-2xl font-black" style={{ color: s.color, fontFamily: "'Cinzel', serif" }}>{s.value}</div>
            <div className="text-[9px] uppercase tracking-widest opacity-45" style={{ fontFamily: "'Cinzel', serif" }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Growth per level ── */}
      <div>
        <SectionHead text="Growth per Level" isOrc={isOrc} />
        <div className="flex gap-5">
          {Object.entries(unit.growth).map(([key, val]) => (
            <div key={key} className="text-sm" style={{ fontFamily: "'EB Garamond', serif" }}>
              <span className="font-bold text-base" style={{ color: isOrc ? '#4aba4a' : '#6a4a2a' }}>+{val}</span>
              <span className="ml-1.5 uppercase text-[10px] tracking-wider opacity-45" style={{ fontFamily: "'Cinzel', serif" }}>{key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Attack type / Economy ── */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm py-3 px-4" style={{
        background: accentFaint,
        border: `1px solid ${borderThin}`,
        fontFamily: "'EB Garamond', serif",
      }}>
        <span>
          <strong style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem' }}>TYPE</strong>{' '}
          {unit.attackType === 'magic' ? '⚡ Arcane' : '⚔ Physical'}
        </span>
        <span>
          <strong style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem' }}>COST</strong>{' '}
          {unit.cost}g
        </span>
        <span>
          <strong style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem' }}>UPKEEP</strong>{' '}
          {unit.maintenance}g / turn
        </span>
      </div>

      {/* ── Special properties ── */}
      {unit.stats.isHealer && (
        <div className="p-4" style={{
          background: isOrc ? 'rgba(0,255,65,0.06)' : 'rgba(100,160,100,0.08)',
          border: `1px solid ${isOrc ? '#1a4a1a' : '#8aaa8a'}`,
          boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.08)',
        }}>
          <span className="text-sm" style={{ fontFamily: "'EB Garamond', serif" }}>
            ✚ <strong>Healer Unit</strong> — Restores HP to allied units within range.
          </span>
        </div>
      )}

      {unit.engineerSkills && (
        <div className="p-4" style={{
          background: 'rgba(176,141,87,0.08)',
          border: '1px solid #c4a87a',
          boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.08)',
        }}>
          <span className="text-sm font-bold block mb-2" style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.08em' }}>⚒ Engineer Skills</span>
          <div className="flex flex-wrap gap-2">
            {unit.engineerSkills.map((s) => (
              <span key={s} className="text-xs px-2.5 py-1" style={{
                background: 'rgba(176,141,87,0.12)',
                border: '1px solid #c4a87a',
                fontFamily: "'EB Garamond', serif",
              }}>
                {s.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {unit.canBoardShip && (
        <p className="text-sm italic opacity-55" style={{ fontFamily: "'EB Garamond', serif" }}>
          ⚓ Can board ships and fire from deck.
        </p>
      )}

      {/* ── Combat modifiers ── */}
      {(unit.bonusAgainst || unit.receiveDamageFactorFrom || unit.damageReduction || unit.bonusAgainstLocation) && (
        <div className="p-5" style={{
          background: accentFaint,
          border: `1px solid ${borderThin}`,
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)',
        }}>
          <SectionHead text="Combat Modifiers" isOrc={isOrc} />
          <div className="space-y-1.5 mt-3" style={{ fontFamily: "'EB Garamond', serif" }}>
            {unit.bonusAgainst?.map((b, i) => (
              <p key={i} className="text-sm">
                ✦ <strong>+{b.bonus} ATK</strong> against {b.targetName}
              </p>
            ))}
            {unit.receiveDamageFactorFrom?.map((d, i) => (
              <p key={i} className="text-sm">
                ✦ Takes only <strong>{d.factor * 100}% damage</strong> from {d.attackerName}
              </p>
            ))}
            {unit.damageReduction?.magic && (
              <p className="text-sm">
                ✦ <strong>{unit.damageReduction.magic * 100}% magic damage reduction</strong>
              </p>
            )}
            {unit.bonusAgainstLocation?.map((b, i) => (
              <p key={i} className="text-sm">
                ✦ <strong>+{b.bonusPercent}% damage</strong> against {b.type} locations
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
