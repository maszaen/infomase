'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const tiers = [
    {
      name: 'Uji Coba',
      price: 'Rp 0',
      period: 'Gratis selamanya',
      description: 'Untuk mencoba fitur dan melihat tampilan undangan sebelum hari H.',
      features: [
        '1 template standar',
        'Live editor teks & foto',
        'Countdown timer hari H',
        'Navigasi Google Maps',
        'Maksimal 20 tamu RSVP',
      ],
      isPopular: false,
      buttonText: 'Coba Gratis',
    },
    {
      name: 'Populer',
      price: 'Rp 99.000',
      originalPrice: 'Rp 199.000',
      period: 'Sekali bayar per acara',
      badge: 'Paling Diminati • Hemat 50%',
      description: 'Pilihan terlengkap dan favorit calon pengantin di seluruh Indonesia.',
      features: [
        'Semua template siap pakai',
        'Tamu WhatsApp tanpa batas',
        'Musik romantis autoplay',
        'Amplop digital bank & QRIS',
        'Buku tamu & RSVP unlimited',
        'Galeri 20+ foto HD',
        'Masa aktif 1 tahun',
      ],
      isPopular: true,
      buttonText: 'Ambil Paket Populer',
    },
    {
      name: 'VIP Eksklusif',
      price: 'Rp 189.000',
      originalPrice: 'Rp 350.000',
      period: 'Sekali bayar per acara',
      description: 'Paket mewah dengan fitur eksklusif untuk kesan tak terlupakan.',
      features: [
        'Semua fitur paket Populer',
        'Custom nama domain bebas',
        'Upload lagu pilihan sendiri',
        'Dukungan prioritas WhatsApp 24/7',
        'Download rekap tamu Excel',
        'Lifetime archive',
      ],
      isPopular: false,
      buttonText: 'Bungkus Paket VIP',
    },
  ];

  return (
    <section id="harga" className="section section-sunken">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            <Sparkles size={13} />
            Harga pas di kantong
          </div>
          <h2 className="section-title">Sekali bayar, beres selamanya</h2>
          <p className="section-subtitle" style={{ margin: '12px auto 0' }}>
            Tanpa langganan bulanan. Sekali bayar, langsung sebar undangan ke semua teman dan
            keluarga tercinta.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18, alignItems: 'stretch' }}>
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="card"
              style={{
                padding: 26,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                borderColor: tier.isPopular ? 'var(--brand)' : undefined,
                borderWidth: tier.isPopular ? 2 : 1,
                boxShadow: tier.isPopular ? 'var(--shadow-md)' : 'var(--shadow-xs)',
              }}
            >
              {tier.badge && (
                <span
                  className="badge"
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--brand)',
                    color: '#fff',
                    border: 'none',
                    whiteSpace: 'nowrap',
                    fontWeight: 600,
                  }}
                >
                  {tier.badge}
                </span>
              )}

              <div style={{ marginBottom: 18 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>{tier.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 4, minHeight: 38, lineHeight: 1.5 }}>
                  {tier.description}
                </p>

                <div style={{ marginTop: 14 }}>
                  {tier.originalPrice && (
                    <span style={{ fontSize: 13, color: 'var(--ink-3)', textDecoration: 'line-through' }}>
                      {tier.originalPrice}
                    </span>
                  )}
                  <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.15 }}>
                    {tier.price}
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{tier.period}</span>
                </div>
              </div>

              <hr className="divider" style={{ marginBottom: 16 }} />

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, flex: 1, marginBottom: 22 }}>
                {tier.features.map((feat) => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13.5, color: 'var(--ink-2)' }}>
                    <Check size={15} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`btn ${tier.isPopular ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: '100%', textDecoration: 'none' }}
              >
                <span>{tier.buttonText}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--ink-3)', marginTop: 28 }}>
          Pembayaran aman via transfer bank, QRIS, dan e-wallet. Bantuan setup gratis untuk semua paket.
        </p>
      </div>
    </section>
  );
};
