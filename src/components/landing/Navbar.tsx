'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
        transition: 'all 0.2s ease',
        background: '#ffffff',
        borderBottom: isScrolled ? '1px solid #e2e8f0' : '1px solid #f1f5f9',
        padding: '14px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={16} color="#ffffff" />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}
          >
            Info<span style={{ color: '#2563eb' }}>Mase</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: 28 }} className="desktop-nav">
          <a href="#templates" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.15s ease' }}>
            Template Desain
          </a>
          <a href="#fitur" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.15s ease' }}>
            Fitur Utama
          </a>
          <a href="#demo" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.15s ease' }}>
            Coba Langsung
          </a>
          <a href="#harga" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.15s ease' }}>
            Pilihan Paket
          </a>
          <a href="#testimoni" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.15s ease' }}>
            Testimoni
          </a>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            href="/dashboard"
            className="btn btn-sm btn-subtle"
            style={{ display: 'none', fontWeight: 600 }}
            id="nav-dashboard-link"
          >
            Masuk Studio
          </Link>

          <Link
            href="/dashboard"
            className="btn btn-sm btn-gold"
            style={{ textDecoration: 'none', borderRadius: 8 }}
          >
            <span>Bikin Undangan Sat-Set</span>
            <ArrowRight size={14} />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-sm btn-subtle"
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
