'use client';

import React from 'react';
import { Star, Heart, Quote, Sparkles } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Rian & Jessica',
      city: 'Jakarta Selatan',
      rating: 5,
      date: 'Pernikahan Oktober 2026',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      text: 'Desainnya bener-bener mewah! Tamu-tamu undangan banyak yang memuji lagunya yang syahdu dan kemudahan konfirmasi kehadiran. Fitur salin rekeningnya juga ngebantu banget bagi tamu yang berhalangan hadir.',
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
      text: 'Editornya sangat intuitif! Bisa ganti foto langsung, preview live di HP langsung berubah seketika. Support-nya responsif dan website undangan sangat cepat diakses tanpa lemot.',
    },
  ];

  return (
    <section id="testimoni" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
          <div style={{ display: 'inline-flex', marginBottom: 12 }}>
            <span className="badge badge-gold">
              <Sparkles size={14} />
              Kisah Bahagia
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
            Dipercaya Oleh Lebih Dari 150.000 Pasangan
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Lihat cerita dan kesan bahagia para mempelai yang telah menggunakan InfoMase untuk hari sakral mereka.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '30px 26px',
                borderRadius: 22,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Stars & Quote Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 4, color: '#f59e0b' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <Quote size={24} color="var(--gold-400)" style={{ opacity: 0.5 }} />
                </div>

                <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 24 }}>
                  "{rev.text}"
                </p>
              </div>

              {/* Author Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid var(--gold-400)',
                    flexShrink: 0,
                  }}
                >
                  <img src={rev.avatar} alt={rev.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>{rev.name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
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
