'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import HomeLogo from '@/components/HomeLogo';
import { BLUE_HEROES, VAMPIRE_HEROES } from '@/data/heroes';
import { ROMAN_UNITS, ORC_UNITS, SHIP_CLASSES } from '@/data/units';
import type { Hero } from '@/data/heroes';
import type { UnitClass } from '@/data/units';

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: '📜' },
  { id: 'getting-started', label: 'Getting Started', icon: '🚀' },
  { id: 'terrain', label: 'Map & Terrain', icon: '🗺️' },
  { id: 'units', label: 'Units', icon: '⚔️' },
  { id: 'combat', label: 'Combat', icon: '💥' },
  { id: 'heroes', label: 'Heroes', icon: '👑' },
  { id: 'undead', label: 'The Undead', icon: '💀' },
  { id: 'naval', label: 'Naval System', icon: '🚢' },
  { id: 'economy', label: 'Economy', icon: '💰' },
  { id: 'production', label: 'Production', icon: '🏗️' },
  { id: 'options', label: 'Game Options', icon: '⚙️' },
  { id: 'controls', label: 'Controls', icon: '⌨️' },
  { id: 'tips', label: 'Pro Tips', icon: '💡' },
] as const;

function HeroPortraitCard({ hero, variant }: { hero: Hero; variant: 'blue' | 'vampire' }) {
  const [hover, setHover] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isVampire = variant === 'vampire';
  const portraitSrc = `/assets/${hero.portraitKey}.png`;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 relative flex items-center justify-center bg-black/40"
        style={{
          borderColor: isVampire ? '#3a1a1a' : '#8a6a30',
          boxShadow: hover ? (isVampire ? '0 0 20px rgba(185,28,28,0.4)' : '0 0 20px rgba(176,141,87,0.4)') : 'none',
        }}
      >
        {!imgError ? (
          <Image
            src={portraitSrc}
            alt={hero.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: isVampire ? 'var(--color-obsidian-light)' : 'rgba(196,168,122,0.2)' }}>
            {isVampire ? '☠' : '⚔'}
          </div>
        )}
      </div>
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-50 w-72 p-4 rounded border shadow-xl"
            style={{
              background: isVampire ? 'linear-gradient(135deg, #0a1a0a, #141418)' : 'linear-gradient(135deg, #2a2520, #1a1814)',
              borderColor: isVampire ? '#3a1a1a' : '#8a6a30',
              fontFamily: "'EB Garamond', serif",
            }}
          >
            <div className="font-bold text-lg mb-1" style={{ color: isVampire ? 'var(--color-ichor)' : '#b08d57', fontFamily: "'Cinzel', serif" }}>
              {hero.name}{hero.title ? `, ${hero.title}` : ''}
            </div>
            <div className="text-[10px] uppercase text-parchment-dark/80 mb-2 tracking-widest">Base: {hero.baseClass} · Cost: {hero.cost}g</div>
            
            <div className="text-xs uppercase text-parchment-dark/80 mb-1 font-bold">Aura (Range: {hero.aura.range})</div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-parchment/90 mb-3">
              {Object.entries(hero.aura.bonuses).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1">
                  <span className="text-bronze-light font-bold">+{v}</span>
                  <span className="opacity-70">{k.toUpperCase()}</span>
                </span>
              ))}
            </div>
            
            <div className="pt-2 border-t" style={{ borderColor: isVampire ? '#3a1a1a' : '#6a5020' }}>
              <div className="text-xs uppercase text-parchment-dark/80 mb-1 font-bold">Ability: {hero.ability.name}</div>
              <p className="text-sm leading-snug text-parchment/95 italic">&quot;{hero.ability.description}&quot;</p>
              <div className="text-[10px] mt-2 opacity-60 flex justify-between">
                <span>Cooldown: {hero.ability.cooldown} turns</span>
                <span>Range: {hero.ability.range}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UnitCard({ unit, variant = 'blue' }: { unit: UnitClass; variant?: 'blue' | 'red' | 'orc' }) {
  const [hover, setHover] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  const isRedArcher = unit.key === 'unit-archer' && variant === 'red';
  const isRedKnight = unit.key === 'unit-knight' && variant === 'red';
  const isBlueArcher = unit.key === 'unit-archer' && variant === 'blue';
  const isBlueKnight = unit.key === 'unit-knight' && variant === 'blue';
  
  // Orc Scaling
  const isOrcInfantry = unit.key === 'unit-orc-infantry-no-bg' && variant === 'orc';
  const isOrcMage = unit.key === 'unit-orc-mage-no-bg' && variant === 'orc';
  const isOrcRider = unit.key === 'unit-orc-rider-no-bg' && variant === 'orc';
  const isOrcSpearman = unit.key === 'unit-orc-spear-no-bg' && variant === 'orc';
  const isOrcHealer = unit.key === 'unit-orc-healer-no-bg' && variant === 'orc';

  // Mapping unit key to the correct sprite filename
  const spriteBase = unit.key.replace('-no-bg', '');
  const spriteSrc = `/assets/${spriteBase}-${variant}.png`;
  
  // Fallback for orcs or special cases
  const finalSrc = unit.faction === 'orc' ? `/assets/${spriteBase}.png` : spriteSrc;

  return (
    <div 
      className="bronze-frame p-4 bg-black/40 rounded-lg flex flex-col items-center text-center transition-all duration-300 hover:bg-black/60"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="w-16 h-16 relative mb-3 flex items-center justify-center">
        {!imgError ? (
          <Image 
            src={finalSrc} 
            alt={unit.name} 
            width={64} 
            height={64} 
            className={`object-contain transition-transform 
              ${isRedArcher ? 'scale-[1.6]' : ''} 
              ${isRedKnight ? 'scale-[1.2]' : ''}
              ${isBlueArcher ? 'scale-[1.2]' : ''}
              ${isBlueKnight ? 'scale-[1.2]' : ''}
              ${isOrcInfantry ? 'scale-[1.8]' : ''}
              ${isOrcMage ? 'scale-[2.4]' : ''}
              ${isOrcRider ? 'scale-[2.0]' : ''}
              ${isOrcSpearman ? 'scale-[2.0]' : ''}
              ${isOrcHealer ? 'scale-[1.22]' : ''}
            `}
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-3xl">⚔️</div>
        )}
      </div>
      <h3 className="font-bold text-bronze-light uppercase tracking-wider text-sm mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
        {unit.name}
      </h3>
      <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-[10px] text-parchment/70 font-mono w-full">
        <div className="flex flex-col">
          <span className="text-white font-bold">{unit.stats.hp}</span>
          <span>HP</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold">{unit.stats.atk}</span>
          <span>ATK</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold">{unit.stats.def}</span>
          <span>DEF</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold">{unit.range}</span>
          <span>RNG</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold">{unit.moves}</span>
          <span>MOV</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold">{unit.cost}g</span>
          <span>GOLD</span>
        </div>
      </div>
      {hover && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 pt-3 border-t border-bronze-dark/30 text-xs text-parchment/80 italic leading-snug"
        >
          {unit.description}
        </motion.div>
      )}
    </div>
  );
}

function TerrainTable() {
  const terrains = [
    { name: 'Grass', img: 'tile-grass.png', cost: '1', effect: 'Standard ground. Smells like victory.' },
    { name: 'Forest', img: 'tile-forest.png', cost: '2', effect: '25% damage reduction. Great for hiding from taxes and arrows.' },
    { name: 'Mountain', img: 'tile-mountain.png', cost: '∞', effect: 'Impassable. Only for mountain goats and very lost mages.' },
    { name: 'Sand', img: 'tile-sand.png', cost: '2', effect: 'It\'s coarse and rough and gets everywhere.' },
    { name: 'Road', img: 'tile-road.png', cost: '0.5', effect: 'Fast travel. Built by exhausted Engineers.' },
    { name: 'Bridge', img: 'tile-bridge.png', cost: '0.5', effect: '25% MORE damage taken. Basically a &quot;kick me&quot; sign for units.' },
    { name: 'Water', img: 'tile-water.png', cost: 'Ship Only', effect: 'Moist. Land units will drown. Use a boat.' },
    { name: 'Fort', img: 'tile-fort.png', cost: '1', effect: '50% damage reduction, +3 DEF, heals 20% HP. Like a spa, but with swords.' },
    { name: 'Port', img: 'tile-port.png', cost: '1', effect: 'Heals 10% HP. Repairs ships. Smells of salt and regret.' },
    { name: 'Orc Camp', img: 'tile-orc-camp.png', cost: '1', effect: 'Spawns Orcs. Highly recommended to not live here.' },
  ];

  return (
    <div className="overflow-x-auto bronze-frame p-1 rounded-sm bg-black/40">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-bronze-dark/50 text-[10px] uppercase tracking-widest text-bronze" style={{ fontFamily: "'Cinzel', serif" }}>
            <th className="p-4">Terrain</th>
            <th className="p-4">Look</th>
            <th className="p-4 text-center">Cost</th>
            <th className="p-4">Effect</th>
          </tr>
        </thead>
        <tbody className="text-sm font-serif">
          {terrains.map((t) => (
            <tr key={t.name} className="border-b border-bronze-dark/20 last:border-0 hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-parchment">{t.name}</td>
              <td className="p-4">
                <div className="w-12 h-12 relative border border-bronze-dark/30 rounded overflow-hidden bg-black/60 flex items-center justify-center">
                  <Image src={`/assets/${t.img}`} alt={t.name} width={48} height={48} className="object-contain" unoptimized />
                </div>
              </td>
              <td className="p-4 text-center text-bronze-light font-mono font-bold">{t.cost}</td>
              <td className="p-4 text-parchment/80 leading-snug">{t.effect}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ShipCard({ ship }: { ship: typeof SHIP_CLASSES[0] }) {
  const [hover, setHover] = useState(false);
  
  return (
    <div 
      className="bronze-frame p-6 bg-black/40 rounded-lg flex flex-col transition-all duration-300 hover:scale-[1.02] hover:bg-black/60"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-bronze" style={{ fontFamily: "'Cinzel', serif" }}>{ship.name}</h3>
          <p className="text-xs text-parchment-dark/70 italic">&quot;{ship.description}&quot;</p>
        </div>
        <div className="w-16 h-16 relative flex items-center justify-center bg-black/60 rounded border border-bronze-dark/40">
           <Image src={`/assets/${ship.key}-n${ship.tiles > 1 ? '-bow' : ''}.png`} alt={ship.name} width={64} height={64} className="object-contain" unoptimized />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div className="space-y-1">
          <div className="flex justify-between border-b border-bronze-dark/20 pb-1">
            <span className="text-parchment-dark">Hull HP</span>
            <span className="text-white font-bold">{ship.hullHp}</span>
          </div>
          <div className="flex justify-between border-b border-bronze-dark/20 pb-1">
            <span className="text-parchment-dark">Attack</span>
            <span className="text-white font-bold">{ship.shipAtk}</span>
          </div>
          <div className="flex justify-between border-b border-bronze-dark/20 pb-1">
            <span className="text-parchment-dark">Defense</span>
            <span className="text-white font-bold">{ship.shipDef}</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between border-b border-bronze-dark/20 pb-1">
            <span className="text-parchment-dark">Movement</span>
            <span className="text-white font-bold">{ship.moves}</span>
          </div>
          <div className="flex justify-between border-b border-bronze-dark/20 pb-1">
            <span className="text-parchment-dark">Capacity</span>
            <span className="text-white font-bold">{ship.capacity}</span>
          </div>
          <div className="flex justify-between border-b border-bronze-dark/20 pb-1">
            <span className="text-parchment-dark">Bombard</span>
            <span className="text-white font-bold">{ship.bombardRange}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-4 flex justify-between items-center border-t border-bronze-dark/40">
         <span className="text-[10px] uppercase tracking-widest text-parchment-dark">Upkeep: {ship.maintenance}g/turn</span>
         <span className="text-lg font-bold text-bronze-light font-mono">{ship.cost}g</span>
      </div>
    </div>
  );
}

export default function GuidePage() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const opts: IntersectionObserverInit = { rootMargin: '-20% 0px -60% 0px', threshold: 0 };

    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveId(id);
          });
        },
        opts
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    setActiveId(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const SectionHeader = ({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) => (
    <div className="mb-12">
      <div className="flex items-center gap-4 mb-2">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-bronze/40" />
        <h2 
          className="text-3xl md:text-4xl font-black uppercase tracking-tighter" 
          style={{ fontFamily: "'Cinzel', serif", color: 'var(--color-bronze)' }}
        >
          {title}
        </h2>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-bronze/40" />
      </div>
      {subtitle && (
        <p className="text-center text-parchment-dark/70 font-serif italic text-lg">{subtitle}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0a0a0a]">
      {/* Sidebar Navigation - FROZEN on desktop */}
      <aside 
        className="hidden md:flex fixed top-0 left-0 h-screen w-64 border-r flex-col z-40"
        style={{
          background: 'linear-gradient(180deg, #121214, #1a1816)',
          borderColor: 'var(--color-bronze-dark)',
          boxShadow: '4px 0 20px rgba(0,0,0,0.8)',
        }}
      >
        <div className="p-6 border-b border-bronze-dark/30 flex items-center gap-4">
          <HomeLogo />
          <div className="font-bold text-bronze uppercase tracking-widest text-[10px]" style={{ fontFamily: "'Cinzel', serif" }}>
            War Room Manual
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {SECTIONS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="w-full text-left px-6 py-3 transition-all duration-200 flex items-center gap-3 group"
              style={{
                background: activeId === id ? 'rgba(176,141,87,0.15)' : 'transparent',
                color: activeId === id ? 'var(--color-parchment)' : 'var(--color-parchment-dark)',
                fontFamily: "'Cinzel', serif",
              }}
            >
              <span className={`text-lg transition-transform duration-300 ${activeId === id ? 'scale-125' : 'group-hover:scale-110 opacity-50'}`}>
                {icon}
              </span>
              <span className={`text-[11px] uppercase tracking-widest ${activeId === id ? 'font-bold' : ''}`}>
                {label}
              </span>
              {activeId === id && (
                <motion.div 
                  layoutId="active-indicator"
                  className="ml-auto w-1 h-4 bg-bronze rounded-full shadow-[0_0_8px_rgba(176,141,87,0.8)]"
                />
              )}
            </button>
          ))}
          
          <div className="mt-8 px-6 pt-8 border-t border-bronze-dark/20">
             <Link href="/" className="text-[10px] uppercase tracking-[0.2em] text-bronze-light hover:text-white transition-colors flex items-center gap-2">
                <span>←</span> Back to Main Menu
             </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile Top Nav with Hamburger */}
      <nav 
        className="md:hidden fixed top-0 left-0 right-0 h-16 px-4 flex items-center justify-between z-50 border-b"
        style={{
          background: 'rgba(18,18,20,0.98)',
          borderColor: 'var(--color-bronze-dark)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        <HomeLogo />
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-bronze border border-bronze/30 rounded"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden bg-[#121214] border-b p-6 flex flex-col gap-2 max-h-[80vh] overflow-y-auto"
            style={{ borderColor: 'var(--color-bronze-dark)' }}
          >
             {SECTIONS.map(({ id, label, icon }) => (
               <button
                 key={id}
                 onClick={() => scrollTo(id)}
                 className="text-left p-4 rounded border border-bronze-dark/20 bg-black/40 flex items-center gap-4 transition-colors hover:bg-bronze/10"
                 style={{ 
                   fontFamily: "'Cinzel', serif",
                   color: activeId === id ? 'var(--color-parchment)' : 'var(--color-parchment-dark)',
                   borderColor: activeId === id ? 'var(--color-bronze)' : 'rgba(176,141,87,0.2)'
                 }}
               >
                 <span className="text-xl">{icon}</span>
                 <span className="text-xs uppercase tracking-widest">{label}</span>
               </button>
             ))}
             <Link href="/" className="mt-4 p-4 text-center text-[10px] uppercase tracking-widest text-bronze border border-dashed border-bronze/30 rounded">
                ← Back to Main Menu
             </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area - Shifted on desktop for frozen sidebar */}
      <main className="flex-1 md:ml-64 px-6 md:px-12 py-24 md:py-20 custom-scrollbar overflow-x-hidden">
        
        {/* HERO HEADER */}
        <section id="overview" ref={(el) => { sectionRefs.current['overview'] = el; }} className="max-w-4xl mx-auto mb-32 scroll-mt-24">
          <div className="text-center mb-12">
            <div className="relative inline-block mb-8">
               <Image src="/assets/insularimperium.png" alt="Insular Imperium" width={400} height={150} className="drop-shadow-[0_0_20px_rgba(176,141,87,0.3)]" unoptimized />
               <div className="absolute -inset-4 bg-bronze/5 blur-3xl rounded-full -z-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6" style={{ fontFamily: "'Cinzel', serif", color: 'var(--color-bronze)' }}>
               Commander&apos;s Field Guide
            </h1>
            <p className="text-xl md:text-2xl text-parchment font-serif leading-relaxed italic opacity-90 max-w-2xl mx-auto">
               &quot;Veni, Vidi, Vici... and then I signed a book deal.&quot;
            </p>
          </div>
          
          <div className="bronze-frame p-8 bg-black/60 rounded-sm leading-relaxed text-parchment/90 space-y-6 font-serif text-lg">
             <p>
               Welcome to <span className="text-bronze font-bold">Insular Imperium</span>, a turn-based strategy game where you lead the glorious Blue Legion against the slightly-less-glorious Red AI and the definitely-not-glorious Orc tribes. 
             </p>
             <p>
               Your goal? Total domination of the archipelago. Whether you prefer crushing your enemies under the hooves of a cavalry charge or slowly suffocating them with superior road infrastructure (the Roman way!), this guide will teach you how to not die in the first three turns.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div className="border-l-2 border-bronze/30 pl-6 bg-white/5 p-4 rounded-r">
                   <h4 className="text-bronze font-bold uppercase text-sm mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Victory Condition A</h4>
                   <p className="text-sm italic text-parchment/70">Defeat all units. Leave nothing but dust and very small pebbles.</p>
                </div>
                <div className="border-l-2 border-bronze/30 pl-6 bg-white/5 p-4 rounded-r">
                   <h4 className="text-bronze font-bold uppercase text-sm mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Victory Condition B</h4>
                   <p className="text-sm italic text-parchment/70">Capture all Forts and Ports. Turn the map blue through superior real estate management.</p>
                </div>
             </div>
          </div>
        </section>

        {/* GETTING STARTED */}
        <section id="getting-started" ref={(el) => { sectionRefs.current['getting-started'] = el; }} className="max-w-5xl mx-auto mb-32 scroll-mt-24">
          <SectionHeader id="getting-started" title="Getting Started" subtitle="From the Main Menu to the Massacre." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
                {[
                  { step: 1, title: 'Choose Your Difficulty', desc: 'Easy is for learning. Normal is for players. Hard is for people who enjoy being shouted at by pixels.' },
                  { step: 2, title: 'Pick Your Map Size', desc: 'Micro (25x25) for a quick coffee break, or Large (100x100) if you don\'t plan on sleeping this week.' },
                  { step: 3, title: 'Recruit Heroes', desc: 'Pick up to 2 heroes. They are like regular units, but with better hair and magical powers.' },
                  { step: 4, title: 'Assemble Your Army', desc: 'Spend your 2,500g wisely. 100 healers might seem funny, but they won\'t win you a war.' },
                  { step: 5, title: 'Naval Deployment', desc: 'Place your ships. Try to put them in the water. Land-ships are notably less effective.' },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-full border border-bronze flex items-center justify-center font-bold text-bronze-light flex-shrink-0 group-hover:bg-bronze group-hover:text-black transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
                      {s.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-parchment uppercase tracking-wider text-sm mb-1" style={{ fontFamily: "'Cinzel', serif" }}>{s.title}</h4>
                      <p className="text-sm text-parchment-dark/80 leading-snug">{s.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
             <div className="relative">
                <div className="absolute -inset-4 bg-bronze/10 blur-3xl rounded-full" />
                <Image src="/assets/assemble your army.png" alt="Army Assembly" width={600} height={400} className="relative bronze-frame rounded shadow-2xl" unoptimized />
                <div className="absolute -bottom-6 -right-6 bg-black/90 p-4 border border-bronze/30 rounded backdrop-blur-md max-w-[200px] shadow-2xl">
                   <p className="text-[10px] text-bronze-light uppercase font-bold mb-1">Commander&apos;s Note:</p>
                   <p className="text-[11px] text-parchment italic">&quot;Budget management is the most dangerous spell a general can cast.&quot;</p>
                </div>
             </div>
          </div>
        </section>

        {/* MAP & TERRAIN */}
        <section id="terrain" ref={(el) => { sectionRefs.current['terrain'] = el; }} className="max-w-5xl mx-auto mb-32 scroll-mt-24">
          <SectionHeader id="terrain" title="Geography & Cartography" subtitle="Know where to stand, and more importantly, where not to stand." />
          <p className="text-center text-parchment/70 mb-12 max-w-2xl mx-auto font-serif italic leading-relaxed">
             Terrain isn&apos;t just scenery; it&apos;s a weapon. Use forests for cover, roads for speed, and avoid bridges unless you really, really like being shot by everyone at once.
          </p>
          <TerrainTable />
        </section>

        {/* UNITS */}
        <section id="units" ref={(el) => { sectionRefs.current['units'] = el; }} className="max-w-6xl mx-auto mb-32 scroll-mt-24">
          <SectionHeader id="units" title="The Legion & The Horde" subtitle="Your soldiers. Their targets. The statistics of war." />
          
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-bronze-light mb-8 flex items-center gap-4" style={{ fontFamily: "'Cinzel', serif" }}>
               <span className="w-8 h-[2px] bg-bronze/30" />
               Blue Legion (The Good Guys)
               <span className="w-8 h-[2px] bg-bronze/30" />
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
               {ROMAN_UNITS.map((u) => <UnitCard key={u.key} unit={u} variant="blue" />)}
            </div>
          </div>

          <div className="mb-20">
            <h3 className="text-2xl font-bold text-red-700 mb-8 flex items-center gap-4" style={{ fontFamily: "'Cinzel', serif" }}>
               <span className="w-8 h-[2px] bg-red-900/30" />
               Red Empire (The Mirror Match)
               <span className="w-8 h-[2px] bg-red-900/30" />
            </h3>
            <p className="text-parchment/60 italic mb-8 border-l-2 border-red-900/40 pl-4 text-sm">
               The Red Empire uses the exact same technology as you, but with more anger and a questionable taste in primary colors. They have the same stats, the same units, and the same desire to see you fail.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
               {ROMAN_UNITS.slice(0, 5).map((u) => <UnitCard key={u.key + '-red'} unit={u} variant="red" />)}
               <div className="flex items-center justify-center text-parchment/40 text-xs italic bg-white/5 rounded border border-dashed border-white/10 p-4">...and more...</div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-green-700 mb-8 flex items-center gap-4" style={{ fontFamily: "'Cinzel', serif" }}>
               <span className="w-8 h-[2px] bg-green-900/30" />
               Orc Tribes (The Wildcards)
               <span className="w-8 h-[2px] bg-green-900/30" />
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
               {ORC_UNITS.map((u) => <UnitCard key={u.key} unit={u} variant="orc" />)}
            </div>
            <div className="mt-8 p-6 bg-green-900/10 border border-green-900/30 rounded">
               <h4 className="text-green-500 font-bold uppercase text-xs mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Special Rule: Orcish Frenzy</h4>
               <p className="text-sm text-parchment/80 leading-snug">
                 Orcs get <span className="text-green-400 font-bold">+50% ATK</span> when their HP drops below 50%. Do not &quot;poke&quot; an orc. Either finish them or leave them alone. A wounded orc is a very fast way to lose a unit.
               </p>
            </div>
          </div>
        </section>

        {/* COMBAT */}
        <section id="combat" ref={(el) => { sectionRefs.current['combat'] = el; }} className="max-w-5xl mx-auto mb-32 scroll-mt-24">
          <SectionHeader id="combat" title="Art of War" subtitle="How to hit things until they stop moving." />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bronze-frame p-6 bg-black/40">
                <h4 className="text-bronze font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                   <span className="text-xl">🧮</span> The Formula
                </h4>
                <div className="bg-black/60 p-4 rounded font-mono text-sm text-center mb-4 border border-white/5">
                   Damage = ATK - DEF
                </div>
                <p className="text-xs text-parchment/70 leading-relaxed italic">
                  Simple, right? Just make sure your ATK is bigger than their DEF. If you hit a 50 DEF fort with 10 ATK, you&apos;ll deal 1 damage. We call that &quot;tactical futility.&quot;
                </p>
             </div>
             
             <div className="bronze-frame p-6 bg-black/40">
                <h4 className="text-bronze font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                   <span className="text-xl">🛡️</span> Counter-Attacks
                </h4>
                <p className="text-sm text-parchment/80 leading-relaxed mb-4">
                  If the defender survives, they hit back at <span className="text-bronze-light font-bold">50% damage</span>.
                </p>
                <p className="text-xs text-parchment/60 italic border-t border-bronze-dark/20 pt-4">
                  Pro-tip: Archers and Mages don&apos;t trigger counters if they shoot from outside the enemy&apos;s range. Cowardice pays off!
                </p>
             </div>

             <div className="bronze-frame p-6 bg-black/40">
                <h4 className="text-bronze font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                   <span className="text-xl">🤝</span> Flanking
                </h4>
                <p className="text-sm text-parchment/80 leading-relaxed mb-4">
                  Surround your enemy! More units adjacent to a target means <span className="text-bronze-light font-bold">higher damage</span> and <span className="text-bronze-light font-bold">weaker counter-attacks</span>.
                </p>
                <div className="text-[10px] uppercase tracking-widest text-parchment-dark bg-bronze/10 px-2 py-1 inline-block rounded">
                  Unity is Strength
                </div>
             </div>
          </div>
          
          <div className="mt-12 p-8 border-2 border-dashed border-bronze-dark/30 rounded-lg flex flex-col md:flex-row items-center gap-8 bg-white/5">
             <div className="w-24 h-24 flex-shrink-0 bg-bronze/10 rounded-full flex items-center justify-center text-5xl border border-bronze/20 shadow-inner">⚡</div>
             <div>
                <h4 className="text-xl font-bold text-parchment mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Leveling Up</h4>
                <p className="text-parchment/70 leading-relaxed italic">
                  Units gain 10 EXP per hit and 25 EXP per kill. Leveling up increases their base stats. Keep your veterans alive—a Level 5 Spearman is worth more than a handful of fresh recruits who haven&apos;t even learned which end of the spear to hold yet.
                </p>
             </div>
          </div>
        </section>

        {/* HEROES */}
        <section id="heroes" ref={(el) => { sectionRefs.current['heroes'] = el; }} className="max-w-6xl mx-auto mb-32 scroll-mt-24">
          <SectionHeader id="heroes" title="Legendary Heroes" subtitle="Special units for special commanders." />
          <div className="text-center mb-12">
            <p className="max-w-2xl mx-auto text-parchment/80 italic font-serif leading-relaxed mb-8">
               Heroes aren&apos;t just powerful; they have <span className="text-bronze font-bold">Auras</span>. Any friendly unit within 4 tiles of a hero gets massive stat boosts. Position your hero in the middle of your army and watch as your peasants suddenly fight like demigods.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
               {BLUE_HEROES.map((h) => <HeroPortraitCard key={h.id} hero={h} variant="blue" />)}
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-bronze-dark">Hover for details • Click to recruit (in-game)</p>
          </div>
        </section>

        {/* UNDEAD */}
        <section id="undead" ref={(el) => { sectionRefs.current['undead'] = el; }} className="max-w-5xl mx-auto mb-32 scroll-mt-24">
           <SectionHeader id="undead" title="The Undead Menace" subtitle="Death is just a temporary career setback." />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <p className="text-parchment/90 font-serif leading-relaxed">
                   When the moon turns blood-red, the <span className="text-red-600 font-bold">Vampire Lords</span> arrive. These aren&apos;t your friendly neighborhood vampires; they lead legions of skeletal warriors and have a nasty habit of turning your fallen soldiers into their new best friends.
                 </p>
                 <div className="p-4 border-l-4 border-red-900 bg-red-900/20 text-sm rounded-r">
                    <span className="text-red-500 font-bold uppercase block mb-1">Corruption Mechanic</span>
                    Red units within 6 tiles of a Vampire Hero have a 50% chance to turn <span className="text-green-500">Undead</span>. Undead units have 1.5x stats. Yes, it&apos;s unfair. No, we aren&apos;t changing it.
                 </div>
                 <div className="flex gap-4">
                    {VAMPIRE_HEROES.map((h) => <HeroPortraitCard key={h.id} hero={h} variant="vampire" />)}
                 </div>
              </div>
              <div className="relative group">
                 <Image src="/assets/hero-tiberius-painting.png" alt="Tiberius" width={500} height={600} className="rounded-lg shadow-2xl filter grayscale contrast-125 border border-red-900/30" unoptimized />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 rounded-lg" />
                 <div className="absolute bottom-6 left-6 right-6">
                    <h4 className="text-red-600 font-black text-2xl uppercase italic" style={{ fontFamily: "'Cinzel', serif" }}>Tiberius</h4>
                    <p className="text-xs text-parchment/80 font-serif italic">He doesn&apos;t want your gold. He wants your bones.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* NAVAL SYSTEM */}
        <section id="naval" ref={(el) => { sectionRefs.current['naval'] = el; }} className="max-w-6xl mx-auto mb-32 scroll-mt-24">
           <SectionHeader id="naval" title="Naval Warfare" subtitle="How to not sink in 3 easy steps." />
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {SHIP_CLASSES.map((s) => <ShipCard key={s.key} ship={s} />)}
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-blue-900/10 p-10 border border-blue-900/30 rounded-lg shadow-inner">
              <div>
                 <h4 className="text-xl font-bold text-blue-400 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Boarding & Capacity</h4>
                 <p className="text-sm text-parchment/80 leading-relaxed space-y-4">
                    Ships have <span className="text-blue-200 font-bold">Deck Slots</span> and <span className="text-blue-200 font-bold">Hold Capacity</span>. 
                    <br/><br/>
                    Units on deck can shoot ballistae or throw insults at the enemy. Units in the hold are safe from combat but are basically just cargo. 
                    <br/><br/>
                    <span className="text-red-400 font-bold">WARNING:</span> If a ship sinks with units on board, they have 3 turns to evacuate to land or another ship before they become fish food.
                 </p>
              </div>
              <div className="flex items-center justify-center">
                 <div className="relative w-full aspect-video bronze-frame overflow-hidden rounded shadow-2xl">
                    <Image src="/assets/naval combat 1.png" alt="Naval Combat" fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-bold uppercase tracking-widest">
                       Action View
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* ECONOMY */}
        <section id="economy" ref={(el) => { sectionRefs.current['economy'] = el; }} className="max-w-5xl mx-auto mb-32 scroll-mt-24">
          <SectionHeader id="economy" title="The Treasury" subtitle="War is expensive. Winning is slightly more expensive." />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
             <div className="p-6 border border-bronze-dark/30 rounded bg-black/40 text-center shadow-lg">
                <div className="text-3xl mb-2">📥</div>
                <div className="text-bronze font-bold uppercase text-[10px] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Income</div>
                <div className="text-parchment/70 text-xs">20g per Fort tile owned. <br/> Capture Orc Camps for loot!</div>
             </div>
             <div className="p-6 border border-bronze-dark/30 rounded bg-black/40 text-center shadow-lg">
                <div className="text-3xl mb-2">📤</div>
                <div className="text-bronze font-bold uppercase text-[10px] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Expenses</div>
                <div className="text-parchment/70 text-xs">Every unit has upkeep. <br/> Don&apos;t build more than you can feed.</div>
             </div>
             <div className="p-6 border border-bronze-dark/30 rounded bg-black/40 text-center shadow-lg">
                <div className="text-3xl mb-2">💎</div>
                <div className="text-bronze font-bold uppercase text-[10px] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Loot</div>
                <div className="text-parchment/70 text-xs">25-100g for every tile captured. <br/> 200g for a full Fort!</div>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-12 items-center">
             <div className="flex-1">
                <h4 className="text-xl font-bold text-parchment mb-4" style={{ fontFamily: "'Cinzel', serif" }}>The Maintenance Death Spiral</h4>
                <p className="text-parchment/80 font-serif leading-relaxed italic border-l-2 border-bronze/30 pl-6">
                  &quot;I have 50 Knights! Why am I bankrupt?&quot; - A Very Poor General.
                  <br/><br/>
                  Knights cost 12g per turn. If you own no territory, you will lose money every turn. When your gold hits zero, you can no longer build units, repair buildings, or buy that fancy new Trireme you wanted. Manage your budget or your soldiers will find a new boss who actually pays them.
                </p>
             </div>
             <div className="w-full md:w-80 h-48 relative border-2 border-bronze-dark/40 rounded overflow-hidden shadow-2xl">
                <Image src="/assets/economy.png" alt="Economy UI" fill className="object-cover" unoptimized />
             </div>
          </div>
        </section>

        {/* PRODUCTION */}
        <section id="production" ref={(el) => { sectionRefs.current['production'] = el; }} className="max-w-5xl mx-auto mb-32 scroll-mt-24">
           <SectionHeader id="production" title="Logistics & Engineering" subtitle="Rome wasn&apos;t built in a day, but we have a deadline." />
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bronze-frame p-8 bg-black/40 shadow-2xl">
                 <h4 className="text-bronze font-bold uppercase text-xs mb-6 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="text-xl">👷</span> Engineer Actions
                 </h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-start border-b border-white/5 pb-4">
                       <div>
                          <span className="text-parchment font-bold block text-sm">Build Road</span>
                          <span className="text-[11px] text-parchment-dark/60 italic">Reduces move cost to 0.5. Very useful for fast retreats.</span>
                       </div>
                       <span className="text-bronze-light font-bold text-sm">10g</span>
                    </div>
                    <div className="flex justify-between items-start border-b border-white/5 pb-4">
                       <div>
                          <span className="text-parchment font-bold block text-sm">Build Workshop</span>
                          <span className="text-[11px] text-parchment-dark/60 italic">Needed for Catapults. Because hitting things with stones is fun.</span>
                       </div>
                       <span className="text-bronze-light font-bold text-sm">150g</span>
                    </div>
                    <div className="flex justify-between items-start border-b border-white/5 pb-4">
                       <div>
                          <span className="text-parchment font-bold block text-sm">Build Castra</span>
                          <span className="text-[11px] text-parchment-dark/60 italic">Mini-fort. 25% damage reduction. Heals 10% HP.</span>
                       </div>
                       <span className="text-bronze-light font-bold text-sm">200g</span>
                    </div>
                    <div className="flex justify-between items-start">
                       <div>
                          <span className="text-parchment font-bold block text-sm">Repair</span>
                          <span className="text-[11px] text-parchment-dark/60 italic">Restores HP to buildings and ships. Essential maintenance.</span>
                       </div>
                       <span className="text-bronze-light font-bold text-sm">Free*</span>
                    </div>
                 </div>
              </div>
              
              <div className="flex flex-col gap-6">
                 <div className="relative aspect-video rounded overflow-hidden bronze-frame shadow-2xl">
                    <Image src="/assets/engineer.png" alt="Engineer at work" fill className="object-cover" unoptimized />
                 </div>
                 <div className="bg-bronze/5 p-6 border-l-4 border-bronze rounded-r bg-black/30">
                    <h4 className="text-bronze-light font-bold text-[10px] uppercase mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Fort Production</h4>
                    <p className="text-xs text-parchment/70 leading-relaxed italic">
                      Large forts (9 tiles) can build any unit. Tiny forts (3 tiles) can only build Infantry. Size matters. If you want a Knight, you need a big castle. If you want a guy with a stick, a small shed will do.
                    </p>
                 </div>
              </div>
           </div>
        </section>

        {/* GAME OPTIONS */}
        <section id="options" ref={(el) => { sectionRefs.current['options'] = el; }} className="max-w-5xl mx-auto mb-32 scroll-mt-24">
           <SectionHeader id="options" title="War Room Options" subtitle="Customizing your conquest." />
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                 <div>
                    <h4 className="text-lg font-bold text-bronze mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Difficulty Levels</h4>
                    <div className="space-y-4">
                       <div className="p-4 border border-white/10 rounded bg-white/5 hover:bg-white/10 transition-colors">
                          <span className="text-bronze-light font-bold uppercase text-[10px]">Easy</span>
                          <p className="text-[11px] text-parchment/70 italic mt-1">AI has 80% HP/ATK. Aggro range is 10 tiles. For commanders who like to win without sweating.</p>
                       </div>
                       <div className="p-4 border border-white/10 rounded bg-white/5 hover:bg-white/10 transition-colors">
                          <span className="text-bronze-light font-bold uppercase text-[10px]">Normal</span>
                          <p className="text-[11px] text-parchment/70 italic mt-1">100% stats. 15 tile aggro range. The intended experience.</p>
                       </div>
                       <div className="p-4 border border-white/10 rounded bg-white/5 hover:bg-white/10 transition-colors">
                          <span className="text-bronze-light font-bold uppercase text-[10px]">Hard</span>
                          <p className="text-[11px] text-parchment/70 italic mt-1">AI has 120% stats. 20 tile aggro range. They will hunt you. They will find you. They will kill you.</p>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="space-y-8">
                 <div>
                    <h4 className="text-lg font-bold text-bronze mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Map Sizes</h4>
                    <div className="grid grid-cols-2 gap-4">
                       {[
                         { size: 'Micro', dim: '25x25', desc: 'Coffee break.' },
                         { size: 'Small', dim: '50x50', desc: 'Lunch break.' },
                         { size: 'Medium', dim: '75x75', desc: 'Standard battle.' },
                         { size: 'Large', dim: '100x100', desc: 'See you next year.' },
                       ].map((m) => (
                         <div key={m.size} className="p-3 border border-white/10 rounded bg-white/5 text-center hover:bg-white/10 transition-colors">
                            <span className="text-parchment font-bold block text-sm">{m.size}</span>
                            <span className="text-[10px] text-bronze-light font-mono">{m.dim}</span>
                            <p className="text-[10px] text-parchment/50 italic mt-1">{m.desc}</p>
                         </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="p-6 bronze-frame bg-black/60 rounded shadow-2xl">
                    <h4 className="text-xs font-bold text-bronze uppercase mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Save & Load</h4>
                    <p className="text-xs text-parchment/80 leading-relaxed font-serif italic">
                       The game features <span className="text-bronze-light font-bold">Quick Save (F5)</span> and <span className="text-bronze-light font-bold">Quick Load (F9)</span>. It also autosaves at the start of every turn, just in case you make a decision you immediately regret (like standing on a bridge).
                    </p>
                 </div>
              </div>
           </div>
        </section>

        {/* CONTROLS */}
        <section id="controls" ref={(el) => { sectionRefs.current['controls'] = el; }} className="max-w-4xl mx-auto mb-32 scroll-mt-24">
           <SectionHeader id="controls" title="The Command Deck" subtitle="Master the interface, master the world." />
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/60 border border-bronze-dark/30 p-8 rounded shadow-2xl">
                 <h4 className="text-lg font-bold text-bronze mb-6" style={{ fontFamily: "'Cinzel', serif" }}>Mouse</h4>
                 <ul className="space-y-4 text-sm font-serif">
                    <li className="flex justify-between border-b border-white/5 pb-2">
                       <span className="text-parchment-dark">Left Click</span>
                       <span className="text-white">Select / Move / Attack</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2">
                       <span className="text-parchment-dark">Right Click</span>
                       <span className="text-white">Cancel / Deselect</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2">
                       <span className="text-parchment-dark">Scroll Wheel</span>
                       <span className="text-white">Zoom In / Out</span>
                    </li>
                    <li className="flex justify-between">
                       <span className="text-parchment-dark">Click & Drag</span>
                       <span className="text-white">Pan Camera</span>
                    </li>
                 </ul>
              </div>
              
              <div className="bg-black/60 border border-bronze-dark/30 p-8 rounded shadow-2xl">
                 <h4 className="text-lg font-bold text-bronze mb-6" style={{ fontFamily: "'Cinzel', serif" }}>Keyboard</h4>
                 <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm font-serif">
                    <div className="flex gap-2 items-center">
                       <kbd className="px-2 py-1 bg-white/10 rounded text-[9px] font-mono border border-white/20 text-bronze-light">WASD</kbd>
                       <span className="text-parchment/70 text-[11px]">Pan Map</span>
                    </div>
                    <div className="flex gap-2 items-center">
                       <kbd className="px-2 py-1 bg-white/10 rounded text-[9px] font-mono border border-white/20 text-bronze-light">SPACE</kbd>
                       <span className="text-parchment/70 text-[11px]">End Turn</span>
                    </div>
                    <div className="flex gap-2 items-center">
                       <kbd className="px-2 py-1 bg-white/10 rounded text-[9px] font-mono border border-white/20 text-bronze-light">TAB</kbd>
                       <span className="text-parchment/70 text-[11px]">Next Unit</span>
                    </div>
                    <div className="flex gap-2 items-center">
                       <kbd className="px-2 py-1 bg-white/10 rounded text-[9px] font-mono border border-white/20 text-bronze-light">D</kbd>
                       <span className="text-parchment/70 text-[11px]">Defend (+2 DEF)</span>
                    </div>
                    <div className="flex gap-2 items-center">
                       <kbd className="px-2 py-1 bg-white/10 rounded text-[9px] font-mono border border-white/20 text-bronze-light">F5/F9</kbd>
                       <span className="text-parchment/70 text-[11px]">Save/Load</span>
                    </div>
                    <div className="flex gap-2 items-center">
                       <kbd className="px-2 py-1 bg-white/10 rounded text-[9px] font-mono border border-white/20 text-bronze-light">SHIFT</kbd>
                       <span className="text-parchment/70 text-[11px]">View Terrain</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* PRO TIPS */}
        <section id="tips" ref={(el) => { sectionRefs.current['tips'] = el; }} className="max-w-4xl mx-auto mb-32 scroll-mt-24">
           <SectionHeader id="tips" title="Commander&apos;s Wisdom" subtitle="Advice from people who survived longer than you." />
           
           <div className="space-y-4">
              {[
                { tip: 'Spearmen are Knight-Shredders', text: 'Spearmen take half damage from Knights and deal massive bonus damage to them. If you see a horse, bring a spear. If you see a spear, maybe don\'t bring a horse.' },
                { tip: 'The Catapult Meta', text: 'Catapults deal 100% bonus damage to forts. Trying to capture a fort with just infantry is like trying to eat a steak with a spoon. It\'s possible, but it\'s painful and everyone will laugh at you.' },
                { tip: 'Hero Auras Stack', text: 'If you have two heroes close together, their auras stack. You can create a literal "Death Ball" of soldiers that are basically invincible. It\'s not cheese, it\'s "Tactical Concentration."' },
                { tip: 'Roads Win Wars', text: 'An army that moves twice as fast is twice as dangerous. Build roads. Your units will thank you. Your enemies will hate you. Your shoes will last longer.' },
                { tip: 'Protect the Healers', text: 'The AI hates your Healers. They will go out of their way to kill them. Surround your Healers with beefy Infantry. A dead healer heals exactly zero people.' },
                { tip: 'Bridge are Traps', text: 'Seriously. Don\'t end your turn on a bridge. You take 25% more damage. You are a target. You are a pincushion. Stay on the grass.' },
              ].map((t, idx) => (
                <div key={idx} className="p-6 border-b border-white/5 flex gap-6 hover:bg-white/5 transition-colors rounded">
                   <div className="text-2xl text-bronze-light opacity-50">✦</div>
                   <div>
                      <h4 className="font-bold text-bronze uppercase tracking-widest text-[10px] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>{t.tip}</h4>
                      <p className="text-xs text-parchment/70 italic font-serif leading-relaxed">{t.text}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* FOOTER CTA */}
        <section className="text-center py-20 border-t border-bronze-dark/30">
           <h2 className="text-3xl font-bold text-bronze mb-8" style={{ fontFamily: "'Cinzel', serif" }}>Ready to Lead?</h2>
           <div className="flex flex-wrap justify-center gap-6">
              <Link href="/" className="px-8 py-3 rounded border border-bronze text-bronze hover:bg-bronze hover:text-black transition-all font-bold uppercase tracking-widest text-xs" style={{ fontFamily: "'Cinzel', serif" }}>
                 Main Menu
              </Link>
              <Link href="/features" className="px-8 py-3 rounded bg-bronze text-black hover:bg-bronze-light transition-all font-bold uppercase tracking-widest text-xs shadow-[0_4px_20px_rgba(176,141,87,0.3)]" style={{ fontFamily: "'Cinzel', serif" }}>
                 Game Features
              </Link>
           </div>
        </section>

      </main>

      <style jsx global>{`
        .bronze-frame {
          border: 2px solid var(--color-bronze-dark);
          box-shadow: inset 0 0 40px rgba(0,0,0,0.8), 0 10px 40px rgba(0,0,0,0.8);
          position: relative;
        }
        .bronze-frame::after {
          content: '';
          position: absolute;
          inset: 1px;
          border: 1px solid rgba(176,141,87,0.15);
          pointer-events: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-bronze-dark);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-bronze);
        }
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=EB+Garamond:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
    </div>
  );
}
