'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Rian & Jessica',
      city: 'Jakarta Selatan',
      rating: 5,
      date: 'Pernikahan Oktober 2026',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      text: 'Desainnya bener-bener bersih dan rapi! Tamu-tamu banyak yang memuji karena enteng dibuka di HP, gak ada iklan atau pop-up yang ganggu. Fitur salin nomor rekeningnya juga membantu banget.',
    },
    {
      name: 'dr. Dimas & dr. Nadia',
      city: 'Bandung',
      rating: 5,
      date: 'Pernikahan September 2026',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      text: 'Kami pakai tema Botanical. Sangat anggun namun tetap modern. Generator pesan WhatsApp-nya hemat waktu banget karena kami punya lebih dari 500 kontak untuk diundang.',
    },
    {
      name: 'Bagus & Anindita',
      city: 'Surabaya',
      rating: 5,
      date: 'Pernikahan Agustus 2026',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      text: 'Editornya sangat gampang dipakai! Ganti foto langsung tersimpan, preview live di simulator HP berubah seketika. Gak perlu nunggu admin buat perbaiki typo teks.',
    },
  ];

  return (
    <section id="testimoni" className="section">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 44px' }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            <Star size={13} fill="currentColor" />
            Kisah bahagia
          </div>
          <h2 className="section-title">Dipercaya lebih dari 150.000 pasangan</h2>
          <p className="section-subtitle" style={{ margin: '12px auto 0' }}>
            Cerita dan kesan para mempelai yang menggunakan InfoMase di hari sakral mereka.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {reviews.map((rev) => (
            <figure key={rev.name} className="card card-hover" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 2, color: '#f59e0b' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <Quote size={18} color="var(--border-strong)" />
              </div>

              <blockquote style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.65, flex: 1 }}>
                &ldquo;{rev.text}&rdquo;
              </blockquote>

              <figcaption style={{ display: 'flex', alignItems: 'center', gap: 11, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    flexShrink: 0,
                    display: 'block',
                  }}
                >
                  <img src={rev.avatar} alt={rev.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{rev.name}</div>
                  <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                    {rev.city} • {rev.date}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
