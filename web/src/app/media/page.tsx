'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import HomeLogo from '@/components/HomeLogo';

const GALLERY_ENTRIES = [
  {
    imageSrc: '/assets/difficulty.png',
    title: 'Step 1: Define the Challenge',
    caption: 'Select your preferred difficulty level to match your strategic expertise.',
  },
  {
    imageSrc: '/assets/map size.png',
    title: 'Step 2: Scale the Battlefield',
    caption: 'Choose the map size that fits your desired scope of conquest.',
  },
  {
    imageSrc: '/assets/choose your hero.png',
    title: 'Step 3: Recruit Your Champions',
    caption: 'Select the legendary heroes who will lead your forces into the fray.',
  },
  {
    imageSrc: '/assets/assemble your army.png',
    title: 'Step 4: Muster Your Forces',
    caption: 'Curate a balanced and powerful army ready for the front lines.',
  },
  {
    imageSrc: '/assets/place your ship.png',
    title: 'Step 5: Anchor the Fleet',
    caption: 'Strategically position your vessel to secure your beachhead. You can\'t place your ship too close to enemy units!',
  },
  {
    imageSrc: '/assets/disembark.png',
    title: 'Step 6A: Command the Landing',
    caption: 'Begin the deployment phase by offloading your primary units.',
  },
  {
    imageSrc: '/assets/manifest.png',
    title: 'Step 6B: Tactical Deployment',
    caption: 'Utilize the Manifest interface to drag and drop specialized units directly into action.',
  },
];

const VIDEO_ENTRIES = [
  {
    videoSrc: '/assets/Now-you-will-burn.mp4',
    title: 'Now You Will Burn',
    caption: 'Witness the fiery wrath of the Empire\'s mages as they rain destruction upon the archipelago.',
    poster: '/assets/Now-you-will-burn-poster.png',
  },
  {
    videoSrc: '/assets/It is a hit.mp4',
    title: 'It is a Hit',
    caption: 'A hail of arrows from above proves that the long-range strikes of veteran archers are as deadly as they are precise.',
    poster: '/assets/It-is-a-hit-poster.png',
  },
];

function ScreenshotPlaceholder({ title, caption, imageSrc, onClick }: { title: string; caption: string; imageSrc: string; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={!imgError ? onClick : undefined}
      className={`group relative w-full rounded-lg border-2 overflow-hidden flex flex-col transition-all duration-300 ${!imgError ? 'cursor-zoom-in hover:scale-[1.02] hover:shadow-xl' : ''}`}
      style={{
        borderColor: 'var(--color-bronze-dark)',
        background: 'linear-gradient(135deg, rgba(26,24,20,0.6), rgba(42,38,30,0.5))',
      }}
    >
      <div className="relative w-full aspect-video flex items-center justify-center bg-black/40 overflow-hidden">
        {!imgError ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-bronze-dark opacity-50 text-4xl">⚔</div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-center border-t border-bronze-dark/30 bg-[#1a1814]/80">
        <div className="text-bronze font-bold uppercase tracking-wider text-xs mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
          {title}
        </div>
        <p className="text-parchment-dark/80 text-xs leading-relaxed" style={{ fontFamily: "'EB Garamond', serif" }}>
          {caption}
        </p>
      </div>
    </div>
  );
}

function VideoPlaceholder({ title, caption, videoSrc, poster, onClick }: { title: string; caption: string; videoSrc: string; poster?: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative w-full rounded-lg border-2 overflow-hidden flex flex-col transition-all duration-300 cursor-zoom-in hover:scale-[1.02] hover:shadow-xl"
      style={{
        borderColor: 'var(--color-bronze-dark)',
        background: 'linear-gradient(135deg, rgba(26,24,20,0.6), rgba(42,38,30,0.5))',
      }}
    >
      <div className="relative w-full aspect-video flex items-center justify-center bg-black/60 overflow-hidden">
        {poster ? (
          <Image
            src={poster}
            alt={title}
            fill
            className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-black/80" />
        )}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-bronze/20 border-2 border-bronze flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-bronze/40 shadow-[0_0_20px_rgba(176,141,87,0.4)]">
             <span className="ml-1 text-bronze-light text-2xl drop-shadow-lg group-hover:text-white">▶</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-center border-t border-bronze-dark/30 bg-[#1a1814]/80">
        <div className="text-bronze font-bold uppercase tracking-wider text-xs mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
          {title}
        </div>
        <p className="text-parchment-dark/80 text-xs leading-relaxed" style={{ fontFamily: "'EB Garamond', serif" }}>
          {caption}
        </p>
      </div>
    </div>
  );
}

function ImageModal({ src, alt, caption, onClose }: { src: string; alt: string; caption: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-md cursor-zoom-out"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[95vw] max-h-[90vh] bronze-frame p-1 bg-[#1a1814] overflow-hidden rounded-sm shadow-[0_0_80px_rgba(0,0,0,1)] flex flex-col items-center justify-center"
      >
        <div className="relative w-full h-full flex items-center justify-center p-1">
          <Image
            src={src}
            alt={alt}
            width={1920}
            height={1080}
            className="max-w-full max-h-[85vh] object-contain block"
            unoptimized
            priority
          />
        </div>

        {/* Caption Overlay */}
        <div 
          className="absolute bottom-0 left-0 right-0 p-6 pt-12 text-center"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 50%, transparent 100%)',
          }}
        >
          <div className="text-bronze font-bold uppercase tracking-[0.2em] text-sm md:text-base mb-1" style={{ fontFamily: "'Cinzel', serif", textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {alt}
          </div>
          <p className="text-parchment/90 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'EB Garamond', serif" }}>
            {caption}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-10 h-10 z-50 flex items-center justify-center text-xl font-bold cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-lg border-2"
          style={{
            background: 'linear-gradient(135deg, #4a4a52 0%, #2a2a32 100%)',
            borderColor: '#8a6a30',
            color: '#c4a87a',
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

function VideoModal({ src, title, caption, onClose }: { src: string; title: string; caption: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-md cursor-zoom-out"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[90vw] max-h-[90vh] bronze-frame p-1 bg-[#1a1814] overflow-hidden rounded-sm shadow-[0_0_80px_rgba(0,0,0,1)] flex flex-col items-center justify-center"
      >
        <div className="relative w-full h-full flex items-center justify-center bg-black p-1">
          <video 
            src={src} 
            controls 
            autoPlay 
            className="max-w-full max-h-[75vh] object-contain shadow-2xl"
            controlsList="nodownload"
          />
        </div>

        {/* Caption Overlay */}
        <div 
          className="w-full p-6 text-center border-t border-bronze-dark/30 bg-black/60"
        >
          <div className="text-bronze font-bold uppercase tracking-[0.2em] text-sm md:text-base mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
            {title}
          </div>
          <p className="text-parchment/90 text-sm md:text-base max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'EB Garamond', serif" }}>
            {caption}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-10 h-10 z-50 flex items-center justify-center text-xl font-bold cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-lg border-2"
          style={{
            background: 'linear-gradient(135deg, #4a4a52 0%, #2a2a32 100%)',
            borderColor: '#8a6a30',
            color: '#c4a87a',
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

export default function MediaPage() {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; caption: string } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ src: string; title: string; caption: string } | null>(null);

  return (
    <div className="marble-bg min-h-screen pb-20">
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 w-full border-b flex items-center py-3 px-6 gap-4"
        style={{
          background: 'linear-gradient(180deg, rgba(22,22,24,0.97), rgba(26,24,22,0.95))',
          borderColor: 'var(--color-bronze-dark)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        <HomeLogo />
        <div className="flex-1" />
        <div className="flex gap-4">
          <Link href="/features" className="text-parchment-dark hover:text-bronze transition-colors text-sm font-semibold uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
            Features
          </Link>
          <Link href="/guide" className="text-parchment-dark hover:text-bronze transition-colors text-sm font-semibold uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
            Guide
          </Link>
          <Link href="/dashboard" className="text-parchment-dark hover:text-bronze transition-colors text-sm font-semibold uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
            War Room
          </Link>
        </div>
      </nav>

      <div className="h-24" />

      <main className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 tracking-tight" 
            style={{ fontFamily: "'Cinzel', serif", color: 'var(--color-bronze)' }}
          >
            Media & Gallery
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1 bg-bronze mx-auto mb-6 opacity-50" 
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.3 }}
            className="text-parchment-dark text-lg max-w-2xl mx-auto italic" 
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            A visual chronicle of your journey through the Insular Imperium archipelagos. From initial mobilization to the final disembarkation.
          </motion.p>
        </header>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GALLERY_ENTRIES.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index % 6) }}
            >
              <ScreenshotPlaceholder
                title={entry.title}
                caption={entry.caption}
                imageSrc={entry.imageSrc}
                onClick={() => setSelectedImage({ src: entry.imageSrc, alt: entry.title, caption: entry.caption })}
              />
            </motion.div>
          ))}
        </div>

        {/* Cinematic Archives Section */}
        <section className="mt-24 pt-12 border-t border-bronze/20 text-center">
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-[0.2em]" style={{ fontFamily: "'Cinzel', serif", color: 'var(--color-bronze-dark)' }}>
            Cinematic Archives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {VIDEO_ENTRIES.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
              >
                <VideoPlaceholder
                  title={entry.title}
                  caption={entry.caption}
                  videoSrc={entry.videoSrc}
                  poster={entry.poster}
                  onClick={() => setSelectedVideo({ src: entry.videoSrc, title: entry.title, caption: entry.caption })}
                />
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Lightboxes */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            src={selectedImage.src}
            alt={selectedImage.alt}
            caption={selectedImage.caption}
            onClose={() => setSelectedImage(null)}
          />
        )}
        {selectedVideo && (
          <VideoModal
            src={selectedVideo.src}
            title={selectedVideo.title}
            caption={selectedVideo.caption}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </AnimatePresence>

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
      `}</style>
    </div>
  );
}
