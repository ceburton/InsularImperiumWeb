'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  variant?: 'parchment' | 'obsidian';
}

export default function ScrollReveal({ children, isOpen, onClose, title, variant = 'parchment' }: ScrollRevealProps) {
  const isParchment = variant === 'parchment';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — heavy vignette */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.85) 100%)',
              backdropFilter: 'blur(3px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Scroll container */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto ${
                isParchment ? 'parchment-card' : 'obsidian-panel'
              } p-8`}
              initial={{ scaleY: 0.03, opacity: 0, filter: 'brightness(0.5)' }}
              animate={{ scaleY: 1, opacity: 1, filter: 'brightness(1)' }}
              exit={{ scaleY: 0.03, opacity: 0, filter: 'brightness(0.5)' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }}
              style={{
                transformOrigin: 'top center',
                boxShadow: '0 12px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              {/* ── Scroll rod TOP ── */}
              <div className="absolute top-0 left-3 right-3 h-4 z-10" style={{
                background: 'linear-gradient(180deg, #9a7a40 0%, #c4a060 25%, #b08d57 50%, #8a6a30 75%, #6a5020 100%)',
                borderRadius: '3px',
                boxShadow: '0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 2px rgba(0,0,0,0.3)',
              }}>
                {/* Rod end caps */}
                <div className="absolute -left-1.5 top-0 bottom-0 w-3 rounded-l" style={{
                  background: 'radial-gradient(ellipse at 40% 40%, #d4a84a, #6a5020)',
                  boxShadow: '-1px 0 3px rgba(0,0,0,0.4)',
                }} />
                <div className="absolute -right-1.5 top-0 bottom-0 w-3 rounded-r" style={{
                  background: 'radial-gradient(ellipse at 60% 40%, #d4a84a, #6a5020)',
                  boxShadow: '1px 0 3px rgba(0,0,0,0.4)',
                }} />
                {/* Wood grain lines */}
                <div className="absolute inset-0 opacity-15" style={{
                  background: 'repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(0,0,0,0.15) 12px, transparent 13px)',
                }} />
              </div>

              {/* ── Close rivet ── */}
              <button
                onClick={onClose}
                className="absolute top-6 right-5 w-9 h-9 flex items-center justify-center z-20"
                style={{
                  background: 'radial-gradient(circle at 38% 32%, #d4a84a 0%, #8a6a30 50%, #5a4020 100%)',
                  borderRadius: '50%',
                  border: '1px solid #4a3018',
                  boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.2), 0 2px 6px rgba(0,0,0,0.5)',
                  color: '#2e1a10',
                  fontSize: '13px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  textShadow: '0 1px 0 rgba(255,255,255,0.15)',
                }}
              >
                ✕
              </button>

              {/* ── Heading ── */}
              <h2
                className="engraved-deep text-2xl md:text-3xl font-black mt-6 mb-6 text-center tracking-wide"
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: isParchment ? '#4a3828' : '#00ff41',
                }}
              >
                {title}
              </h2>

              {/* Content */}
              <div className="relative">
                {children}
              </div>

              {/* ── Scroll rod BOTTOM ── */}
              <div className="absolute bottom-0 left-3 right-3 h-4 z-10" style={{
                background: 'linear-gradient(180deg, #6a5020 0%, #8a6a30 25%, #b08d57 50%, #c4a060 75%, #9a7a40 100%)',
                borderRadius: '3px',
                boxShadow: '0 -3px 8px rgba(0,0,0,0.5), inset 0 -1px 0 rgba(255,255,255,0.2), inset 0 1px 2px rgba(0,0,0,0.3)',
              }}>
                <div className="absolute -left-1.5 top-0 bottom-0 w-3 rounded-l" style={{
                  background: 'radial-gradient(ellipse at 40% 60%, #d4a84a, #6a5020)',
                  boxShadow: '-1px 0 3px rgba(0,0,0,0.4)',
                }} />
                <div className="absolute -right-1.5 top-0 bottom-0 w-3 rounded-r" style={{
                  background: 'radial-gradient(ellipse at 60% 60%, #d4a84a, #6a5020)',
                  boxShadow: '1px 0 3px rgba(0,0,0,0.4)',
                }} />
                <div className="absolute inset-0 opacity-15" style={{
                  background: 'repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(0,0,0,0.15) 12px, transparent 13px)',
                }} />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
