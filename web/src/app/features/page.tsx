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

function ScreenshotPlaceholder({ title, caption, imageSrc, imageAlt }: { title: string; caption: string; imageSrc?: string; imageAlt?: string }) {
  const [imgError, setImgError] = useState(false);
  const src = imageSrc ?? null;
  const showImage = src && !imgError;

  return (
    <div
      className="w-full rounded-lg border-2 overflow-hidden flex items-center justify-center text-center"
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

export default function FeaturesPage() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          { id: 'unified' as const, primaryHighlight: true, title: 'The Unified Battlefield', body: 'No loading screens. No scene transitions. One seamless map where every decision plays out in real time. Terrain and flanking modifiers apply directly on the strategic view—Hero auras pulse over your units, forts grant defensive bonuses where they stand, and the same view that guides your march is the view where combat resolves. Move from exploration to engagement without a single cut. Insular Imperium delivers a frictionless tactical experience: one battlefield, one vision, total control.', screenshot: { title: 'Unified Battlefield', caption: 'Wide-angle shot of the game map featuring a Hero aura overlapping units, a flanking maneuver in progress, and a unit utilizing a Fort for defense—all in one seamless view.', imageSrc: '/assets/unified-battlefield.png', imageAlt: 'Wide-angle shot of the game map featuring a Hero aura overlapping units, a flanking maneuver in progress, and a unit utilizing a Fort for defense—all in one seamless view.' } },
          { id: 'naval' as const, keyFeature: true, title: 'Integrated Naval Combat', body: 'Ships are not just units; they are floating terrain. Command Liburnas, Galleys, and Triremes that carry your army across the sea, engage in ship-to-ship boarding, and provide devastating ballista bombardments from their decks.', screenshot: { title: 'Naval combat', caption: 'Action shot: A 3-tile Trireme docked at a Port with units on deck and a spinning ballista indicator ready to bombard a nearby enemy ship.' } },
          { id: 'heroes' as const, keyFeature: true, title: 'Legendary Heroes', body: 'Deploy up to three unique heroes per game from a roster of nine. Heroes like Marcus the Centurion and Valeria the Shield Maiden provide passive auras to nearby allies and can unleash tide-turning abilities like the defensive Testudo or the high-damage Lunge.', screenshot: { title: 'Hero ability', caption: 'Zoomed-in Hero unit with purple aura ring visible and an active ability effect (e.g. gold shield icons during Testudo).' }, heroes: 'blue' as const },
          { id: 'economy' as const, keyFeature: false, title: 'Strategic Economy', body: 'Success requires more than just steel. Control territory to generate gold income from captured Forts and Orc Camps. Manage unit maintenance costs to ensure your army stays fed, and spend your loot on reinforcements or elite siege weaponry like Catapults and Ballistae.', screenshot: { title: 'Economy UI', caption: 'Gold HUD showing turn income and the Production Report panel with current gold balance vs. maintenance expenses.' } },
          { id: 'procedural' as const, keyFeature: true, title: 'Infinite Frontiers: A New World with Every Launch', body: 'Experience a strategy game where the horizon is truly limitless. Insular Imperium features a sophisticated procedural generation engine that crafts unique island archipelagos every time you start a new campaign. No two battlefields are ever the same, forcing you to adapt your tactics to jagged coastlines, isolated mountain passes, and strategically placed resource hubs. With four distinct map sizes—ranging from tight tactical skirmishes to sprawling oceanic empires—and three escalating difficulty levels, you can tailor the challenge to your expertise. Whether you are mastering the basics or facing a brutal AI onslaught, the ever-changing geography ensures that your path to victory is always a fresh discovery.', screenshot: { title: 'Procedural variety', caption: 'Side-by-side or montage: a Small map with high density and immediate conflict, and a Huge map with vast oceans and multiple distant island chains—showing the variety the procedural engine creates.' } },
          { id: 'engineering' as const, keyFeature: false, title: 'Engineering & Logistics', body: 'Shape the battlefield with Engineer units. Build roads and bridges to overcome rough terrain and water, or establish workshops to produce siege engines on the front lines. Every bridge built is a new path to victory.', screenshot: { title: 'Construction', caption: 'Engineer unit beside a newly built Road or Bridge crossing water, with the road-cursor active to show logistical planning.' } },
          { id: 'undead' as const, keyFeature: true, title: 'The Undead Legions', body: 'Beware the Undead Legion—Vampire Lords who rise from the grave to lead a skeletal horde. These dark heroes cannot be purchased; they appear in waves as the invasion escalates, each wielding devastating abilities like Soul Siphon, Plague Cloud, and Terror Charge. Their undead units—reanimated infantry, knights, mages, and archers—fill the ranks. Fallen Roman soldiers can be converted: when your units fall in battle, the enemy can raise them as undead under vampire command, turning your own legions against you. The Undead Legion does not merely defend—they assault your forts and push relentlessly to drive you from the island. Hold the line or be overrun.', screenshot: { title: 'Undead Legion', caption: 'Vampire hero with aura over undead units; conversion or decay mechanics visible. Undead assault on a fort or Roman position.' }, heroes: 'vampire' as const },
          { id: 'orcish' as const, keyFeature: true, title: 'The Orcish Onslaught: Mastery of the Frenzy', body: 'Face an enemy that grows more dangerous with every wound. The Orc Factions of the archipelago bring a primal ferocity to the battlefield, governed by the unique Frenzy mechanic. Unlike disciplined Roman units, Orcs gain significant attack bonuses as their health depletes, turning a wounded Grunt into a devastating powerhouse. Engaging the horde requires cold calculation: do you risk a partial strike that might trigger their rage, or do you coordinate a decisive, overwhelming blow to finish them? Navigating their aggressive AI and unpredictable strength is the ultimate test of your tactical foresight.', screenshot: { title: 'Frenzy mechanic', caption: 'Tight action shot of an Orc Raider or Berserker with low HP (red bar), surrounded by the red Frenzy glow/aura. Combat preview tooltip showing Frenzy-buffed damage contrasted with a healthy unit.' } },
        ].map(({ id, primaryHighlight, keyFeature, title, body, screenshot, heroes: heroesKey }, index) => {
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
                <ScreenshotPlaceholder
                  title={screenshot.title}
                  caption={screenshot.caption}
                  imageSrc={'imageSrc' in screenshot ? screenshot.imageSrc : undefined}
                  imageAlt={'imageAlt' in screenshot ? screenshot.imageAlt : undefined}
                />
              </div>
            </div>
          </section>
          );
        })}

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
