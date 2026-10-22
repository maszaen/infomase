'use client';

import React from 'react';
import {
  Music,
  CreditCard,
  MapPin,
  MessageSquareHeart,
  Share2,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Music,
      color: '#0f172a',
      bgColor: '#f1f5f9',
      title: 'Musik Latar Syahdu',
      description: 'Buka undangan langsung disambut alunan lagu romantis pilihan, vibes hajatan mase langsung berasa banget.',
    },
    {
      icon: CreditCard,
      color: '#059669',
      bgColor: '#ecfdf5',
      title: 'Amplop Digital & QRIS Sat-Set',
      description: 'Tamu tinggal 1-klik salin rekening (BCA, Mandiri, BSI) atau scan QRIS, tanda kasih langsung meluncur tanpa potongan.',
    },
    {
      icon: MapPin,
      color: '#2563eb',
      bgColor: '#eff6ff',
      title: 'Google Maps Anti Nyasar',
      description: 'Petunjuk arah presisi dan tombol simpan ke Google Calendar, gak ada lagi drama tamu nyasar atau lupa hari H.',
    },
    {
      icon: MessageSquareHeart,
      color: '#e11d48',
      bgColor: '#fff1f2',
      title: 'RSVP & Tamu Auto Rekap',
      description: 'Konfirmasi kehadiran otomatis, estimasi jumlah porsi katering, plus doa restu hangat dari tamu yang tampil live.',
    },
    {
      icon: Share2,
      color: '#7c3aed',
      bgColor: '#f5f3ff',
      title: 'Broadcast WhatsApp Personal',
      description: 'Ketik nama tamu, langsung dapet tautan khusus dan draft pesan WA sopan yang siap disebar sat-set.',
    },
    {
      icon: ImageIcon,
      color: '#d97706',
      bgColor: '#fffbeb',
      title: 'Galeri Prewed HD & Love Story',
      description: 'Pamerin foto prewedding resolusi tinggi dengan zoom lightbox dan linimasa momen manis perjalanan cinta kalian.',
    },
  ];

  return (
    <section id="fitur" style={{ padding: '70px 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 46px' }}>
          <div style={{ display: 'inline-flex', marginBottom: 12 }}>
            <span className="badge badge-gold">
              <Sparkles size={14} color="#2563eb" />
              Fitur Sat-Set Anti Mumet
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
            Semua Kebutuhan Hajatan Mase, Beres Sekali Klik!
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Bikin tamu betah scroll dari atas sampai bawah, amplop cair sat-set, dan gak bakal ada yang salah lokasi acara.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 20,
          }}
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '28px 24px',
                  borderRadius: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  background: '#ffffff',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: feat.bgColor,
                    border: `1px solid ${feat.color}20`,
                    color: feat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={22} />
                </div>

                <h3
                  style={{
                    fontSize: '1.15rem',
                    color: '#0f172a',
                    fontWeight: 700,
                  }}
                >
                  {feat.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
