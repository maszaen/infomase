'use client';

import React, { useState } from 'react';
import { ChevronDown, CircleHelp } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Gimana cara sebar undangan dengan nama tamu yang beda-beda?',
      a: 'Di konsol ada menu "Daftar Tamu". Tinggal ketik nama tamu (misal "Budi Santoso & Keluarga"), sistem otomatis membuat link khusus dan draft pesan WhatsApp yang sopan. Klik "Kirim WA" dan langsung terkirim ke kontak tamu.',
    },
    {
      q: 'Bisa ganti foto, teks, dan musiknya?',
      a: 'Bisa. Mase punya kontrol penuh untuk mengganti nama pengantin, jadwal akad & resepsi, foto prewedding, cerita cinta, sampai lagu MP3 favorit. Kalau belum ada foto sendiri, tersedia foto prewedding estetik siap pakai.',
    },
    {
      q: 'Amplop digitalnya ada potongan admin?',
      a: 'Nol rupiah, tanpa potongan sepeser pun. Tamu mentransfer langsung ke rekening bank mase (BCA, Mandiri, BSI, dll) atau scan QRIS yang mase pasang. Uang kado 100% masuk ke dompet mase.',
    },
    {
      q: 'Berapa lama proses bikin undangannya?',
      a: 'Cuma 3–5 menit. Template dan susunan acara sudah siap pakai — tinggal edit nama, tanggal, lokasi, lalu langsung bisa disebarkan.',
    },
    {
      q: 'Apakah undangannya enteng dibuka di semua HP?',
      a: 'Pasti. Desain kami mobile-first, sangat ringan dan responsif di iPhone, Android, tablet, sampai laptop tanpa lemot.',
    },
  ];

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 820 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            <CircleHelp size={13} />
            Tanya jawab
          </div>
          <h2 className="section-title">Pertanyaan yang sering diajukan</h2>
          <p className="section-subtitle" style={{ margin: '12px auto 0' }}>
            Semua yang perlu mase tahu tentang kepraktisan bikin undangan digital di InfoMase.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  overflow: 'hidden',
                  borderColor: isOpen ? 'var(--brand)' : undefined,
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    padding: '15px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 14,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--ink)',
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={17}
                    color="var(--ink-3)"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.18s ease',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {isOpen && (
                  <div style={{ padding: '0 18px 16px', color: 'var(--ink-2)', fontSize: 13.5, lineHeight: 1.65 }}>
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
