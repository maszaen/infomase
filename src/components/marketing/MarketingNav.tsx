'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Wordmark } from '@/components/ui/Brand';
import { useAuth } from '@/lib/authContext';

/** Four destinations, two of which are the actual conversion paths. */
const LINKS = [
  { href: '#template', label: 'Template' },
  { href: '#fitur', label: 'Fitur' },
  { href: '#harga', label: 'Harga' },
  { href: '/invite/raka-sinta', label: 'Contoh undangan' },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="landing-nav">
      <div className="container">
        <div className="landing-nav-inner">
          <Wordmark onClick={() => setOpen(false)} />

          <nav className="landing-nav-links" aria-label="Navigasi utama">
            {LINKS.map((link) =>
              link.href.startsWith('#') ? (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="row" style={{ gap: 'var(--space-2)', flexWrap: 'nowrap' }}>
            {isAuthenticated ? (
              <Link href="/dashboard" className="btn btn-sm btn-primary">
                Konsol {user?.name ? `· ${user.name.split(' ')[0]}` : ''}
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-sm btn-ghost nav-login">
                  Masuk
                </Link>
                <Link href="/register" className="btn btn-sm btn-primary">
                  <span className="nav-cta-label">Buat undangan</span>
                  <ArrowRight size={14} />
                </Link>
              </>
            )}

            <button
              type="button"
              className="btn btn-sm btn-ghost btn-icon landing-mobile-btn"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="landing-mobile-menu">
          {LINKS.map((link) =>
            link.href.startsWith('#') ? (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            )
          )}
          {!isAuthenticated && (
            <Link href="/login" onClick={() => setOpen(false)}>
              Masuk
            </Link>
          )}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 560px) {
          .nav-login,
          .nav-cta-label {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
