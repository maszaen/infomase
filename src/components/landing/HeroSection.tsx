'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Play, Heart, CheckCircle2, ShieldCheck, Star } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section
      style={{
        paddingTop: '130px',
        paddingBottom: '90px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '750px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(14, 165, 233, 0.04) 50%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* Top Eyebrow Badge */}
        <div style={{ display: 'inline-flex', marginBottom: 20 }}>
          <div
            className="badge badge-gold"
            style={{
              padding: '6px 18px',
              fontSize: '0.88rem',
              boxShadow: '0 4px 18px rgba(212, 175, 55, 0.18)',
            }}
          >
            <Sparkles size={15} />
            <span>Info acara mase! Bikin undangan digital sat-set, tamu auto merapat.</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.3rem, 5.2vw, 4.3rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            color: '#ffffff',
            maxWidth: '920px',
            margin: '0 auto 20px',
            letterSpacing: '-0.02em',
          }}
        >
          Bikin Undangan Digital Sat-Set, <br />
          <span className="text-gradient-gold">Tamu Auto Merapat!</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.18rem)',
            color: 'var(--text-secondary)',
            maxWidth: '740px',
            margin: '0 auto 36px',
            lineHeight: 1.6,
          }}
        >
          Gak perlu pusing cetak kertas dan buang waktu. Sebar undangan pernikahan mewah tinggal klik, lengkap dengan musik syahdu autoplay, amplop QRIS sat-set, navigasi Google Maps anti nyasar, dan RSVP auto rekap!
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
          <Link
            href="/dashboard"
            className="btn btn-lg btn-gold"
            style={{ textDecoration: 'none' }}
          >
            <span>Bikin Undangan Sat-Set</span>
            <ArrowRight size={18} />
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
            fontSize: '0.88rem',
            marginBottom: 60,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <span style={{ fontWeight: 600, color: '#ffffff' }}>4.9/5</span>
            <span>(150.000+ Manten Puas)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span>Kirim WhatsApp Sat-Set Unlimited</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span>Anti Ribet, Langsung Jadi</span>
          </div>
        </div>

        {/* Visual Hero Showcase (Multi Mockup Showcase) */}
        <div style={{ position: 'relative', maxWidth: 980, margin: '0 auto' }}>
          {/* Central Mockup Container */}
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              borderRadius: 36,
              background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(16, 22, 34, 0.7) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(212, 175, 55, 0.15)',
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
                  borderRadius: 20,
                  textAlign: 'left',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                }}
              >
                <div style={{ height: 200, borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
                  <img
                    src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80"
                    alt="Rustic Theme"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span className="badge badge-gold" style={{ marginBottom: 6 }}>Tema Rustic &amp; Botanical</span>
                <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: 4 }}>Aditya &amp; Annisa</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Earthy warm tones dipadukan dengan tipografi klasik dan foto mempesona.
                </p>
              </div>

              {/* Feature 2: Phone mock in center */}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    width: 270,
                    height: 480,
                    borderRadius: 36,
                    background: '#0c1524',
                    border: '8px solid #1e293b',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 25px rgba(212, 175, 55, 0.2)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80"
                    alt="Preview Mobile"
                    style={{ width: '100%', height: '55%', objectFit: 'cover' }}
                  />
                  <div style={{ padding: 16, textAlign: 'center', color: '#fff' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#d4af37' }}>
                      Undangan Pernikahan
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: '#d4af37', margin: '4px 0' }}>
                      Aditya &amp; Annisa
                    </h3>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 12 }}>
                      Sabtu, 28 November 2026
                    </p>
                    <Link
                      href="/dashboard"
                      className="btn btn-sm btn-gold"
                      style={{ fontSize: '0.72rem', padding: '6px 14px', borderRadius: 999 }}
                    >
                      Buka Undangan
                    </Link>
                  </div>
                </div>
              </div>

              {/* Feature 3: Royal Gold Theme preview card */}
              <div
                className="glass-card"
                style={{
                  padding: 16,
                  borderRadius: 20,
                  textAlign: 'left',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                }}
              >
                <div style={{ height: 200, borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
                  <img
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80"
                    alt="Islamic Emerald Theme"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span className="badge badge-emerald" style={{ marginBottom: 6 }}>Tema Islamic Emerald</span>
                <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: 4 }}>Nuansa Suci Islami</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Latar hijau zamrud berhias ornamen arabesque emas dan kaligrafi anggun.
                </p>
              </div>
            </div>
          </div>

          {/* Floating Pill Notifs */}
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              top: '-20px',
              left: '-10px',
              background: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: 14,
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: 'var(--shadow-md)',
              zIndex: 10,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '0.8rem', color: '#fff' }}>
              💌 <strong>dr. Faradilla</strong>: "Gaskeun mas, kami sekeluarga hadir!"
            </span>
          </div>

          <div
            className="animate-float"
            style={{
              position: 'absolute',
              bottom: '-15px',
              right: '-10px',
              background: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: 14,
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: 'var(--shadow-md)',
              zIndex: 10,
            }}
          >
            <Sparkles size={16} color="var(--gold-400)" />
            <span style={{ fontSize: '0.8rem', color: '#fff' }}>
              💳 Amplop QRIS sat-set langsung meluncur ke rekening mase
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
