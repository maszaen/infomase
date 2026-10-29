'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const links = [
    { href: '#templates', label: 'Template' },
    { href: '#fitur', label: 'Fitur' },
    { href: '#demo', label: 'Demo' },
    { href: '#harga', label: 'Harga' },
    { href: '#testimoni', label: 'Testimoni' },
  ];

  return (
    <nav className="landing-nav">
      <div className="container">
        <div className="landing-nav-inner">
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: 'var(--brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v6m0 0 4.5 2.6M12 8 7.5 10.6" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 15v7" />
              </svg>
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
              Info<span style={{ color: 'var(--brand)' }}>Mase</span>
            </span>
          </Link>

          <div className="landing-nav-links">
            {links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="btn btn-sm btn-secondary" style={{ textDecoration: 'none' }}>
                  <LayoutDashboard size={14} />
                  <span className="nav-user-label">{user?.name?.split(' ')[0] || 'Konsol'}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="btn btn-sm btn-ghost btn-icon"
                  title="Keluar akun"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-sm btn-ghost nav-login-link" style={{ textDecoration: 'none' }}>
                  Masuk
                </Link>
                <Link href="/register" className="btn btn-sm btn-primary" style={{ textDecoration: 'none' }}>
                  <span>Mulai Gratis</span>
                  <ArrowRight size={14} />
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-sm btn-ghost btn-icon landing-mobile-btn"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="landing-mobile-menu">
          {isAuthenticated && (
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              Dashboard Konsol
            </Link>
          )}
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)}>
              {l.label}
            </a>
          ))}
          {!isAuthenticated && (
            <>
              <a href="/login" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--brand)', fontWeight: 600 }}>
                Masuk
              </a>
              <a
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textAlign: 'center',
                  background: 'var(--brand)',
                  color: '#fff',
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
                Mulai Gratis
              </a>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 560px) {
          .nav-user-label { display: none; }
          .nav-login-link { display: none; }
        }
      `}</style>
    </nav>
  );
};
