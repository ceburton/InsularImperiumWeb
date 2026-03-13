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

      {/* ── Large Unit portrait area ── */}
      {spriteSrc && (
        <div className={`w-full h-64 flex items-center justify-center relative overflow-hidden ${
          isOrc ? 'ichor-glow' : ''
        }`} style={{
          background: isOrc
            ? 'radial-gradient(ellipse at 50% 50%, rgba(136,170,102,0.12) 0%, rgba(10,14,10,0.95) 60%)'
            : `radial-gradient(ellipse at 50% 50%, rgba(180,160,120,0.35) 0%, rgba(236,220,176,0.1) 60%)`,
          border: isOrc ? '2px solid #1a3a1a' : '2px solid #8a6a30',
          boxShadow: isOrc
            ? 'inset 0 0 30px rgba(136,170,102,0.08)'
            : 'inset 0 0 20px rgba(100,70,20,0.1)',
        }}>
          <Image
            src={spriteSrc}
            alt={unit.name}
            width={256}
            height={256}
            className="relative z-10 object-contain h-full w-auto max-h-full"
            style={{
              filter: isOrc ? 'drop-shadow(0 0 16px rgba(136,170,102,0.6))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
            unoptimized
          />
          {/* Inner vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.2) 100%)',
          }} />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Stats grid ── */}
        <div className="space-y-4">
          <SectionHead text="Vital Statistics" isOrc={isOrc} />
          <div className="grid grid-cols-2 gap-3">
            {([
              { label: 'ATK', value: unit.stats.atk, color: isOrc ? '#cc8888' : '#9a031e' },
              { label: 'DEF', value: unit.stats.def, color: isOrc ? '#88aacc' : '#4a6080' },
              { label: 'MOV', value: unit.moves, color: isOrc ? '#aacc88' : '#5a7040' },
              { label: 'RNG', value: `${unit.minRange}-${unit.range}`, color: isOrc ? '#ccaacc' : '#806040' },
            ] as const).map((s) => (
              <motion.div
                key={s.label}
                className="text-center py-3 px-2 relative"
                style={{
                  background: accentFaint,
                  border: `1px solid ${borderThin}`,
                  boxShadow: `inset 0 1px 3px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.04)`,
                }}
                whileHover={{ scale: 1.04, boxShadow: `inset 0 1px 3px rgba(0,0,0,0.18), 0 0 8px ${accentFaint}` }}
              >
                <div className="text-xs mb-1 opacity-40">{statIcon(s.label)}</div>
                <div className="text-2xl font-black" style={{ color: s.color, fontFamily: "'Cinzel', serif" }}>{s.value}</div>
                <div className="text-[9px] uppercase tracking-widest opacity-45" style={{ fontFamily: "'Cinzel', serif" }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── HP / Vitae ── */}
        <div className="space-y-4">
          <SectionHead text={`Vitae — ${unit.stats.hp} HP`} isOrc={isOrc} />
          <WaxDropRow hp={unit.stats.hp} />
          <div className="mt-4 pt-4" style={{ borderTop: `1px dashed ${borderThin}` }}>
             <SectionHead text="Growth per Level" isOrc={isOrc} />
             <div className="flex gap-5 mt-2">
                {Object.entries(unit.growth).map(([key, val]) => (
                  <div key={key} className="text-sm" style={{ fontFamily: "'EB Garamond', serif" }}>
                    <span className="font-bold text-base" style={{ color: isOrc ? '#4aba4a' : '#6a4a2a' }}>+{val}</span>
                    <span className="ml-1.5 uppercase text-[10px] tracking-wider opacity-45" style={{ fontFamily: "'Cinzel', serif" }}>{key}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* ── Attack type / Economy ── */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm py-4 px-6 justify-between" style={{
        background: accentFaint,
        border: `1px solid ${borderThin}`,
        fontFamily: "'EB Garamond', serif",
      }}>
        <span className="flex items-center gap-2">
          <strong style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem' }}>TYPE</strong>
          <span className="px-2 py-0.5" style={{ border: `1px solid ${borderThin}`, background: 'rgba(0,0,0,0.05)' }}>
            {unit.attackType === 'magic' ? '⚡ Arcane' : '⚔ Physical'}
          </span>
        </span>
        <span className="flex items-center gap-2">
          <strong style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem' }}>COST</strong>
          <span className="px-2 py-0.5" style={{ border: `1px solid ${borderThin}`, background: 'rgba(0,0,0,0.05)' }}>
            {unit.cost}g
          </span>
        </span>
        <span className="flex items-center gap-2">
          <strong style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem' }}>UPKEEP</strong>
          <span className="px-2 py-0.5" style={{ border: `1px solid ${borderThin}`, background: 'rgba(0,0,0,0.05)' }}>
            {unit.maintenance}g / turn
          </span>
        </span>
      </div>

      {/* ── Special properties ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="p-4 flex items-center gap-3" style={{
            background: 'rgba(74,96,128,0.08)',
            border: '1px solid #4a6080',
          }}>
            <span className="text-lg">⚓</span>
            <span className="text-sm italic" style={{ fontFamily: "'EB Garamond', serif" }}>
              Can board ships and fire from deck.
            </span>
          </div>
        )}
      </div>

      {/* ── Combat modifiers ── */}
      {(unit.bonusAgainst || unit.receiveDamageFactorFrom || unit.damageReduction || unit.bonusAgainstLocation) && (
        <div className="p-6" style={{
          background: `linear-gradient(180deg, ${accentFaint}, transparent)`,
          border: `1px solid ${borderThin}`,
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)',
        }}>
          <SectionHead text="Combat Doctrine" isOrc={isOrc} />
          <div className="space-y-2 mt-4" style={{ fontFamily: "'EB Garamond', serif" }}>
            {unit.bonusAgainst?.map((b, i) => (
              <p key={i} className="text-sm flex items-start gap-3">
                <span style={{ color: accent }}>✦</span>
                <span><strong>+{b.bonus} ATK</strong> against {b.targetName}</span>
              </p>
            ))}
            {unit.receiveDamageFactorFrom?.map((d, i) => (
              <p key={i} className="text-sm flex items-start gap-3">
                <span style={{ color: accent }}>✦</span>
                <span>Takes only <strong>{d.factor * 100}% damage</strong> from {d.attackerName}</span>
              </p>
            ))}
            {unit.damageReduction?.magic && (
              <p key="magic-reduction-doctrine" className="text-sm flex items-start gap-3">
                <span style={{ color: accent }}>✦</span>
                <span><strong>{unit.damageReduction.magic * 100}% magic damage reduction</strong></span>
              </p>
            )}
            {unit.bonusAgainstLocation?.map((b, i) => (
              <p key={i} className="text-sm flex items-start gap-3">
                <span style={{ color: accent }}>✦</span>
                <span><strong>+{b.bonusPercent}% damage</strong> against {b.type} locations</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
