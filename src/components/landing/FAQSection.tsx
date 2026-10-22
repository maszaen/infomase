'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana cara membagikan undangan dengan nama tamu yang berbeda-beda?',
      a: 'Sangat mudah! Di dalam Dashboard Studio Anda terdapat menu "Daftar Tamu". Anda cukup mengetikkan nama tamu (misal: "Budi Santoso & Keluarga"), dan sistem kami otomatis menghasilkan tautan khusus serta draft pesan WhatsApp yang sopan. Anda tinggal klik tombol "Salin Teks WA" dan kirimkan langsung ke WhatsApp tamu.',
    },
    {
      q: 'Apakah bisa mengganti foto, teks, dan musik sesuka hati?',
      a: 'Tentu saja! Anda memiliki kontrol penuh untuk mengubah nama mempelai, cerita cinta, galeri foto prewedding, jadwal akad/resepsi, hingga tautan musik MP3 favorit Anda. Anda juga bisa memilih dari foto preset berkualitas tinggi yang kami sediakan.',
    },
    {
      q: 'Bagaimana cara kerja Amplop Digital? Apakah ada potongan biaya?',
      a: 'Tidak ada potongan biaya sama sekali (0% fee). Tamu Anda akan mentransfer uang langsung ke rekening bank pribadi Anda (BCA, Mandiri, BSI, dll) atau melalui kode QRIS yang Anda pasang. Uang tanda kasih 100% masuk langsung ke rekening Anda.',
    },
    {
      q: 'Berapa lama proses pembuatan undangan online ini?',
      a: 'Hanya butuh 3 hingga 5 menit! Template kami sudah siap pakai lengkap dengan teks kutipan dan susunan acara standar. Anda hanya perlu menyesuaikan nama, tanggal, lokasi, dan foto.',
    },
    {
      q: 'Apakah website undangan ramah dibuka di semua perangkat seluler?',
      a: 'Ya, seluruh template InfoMase dirancang secara modern dengan pendekatan mobile-first. Website akan tampil proporsional, mulus, dan mewah di layar iPhone, Android, tablet, hingga layar laptop/desktop.',
    },
  ];

  return (
    <section style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container" style={{ maxWidth: 840 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', marginBottom: 12 }}>
            <span className="badge badge-gold">
              <HelpCircle size={14} />
              Pertanyaan Umum
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.8vw, 2.8rem)',
              color: '#ffffff',
              marginBottom: 14,
            }}
          >
            Sering Ditanyakan (FAQ)
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Segala informasi yang ingin Anda ketahui tentang kemudahan membuat undangan digital di InfoMase.
          </p>
        </div>

        {/* Accordions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  borderRadius: 18,
                  overflow: 'hidden',
                  border: isOpen ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid var(--border-glass)',
                  transition: 'all 0.3s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    color="var(--gold-400)"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {isOpen && (
                  <div style={{ padding: '0 24px 22px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
