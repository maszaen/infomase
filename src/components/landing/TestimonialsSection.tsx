'use client';

import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Rian & Jessica',
      city: 'Jakarta Selatan',
      rating: 5,
      date: 'Pernikahan Oktober 2026',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      text: 'Desainnya bener-bener bersih dan rapi! Tamu-tamu banyak yang muji karena enteng banget dibuka di HP, gak ada iklan atau pop-up ganggu. Fitur salin nomor rekeningnya juga ngebantu banget bagi yang transfer kado.',
    },
    {
      name: 'dr. Dimas & dr. Nadia',
      city: 'Bandung',
      rating: 5,
      date: 'Pernikahan September 2026',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      text: 'Kami pakai tema Islamic Emerald. Sangat anggun dan syar’i namun tetap modern. Generator pesan WhatsApp-nya hemat waktu banget karena kami punya lebih dari 500 kontak untuk diundang.',
    },
    {
      name: 'Bagus & Anindita',
      city: 'Surabaya',
      rating: 5,
      date: 'Pernikahan Agustus 2026',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      text: 'Editornya sangat gampang dipake! Bisa ganti foto langsung, preview live di simulator HP langsung berubah seketika. Gak perlu nunggu admin buat ubah typo teks.',
    },
  ];

  return (
    <section id="testimoni" style={{ padding: '70px 0', background: '#ffffff' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 44px' }}>
          <div style={{ display: 'inline-flex', marginBottom: 12 }}>
            <span className="badge badge-gold">
              <Sparkles size={14} color="#2563eb" />
              Kisah Bahagia
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
            Dipercaya Oleh Lebih Dari 150.000 Pasangan
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Lihat cerita dan kesan bahagia para mempelai yang telah menggunakan InfoMase untuk hari sakral mereka.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 22,
          }}
        >
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '26px 22px',
                borderRadius: 14,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#ffffff',
              }}
            >
              <div>
                {/* Stars & Quote Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 3, color: '#f59e0b' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <Quote size={20} color="#cbd5e1" />
                </div>

                <p style={{ fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.6, marginBottom: 20 }}>
                  &quot;{rev.text}&quot;
                </p>
              </div>

              {/* Author Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    flexShrink: 0,
                  }}
                >
                  <img src={rev.avatar} alt={rev.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{rev.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {rev.city} • {rev.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
