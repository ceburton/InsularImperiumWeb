'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import type { Hero } from '@/data/heroes';

interface HeroCardProps {
  hero: Hero;
  index: number;
  onClick: () => void;
  variant: 'blue' | 'vampire';
}

const heroPortraitSrc = (portraitKey: string) => `/assets/${portraitKey}.png`;

export default function HeroCard({ hero, index, onClick, variant }: HeroCardProps) {
  const isVampire = variant === 'vampire';
  const [portraitError, setPortraitError] = useState(false);

  return (
    <motion.div
      className={`relative cursor-pointer ${isVampire ? 'obsidian-panel' : 'parchment-card'} p-6 overflow-hidden`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{
        y: -6,
        boxShadow: isVampire
          ? '0 10px 35px rgba(185,28,28,0.2), 0 0 50px rgba(185,28,28,0.08), 0 4px 12px rgba(0,0,0,0.5)'
          : '0 10px 30px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.3)',
      }}
      onClick={onClick}
    >
      {/* Vampire ichor smoke overlay — heavier, animated */}
      {isVampire && (
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(185,28,28,0.08) 0%, transparent 60%)',
          animation: 'ichor-drift 5s ease-in-out infinite alternate',
        }} />
      )}

      {/* Corner rivets — variant-appropriate */}
      <div className={`${isVampire ? 'rivet-ichor' : 'rivet'} absolute top-1.5 left-1.5`} />
      <div className={`${isVampire ? 'rivet-ichor' : 'rivet'} absolute top-1.5 right-1.5`} />
      <div className={`${isVampire ? 'rivet-ichor' : 'rivet'} absolute bottom-1.5 left-1.5`} />
      <div className={`${isVampire ? 'rivet-ichor' : 'rivet'} absolute bottom-1.5 right-1.5`} />

      {/* Hero portrait area — deeper, more atmospheric */}
      <div className={`w-full h-44 mb-4 flex items-center justify-center relative overflow-hidden ${
        isVampire ? 'ichor-glow' : ''
      }`} style={{
        background: isVampire
          ? 'radial-gradient(ellipse at 50% 50%, rgba(185,28,28,0.12) 0%, rgba(10,10,14,0.95) 60%)'
          : `radial-gradient(ellipse at 50% 50%, rgba(180,160,120,0.35) 0%, rgba(236,220,176,0.1) 60%)`,
        border: isVampire ? '2px solid #3a1a1a' : '2px solid #8a6a30',
        boxShadow: isVampire
          ? 'inset 0 0 30px rgba(185,28,28,0.08)'
          : 'inset 0 0 20px rgba(100,70,20,0.1)',
      }}>
        {!portraitError ? (
          <Image
            src={heroPortraitSrc(hero.portraitKey)}
            alt={hero.name}
            width={176}
            height={176}
            className="relative z-10 object-contain h-full w-auto max-h-full"
            style={{
              filter: isVampire ? 'drop-shadow(0 0 16px rgba(185,28,28,0.7))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
            onError={() => setPortraitError(true)}
            unoptimized
          />
        ) : (
          <span className="text-7xl relative z-10" style={{
            filter: isVampire ? 'drop-shadow(0 0 16px rgba(185,28,28,0.7))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}>
            {getHeroIcon(hero.baseClass, isVampire)}
          </span>
        )}
        {/* Inner vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.2) 100%)',
        }} />
      </div>

      {/* Hero name & title — embossed feel */}
      <div className="mb-3 text-center relative z-10">
        <h3 className="text-xl font-bold tracking-[0.12em]" style={{
          fontFamily: "'Cinzel', serif",
          color: isVampire ? 'var(--color-ichor)' : '#9a031e',
          textShadow: isVampire
            ? '0 0 12px rgba(185,28,28,0.5), 0 0 25px rgba(185,28,28,0.2)'
            : '0 1px 0 rgba(255,255,255,0.05), 0 -1px 2px rgba(0,0,0,0.2)',
        }}>
          {hero.name}
        </h3>
        {hero.title && (
          <p className="text-sm mt-0.5" style={{
            color: isVampire ? '#a85a5a' : '#7a5a3a',
            fontFamily: "'EB Garamond', serif",
            fontStyle: 'italic',
          }}>
            {hero.title}
          </p>
        )}
        <p className="text-[10px] mt-1 uppercase tracking-[0.15em]" style={{
          color: isVampire ? '#2a5a2a' : '#8a7a5a',
          fontFamily: "'Cinzel', serif",
        }}>
          {hero.baseClass}
        </p>
      </div>

      {/* Bonus stats — compact, engraved into card */}
      <div className="flex justify-center gap-3 mb-3 relative z-10">
        {Object.entries(hero.bonusStats).filter(([, v]) => v !== 0).map(([key, val]) => (
          <div key={key} className="text-center px-1">
            <div className="text-base font-bold" style={{
              color: isVampire ? 'var(--color-ichor)' : '#6a4a2a',
            }}>
              +{val}
            </div>
            <div className="text-[8px] uppercase tracking-[0.1em] opacity-45" style={{
              fontFamily: "'Cinzel', serif",
            }}>{key}</div>
          </div>
        ))}
      </div>

      {/* Ability plaque — pressed into bronze/obsidian */}
      <div className="mt-3 p-3.5 relative z-10" style={{
        background: isVampire
          ? 'linear-gradient(135deg, rgba(185,28,28,0.06), rgba(127,29,29,0.1))'
          : 'linear-gradient(135deg, rgba(120,90,40,0.08), rgba(120,90,40,0.03))',
        border: isVampire ? '1px solid #3a1a1a' : '1px solid #b08d57',
        boxShadow: isVampire
          ? 'inset 0 0 10px rgba(185,28,28,0.04)'
          : 'inset 0 0 8px rgba(100,70,20,0.06)',
      }}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.1em]" style={{
            color: isVampire ? 'var(--color-ichor)' : '#9a031e',
            fontFamily: "'Cinzel', serif",
            textShadow: isVampire ? '0 0 6px rgba(185,28,28,0.35)' : 'none',
          }}>
            ✧ {hero.ability.name}
          </span>
          <span className="text-[10px] opacity-35 ml-auto">CD: {hero.ability.cooldown}</span>
        </div>
        <p className="text-xs leading-relaxed" style={{
          color: isVampire ? '#a87a7a' : '#4a3a2a',
          fontFamily: "'EB Garamond', serif",
        }}>
          {hero.ability.description}
        </p>
      </div>

      {/* Cost / maintenance — branded footer */}
      <div className="mt-3 text-center relative z-10">
        {hero.cost > 0 ? (
          <span className="text-[10px] uppercase tracking-[0.1em]" style={{
            color: isVampire ? '#8a5a5a' : '#8a7a5a',
            fontFamily: "'Cinzel', serif",
          }}>
            {hero.cost}g &bull; {hero.maintenance}g/turn
          </span>
        ) : hero.vampireHero ? (
          <span className="ichor-text text-[10px] uppercase tracking-[0.1em]">
            ☠ Undead — No Cost — Eternal
          </span>
        ) : null}
      </div>
    </motion.div>
  );
}

function getHeroIcon(baseClass: string, isVampire: boolean): string {
  if (isVampire) {
    const v: Record<string, string> = { INFANTRY: '💀', KNIGHT: '🦇', MAGE: '👁', ARCHER: '🦴' };
    return v[baseClass] || '☠';
  }
  const i: Record<string, string> = { INFANTRY: '⚔', SPEAR: '🔱', KNIGHT: '🐎', ARCHER: '🏹', MAGE: '✧', HEALER: '✚', ENGINEER: '⚒' };
  return i[baseClass] || '⚔';
}
