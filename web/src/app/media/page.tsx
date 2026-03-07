'use client';

import Link from 'next/link';

export default function MediaPage() {
  return (
    <div className="marble-bg min-h-screen flex flex-col items-center justify-center px-6">
      <Link href="/" className="absolute top-6 left-6 text-sm uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif", color: 'var(--color-bronze)' }}>
        ← Home
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Cinzel', serif", color: 'var(--color-bronze)' }}>
        Media & Gallery
      </h1>
      <p className="text-parchment/80 text-center max-w-md mb-8" style={{ fontFamily: "'EB Garamond', serif" }}>
        Screenshots, trailers, and assets. Coming soon.
      </p>
      <div className="flex gap-4">
        <Link href="/features" className="px-4 py-2 rounded border text-sm uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif", borderColor: 'var(--color-bronze)', color: 'var(--color-parchment)' }}>
          Features
        </Link>
        <Link href="/dashboard" className="px-4 py-2 rounded border text-sm uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif", borderColor: 'var(--color-bronze)', color: 'var(--color-parchment)' }}>
          War Room
        </Link>
      </div>
    </div>
  );
}
