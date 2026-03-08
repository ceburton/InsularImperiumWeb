'use client';

import Link from 'next/link';
import Image from 'next/image';

interface HomeLogoProps {
  className?: string;
}

export default function HomeLogo({ className = '' }: HomeLogoProps) {
  return (
    <span className={`group relative inline-flex items-center ${className}`}>
      <Link href="/" className="flex items-center" aria-label="Home">
        <Image
          src="/assets/insularimperium.png"
          alt="Insular Imperium"
          width={250}
          height={75}
          className="h-[75px] w-auto object-contain"
        />
      </Link>
      <span
        className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded px-3 py-2 text-sm font-semibold uppercase tracking-wider opacity-0 shadow-lg transition-opacity duration-200 pointer-events-none group-hover:opacity-100 z-50"
        style={{
          background: '#0a0a0a',
          color: 'var(--color-parchment)',
          border: '1px solid rgba(236,220,176,0.15)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}
      >
        Home
      </span>
    </span>
  );
}
