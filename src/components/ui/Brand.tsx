import React from 'react';
import Link from 'next/link';

/** Single logo mark used by nav, footer, auth pages and the console rail. */
export function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        background: 'var(--ink-900)',
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
        <path
          d="M5 19V5l7 8 7-8v14"
          stroke="var(--on-inverse)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Wordmark({
  size = 26,
  href = '/',
  tone = 'dark',
  onClick,
}: {
  size?: number;
  href?: string;
  tone?: 'dark' | 'light';
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        textDecoration: 'none',
      }}
    >
      <BrandMark size={size} />
      <span
        style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 700,
          letterSpacing: '-0.022em',
          color: tone === 'light' ? 'var(--on-inverse)' : 'var(--ink-900)',
        }}
      >
        InfoMase
      </span>
    </Link>
  );
}
