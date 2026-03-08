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
    <div className="flex flex-wrap gap-0.5 mt-1">
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
    <div className="text-center flex flex-col items-center">
      <span className="text-sm opacity-60" style={{ color }}>{icons[type]}</span>
      <div className="text-lg font-bold leading-tight" style={{ color }}>{value}</div>
      <div className="text-[9px] uppercase tracking-[0.1em] opacity-50 mt-0.5" style={{
        fontFamily: "'Cinzel', serif",
      }}>{type}</div>
    </div>
  );
}

export default function UnitCard({ unit, index, onClick }: UnitCardProps) {
  const isOrc = unit.faction === 'orc';

  return (
    <motion.div
      className={`relative cursor-pointer ${isOrc ? 'obsidian-panel' : 'parchment-card deckled-edge'} p-5`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      whileHover={{
        y: -6,
        boxShadow: isOrc
          ? '0 10px 30px rgba(0,255,65,0.12), 0 4px 12px rgba(0,0,0,0.5)'
          : '0 10px 30px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.3)',
      }}
      onClick={onClick}
    >
      {/* Corner rivets */}
      <div className={`${isOrc ? 'rivet-ichor' : 'rivet'} top-1.5 left-1.5`} />
      <div className={`${isOrc ? 'rivet-ichor' : 'rivet'} top-1.5 right-1.5`} />

      {/* Unit name header — sprite + title, bronze/obsidian underline */}
      <div className="mb-3 pb-2.5 relative flex items-start gap-3" style={{
        borderBottom: `2px solid ${isOrc ? '#1a3a1a' : '#8a6a30'}`,
      }}>
        {getUnitSpriteSrc(unit.key) && (
          <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded overflow-hidden" style={{
            background: isOrc ? 'rgba(0,0,0,0.3)' : 'rgba(120,90,40,0.12)',
            border: `1px solid ${isOrc ? '#1a3a1a' : '#8a6a30'}`,
          }}>
            <Image
              src={getUnitSpriteSrc(unit.key)!}
              alt=""
              width={56}
              height={56}
              className="w-full h-full object-contain"
              unoptimized
              aria-hidden
            />
          </div>
        )}
        <div className="min-w-0 flex-1 pr-14">
        <h3 className="text-lg font-bold tracking-[0.1em]" style={{
          fontFamily: "'Cinzel', serif",
          color: isOrc ? '#88cc88' : '#9a031e',
          textShadow: isOrc
            ? '0 0 8px rgba(0,255,65,0.3)'
            : '0 1px 2px rgba(0,0,0,0.15)',
        }}>
          {unit.name}
        </h3>
        <p className="text-xs mt-0.5" style={{
          color: isOrc ? '#6a8a6a' : '#6a5a3a',
          fontFamily: "'EB Garamond', serif",
          fontStyle: 'italic',
        }}>
          {unit.attackType === 'magic' ? '✧ Arcane' : '⚔ Physical'} &bull; Range {unit.minRange}–{unit.range} &bull; MOV {unit.moves}
        </p>
        </div>
      </div>

      {/* HP as wax drops */}
      <div className="mb-3">
        <span className="text-[10px] uppercase tracking-[0.12em] font-bold" style={{
          color: isOrc ? '#5a8a5a' : '#7a5a3a',
          fontFamily: "'Cinzel', serif",
        }}>
          Vitae — {unit.stats.hp} HP
        </span>
        <WaxDropRow hp={unit.stats.hp} />
      </div>

      {/* Stats row — crossed swords / tower icons */}
      <div className="flex gap-5 mb-3 py-2 px-1" style={{
        background: isOrc ? 'rgba(0,255,65,0.02)' : 'rgba(120,90,40,0.05)',
        borderTop: `1px solid ${isOrc ? '#1a2a1a' : '#d4c49c80'}`,
        borderBottom: `1px solid ${isOrc ? '#1a2a1a' : '#d4c49c80'}`,
      }}>
        <StatIcon type="ATK" value={unit.stats.atk} color={isOrc ? '#cc6666' : '#9a031e'} />
        <StatIcon type="DEF" value={unit.stats.def} color={isOrc ? '#6688aa' : '#4a6080'} />
        <StatIcon type="MOV" value={unit.moves} color={isOrc ? '#88aa66' : '#5a7040'} />
        <StatIcon type="GOLD" value={unit.cost} color={isOrc ? '#aa8866' : '#806040'} />
      </div>

      {/* Description — handwritten inscription */}
      <p className="text-sm leading-relaxed mb-2" style={{
        color: isOrc ? '#8a9a8a' : '#3a2a1a',
        fontStyle: 'italic',
        fontFamily: "'EB Garamond', serif",
      }}>
        {unit.description}
      </p>

      {/* Combat modifiers as inked footnotes */}
      {(unit.bonusAgainst || unit.receiveDamageFactorFrom || unit.damageReduction || unit.bonusAgainstLocation) && (
        <div className="mt-3 pt-2" style={{
          borderTop: `1px dashed ${isOrc ? '#1a3a1a' : '#b08d57'}`,
        }}>
          <span className="text-[9px] uppercase tracking-[0.12em] font-bold block mb-1.5" style={{
            color: isOrc ? '#4a6a4a' : '#8a7a5a',
            fontFamily: "'Cinzel', serif",
          }}>
            ─ Combat Notes ─
          </span>
          {unit.bonusAgainst?.map((b, i) => (
            <p key={i} className="text-xs" style={{
              color: isOrc ? '#7a9a7a' : '#5a4a30',
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic',
            }}>
              ✦ +{b.bonus} ATK vs {b.targetName}
            </p>
          ))}
          {unit.receiveDamageFactorFrom?.map((d, i) => (
            <p key={i} className="text-xs" style={{
              color: isOrc ? '#7a9a7a' : '#5a4a30',
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic',
            }}>
              ✦ Takes {d.factor * 100}% damage from {d.attackerName}
            </p>
          ))}
          {unit.damageReduction?.magic && (
            <p className="text-xs" style={{
              color: isOrc ? '#7a9a7a' : '#5a4a30',
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic',
            }}>
              ✦ {unit.damageReduction.magic * 100}% magic damage reduction
            </p>
          )}
          {unit.bonusAgainstLocation?.map((b, i) => (
            <p key={i} className="text-xs" style={{
              color: isOrc ? '#7a9a7a' : '#5a4a30',
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic',
            }}>
              ✦ +{b.bonusPercent}% damage vs {b.type}
            </p>
          ))}
        </div>
      )}

      {/* Maintenance stamp — iron branded into corner */}
      <div className="absolute top-3.5 right-3 text-[10px] uppercase tracking-[0.1em]" style={{
        fontFamily: "'Cinzel', serif",
        color: isOrc ? '#4a6a4a' : '#8a7a5a',
        textShadow: '0 1px 0 rgba(0,0,0,0.3)',
        opacity: 0.6,
      }}>
        ⚙ {unit.maintenance}g
      </div>
    </motion.div>
  );
}
