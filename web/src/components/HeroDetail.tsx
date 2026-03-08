'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import type { Hero } from '@/data/heroes';

interface HeroDetailProps {
  hero: Hero;
  variant: 'blue' | 'vampire';
}

const heroPortraitSrc = (portraitKey: string) => `/assets/${portraitKey}.png`;

export default function HeroDetail({ hero, variant }: HeroDetailProps) {
  const isVampire = variant === 'vampire';
  const [portraitError, setPortraitError] = useState(false);

  return (
    <div className="space-y-7" style={{
      color: isVampire ? '#d4c4c4' : '#3a2a1a',
    }}>
      {/* Portrait — deeper atmospheric frame */}
      <div className={`w-full h-52 flex items-center justify-center relative overflow-hidden ${
        isVampire ? 'ichor-glow' : ''
      }`} style={{
        background: isVampire
          ? 'radial-gradient(ellipse at 50% 50%, rgba(185,28,28,0.12) 0%, rgba(10,10,14,0.97) 60%)'
          : `radial-gradient(ellipse at 50% 45%, rgba(180,160,120,0.35) 0%, rgba(236,220,176,0.05) 60%)`,
        border: isVampire ? '3px solid #3a1a1a' : '3px solid #8a6a30',
        boxShadow: isVampire
          ? 'inset 0 0 40px rgba(185,28,28,0.08), 0 4px 12px rgba(0,0,0,0.4)'
          : 'inset 0 0 30px rgba(100,70,20,0.12), 0 4px 12px rgba(0,0,0,0.2)',
      }}>
        {!portraitError ? (
          <Image
            src={heroPortraitSrc(hero.portraitKey)}
            alt={hero.name}
            width={208}
            height={208}
            className="relative z-10 object-contain h-full w-auto max-h-full"
            style={{
              filter: isVampire
                ? 'drop-shadow(0 0 24px rgba(185,28,28,0.7))'
                : 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))',
            }}
            onError={() => setPortraitError(true)}
            unoptimized
          />
        ) : (
          <span className="text-8xl relative z-10" style={{
            filter: isVampire
              ? 'drop-shadow(0 0 24px rgba(185,28,28,0.7))'
              : 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))',
          }}>
            {getIcon(hero.baseClass, isVampire)}
          </span>
        )}
        {/* Vignette + optional ichor pulse */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.25) 100%)`,
        }} />
        {isVampire && (
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse at 50% 100%, rgba(185,28,28,0.08) 0%, transparent 50%)`,
            animation: 'ichor-drift 6s ease-in-out infinite alternate',
          }} />
        )}
      </div>

      {/* Title block — deeper engravings */}
      <div className="text-center">
        <h3 className="text-3xl font-black tracking-[0.12em]" style={{
          fontFamily: "'Cinzel', serif",
          color: isVampire ? 'var(--color-ichor)' : '#9a031e',
          textShadow: isVampire
            ? '0 0 15px rgba(185,28,28,0.5), 0 0 30px rgba(185,28,28,0.2)'
            : '0 1px 0 rgba(255,255,255,0.05), 0 -1px 2px rgba(0,0,0,0.2)',
        }}>
          {hero.name}{hero.title ? ',' : ''}
        </h3>
        {hero.title && (
          <p className="text-lg mt-1" style={{
            color: isVampire ? '#a85a5a' : '#7a5a3a',
            fontFamily: "'EB Garamond', serif",
            fontStyle: 'italic',
          }}>
            {hero.title}
          </p>
        )}
      </div>

      {/* Lore — ink on parchment blockquote */}
      <div className="px-5 py-4" style={{
        borderLeft: `4px solid ${isVampire ? '#7f1d1d' : '#b08d57'}`,
        fontStyle: 'italic',
        lineHeight: '1.75',
        fontSize: '0.95rem',
        fontFamily: "'EB Garamond', serif",
        background: isVampire
          ? 'linear-gradient(90deg, rgba(185,28,28,0.04), transparent)'
          : 'linear-gradient(90deg, rgba(176,141,87,0.06), transparent)',
      }}>
        &ldquo;{hero.lore}&rdquo;
      </div>

      {/* Bonus Statistics — engraved stat plaques */}
      <div>
        <h4 className="text-sm font-bold uppercase tracking-[0.12em] mb-3" style={{
          fontFamily: "'Cinzel', serif",
          color: isVampire ? '#b91c1c' : '#8a6a3a',
        }}>
          Bonus Statistics
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(hero.bonusStats).map(([key, val]) => (
            <motion.div
              key={key}
              className="text-center p-2.5"
              style={{
                background: isVampire ? 'rgba(185,28,28,0.06)' : 'rgba(120,90,40,0.06)',
                border: `1px solid ${isVampire ? '#3a1a1a' : '#c4a87a'}`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-xl font-bold" style={{
                color: isVampire ? 'var(--color-ichor)' : '#6a4a2a',
              }}>
                {val > 0 ? '+' : ''}{val}
              </div>
              <div className="text-[9px] uppercase tracking-[0.1em] opacity-45" style={{
                fontFamily: "'Cinzel', serif",
              }}>{key}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Growth per level */}
      <div>
        <h4 className="text-sm font-bold uppercase tracking-[0.12em] mb-3" style={{
          fontFamily: "'Cinzel', serif",
          color: isVampire ? '#b91c1c' : '#8a6a3a',
        }}>
          Growth per Level
        </h4>
        <div className="flex gap-5">
          {Object.entries(hero.growth).map(([key, val]) => (
            <div key={key} className="text-center">
              <span className="text-base font-bold" style={{
                color: isVampire ? 'var(--color-ichor)' : '#6a4a2a',
              }}>+{val}</span>
              <span className="text-xs opacity-45 ml-1.5 uppercase" style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '10px',
              }}>{key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Aura — embossed panel */}
      <div className="p-5" style={{
        background: isVampire
          ? 'linear-gradient(135deg, rgba(185,28,28,0.08), rgba(127,29,29,0.1))'
          : 'linear-gradient(135deg, rgba(176,141,87,0.1), rgba(176,141,87,0.04))',
        border: `1px solid ${isVampire ? '#3a1a1a' : '#b08d57'}`,
        boxShadow: isVampire
          ? 'inset 0 0 12px rgba(185,28,28,0.05)'
          : 'inset 0 0 10px rgba(100,70,20,0.05)',
      }}>
        <h4 className="text-sm font-bold uppercase tracking-[0.12em] mb-3" style={{
          fontFamily: "'Cinzel', serif",
          color: isVampire ? 'var(--color-ichor)' : '#b08d57',
          textShadow: isVampire ? '0 0 6px rgba(185,28,28,0.35)' : 'none',
        }}>
          Passive Aura (Range: {hero.aura.range})
          {hero.aura.undeadOnly && <span className="ml-2 text-xs opacity-50">— Undead Only</span>}
        </h4>
        <div className="flex flex-wrap gap-4">
          {Object.entries(hero.aura.bonuses).map(([key, val]) => (
            <div key={key} className="text-sm">
              <span className="font-bold" style={{ color: isVampire ? 'var(--color-ichor)' : '#6a4a2a' }}>
                +{val}
              </span>{' '}
              <span className="uppercase text-xs opacity-55" style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '10px',
              }}>{key}</span>
              <span className="text-[10px] opacity-25 ml-1">
                (cap: {hero.aura.caps[key]})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ability — heavier border, branded feel */}
      <div className="p-5" style={{
        background: isVampire
          ? 'linear-gradient(135deg, rgba(185,28,28,0.1), rgba(127,29,29,0.12))'
          : 'linear-gradient(135deg, rgba(154,3,30,0.08), rgba(154,3,30,0.03))',
        border: isVampire ? '2px solid #7f1d1d' : `2px solid rgba(154,3,30,0.25)`,
        boxShadow: isVampire
          ? 'inset 0 0 15px rgba(185,28,28,0.05)'
          : 'inset 0 0 10px rgba(154,3,30,0.04)',
      }}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-bold tracking-[0.08em]" style={{
            fontFamily: "'Cinzel', serif",
            color: isVampire ? 'var(--color-ichor)' : '#9a031e',
            textShadow: isVampire ? '0 0 8px rgba(185,28,28,0.4)' : 'none',
          }}>
            ✧ {hero.ability.name}
          </h4>
          <div className="flex gap-3 text-xs opacity-50">
            <span>CD: {hero.ability.cooldown}</span>
            {hero.ability.duration > 0 && <span>Dur: {hero.ability.duration}</span>}
            <span>Rng: {hero.ability.range}</span>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{
          fontFamily: "'EB Garamond', serif",
        }}>{hero.ability.description}</p>
        <div className="mt-3 flex gap-3 text-[10px] uppercase tracking-[0.1em] opacity-35" style={{
          fontFamily: "'Cinzel', serif",
        }}>
          <span>Target: {hero.ability.targetType}</span>
          <span>⬦</span>
          <span>Shape: {hero.ability.shape}</span>
        </div>
      </div>

      {/* Bottom seal — branded into parchment */}
      <div className="text-center pt-5" style={{
        borderTop: `2px solid ${isVampire ? '#3a1a1a' : '#b08d57'}`,
      }}>
        {hero.vampireHero ? (
          <span className="ichor-text text-sm" style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic' }}>
            ☠ This hero rises from the grave. They cannot be purchased — only feared.
          </span>
        ) : (
          <span className="text-sm opacity-45" style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic' }}>
            Cost: {hero.cost}g &bull; Maintenance: {hero.maintenance}g/turn
          </span>
        )}
      </div>
    </div>
  );
}

function getIcon(baseClass: string, isVampire: boolean): string {
  if (isVampire) {
    const v: Record<string, string> = { INFANTRY: '💀', KNIGHT: '🦇', MAGE: '👁', ARCHER: '🦴' };
    return v[baseClass] || '☠';
  }
  const i: Record<string, string> = { INFANTRY: '⚔', SPEAR: '🔱', KNIGHT: '🐎', ARCHER: '🏹', MAGE: '✧', HEALER: '✚', ENGINEER: '⚒' };
  return i[baseClass] || '⚔';
}
