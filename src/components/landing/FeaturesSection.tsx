'use client';

import React from 'react';
import {
  Music,
  Wallet,
  MapPin,
  MessageSquareHeart,
  Share2,
  Image as ImageIcon,
  Zap,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Music,
      title: 'Musik latar syahdu',
      description:
        'Undangan terbuka langsung disambut alunan lagu romantis pilihan — vibes hajatan langsung terasa.',
      tint: 'var(--info-bg)',
      color: 'var(--info)',
    },
    {
      icon: Wallet,
      title: 'Amplop digital & QRIS',
      description:
        'Tamu satu klik salin rekening (BCA, Mandiri, BSI) atau scan QRIS. Tanda kasih langsung cair tanpa potongan.',
      tint: 'var(--success-bg)',
      color: 'var(--success)',
    },
    {
      icon: MapPin,
      title: 'Google Maps anti nyasar',
      description:
        'Petunjuk arah presisi dan tombol simpan ke Google Calendar. Tidak ada lagi tamu salah lokasi atau lupa hari H.',
      tint: 'var(--warning-bg)',
      color: 'var(--warning)',
    },
    {
      icon: MessageSquareHeart,
      title: 'RSVP & rekap otomatis',
      description:
        'Konfirmasi kehadiran real-time, estimasi porsi katering otomatis, plus doa restu tamu tampil langsung.',
      tint: 'var(--danger-bg)',
      color: 'var(--danger)',
    },
    {
      icon: Share2,
      title: 'Broadcast WhatsApp personal',
      description:
        'Setiap tamu dapat tautan khusus berisi namanya sendiri di cover undangan, plus draft pesan WA sopan siap kirim.',
      tint: 'var(--info-bg)',
      color: 'var(--info)',
    },
    {
      icon: ImageIcon,
      title: 'Galeri HD & love story',
      description:
        'Pamerkan foto prewedding resolusi tinggi dengan lightbox dan linimasa momen perjalanan cinta kalian.',
      tint: 'var(--success-bg)',
      color: 'var(--success)',
    },
  ];

  return (
    <section id="fitur" className="section">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 48px' }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            <Zap size={13} />
            Semua fitur dalam satu konsol
          </div>
          <h2 className="section-title">Semua kebutuhan hajatan, beres sekali klik</h2>
          <p className="section-subtitle" style={{ margin: '12px auto 0' }}>
            Dibangun agar tamu betah scroll dari atas sampai bawah — dan mase tinggal duduk manis
            memantau semuanya dari satu dashboard.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="card card-hover" style={{ padding: 22 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 'var(--radius-md)',
                    background: feat.tint,
                    color: feat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 14,
                  }}
                >
                  <Icon size={19} />
                </div>

                <h3 style={{ fontSize: 15.5, fontWeight: 600, marginBottom: 6 }}>{feat.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>{feat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Metrics strip */}
        <div
          className="card"
          style={{
            marginTop: 48,
            padding: '28px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 24,
            textAlign: 'center',
            background: 'var(--ink)',
            borderColor: 'var(--ink)',
          }}
        >
          {[
            { value: '150.000+', label: 'Pasangan bahagia' },
            { value: '4.9/5', label: 'Rating pengguna' },
            { value: '5 menit', label: 'Rata-rata bikin undangan' },
            { value: '99,9%', label: 'Uptime tautan undangan' },
          ].map((m) => (
            <div key={m.label}>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{m.value}</div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
