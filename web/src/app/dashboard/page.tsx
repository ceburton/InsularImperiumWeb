'use client';

import { useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ROMAN_UNITS, ORC_UNITS } from '@/data/units';
import { BLUE_HEROES, VAMPIRE_HEROES } from '@/data/heroes';
import { SHIP_CLASSES } from '@/data/units';
import UnitCard from '@/components/UnitCard';
import HeroCard from '@/components/HeroCard';
import HeroDetail from '@/components/HeroDetail';
import UnitDetail from '@/components/UnitDetail';
import ShipCard from '@/components/ShipCard';
import ScrollReveal from '@/components/ScrollReveal';
import type { UnitClass } from '@/data/units';
import type { Hero } from '@/data/heroes';

type TabKey = 'units' | 'heroes' | 'vampires' | 'fleet';

interface NavItem {
  key: TabKey;
  label: string;
  sigil: string;
  subtitle: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'units', label: 'Field Reports', sigil: '⚔', subtitle: 'Legions & Clans' },
  { key: 'heroes', label: 'Blue Heroes', sigil: '🏛', subtitle: 'Champions of Rome' },
  { key: 'vampires', label: 'Vampire Clan', sigil: '☠', subtitle: 'The Undead Conclave' },
  { key: 'fleet', label: 'Naval Fleet', sigil: '⚓', subtitle: 'Imperial Navy' },
];

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabKey) || 'units';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [selectedUnit, setSelectedUnit] = useState<UnitClass | null>(null);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [heroVariant, setHeroVariant] = useState<'blue' | 'vampire'>('blue');

  const handleHeroClick = useCallback((hero: Hero, variant: 'blue' | 'vampire') => {
    setSelectedHero(hero);
    setHeroVariant(variant);
  }, []);

  // Stone grinding transition — heavier, with brightness dip
  const tabTransition = {
    initial: { x: 60, opacity: 0, filter: 'brightness(0.7)' },
    animate: { x: 0, opacity: 1, filter: 'brightness(1)' },
    exit: { x: -60, opacity: 0, filter: 'brightness(0.7)' },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <div className="marble-bg min-h-screen flex">
      {/* ══════════ LEFT NAV — Heavy Wooden Placard Rack ══════════ */}
      <nav className="wooden-placard w-60 min-h-screen flex flex-col py-6 px-3 shrink-0 z-30">
        <Link
          href="/"
          className="mb-4 text-sm uppercase tracking-wider block"
          style={{ fontFamily: "'Cinzel', serif", color: 'var(--color-bronze)' }}
        >
          ← Home
        </Link>
        {/* Iron heading plaque */}
        <div className="mb-6 pb-4 relative" style={{ borderBottom: '3px solid #6a5020' }}>
          <h2 className="engraved-deep text-lg font-bold text-center tracking-[0.2em]">
            WAR ROOM
          </h2>
          <p className="text-center text-[10px] uppercase tracking-[0.15em] mt-1.5" style={{
            color: '#7a6a5a',
            textShadow: '0 1px 0 rgba(0,0,0,0.5)',
          }}>
            Tactical Command
          </p>
          {/* Bronze nail heads at plaque corners */}
          <div className="rivet top-0 left-0" style={{ width: 8, height: 8 }} />
          <div className="rivet top-0 right-0" style={{ width: 8, height: 8 }} />
        </div>

        {/* Nav items — iron stamped plates */}
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.key;
          const isVampire = item.key === 'vampires';

          return (
            <motion.button
              key={item.key}
              className={`relative w-full text-left mb-1 px-3 py-3.5 flex items-center gap-3 leather-stitch nav-plate ${isActive ? 'active' : ''}`}
              style={{
                color: isVampire
                  ? (isActive ? '#00ff41' : '#3a7a3a')
                  : (isActive ? '#ecdcb0' : '#9a8a70'),
                fontFamily: "'Cinzel', serif",
                fontSize: '0.82rem',
                cursor: 'pointer',
                border: 'none',
              }}
              whileHover={{ x: 4 }}
              onClick={() => setActiveTab(item.key)}
            >
              {/* Iron-stamped sigil */}
              <span className="text-xl flex-shrink-0" style={{
                filter: isVampire
                  ? `drop-shadow(0 0 ${isActive ? '6' : '3'}px rgba(0,255,65,0.5))`
                  : `drop-shadow(0 1px 3px rgba(0,0,0,0.8))`,
                textShadow: isActive
                  ? (isVampire ? '0 0 10px rgba(0,255,65,0.4)' : '0 0 8px rgba(176,141,87,0.4)')
                  : 'none',
              }}>
                {item.sigil}
              </span>
              <div className="flex flex-col">
                <span className="tracking-wider leading-tight">{item.label}</span>
                <span className="text-[9px] tracking-wider opacity-40 mt-0.5" style={{
                  fontFamily: "'EB Garamond', serif",
                  fontStyle: 'italic',
                }}>
                  {item.subtitle}
                </span>
              </div>

              {/* Active indicator — hammered bronze nail */}
              {isActive && (
                <motion.div
                  className="absolute right-2"
                  layoutId="navIndicator"
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{
                    background: isVampire
                      ? 'radial-gradient(circle, #00ff41, #004a10)'
                      : 'radial-gradient(circle at 35% 35%, #d4a84a, #6a5020)',
                    boxShadow: isVampire
                      ? '0 0 8px rgba(0,255,65,0.6), 0 0 16px rgba(0,255,65,0.25)'
                      : '0 0 6px rgba(176,141,87,0.5), inset 0 -1px 2px rgba(0,0,0,0.4)',
                  }} />
                </motion.div>
              )}
            </motion.button>
          );
        })}

        {/* Bottom wax seal insignia */}
        <div className="mt-auto pt-6 text-center" style={{ borderTop: '2px solid #3e2a10' }}>
          <div className="wax-seal w-14 h-14 mx-auto flex items-center justify-center text-[10px] font-bold tracking-widest">
            SPQR
          </div>
          <p className="text-[9px] mt-2.5 uppercase tracking-[0.15em]" style={{
            color: '#5a4a3a',
            textShadow: '0 1px 0 rgba(0,0,0,0.5)',
          }}>
            Insular Imperium
          </p>
        </div>
      </nav>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">
          {/* ──── Field Reports (Units) ──── */}
          {activeTab === 'units' && (
            <motion.div key="units" {...tabTransition}>
              {/* Section: Roman Units */}
              <SectionHeader
                title="Roman Legions"
                subtitle="The backbone of the Imperium. Every soldier, from the humblest Hastatus to the mightiest Onager."
                color="#9a031e"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-14">
                {ROMAN_UNITS.map((unit, i) => (
                  <UnitCard
                    key={unit.key}
                    unit={unit}
                    index={i}
                    onClick={() => setSelectedUnit(unit)}
                  />
                ))}
              </div>

              {/* Section: Orc Units */}
              <SectionHeader
                title="Orc War Clans"
                subtitle="Know thy enemy. These beasts are stronger individually, but lack Roman discipline."
                color="#88aa66"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {ORC_UNITS.map((unit, i) => (
                  <UnitCard
                    key={unit.key}
                    unit={unit}
                    index={i}
                    onClick={() => setSelectedUnit(unit)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ──── Blue Team Heroes ──── */}
          {activeTab === 'heroes' && (
            <motion.div key="heroes" {...tabTransition}>
              <SectionHeader
                title="Heroes of Rome"
                subtitle="Nine champions of the Imperium. Each commands a unique aura and wields a devastating ability."
                color="#9a031e"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {BLUE_HEROES.map((hero, i) => (
                  <HeroCard
                    key={hero.id}
                    hero={hero}
                    index={i}
                    variant="blue"
                    onClick={() => handleHeroClick(hero, 'blue')}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ──── Vampire Clan ──── */}
          {activeTab === 'vampires' && (
            <motion.div key="vampires" {...tabTransition}>
              {/* Corrupted obsidian header */}
              <div className="mb-10 p-8 obsidian-panel relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: `radial-gradient(ellipse at 50% 0%, rgba(0,255,65,0.1) 0%, transparent 50%)`,
                  animation: 'ichor-drift 5s ease-in-out infinite alternate',
                }} />
                {/* Ichor rivets */}
                <div className="rivet-ichor absolute top-2 left-2" />
                <div className="rivet-ichor absolute top-2 right-2" />
                <div className="rivet-ichor absolute bottom-2 left-2" />
                <div className="rivet-ichor absolute bottom-2 right-2" />

                <h2 className="ichor-text text-3xl md:text-4xl font-black text-center tracking-[0.25em] relative z-10" style={{
                  fontFamily: "'Cinzel', serif",
                }}>
                  THE UNDEAD CONCLAVE
                </h2>
                <p className="text-center mt-3 text-sm italic relative z-10" style={{
                  color: '#4a7a4a',
                  lineHeight: '1.6',
                }}>
                  Four vampire lords rise from the fallen. They cannot be purchased — only survived.
                  <br />
                  Their auras empower only the undead. Their presence corrupts the very land they walk.
                </p>
                <div className="flex justify-center gap-3 mt-5 relative z-10">
                  {['DISEASED', 'FEARED', 'DESECRATED', 'SIPHONED'].map((status) => (
                    <span key={status} className="text-[10px] uppercase tracking-[0.15em] px-3 py-1.5" style={{
                      border: '1px solid #1a3a1a',
                      color: '#3a6a3a',
                      background: 'rgba(0,255,65,0.04)',
                      textShadow: '0 0 6px rgba(0,255,65,0.2)',
                    }}>
                      {status}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {VAMPIRE_HEROES.map((hero, i) => (
                  <HeroCard
                    key={hero.id}
                    hero={hero}
                    index={i}
                    variant="vampire"
                    onClick={() => handleHeroClick(hero, 'vampire')}
                  />
                ))}
              </div>

              {/* Undead mechanics panel — etched into obsidian */}
              <div className="mt-12 obsidian-panel p-8 relative">
                <div className="rivet-ichor absolute top-2 left-2" />
                <div className="rivet-ichor absolute top-2 right-2" />
                <h3 className="ichor-text text-xl font-bold tracking-[0.2em] mb-5" style={{
                  fontFamily: "'Cinzel', serif",
                }}>
                  Undead Mechanics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" style={{ color: '#8aaa8a' }}>
                  {[
                    { title: 'Corruption', text: 'Undead presence corrupts terrain within 6 tiles. After 3 turns, tiles have a 50% chance of spawning undead units.' },
                    { title: 'Frenzy', text: 'Undead within 6 tiles of their hero gain +50% ATK but lose 5% HP per turn.' },
                    { title: 'Mist Form', text: 'Defeated vampire heroes enter Mist Form, moving 2 tiles/turn. After 5 turns, they regenerate with 50% HP.' },
                    { title: 'Necromancy', text: 'Undead healers become Necromancers. They can raise corpses within 3 tiles as undead units.' },
                    { title: 'Undead Transforms', text: 'All base unit types gain ×1.5 HP, ATK, and DEF. Knights get +1 MOV, Archers get +1 RNG.' },
                    { title: 'Escalation', text: 'Four waves, each bringing a new vampire hero. The undead grow stronger with each fort that falls.' },
                  ].map((m) => (
                    <div key={m.title} className="p-4 relative" style={{
                      border: '1px solid #1a3a1a',
                      background: 'rgba(0,255,65,0.02)',
                    }}>
                      <strong className="ichor-text text-sm">{m.title}:</strong>
                      <span className="ml-1">{m.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ──── Naval Fleet ──── */}
          {activeTab === 'fleet' && (
            <motion.div key="fleet" {...tabTransition}>
              <SectionHeader
                title="Imperial Navy"
                subtitle="Rome rules the waves. From the swift Liburna to the mighty Trireme, the fleet carries the Legion to war."
                color="#4a6080"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {SHIP_CLASSES.map((ship, i) => (
                  <ShipCard key={ship.key} ship={ship} index={i} />
                ))}
              </div>

              {/* Naval doctrine — engraved into parchment */}
              <div className="parchment-card p-8 relative">
                <div className="rivet absolute top-2 left-2" />
                <div className="rivet absolute top-2 right-2" />
                <div className="rivet absolute bottom-2 left-2" />
                <div className="rivet absolute bottom-2 right-2" />
                <h3 className="text-xl font-bold tracking-[0.15em] mb-5" style={{
                  fontFamily: "'Cinzel', serif",
                  color: '#4a6080',
                  textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                }}>
                  Naval Doctrine
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" style={{ color: '#3a2a1a' }}>
                  {[
                    { title: 'Bombardment', text: 'All ships bombard at range 3. Damage applies to ships, units, and buildings on target tiles.' },
                    { title: 'Crew System', text: 'Units embark onto deck and below-deck slots. Deck units can attack; below-deck are protected.' },
                    { title: 'Sinking', text: 'Ships at 0 hull HP begin sinking (3 turns). Derelict ships float for 1 turn before going under.' },
                    { title: 'Port Repair', text: 'Ships at Jetty tiles repair 20% HP per turn. Ports also heal embarked units at 10% per turn.' },
                  ].map((d) => (
                    <div key={d.title} className="p-4" style={{
                      border: '1px solid #c4a87a',
                      background: 'rgba(176,141,87,0.05)',
                    }}>
                      <strong style={{ color: '#6a4a2a' }}>{d.title}:</strong> {d.text}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ══════════ SCROLL REVEAL MODALS ══════════ */}
      <ScrollReveal
        isOpen={!!selectedUnit}
        onClose={() => setSelectedUnit(null)}
        title={selectedUnit?.name || ''}
        variant={selectedUnit?.faction === 'orc' ? 'obsidian' : 'parchment'}
      >
        {selectedUnit && <UnitDetail unit={selectedUnit} />}
      </ScrollReveal>

      <ScrollReveal
        isOpen={!!selectedHero}
        onClose={() => setSelectedHero(null)}
        title={selectedHero ? `${selectedHero.name}${selectedHero.title ? `, ${selectedHero.title}` : ''}` : ''}
        variant={heroVariant === 'vampire' ? 'obsidian' : 'parchment'}
      >
        {selectedHero && <HeroDetail hero={selectedHero} variant={heroVariant} />}
      </ScrollReveal>
    </div>
  );
}

function SectionHeader({ title, subtitle, color }: { title: string; subtitle: string; color: string }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex-1 chisel-line" style={{
          background: `linear-gradient(90deg, ${color}50, transparent)`,
        }} />
        <h2 className="engraved-deep text-2xl md:text-3xl font-bold tracking-[0.2em]" style={{ color }}>
          {title}
        </h2>
        <div className="flex-1 chisel-line" style={{
          background: `linear-gradient(270deg, ${color}50, transparent)`,
        }} />
      </div>
      <p className="text-center text-sm italic opacity-50" style={{
        color: '#a89878',
        fontFamily: "'EB Garamond', serif",
      }}>
        {subtitle}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="marble-bg min-h-screen flex items-center justify-center">
        <div className="engraved-deep text-2xl tracking-[0.2em] animate-pulse">Loading War Room...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
