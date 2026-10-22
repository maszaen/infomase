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
    <section id="harga" style={{ padding: '70px 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 46px' }}>
          <div style={{ display: 'inline-flex', marginBottom: 12 }}>
            <span className="badge badge-gold">
              <Sparkles size={14} color="#2563eb" />
              Harga Pas di Kantong Mase
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)',
              color: '#0f172a',
              marginBottom: 12,
            }}
          >
            Paket Hemat &amp; Mantap, Sekali Bayar Beres Selamanya!
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Gak pake biaya langganan bulanan. Sekali bayar, langsung sat-set undang semua teman dan keluarga tercinta.
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
            alignItems: 'stretch',
          }}
        >
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                borderRadius: 14,
                padding: '32px 26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: tier.isPopular ? '2px solid #0f172a' : '1px solid #e2e8f0',
                boxShadow: tier.isPopular ? 'var(--shadow-md)' : 'var(--shadow-xs)',
                position: 'relative',
                background: '#ffffff',
              }}
            >
              {tier.badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#0f172a',
                    color: '#ffffff',
                    padding: '3px 14px',
                    borderRadius: 999,
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tier.badge}
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: 6, fontWeight: 700 }}>
                  {tier.name}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                  {tier.description}
                </p>

                {/* Price Display */}
                <div style={{ marginBottom: 20 }}>
                  {tier.originalPrice && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through', display: 'block' }}>
                      {tier.originalPrice}
                    </span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '2.4rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {tier.price}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {tier.period}
                  </span>
                </div>

                <div style={{ height: 1, background: '#f1f5f9', marginBottom: 20 }} />

                {/* Feature List */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                      <Check size={16} color="#059669" style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Link
                href="/dashboard"
                className={`btn ${tier.buttonStyle}`}
                style={{ width: '100%', textDecoration: 'none', borderRadius: 8 }}
              >
                <span>{tier.buttonText}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
