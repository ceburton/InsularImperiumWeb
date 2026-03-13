'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { UnitClass } from '@/data/units';
import { getUnitSpriteSrc } from '@/data/units';

interface UnitCardProps {
  unit: UnitClass;
  index: number;
  onClick: () => void;
}

function WaxDropRow({ hp }: { hp: number }) {
  const drops = Math.ceil(hp / 10);
  return (
    <div className="flex flex-wrap justify-center gap-0.5 mt-1">
      {[...Array(drops)].map((_, i) => (
        <div key={i} className="wax-drop" />
      ))}
    </div>
  );
}

function StatIcon({ type, value, color }: { type: string; value: number | string; color: string }) {
  const icons: Record<string, string> = {
    ATK: '⚔',
    DEF: '🏛',
    MOV: '🦶',
    GOLD: '⬡',
  };
  return (
    <div className="text-center flex flex-col items-center flex-1">
      <span className="text-sm opacity-60 mb-0.5" style={{ color }}>{icons[type]}</span>
      <div className="text-xl font-bold leading-tight" style={{ color }}>{value}</div>
      <div className="text-[9px] uppercase tracking-[0.1em] opacity-50" style={{
        fontFamily: "'Cinzel', serif",
      }}>{type}</div>
    </div>
  );
}

export default function UnitCard({ unit, index, onClick }: UnitCardProps) {
  const isOrc = unit.faction === 'orc';

  return (
    <motion.div
      className={`relative cursor-pointer ${isOrc ? 'obsidian-panel' : 'parchment-card deckled-edge'} p-6 overflow-hidden`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      whileHover={{
        y: -6,
        boxShadow: isOrc
          ? '0 10px 35px rgba(136,170,102,0.2), 0 0 50px rgba(136,170,102,0.08), 0 4px 12px rgba(0,0,0,0.5)'
          : '0 10px 30px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.3)',
      }}
      onClick={onClick}
    >
      {/* Corner rivets */}
      <div className={`${isOrc ? 'rivet-ichor' : 'rivet'} absolute top-1.5 left-1.5`} />
      <div className={`${isOrc ? 'rivet-ichor' : 'rivet'} absolute top-1.5 right-1.5`} />
      <div className={`${isOrc ? 'rivet-ichor' : 'rivet'} absolute bottom-1.5 left-1.5`} />
      <div className={`${isOrc ? 'rivet-ichor' : 'rivet'} absolute bottom-1.5 right-1.5`} />

      {/* Maintenance stamp — iron branded into corner */}
      <div className="absolute top-3.5 right-4 text-[10px] uppercase tracking-[0.1em] z-20" style={{
        fontFamily: "'Cinzel', serif",
        color: isOrc ? '#88aa66' : '#8a7a5a',
        textShadow: '0 1px 0 rgba(0,0,0,0.3)',
        opacity: 0.7,
      }}>
        ⚙ {unit.maintenance}g
      </div>

      {/* Large Unit portrait area — same as HeroCard */}
      <div className={`w-full h-44 mb-4 flex items-center justify-center relative overflow-hidden ${
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
        {getUnitSpriteSrc(unit.key) && (
          <Image
            src={getUnitSpriteSrc(unit.key)!}
            alt={unit.name}
            width={176}
            height={176}
            className="relative z-10 object-contain h-full w-auto max-h-full"
            style={{
              filter: isOrc ? 'drop-shadow(0 0 16px rgba(136,170,102,0.6))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
            unoptimized
          />
        )}
        {/* Inner vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.2) 100%)',
        }} />
      </div>

      {/* Unit name header */}
      <div className="mb-4 text-center relative z-10">
        <h3 className="text-xl font-bold tracking-[0.12em]" style={{
          fontFamily: "'Cinzel', serif",
          color: isOrc ? '#88cc88' : '#9a031e',
          textShadow: isOrc
            ? '0 0 12px rgba(136,170,102,0.4)'
            : '0 1px 2px rgba(0,0,0,0.15)',
        }}>
          {unit.name}
        </h3>
        <p className="text-xs mt-1" style={{
          color: isOrc ? '#6a8a6a' : '#6a5a3a',
          fontFamily: "'EB Garamond', serif",
          fontStyle: 'italic',
        }}>
          {unit.attackType === 'magic' ? '✧ Arcane' : '⚔ Physical'} &bull; Range {unit.minRange}–{unit.range} &bull; MOV {unit.moves}
        </p>
      </div>

      {/* HP as Vitae section */}
      <div className="mb-4 text-center">
        <div className="text-[10px] uppercase tracking-[0.12em] font-bold mb-1" style={{
          color: isOrc ? '#5a8a5a' : '#7a5a3a',
          fontFamily: "'Cinzel', serif",
          opacity: 0.8,
        }}>
          Vitae — {unit.stats.hp} HP
        </div>
        <WaxDropRow hp={unit.stats.hp} />
      </div>

      {/* Stats row — shared style with HeroCard but with Icons */}
      <div className="flex justify-between items-center mb-5 py-3 px-2" style={{
        background: isOrc ? 'rgba(136,170,102,0.03)' : 'rgba(120,90,40,0.05)',
        borderTop: `1px solid ${isOrc ? '#1a2a1a' : '#d4c49c80'}`,
        borderBottom: `1px solid ${isOrc ? '#1a2a1a' : '#d4c49c80'}`,
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02)',
      }}>
        <StatIcon type="ATK" value={unit.stats.atk} color={isOrc ? '#cc8888' : '#9a031e'} />
        <StatIcon type="DEF" value={unit.stats.def} color={isOrc ? '#88aacc' : '#4a6080'} />
        <StatIcon type="MOV" value={unit.moves} color={isOrc ? '#aacc88' : '#5a7040'} />
        <StatIcon type="GOLD" value={unit.cost} color={isOrc ? '#ccaacc' : '#806040'} />
      </div>

      {/* Description — handwritten inscription */}
      <div className="mb-4 relative">
        <p className="text-sm leading-relaxed text-center italic" style={{
          color: isOrc ? '#8a9a8a' : '#3a2a1a',
          fontFamily: "'EB Garamond', serif",
        }}>
          &quot;{unit.description}&quot;
        </p>
      </div>

      {/* Combat modifiers — Plaque style similar to Hero abilities */}
      {(unit.bonusAgainst || unit.receiveDamageFactorFrom || unit.damageReduction || unit.bonusAgainstLocation) && (
        <div className="p-3.5 relative z-10" style={{
          background: isOrc
            ? 'linear-gradient(135deg, rgba(136,170,102,0.06), rgba(20,30,20,0.1))'
            : 'linear-gradient(135deg, rgba(120,90,40,0.08), rgba(120,90,40,0.03))',
          border: isOrc ? '1px solid #1a3a1a' : '1px solid #b08d57',
          boxShadow: isOrc
            ? 'inset 0 0 10px rgba(136,170,102,0.04)'
            : 'inset 0 0 8px rgba(100,70,20,0.06)',
        }}>
          <span className="text-[10px] uppercase tracking-[0.12em] font-bold block mb-2" style={{
            color: isOrc ? '#88aa66' : '#9a031e',
            fontFamily: "'Cinzel', serif",
          }}>
            ✧ Combat Doctrine
          </span>
          <div className="space-y-1">
            {unit.bonusAgainst?.map((b, i) => (
              <p key={i} className="text-xs" style={{
                color: isOrc ? '#a8bba8' : '#5a4a30',
                fontFamily: "'EB Garamond', serif",
              }}>
                • +{b.bonus} ATK vs {b.targetName}
              </p>
            ))}
            {unit.receiveDamageFactorFrom?.map((d, i) => (
              <p key={i} className="text-xs" style={{
                color: isOrc ? '#a8bba8' : '#5a4a30',
                fontFamily: "'EB Garamond', serif",
              }}>
                • Takes {d.factor * 100}% damage from {d.attackerName}
              </p>
            ))}
            {unit.damageReduction?.magic && (
              <p className="text-xs" style={{
                color: isOrc ? '#a8bba8' : '#5a4a30',
                fontFamily: "'EB Garamond', serif",
              }}>
                • {unit.damageReduction.magic * 100}% magic damage reduction
              </p>
            )}
            {unit.bonusAgainstLocation?.map((b, i) => (
              <p key={i} className="text-xs" style={{
                color: isOrc ? '#a8bba8' : '#5a4a30',
                fontFamily: "'EB Garamond', serif",
              }}>
                • +{b.bonusPercent}% damage vs {b.type}
              </p>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
