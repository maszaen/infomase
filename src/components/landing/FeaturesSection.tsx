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
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Music,
      color: '#d4af37',
      title: 'Musik Latar Syahdu',
      description: 'Buka undangan langsung disambut alunan lagu romantis pilihan, vibes hajatan mase langsung berasa banget.',
    },
    {
      icon: CreditCard,
      color: '#10b981',
      title: 'Amplop Digital & QRIS Sat-Set',
      description: 'Tamu tinggal 1-klik salin rekening (BCA, Mandiri, BSI) atau scan QRIS, tanda kasih langsung meluncur tanpa potongan.',
    },
    {
      icon: MapPin,
      color: '#38bdf8',
      title: 'Google Maps Anti Nyasar',
      description: 'Petunjuk arah presisi dan tombol simpan ke Google Calendar, gak ada lagi drama tamu nyasar atau lupa hari H.',
    },
    {
      icon: MessageSquareHeart,
      color: '#f43f5e',
      title: 'RSVP & Tamu Auto Rekap',
      description: 'Konfirmasi kehadiran otomatis, estimasi jumlah porsi katering, plus doa restu hangat dari tamu yang tampil live.',
    },
    {
      icon: Share2,
      color: '#a855f7',
      title: 'Broadcast WhatsApp Personal',
      description: 'Ketik nama tamu, langsung dapet tautan khusus dan draft pesan WA sopan yang siap disebar sat-set.',
    },
    {
      icon: ImageIcon,
      color: '#ec4899',
      title: 'Galeri Prewed HD & Love Story',
      description: 'Pamerin foto prewedding resolusi tinggi dengan zoom lightbox dan linimasa momen manis perjalanan cinta kalian.',
    },
  ];

  return (
    <section id="fitur" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 50px' }}>
          <div style={{ display: 'inline-flex', marginBottom: 12 }}>
            <span className="badge badge-gold">
              <Sparkles size={14} />
              Fitur Sat-Set Anti Mumet
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
            Semua Kebutuhan Hajatan Mase, Beres Sekali Klik!
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Bikin tamu betah scroll dari atas sampai bawah, amplop cair sat-set, dan gak bakal ada yang salah lokasi acara.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '32px 28px',
                  borderRadius: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: `${feat.color}18`,
                    border: `1px solid ${feat.color}35`,
                    color: feat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 20px ${feat.color}15`,
                  }}
                >
                  <Icon size={26} />
                </div>

                <h3
                  style={{
                    fontSize: '1.25rem',
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                >
                  {feat.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.88rem',
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
