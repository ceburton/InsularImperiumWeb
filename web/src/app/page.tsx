'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

/** Deterministic "random" from seed so server and client hydrate the same. */
function seeded(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}
/** Round to fixed decimals so server/client style strings match (avoids hydration mismatch). */
function r4(v: number): string {
  return v.toFixed(4);
}

function Rivet({ className }: { className: string }) {
  return <div className={`rivet ${className}`} />;
}

export default function LandingPortal() {
  return (
    <div className="landing-bg min-h-screen md:h-screen md:min-h-0 md:overflow-hidden flex flex-col items-center justify-center relative overflow-x-hidden overflow-y-auto md:overflow-y-hidden">
      {/* Ambient dust particles — thicker, slower (seeded + r4 for exact server/client match) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(30)].map((_, i) => {
          const s = (n: number) => seeded(i * 7 + n);
          const w = 1 + s(1) * 2;
          const h = 1 + s(2) * 2;
          const alpha = 0.15 + s(3) * 0.15;
          const x0 = s(4) * 100;
          const y0 = s(5) * 100;
          const x1 = s(7) * 100;
          const y1 = s(6) * 100;
          const dur = 8 + s(8) * 12;
          const dly = s(9) * 6;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${r4(w)}px`,
                height: `${r4(h)}px`,
                backgroundColor: `rgba(200,180,140,${r4(alpha)})`,
              }}
              initial={{
                x: `${r4(x0)}%`,
                y: `${r4(y0)}%`,
                opacity: 0 as const,
              }}
              animate={{
                y: [`${r4(y0)}%`, `${r4(y1)}%`],
                x: [`${r4(x0)}%`, `${r4(x1)}%`],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Number(r4(dur)),
                repeat: Infinity,
                delay: Number(r4(dly)),
              }}
            />
          );
        })}
      </div>

      {/* Stone slab title — heavier, cracked, aged; tighter margin on desktop so shields fit in viewport */}
      <motion.div
        className="relative z-20 mb-4 md:mb-6"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Stone slab with heavier frame */}
        <div className="relative px-12 md:px-20 py-6 md:py-8 bronze-frame" style={{
          background: `
            /* Surface scratches */
            repeating-linear-gradient(
              97deg,
              transparent, transparent 4px,
              rgba(255,255,255,0.015) 4px, rgba(255,255,255,0.015) 5px,
              transparent 5px, transparent 40px
            ),
            /* Chisel dust in grooves */
            radial-gradient(ellipse at 50% 50%, rgba(70,65,75,0.95) 0%, rgba(42,40,48,0.98) 100%),
            linear-gradient(145deg, #2c2a32 0%, #383640 30%, #2a282e 60%, #343238 100%)
          `,
        }}>
          <Rivet className="top-2 left-2" />
          <Rivet className="top-2 right-2" />
          <Rivet className="bottom-2 left-2" />
          <Rivet className="bottom-2 right-2" />

          {/* Hairline crack across slab */}
          <div className="absolute top-[35%] left-[10%] right-[20%] h-[1px] opacity-20"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(150,140,130,0.5) 30%, rgba(150,140,130,0.3) 70%, transparent)',
            }}
          />

          {/* Prominent logo — hero of the landing page */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/assets/insularimperium.png"
              alt="Insular Imperium"
              width={480}
              height={144}
              className="h-[100px] md:h-[140px] lg:h-[180px] w-auto object-contain drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
              priority
            />
          </motion.div>

          {/* Game title — big, beautiful, engraved */}
          <motion.h2
            className="engraved-deep text-center mt-3 md:mt-4 text-2xl md:text-3xl lg:text-4xl font-black tracking-[0.25em] uppercase select-none"
            style={{
              color: '#c4a87a',
              fontFamily: "'Cinzel', serif",
              textShadow: '0 0 20px rgba(176,141,87,0.15), 0 2px 4px rgba(0,0,0,0.6)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Insular
            <br />
            Imperium
          </motion.h2>

          {/* Decorative bronze filigree below title */}
          <motion.div
            className="flex items-center justify-center gap-3 mt-2 md:mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 3, duration: 1 }}
          >
            <div className="w-16 h-[1px]" style={{
              background: 'linear-gradient(90deg, transparent, #b08d57)',
            }} />
            <span style={{ color: '#b08d57', fontSize: '10px', textShadow: '0 0 4px rgba(176,141,87,0.3)' }}>✦</span>
            <div className="w-16 h-[1px]" style={{
              background: 'linear-gradient(270deg, transparent, #b08d57)',
            }} />
          </motion.div>
        </div>

        {/* Crack line extending from slab down into marble */}
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 2.5, duration: 1.2 }}
          style={{ transformOrigin: 'top' }}
        >
          <div className="w-[1px] h-8" style={{
            background: 'linear-gradient(180deg, rgba(100,95,80,0.4), transparent)',
          }} />
        </motion.div>
      </motion.div>

      {/* CTA buttons — image assets, links preserved */}
      <motion.div
        className="relative z-20 flex flex-col sm:flex-row gap-1 sm:gap-2 items-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href="/features" className="block">
          <motion.span
            className="block w-64 sm:w-72 md:w-80 max-w-[min(320px,85vw)] sm:max-w-[min(288px,22vw)] aspect-square cursor-pointer relative"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.91 }}
          >
            <Image
              src="/assets/button-features.png"
              alt="Features"
              width={384}
              height={384}
              className="w-full h-full object-contain"
            />
            <span className="cta-button-label">Features</span>
          </motion.span>
        </Link>

        {/* Divider — bronze chain link */}
        <div className="hidden sm:flex flex-col items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1.5 h-3 rounded-full" style={{
              background: 'linear-gradient(180deg, #b08d57, #6a5020)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
              opacity: 0.5,
            }} />
          ))}
        </div>

        <Link href="/dashboard" className="block">
          <motion.span
            className="block w-64 sm:w-72 md:w-80 max-w-[min(320px,85vw)] sm:max-w-[min(288px,22vw)] aspect-square cursor-pointer relative"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.91 }}
          >
            <Image
              src="/assets/button-units.png"
              alt="War Room"
              width={384}
              height={384}
              className="w-full h-full object-contain"
            />
            <span className="cta-button-label">Units</span>
          </motion.span>
        </Link>

        {/* Divider — bronze chain link */}
        <div className="hidden sm:flex flex-col items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1.5 h-3 rounded-full" style={{
              background: 'linear-gradient(180deg, #b08d57, #6a5020)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
              opacity: 0.5,
            }} />
          ))}
        </div>

        <Link href="/media" className="block">
          <motion.span
            className="block w-64 sm:w-72 md:w-80 max-w-[min(320px,85vw)] sm:max-w-[min(288px,22vw)] aspect-square cursor-pointer relative"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.91 }}
          >
            <Image
              src="/assets/button-media.png"
              alt="Media"
              width={384}
              height={384}
              className="w-full h-full object-contain"
            />
            <span className="cta-button-label">Media</span>
          </motion.span>
        </Link>

        {/* Divider — bronze chain link */}
        <div className="hidden sm:flex flex-col items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1.5 h-3 rounded-full" style={{
              background: 'linear-gradient(180deg, #b08d57, #6a5020)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
              opacity: 0.5,
            }} />
          ))}
        </div>

        <Link
          href="https://9000-firebase-gridgeneral-1770787749264.cluster-fsmcisrvfbb5cr5mvra3hr3qyg.cloudworkstations.dev/?monospaceUid=58064"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <motion.span
            className="block w-64 sm:w-72 md:w-80 max-w-[min(320px,85vw)] sm:max-w-[min(288px,22vw)] aspect-square cursor-pointer relative"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.91 }}
          >
            <Image
              src="/assets/button-play.png"
              alt="Play Now"
              width={384}
              height={384}
              className="w-full h-full object-contain"
            />
            <span className="cta-button-label">Play Now</span>
          </motion.span>
        </Link>
      </motion.div>

      {/* Stone floor inscription — worn into the marble, with small logo */}
      <motion.div
        className="absolute bottom-4 md:bottom-6 z-20 text-center flex flex-col items-center gap-2 md:gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 4, duration: 2 }}
      >
        <Image
          src="/assets/insularimperium.png"
          alt=""
          width={120}
          height={36}
          className="h-8 w-auto object-contain opacity-70"
          aria-hidden
        />
        <div className="flex items-center gap-3">
          <div className="w-12 h-[1px]" style={{
            background: 'linear-gradient(90deg, transparent, rgba(90,86,80,0.4))',
          }} />
          <p className="text-xs tracking-[0.5em] uppercase" style={{
            color: '#4a4640',
            fontFamily: "'Cinzel', serif",
            textShadow: '0 -1px 0 rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03)',
          }}>
            Forged in Fire &bull; Tempered by War &bull; Bound by Honor
          </p>
          <div className="w-12 h-[1px]" style={{
            background: 'linear-gradient(270deg, transparent, rgba(90,86,80,0.4))',
          }} />
        </div>
      </motion.div>
    </div>
  );
}
