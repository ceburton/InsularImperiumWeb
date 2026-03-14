'use client';

import Link from 'next/link';
import HomeLogo from '@/components/HomeLogo';

export default function GuidePage() {
  return (
    <div className="marble-bg min-h-screen flex flex-col items-center justify-center px-6">
      <div className="absolute top-6 left-6">
        <HomeLogo />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Cinzel', serif", color: 'var(--color-bronze)' }}>
        User Guide
      </h1>
      <p className="text-parchment/80 text-center max-w-md mb-8" style={{ fontFamily: "'EB Garamond', serif" }}>
        Learn the strategies, master the grid, and lead your legions to victory. Guide content coming soon.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="px-4 py-2 rounded border text-sm uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif", borderColor: 'var(--color-bronze)', color: 'var(--color-parchment)' }}>
          Home
        </Link>
        <Link href="/features" className="px-4 py-2 rounded border text-sm uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif", borderColor: 'var(--color-bronze)', color: 'var(--color-parchment)' }}>
          Features
        </Link>
      </div>
    </div>
  );
}
