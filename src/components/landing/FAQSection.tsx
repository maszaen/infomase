'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Gimana cara sebar undangan dengan nama tamu yang beda-beda?',
      a: 'Gampang banget mase! Di Dashboard Studio ada menu "Daftar Tamu". Tinggal ketik nama tamu (misal: "Budi Santoso & Keluarga"), sistem otomatis bikinin link khusus dan draft pesan WhatsApp yang sopan. Tinggal klik "Salin Teks WA" dan langsung kirim ke kontak tamu.',
    },
    {
      q: 'Bisa ganti foto, teks, sama musiknya gak?',
      a: 'Bisa banget! Mase punya kontrol penuh buat ganti nama pengantin, jadwal akad & resepsi, foto prewedding, cerita cinta, sampai lagu MP3 favorit. Kalau belum ada foto sendiri, kami juga siapin foto prewedding estetik siap pakai.',
    },
    {
      q: 'Amplop digitalnya gimana? Ada potongan admin?',
      a: 'Nol rupiah alias tanpa potongan sepeserpun! Tamu mentransfer langsung ke rekening bank mase (BCA, Mandiri, BSI, dll) atau scan QRIS yang mase pasang. Uang kado 100% masuk ke dompet mase.',
    },
    {
      q: 'Berapa lama proses bikin undangannya?',
      a: 'Cuma 3 sampai 5 menit beres! Template dan susunan acara udah siap pakai. Mase tinggal edit nama, tanggal, lokasi, terus langsung bisa disebar.',
    },
    {
      q: 'Apakah undangannya enteng dibuka di semua HP?',
      a: 'Pasti mase! Desain kami dibikin mobile-first, sangat ringan dan responsif di iPhone, Android, tablet, sampai laptop tanpa lemot.',
    },
  ];

  return (
    <section style={{ padding: '70px 0', background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
      <div className="container" style={{ maxWidth: 840 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', marginBottom: 12 }}>
            <span className="badge badge-gold">
              <HelpCircle size={14} color="#2563eb" />
              Tanya Jawab Sat-Set
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
            Sering Ditanyakan (FAQ)
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Semua hal yang perlu mase tahu tentang kepraktisan bikin undangan digital di InfoMase.
          </p>
        </div>

        {/* Accordions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: isOpen ? '1px solid #0f172a' : '1px solid #e2e8f0',
                  background: '#ffffff',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    background: 'transparent',
                    border: 'none',
                    color: '#0f172a',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    color="#64748b"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {isOpen && (
                  <div style={{ padding: '0 20px 20px', color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
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
