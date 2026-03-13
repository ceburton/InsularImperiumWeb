'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import HomeLogo from '@/components/HomeLogo';
import { BLUE_HEROES, VAMPIRE_HEROES } from '@/data/heroes';
import type { Hero } from '@/data/heroes';

const SECTIONS = [
  { id: 'unified', label: 'The Unified Battlefield', href: '#unified' },
  { id: 'naval', label: 'Naval Warfare', href: '#naval' },
  { id: 'heroes', label: 'The Hero System', href: '#heroes' },
  { id: 'economy', label: 'Strategic Economy', href: '#economy' },
  { id: 'procedural', label: 'Procedural Replayability', href: '#procedural' },
  { id: 'engineering', label: 'Engineering & Construction', href: '#engineering' },
  { id: 'undead', label: 'The Undead Legions', href: '#undead' },
  { id: 'orcish', label: 'The Orcish Onslaught', href: '#orcish' },
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
        className="w-24 h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 relative flex items-center justify-center"
        style={{
          borderColor: isVampire ? '#3a1a1a' : '#8a6a30',
          boxShadow: hover ? (isVampire ? '0 0 20px rgba(185,28,28,0.4)' : '0 0 20px rgba(176,141,87,0.4)') : 'none',
        }}
      >
        {!imgError ? (
          <Image
            src={portraitSrc}
            alt={hero.name}
            width={96}
            height={96}
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
      {hover && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-full ml-3 top-0 z-50 w-72 p-4 rounded border shadow-xl"
          style={{
            background: isVampire ? 'linear-gradient(135deg, #0a1a0a, #141418)' : 'linear-gradient(135deg, #2a2520, #1a1814)',
            borderColor: isVampire ? '#3a1a1a' : '#8a6a30',
            fontFamily: "'EB Garamond', serif",
          }}
        >
          <div className="font-bold text-lg mb-2" style={{ color: isVampire ? 'var(--color-ichor)' : '#b08d57', fontFamily: "'Cinzel', serif" }}>
            {hero.name}{hero.title ? `, ${hero.title}` : ''}
          </div>
          <div className="text-xs uppercase text-parchment-dark/80 mb-2">Aura (Range: {hero.aura.range})</div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-parchment/90">
            {Object.entries(hero.aura.bonuses).map(([k, v]) => (
              <span key={k}>+{v} {k}</span>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t" style={{ borderColor: isVampire ? '#3a1a1a' : '#6a5020' }}>
            <div className="text-xs uppercase text-parchment-dark/80 mb-1">Ability: {hero.ability.name}</div>
            <p className="text-sm leading-snug text-parchment/95">{hero.ability.description}</p>
            <div className="text-[10px] mt-1 opacity-70">CD: {hero.ability.cooldown} · Rng: {hero.ability.range}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ScreenshotPlaceholder({ title, caption, imageSrc, imageAlt, onClick }: { title: string; caption: string; imageSrc?: string; imageAlt?: string; onClick?: () => void }) {
  const [imgError, setImgError] = useState(false);
  const src = imageSrc ?? null;
  const showImage = src && !imgError;

  return (
    <div
      onClick={showImage ? onClick : undefined}
      className={`w-full rounded-lg border-2 overflow-hidden flex items-center justify-center text-center transition-transform duration-300 ${showImage ? 'cursor-zoom-in hover:scale-[1.02]' : ''}`}
      style={{
        minHeight: 280,
        borderColor: 'var(--color-bronze-dark)',
        background: !showImage ? 'linear-gradient(135deg, rgba(26,24,20,0.6), rgba(42,38,30,0.5))' : 'transparent',
      }}
    >
      {showImage ? (
        <div className="relative w-full min-h-[280px] flex items-center justify-center bg-black/20">
          <Image
            src={src}
            alt={imageAlt ?? caption}
            width={800}
            height={450}
            className="w-full h-auto object-contain max-h-[420px]"
            unoptimized
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="p-8 w-full">
          <div className="text-bronze font-semibold uppercase tracking-wider text-sm mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            {title}
          </div>
          <p className="text-parchment-dark/70 text-sm max-w-md mx-auto">{caption}</p>
        </div>
      )}
    </div>
  );
}

function ImageModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm cursor-zoom-out"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-[90vw] md:w-[80vw] h-[70vh] md:h-[80vh] bronze-frame p-1 bg-[#1a1814] overflow-hidden rounded-sm shadow-[0_0_60px_rgba(0,0,0,0.9)] flex items-center justify-center"
      >
        <div className="relative w-full h-full flex items-center justify-center p-2 md:p-4">
          <Image
            src={src}
            alt={alt}
            width={1920}
            height={1080}
            className="max-w-full max-h-full object-contain block shadow-2xl"
            unoptimized
            priority
          />
        </div>
        
        {/* Close Button - Medieval Plate Style (Hexagonal) */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-10 h-10 md:w-12 md:h-12 z-50 flex items-center justify-center text-xl md:text-2xl font-bold cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-lg border-2"
          style={{
            background: 'linear-gradient(135deg, #4a4a52 0%, #2a2a32 100%)',
            borderColor: '#8a6a30',
            color: '#c4a87a',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.1)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            fontFamily: "'Cinzel', serif",
          }}
          aria-label="Close"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function FeaturesPage() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const opts: IntersectionObserverInit = { rootMargin: '-20% 0px -70% 0px', threshold: 0 };

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

  return (
    <div className="marble-bg min-h-screen">
      {/* Fixed top navigation — desktop: full nav; mobile: logo + hamburger, section list in dropdown */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 w-full border-b flex items-center py-3 px-4 gap-4"
        style={{
          background: 'linear-gradient(180deg, rgba(22,22,24,0.97), rgba(26,24,22,0.95))',
          borderColor: 'var(--color-bronze-dark)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        <HomeLogo className="flex-shrink-0" />
        {/* Desktop: inline section buttons */}
        <div className="hidden md:flex flex-1 flex-wrap items-center justify-center gap-2 lg:gap-4 min-w-0">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="px-4 py-2 rounded text-sm font-semibold uppercase tracking-wider transition-all"
              style={{
                fontFamily: "'Cinzel', serif",
                color: activeId === id ? 'var(--color-parchment)' : 'var(--color-parchment-dark)',
                background: activeId === id ? 'rgba(176,141,87,0.2)' : 'transparent',
                border: `1px solid ${activeId === id ? 'var(--color-bronze)' : 'transparent'}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Mobile: hamburger */}
        <div className="flex-1 flex justify-end md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="p-2 rounded border touch-manipulation"
            style={{ borderColor: 'var(--color-bronze-dark)', color: 'var(--color-parchment)' }}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open section menu'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown: full-width list below nav, scrollable if needed */}
      {mobileMenuOpen && (
        <div
          className="fixed left-0 right-0 z-30 md:hidden border-b overflow-y-auto top-14"
          style={{
            maxHeight: 'calc(100vh - 3.5rem)',
            background: 'linear-gradient(180deg, rgba(26,24,22,0.98), rgba(22,22,24,0.98))',
            borderColor: 'var(--color-bronze-dark)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          <div className="py-2 px-4 flex flex-col gap-0.5">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="w-full text-left px-4 py-3 rounded text-sm font-semibold uppercase tracking-wider transition-all touch-manipulation"
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: activeId === id ? 'var(--color-parchment)' : 'var(--color-parchment-dark)',
                  background: activeId === id ? 'rgba(176,141,87,0.2)' : 'transparent',
                  border: `1px solid ${activeId === id ? 'var(--color-bronze)' : 'transparent'}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Spacer so content is not hidden under fixed nav */}
      <div className="h-14 md:h-20 flex-shrink-0" aria-hidden />

      <main>
        {/* Hero title & intro — full width */}
        <section className="text-center px-6 py-20 space-y-6">
          <div className="max-w-3xl mx-auto">
            <h1
              className="text-4xl md:text-5xl font-black tracking-tight"
              style={{ fontFamily: "'Cinzel', serif", color: 'var(--color-bronze)' }}
            >
              Command the Seas, Conquer the Islands
            </h1>
            <p className="text-xl text-parchment-dark/90 leading-relaxed mt-4" style={{ fontFamily: "'EB Garamond', serif" }}>
              The Tactical Depth of Insular Imperium
            </p>
            <p className="text-parchment/85 leading-relaxed mt-6" style={{ fontFamily: "'EB Garamond', serif" }}>
              Step into a world where Roman military discipline meets medieval fantasy. Grid General offers a unique turn-based strategy experience where every decision matters—from the formation of your phalanx on land to the positioning of your multi-tile Triremes at sea. Lead a roster of nine legendary heroes, each wielding powerful active abilities and passive auras that can turn the tide of battle. With procedurally generated islands and a complex gold-based economy, no two campaigns are ever the same. Master the terrain, manage your resources, and build your empire one grid at a time.
            </p>
          </div>
        </section>

        {/* Alternating feature sections (Romestead-style) — unified + 5 features, index drives layout */}
        {[
          { 
            id: 'unified' as const, 
            primaryHighlight: true, 
            title: 'The Unified Battlefield', 
            body: 'Experience a seamless transition between strategic command and tactical execution. In Insular Imperium, there are no separate battle screens or loading transitions. Use the mousewheel to zoom out for a high-level view of your archipelago, or zoom in to manage individual units and abilities on the same map. Every decision—from flanking maneuvers to hero auras—resolves directly on the unified battlefield.', 
            screenshots: [
              { title: 'Strategic View', caption: 'Seamless Zoom: Use the mousewheel to pull back for a high-level overview of the archipelago.', imageSrc: '/assets/large map.png' },
              { title: 'Tactical View', caption: 'Seamless Zoom: Roll the mousewheel forward to dive into the heart of the action.', imageSrc: '/assets/zoom map.png' }
            ]
          },
          { id: 'naval' as const, keyFeature: true, title: 'Integrated Naval Combat', body: 'Ships are not just units; they are floating terrain. Command Liburnas, Galleys, and Triremes that carry your army across the sea, engage in ship-to-ship boarding, and provide devastating ballista bombardments from their decks.', screenshot: { title: 'Naval combat', caption: 'Command massive multi-tile Triremes and Liburnas in a seamless environment where naval and land tactics converge.', imageSrc: '/assets/naval combat 1.png' } },
          { id: 'heroes' as const, keyFeature: true, title: 'Legendary Heroes', body: 'Deploy up to three unique heroes per game from a roster of nine. Heroes like Marcus the Centurion and Valeria the Shield Maiden provide passive auras to nearby allies and can unleash tide-turning abilities like the defensive Testudo or the high-damage Lunge.', screenshot: { title: 'Hero ability', caption: 'Command heroes with game-changing active abilities and auras that turn the tide of battle.', imageSrc: '/assets/hero 1.png' }, heroes: 'blue' as const },
          { 
            id: 'economy' as const, 
            keyFeature: false, 
            title: 'Strategic Economy', 
            body: 'Success requires more than just steel. Control territory to generate gold income from captured Forts and Orc Camps. Manage unit maintenance costs to ensure your army stays fed, and spend your loot on reinforcements or elite siege weaponry like Catapults and Ballistae.', 
            screenshots: [
              { title: 'Economy UI', caption: 'Master your empire\'s gold-based economy with detailed production reports and maintenance tracking.', imageSrc: '/assets/economy.png' },
              { title: 'Production Report', caption: 'Detailed breakdown of unit maintenance and base income for precise logistical planning.', imageSrc: '/assets/production.png' }
            ]
          },
          { 
            id: 'procedural' as const, 
            keyFeature: true, 
            title: 'Infinite Frontiers: A New World with Every Launch', 
            body: 'Experience a strategy game where the horizon is truly limitless. Insular Imperium features a sophisticated procedural generation engine that crafts unique island archipelagos every time you start a new campaign. No two battlefields are ever the same, forcing you to adapt your tactics to jagged coastlines, isolated mountain passes, and strategically placed resource hubs. With four distinct map sizes—ranging from tight tactical skirmishes to sprawling oceanic empires—and three escalating difficulty levels, you can tailor the challenge to your expertise. Whether you are mastering the basics or facing a brutal AI onslaught, the ever-changing geography ensures that your path to victory is always a fresh discovery.', 
            screenshots: [
              { title: 'Archipelago Alpha', caption: 'Map 1: A complex chain of interconnected islands.', imageSrc: '/assets/map 1.png' },
              { title: 'Archipelago Beta', caption: 'Map 2: Jagged coastlines and scattered resource hubs.', imageSrc: '/assets/map 2.png' },
              { title: 'Archipelago Gamma', caption: 'Map 3: A dense, contested central landmass.', imageSrc: '/assets/map 3.png' },
              { title: 'Archipelago Delta', caption: 'Map 4: Sprawling oceanic empire with isolated outposts.', imageSrc: '/assets/map 4.png' }
            ]
          },
          { id: 'engineering' as const, keyFeature: false, title: 'Engineering & Logistics', body: 'Shape the battlefield with Engineer units. Build roads and bridges to overcome rough terrain and water, or establish workshops to produce siege engines on the front lines. Every bridge built is a new path to victory.', screenshot: { title: 'Construction', caption: 'Engineer units constructing bridges and roads to expand your empire\'s logistical reach.', imageSrc: '/assets/engineer.png' } },
          { 
            id: 'undead' as const, 
            keyFeature: true, 
            title: 'The Undead Legions', 
            body: 'Beware the Undead Legion—Vampire Lords who rise from the grave to lead a skeletal horde. These dark heroes cannot be purchased; they appear in waves as the invasion escalates, each wielding devastating abilities like Soul Siphon, Plague Cloud, and Terror Charge. Their undead units—reanimated infantry, knights, mages, and archers—fill the ranks. Fallen Roman soldiers can be converted: when your units fall in battle, the enemy can raise them as undead under vampire command, turning your own legions against you. The Undead Legion does not merely defend—they assault your forts and push relentlessly to drive you from the island. Hold the line or be overrun.', 
            screenshots: [
              { title: 'The Undead Legion', caption: 'Face the dark influence of Vampire Lords as they raise skeletal hordes and convert fallen legions.', imageSrc: '/assets/enemy hero.png' },
              { title: 'Tiberius the Revenant', caption: 'Witness the power of a fallen legend resurrected to lead the undead assault.', imageSrc: '/assets/tiberius.png' }
            ], 
            heroes: 'vampire' as const 
          },
          { id: 'orcish' as const, keyFeature: true, title: 'The Orcish Onslaught: Mastery of the Frenzy', body: 'Face an enemy that grows more dangerous with every wound. The Orc Factions of the archipelago bring a primal ferocity to the battlefield, governed by the unique Frenzy mechanic. Unlike disciplined Roman units, Orcs gain significant attack bonuses as their health depletes, turning a wounded Grunt into a devastating powerhouse. Engaging the horde requires cold calculation: do you risk a partial strike that might trigger their rage, or do you coordinate a decisive, overwhelming blow to finish them? Navigating their aggressive AI and unpredictable strength is the ultimate test of your tactical foresight.', screenshot: { title: 'Frenzy Mechanic', caption: 'The Orcish Onslaught: Frenzy mechanic turns wounded units into lethal combatants.', imageSrc: '/assets/orc frenzy.png' } },
        ].map(({ id, primaryHighlight, keyFeature, title, body, screenshot, screenshots, heroes: heroesKey }, index) => {
          const reverse = index % 2 === 1;
          return (
          <section
            key={id}
            id={id}
            ref={(el) => { sectionRefs.current[id] = el; }}
            className={`scroll-mt-24 py-16 md:py-24 ${index % 2 === 0 ? '' : ''}`}
            style={{
              background: index % 2 === 0 ? 'rgba(176,141,87,0.04)' : 'rgba(0,0,0,0.08)',
              borderTop: '1px solid rgba(176,141,87,0.08)',
              borderBottom: '1px solid rgba(176,141,87,0.08)',
            }}
          >
            <div className={`max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${reverse ? 'md:grid-flow-dense' : ''}`}>
              {/* Text block */}
              <div className={reverse ? 'md:col-start-2' : ''}>
                <div className="text-xs uppercase tracking-[0.2em] mb-2" style={{ fontFamily: "'Cinzel', serif", color: primaryHighlight ? 'var(--color-bronze-light)' : 'var(--color-bronze-dark)' }}>
                  {primaryHighlight ? 'Primary Highlight' : keyFeature ? 'Key Feature' : 'Feature'}
                </div>
                <h2
                  className="text-2xl md:text-3xl font-bold border-b pb-2 mb-4"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: id === 'undead' ? 'var(--color-ichor)' : 'var(--color-bronze)',
                    borderColor: id === 'undead' ? 'var(--color-ichor-dark)' : 'var(--color-bronze-dark)',
                  }}
                >
                  {title}
                </h2>
                <p className="text-parchment/90 leading-relaxed" style={{ fontFamily: "'EB Garamond', serif" }}>
                  {body}
                </p>
                {heroesKey === 'blue' && (
                  <div className="pt-6">
                    <div className="text-sm font-semibold uppercase tracking-wider text-bronze mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                      Hover a portrait for aura & ability stats
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {BLUE_HEROES.map((hero) => (
                        <div key={hero.id} className="flex items-center gap-2">
                          <HeroPortraitCard hero={hero} variant="blue" />
                          <div>
                            <div className="font-bold text-parchment text-sm" style={{ fontFamily: "'Cinzel', serif" }}>{hero.name}</div>
                            <div className="text-xs text-parchment-dark/60">{hero.ability.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {heroesKey === 'vampire' && (
                  <div className="pt-6">
                    <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: "'Cinzel', serif", color: 'var(--color-ichor)' }}>
                      Vampire heroes
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {VAMPIRE_HEROES.map((hero) => (
                        <div key={hero.id} className="flex items-center gap-2">
                          <HeroPortraitCard hero={hero} variant="vampire" />
                          <div>
                            <div className="font-bold text-sm" style={{ color: 'var(--color-ichor)', fontFamily: "'Cinzel', serif" }}>{hero.name}</div>
                            <div className="text-xs text-ichor/70">{hero.ability.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Visual block */}
              <div className={reverse ? 'md:col-start-1 md:row-start-1' : ''}>
                {screenshots ? (
                  <div className={(id === 'procedural' || id === 'economy') ? "grid grid-cols-2 gap-4" : "flex flex-col gap-8"}>
                    {screenshots.map((ss, ssIdx) => (
                      <div key={ssIdx} className="relative group">
                        <ScreenshotPlaceholder
                          title={ss.title}
                          caption={ss.caption}
                          imageSrc={ss.imageSrc}
                          imageAlt={ss.title}
                          onClick={() => setSelectedImage({ src: ss.imageSrc, alt: ss.title })}
                        />
                        {/* Zoom indicator positioning logic */}
                        {(id === 'unified' && ssIdx === 0) && (
                          <div className="-bottom-6 left-1/2 -translate-x-1/2 absolute z-10 flex flex-col items-center">
                            <div className="w-[1px] h-4 bg-bronze/40" />
                            <div className="bg-black/90 px-3 py-1 border border-bronze/40 rounded-full text-[9px] uppercase tracking-[0.2em] text-bronze-light font-bold flex items-center gap-2 shadow-xl whitespace-nowrap">
                              <span className="text-xs animate-bounce">↓</span>
                              Mousewheel Zoom
                              <span className="text-xs animate-bounce">↓</span>
                            </div>
                            <div className="w-[1px] h-4 bg-bronze/40" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <ScreenshotPlaceholder
                    title={screenshot!.title}
                    caption={screenshot!.caption}
                    imageSrc={'imageSrc' in screenshot! ? (screenshot! as any).imageSrc : undefined}
                    imageAlt={'imageAlt' in screenshot! ? (screenshot! as any).imageAlt : undefined}
                    onClick={() => {
                      const src = 'imageSrc' in screenshot! ? (screenshot! as any).imageSrc : undefined;
                      const alt = 'imageAlt' in screenshot! ? (screenshot! as any).imageAlt : (screenshot!.caption || screenshot!.title);
                      if (src) setSelectedImage({ src, alt });
                    }}
                  />
                )}
              </div>
            </div>
          </section>
          );
        })}

        {/* Image Modal Lightbox */}
        {selectedImage && (
          <ImageModal
            src={selectedImage.src}
            alt={selectedImage.alt}
            onClose={() => setSelectedImage(null)}
          />
        )}

        {/* CTA: Join the Imperium */}
        <section className="scroll-mt-24 text-center py-20 px-6 border-t-2" style={{ borderColor: 'var(--color-bronze)', background: 'linear-gradient(135deg, rgba(176,141,87,0.12), rgba(106,80,32,0.18))' }}>
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ fontFamily: "'Cinzel', serif", color: 'var(--color-bronze)' }}>
            Join the Imperium
          </h2>
          <p className="text-parchment/85 mb-8 max-w-xl mx-auto" style={{ fontFamily: "'EB Garamond', serif" }}>
            Enter the War Room. Master the grid. Forge your legend.
          </p>
          <Link
            href="https://9000-firebase-gridgeneral-1770787749264.cluster-fsmcisrvfbb5cr5mvra3hr3qyg.cloudworkstations.dev/?monospaceUid=58064"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.button
              className="px-10 py-4 rounded-lg font-bold uppercase tracking-widest text-lg"
              style={{
                fontFamily: "'Cinzel', serif",
                background: 'linear-gradient(180deg, var(--color-bronze-light), var(--color-bronze-dark))',
                color: '#1a1410',
                border: '2px solid var(--color-bronze)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Download / Play Now
            </motion.button>
          </Link>
        </section>
      </main>
    </div>
  );
}
