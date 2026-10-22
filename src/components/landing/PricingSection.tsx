'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const tiers = [
    {
      name: 'Paket Uji Coba',
      price: 'Rp 0',
      period: 'Gratis Selamanya',
      description: 'Cocok untuk mencoba fitur dan melihat tampilan undangan sebelum hari H.',
      features: [
        '1 Pilihan Template Standar',
        'Live Editor Teks & Foto',
        'Countdown Timer Hari H',
        'Navigasi Peta Google Maps',
        'Maksimal 20 Tamu RSVP',
      ],
      isPopular: false,
      buttonText: 'Coba Gratisan Dulu',
      buttonStyle: 'btn-glass',
    },
    {
      name: 'Paket Populer',
      price: 'Rp 99.000',
      originalPrice: 'Rp 199.000',
      period: 'Sekali bayar per acara',
      badge: 'Paling Diminati (Hemat 50%)',
      description: 'Pilihan terlengkap dan favorit calon pengantin di seluruh Indonesia.',
      features: [
        'Akses Semua Template Siap Pakai',
        'Kirim Tamu WhatsApp Tanpa Batas',
        'Musik Romantis Latar Autoplay',
        'Amplop Digital Bank & QRIS Instant',
        'Buku Tamu & RSVP Unlimited',
        'Galeri Prewedding 20+ Foto HD',
        'Masa Aktif 1 Tahun Penuh',
      ],
      isPopular: true,
      buttonText: 'Ambil Paket Populer (Paling Laris)',
      buttonStyle: 'btn-gold',
    },
    {
      name: 'Paket Eksklusif VIP',
      price: 'Rp 189.000',
      originalPrice: 'Rp 350.000',
      period: 'Sekali bayar per acara',
      description: 'Paket mewah dengan fitur eksklusif untuk kesan pernikahan tak terlupakan.',
      features: [
        'Semua Fitur Paket Populer',
        'Custom Nama Domain / Subdomain Bebas',
        'Bebas Upload Lagu Pilihan Sendiri',
        'Dukungan Prioritas WhatsApp 24/7',
        'Download Rekap Tamu & Amplop Excel',
        'Masa Aktif Selamanya (Lifetime Archive)',
      ],
      isPopular: false,
      buttonText: 'Bungkus Paket VIP',
      buttonStyle: 'btn-glass',
    },
  ];

  return (
    <section id="harga" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
          <div style={{ display: 'inline-flex', marginBottom: 12 }}>
            <span className="badge badge-gold">
              <Sparkles size={14} />
              Harga Pas di Kantong Mase
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              color: '#ffffff',
              marginBottom: 16,
            }}
          >
            Paket Hemat &amp; Mantap, Sekali Bayar Beres Selamanya!
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Gak pake biaya langganan bulanan. Sekali bayar, langsung sat-set undang semua teman dan keluarga tercinta.
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 28,
            alignItems: 'stretch',
          }}
        >
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                borderRadius: 24,
                padding: '36px 30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: tier.isPopular ? '2px solid var(--gold-400)' : '1px solid var(--border-glass)',
                boxShadow: tier.isPopular ? '0 16px 40px rgba(212, 175, 55, 0.25)' : 'var(--shadow-sm)',
                position: 'relative',
                transform: tier.isPopular ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {tier.badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--gold-gradient)',
                    color: '#0e141f',
                    padding: '4px 16px',
                    borderRadius: 999,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tier.badge}
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: 8, fontWeight: 600 }}>
                  {tier.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                  {tier.description}
                </p>

                {/* Price Display */}
                <div style={{ marginBottom: 24 }}>
                  {tier.originalPrice && (
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through', display: 'block' }}>
                      {tier.originalPrice}
                    </span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: tier.isPopular ? 'var(--gold-300)' : '#ffffff',
                      }}
                    >
                      {tier.price}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {tier.period}
                  </span>
                </div>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 24 }} />

                {/* Feature List */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      <Check size={16} color={tier.isPopular ? '#d4af37' : '#10b981'} style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Link
                href="/dashboard"
                className={`btn ${tier.buttonStyle}`}
                style={{ width: '100%', textDecoration: 'none' }}
              >
                <span>{tier.buttonText}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
