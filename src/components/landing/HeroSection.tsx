'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, Star } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section
      style={{
        paddingTop: '110px',
        paddingBottom: '80px',
        position: 'relative',
        background: '#ffffff',
      }}
    >
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Top Eyebrow Badge */}
        <div style={{ display: 'inline-flex', marginBottom: 20 }}>
          <div
            className="badge badge-gold"
            style={{
              padding: '6px 16px',
              fontSize: '0.85rem',
            }}
          >
            <Sparkles size={14} color="#2563eb" />
            <span>Info acara mase! Bikin undangan digital sat-set, tamu auto merapat.</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#0f172a',
            maxWidth: '920px',
            margin: '0 auto 18px',
            letterSpacing: '-0.03em',
          }}
        >
          Bikin Undangan Digital Sat-Set, <br />
          <span style={{ color: '#2563eb' }}>Tamu Auto Merapat!</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            margin: '0 auto 34px',
            lineHeight: 1.6,
          }}
        >
          Gak perlu pusing cetak kertas dan buang waktu. Sebar undangan pernikahan mewah tinggal klik, lengkap dengan musik syahdu autoplay, amplop QRIS sat-set, navigasi Google Maps anti nyasar, dan RSVP auto rekap!
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 44 }}>
          <Link
            href="/dashboard"
            className="btn btn-lg btn-gold"
            style={{ textDecoration: 'none' }}
          >
            <span>Bikin Undangan Sat-Set</span>
            <ArrowRight size={17} />
          </Link>

          <a
            href="#templates"
            className="btn btn-lg btn-glass"
            style={{ textDecoration: 'none' }}
          >
            <span>Lihat Template Kece</span>
          </a>
        </div>

        {/* Social Proof & Trust Pillars */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            flexWrap: 'wrap',
            color: 'var(--text-secondary)',
            fontSize: '0.86rem',
            marginBottom: 56,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>4.9/5</span>
            <span>(150.000+ Manten Puas)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>Kirim WhatsApp Sat-Set Unlimited</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>Anti Ribet, Langsung Jadi</span>
          </div>
        </div>

        {/* Visual Hero Showcase (Professional Flat Mockup Display) */}
        <div style={{ position: 'relative', maxWidth: 960, margin: '0 auto' }}>
          <div
            style={{
              padding: '24px',
              borderRadius: 20,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 20,
                alignItems: 'center',
              }}
            >
              {/* Feature 1: Rustic Theme preview card */}
              <div
                className="glass-card"
                style={{
                  padding: 16,
                  borderRadius: 14,
                  textAlign: 'left',
                }}
              >
                <div style={{ height: 190, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
                  <img
                    src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80"
                    alt="Rustic Theme"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span className="badge badge-gold" style={{ marginBottom: 6 }}>Tema Rustic Flora</span>
                <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: 4 }}>Aditya &amp; Annisa</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Earthy warm tones dipadukan dengan tipografi klasik dan foto mempesona.
                </p>
              </div>

              {/* Feature 2: Phone mock in center */}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    width: 260,
                    height: 460,
                    borderRadius: 36,
                    background: '#ffffff',
                    border: '8px solid #0f172a',
                    boxShadow: 'var(--shadow-lg)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80"
                    alt="Preview Mobile"
                    style={{ width: '100%', height: '55%', objectFit: 'cover' }}
                  />
                  <div style={{ padding: 16, textAlign: 'center', color: '#0f172a' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', fontWeight: 600 }}>
                      The Wedding Of
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#0f172a', margin: '4px 0' }}>
                      Aditya &amp; Annisa
                    </h3>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 12 }}>
                      Sabtu, 28 November 2026
                    </p>
                    <Link
                      href="/dashboard"
                      className="btn btn-sm btn-gold"
                      style={{ fontSize: '0.72rem', padding: '6px 14px', borderRadius: 6 }}
                    >
                      Buka Undangan
                    </Link>
                  </div>
                </div>
              </div>

              {/* Feature 3: Islamic Emerald Theme preview card */}
              <div
                className="glass-card"
                style={{
                  padding: 16,
                  borderRadius: 14,
                  textAlign: 'left',
                }}
              >
                <div style={{ height: 190, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
                  <img
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80"
                    alt="Islamic Emerald Theme"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span className="badge badge-emerald" style={{ marginBottom: 6 }}>Tema Islamic Emerald</span>
                <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: 4 }}>Nuansa Suci Islami</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Elegan berbalut aksen zamrud sejuk dan ornamen arabesque modern.
                </p>
              </div>
            </div>
          </div>

          {/* Floating Pill Notifs */}
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              top: '-16px',
              left: '-10px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: 'var(--shadow-md)',
              zIndex: 10,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
            <span style={{ fontSize: '0.8rem', color: '#0f172a' }}>
              💌 <strong>dr. Faradilla</strong>: &quot;Gaskeun mas, kami pasti hadir!&quot;
            </span>
          </div>

          <div
            className="animate-float"
            style={{
              position: 'absolute',
              bottom: '-14px',
              right: '-10px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: 'var(--shadow-md)',
              zIndex: 10,
            }}
          >
            <Sparkles size={15} color="#2563eb" />
            <span style={{ fontSize: '0.8rem', color: '#0f172a' }}>
              💳 Amplop QRIS sat-set langsung ke rekening mase
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
