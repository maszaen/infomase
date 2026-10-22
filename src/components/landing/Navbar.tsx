'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Menu, X, Heart } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: isScrolled ? 'rgba(10, 13, 20, 0.9)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
        padding: '16px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--gold-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)',
            }}
          >
            <Sparkles size={18} color="#0c1017" />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.45rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.01em',
            }}
          >
            Info<span className="text-gradient-gold">Mase</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: 28 }} className="desktop-nav">
          <a href="#templates" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', transition: 'color 0.2s ease' }}>
            Template Desain
          </a>
          <a href="#fitur" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', transition: 'color 0.2s ease' }}>
            Fitur Utama
          </a>
          <a href="#demo" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', transition: 'color 0.2s ease' }}>
            Coba Langsung
          </a>
          <a href="#harga" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', transition: 'color 0.2s ease' }}>
            Pilihan Paket
          </a>
          <a href="#testimoni" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', transition: 'color 0.2s ease' }}>
            Testimoni
          </a>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/dashboard"
            className="btn btn-sm btn-glass"
            style={{ display: 'none' }}
            id="nav-dashboard-link"
          >
            Masuk Studio
          </Link>

          <Link
            href="/dashboard"
            className="btn btn-sm btn-gold"
            style={{ textDecoration: 'none' }}
          >
            <span>Bikin Undangan Sat-Set</span>
            <ArrowRight size={14} />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-sm btn-glass"
            style={{ padding: '8px', display: 'none' }}
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          #nav-dashboard-link {
            display: inline-flex !important;
          }
        }
        @media (max-width: 767px) {
          #mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </nav>
  );
};
