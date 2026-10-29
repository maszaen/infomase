'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Star, HeartHandshake, Copy, Wallet, Music4, MapPin } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section style={{ paddingTop: 132, paddingBottom: 96, background: 'var(--surface)', position: 'relative' }}>
      {/* Subtle grid backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(29,29,32,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(29,29,32,0.035) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%, #000 55%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%, #000 55%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative' }}>
        <div style={{ textAlign: 'center', maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', marginBottom: 20 }}>
            <span className="badge badge-blue" style={{ padding: '4px 12px', fontSize: 12.5 }}>
              <Star size={12} fill="currentColor" />
              Dipercaya 150.000+ pasangan di Indonesia
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5.4vw, 3.6rem)',
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              marginBottom: 20,
            }}
          >
            Undangan pernikahan digital,
            <br />
            <span style={{ color: 'var(--brand)' }}>jadi dalam 5 menit.</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.98rem, 1.8vw, 1.14rem)',
              color: 'var(--ink-2)',
              maxWidth: 640,
              margin: '0 auto 32px',
              lineHeight: 1.65,
            }}
          >
            Kelola semuanya dari satu konsol: editor live, tamu WhatsApp personal, RSVP real-time,
            amplop digital QRIS, dan Google Maps anti nyasar. Tanpa cetak kertas, tanpa ribet.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 36,
            }}
          >
            <Link href="/register" className="btn btn-lg btn-primary" style={{ textDecoration: 'none' }}>
              <span>Buat Undangan Gratis</span>
              <ArrowRight size={16} />
            </Link>
            <a href="#demo" className="btn btn-lg btn-secondary" style={{ textDecoration: 'none' }}>
              Coba Demo Langsung
            </a>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 22,
              flexWrap: 'wrap',
              color: 'var(--ink-3)',
              fontSize: 12.5,
              fontWeight: 500,
            }}
          >
            {['Tanpa kartu kredit', 'Template premium gratis', 'Live preview real-time'].map((t) => (
              <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Check size={14} color="var(--success)" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Product visual: console window + phone */}
        <div style={{ maxWidth: 980, margin: '56px auto 0', position: 'relative' }}>
          {/* Browser frame */}
          <div className="card" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                background: 'var(--surface-hover)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f97066' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#fcbf25' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#57ab5a' }} />
              <div
                style={{
                  flex: 1,
                  maxWidth: 320,
                  margin: '0 auto',
                  textAlign: 'center',
                  fontSize: 12,
                  color: 'var(--ink-3)',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '3px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                infomase.id/dashboard
              </div>
            </div>

            <div style={{ display: 'flex', background: 'var(--canvas)' }}>
              {/* Mini sidebar */}
              <div
                style={{
                  width: 172,
                  flexShrink: 0,
                  borderRight: '1px solid var(--border)',
                  background: 'var(--surface)',
                  padding: '12px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
                className="hero-mini-sidebar"
              >
                {[
                  { label: 'Ringkasan', active: true },
                  { label: 'Studio Editor' },
                  { label: 'Daftar Tamu' },
                  { label: 'RSVP & Katering' },
                  { label: 'Langganan' },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 12,
                      fontWeight: item.active ? 600 : 500,
                      color: item.active ? 'var(--brand)' : 'var(--ink-2)',
                      background: item.active ? 'var(--brand-subtle)' : 'transparent',
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 2,
                        background: 'currentColor',
                        opacity: item.active ? 1 : 0.35,
                      }}
                    />
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Console content */}
              <div style={{ flex: 1, padding: 16, minWidth: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }} className="hero-stats-grid">
                  {[
                    { label: 'Tamu Terundang', value: '248' },
                    { label: 'Konfirmasi Hadir', value: '186' },
                    { label: 'Estimasi Pax', value: '335' },
                  ].map((s) => (
                    <div key={s.label} className="card" style={{ padding: '12px 14px', boxShadow: 'none' }}>
                      <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-3)' }}>
                        {s.label}
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="card" style={{ marginTop: 10, padding: 14, boxShadow: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>Checklist Persiapan</span>
                    <span className="badge badge-success" style={{ fontSize: 10.5 }}>67%</span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar" style={{ width: '67%' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                    {['Biodata', 'Acara', 'Amplop', 'Galeri', 'Tamu'].map((c, i) => (
                      <span
                        key={c}
                        className="badge"
                        style={{
                          fontSize: 10.5,
                          background: i < 3 ? 'var(--success-bg)' : 'var(--surface-sunken)',
                          color: i < 3 ? 'var(--success)' : 'var(--ink-3)',
                          border: `1px solid ${i < 3 ? 'var(--success-border)' : 'var(--border)'}`,
                        }}
                      >
                        {i < 3 && <Check size={10} />}
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ marginTop: 10, padding: 14, boxShadow: 'none' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>
                    Tamu Terbaru
                  </div>
                  {[
                    { name: 'dr. Faradilla', msg: '"Gaskeun mas, kami pasti hadir!"', done: true },
                    { name: 'Keluarga Bpk. Surya', msg: '"Insya Allah hadir, 4 orang"', done: true },
                    { name: 'Tim Engineering', msg: '"Siap! Sudah save the date"', done: false },
                  ].map((r) => (
                    <div
                      key={r.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '7px 0',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      <span className="status-dot" style={{ background: r.done ? '#2da44e' : 'var(--ink-3)' }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.msg}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating phone */}
          <div className="hero-phone-wrap">
            <div
              style={{
                width: 172,
                borderRadius: 22,
                border: '5px solid #14161a',
                overflow: 'hidden',
                background: '#faf7f2',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <img
                src="/template/undangan_1/img/foto_mempelai_dummy.jpg"
                alt="Preview undangan digital"
                style={{ width: '100%', height: 230, objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 8.5, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#786755', fontWeight: 600 }}>
                  The Wedding Of
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 600, color: '#382e25', marginTop: 2 }}>
                  Raka &amp; Sinta
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 7 }}>
                  <span style={{ fontSize: 8, color: '#8c735b' }}>
                    <Music4 size={9} style={{ verticalAlign: -1 }} /> Musik
                  </span>
                  <span style={{ fontSize: 8, color: '#8c735b' }}>
                    <MapPin size={9} style={{ verticalAlign: -1 }} /> Maps
                  </span>
                  <span style={{ fontSize: 8, color: '#8c735b' }}>
                    <Wallet size={9} style={{ verticalAlign: -1 }} /> QRIS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating pills */}
          <div
            className="animate-float hero-pill"
            style={{
              position: 'absolute',
              top: -14,
              left: -8,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 13px',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <span className="status-dot status-dot-live" />
              <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)' }}>
                186 tamu konfirmasi hadir
              </span>
            </div>
          </div>

          <div
            className="animate-float hero-pill"
            style={{
              position: 'absolute',
              bottom: -14,
              right: -8,
              animationDelay: '1.2s',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 13px',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <HeartHandshake size={15} color="var(--brand)" />
              <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)' }}>
                Amplop QRIS langsung cair
              </span>
            </div>
          </div>
        </div>

        {/* Trust logos row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            flexWrap: 'wrap',
            marginTop: 72,
            color: 'var(--ink-3)',
            fontSize: 13,
            fontWeight: 600,
            opacity: 0.85,
          }}
        >
          {['BCA', 'MANDIRI', 'BSI', 'QRIS', 'Google Maps', 'WhatsApp'].map((b) => (
            <span key={b} style={{ letterSpacing: '0.08em' }}>
              {b}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hero-phone-wrap {
          position: absolute;
          right: -26px;
          bottom: -34px;
          display: none;
        }

        .hero-pill {
          display: none;
        }

        @media (min-width: 900px) {
          .hero-phone-wrap { display: block; }
          .hero-pill { display: block; }
        }

        @media (max-width: 640px) {
          .hero-mini-sidebar { display: none; }
          .hero-stats-grid { grid-template-columns: 1fr; }
        }

        @media (min-width: 641px) and (max-width: 899px) {
          .hero-stats-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </section>
  );
};
