import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Wordmark } from '@/components/ui/Brand';

const POINTS = [
  'Pratinjau undangan di layar ponsel, bukan gambar statis',
  'Satu tautan personal untuk setiap tamu, siap dikirim lewat WhatsApp',
  'RSVP dan jumlah pax masuk otomatis ke rekap katering',
  'Bayar per template — tanpa langganan bulanan',
];

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="auth-shell">
      {/* Brand column: sells the product, not testimonials we can't verify. */}
      <aside className="auth-aside">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Wordmark tone="light" size={26} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              color: 'var(--on-inverse)',
              fontSize: 'var(--text-2xl)',
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              maxWidth: '24ch',
            }}
          >
            Undangan yang tamu Anda benar-benar buka.
          </h2>

          <ul className="stack-3" style={{ marginTop: 'var(--space-6)' }}>
            {POINTS.map((point) => (
              <li
                key={point}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-2-5)',
                  fontSize: 'var(--text-sm)',
                  color: 'rgba(255,255,255,0.78)',
                  lineHeight: 1.55,
                }}
              >
                <span
                  style={{
                    width: 17,
                    height: 17,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 'var(--space-0-5)',
                  }}
                >
                  <Check size={10} color="var(--on-inverse)" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p style={{ position: 'relative', zIndex: 1, fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)' }}>
          InfoMase · undangan digital, dibeli per desain.
        </p>
      </aside>

      <main className="auth-main">
        <div className="auth-panel">
          <div className="auth-mobile-brand">
            <Wordmark size={26} />
          </div>

          <h1 style={{ fontSize: 'var(--text-xl)', letterSpacing: '-0.02em' }}>{title}</h1>
          <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1-5)', marginBottom: 'var(--space-6)' }}>
            {subtitle}
          </p>

          {children}

          <div
            style={{
              marginTop: 'var(--space-6)',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--border)',
              textAlign: 'center',
              fontSize: 'var(--text-sm)',
              color: 'var(--ink-600)',
            }}
          >
            {footer}
          </div>

          <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
            <Link href="/" style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)', textDecoration: 'none' }}>
              ← Kembali ke beranda
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
