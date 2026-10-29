'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      <div className="container" style={{ padding: '56px 24px 28px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32,
            marginBottom: 36,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: 'var(--brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v6m0 0 4.5 2.6M12 8 7.5 10.6" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 15v7" />
                </svg>
              </div>
              <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                Info<span style={{ color: 'var(--brand)' }}>Mase</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, maxWidth: 280 }}>
              Undangan pernikahan digital yang jadi dalam 5 menit. Praktis disebarkan ke WhatsApp
              dan media sosial.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 12.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-3)', marginBottom: 14 }}>
              Navigasi
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13.5 }}>
              {[
                { href: '#templates', label: 'Koleksi Template' },
                { href: '#fitur', label: 'Fitur Unggulan' },
                { href: '#demo', label: 'Coba Simulasi' },
                { href: '#harga', label: 'Pilihan Paket' },
              ].map((l) => (
                <a key={l.href} href={l.href} style={{ color: 'var(--ink-2)', textDecoration: 'none' }}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 12.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-3)', marginBottom: 14 }}>
              Konsol
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13.5 }}>
              <Link href="/dashboard" style={{ color: 'var(--ink-2)', textDecoration: 'none' }}>
                Buka Studio Editor
              </Link>
              <Link href="/invite/raka-sinta" style={{ color: 'var(--ink-2)', textDecoration: 'none' }}>
                Lihat Contoh Undangan
              </Link>
              <Link href="/login" style={{ color: 'var(--ink-2)', textDecoration: 'none' }}>
                Masuk Akun
              </Link>
              <Link href="/register" style={{ color: 'var(--ink-2)', textDecoration: 'none' }}>
                Daftar Gratis
              </Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 12.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-3)', marginBottom: 14 }}>
              Bantuan
            </h4>
            <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55, marginBottom: 8 }}>
              Ada yang mau ditanyakan? Tim kami siap membantu hajatan mase.
            </p>
            <span style={{ fontSize: 13.5, color: 'var(--brand)', fontWeight: 600, display: 'block' }}>
              WhatsApp: +62 812-3456-7890
            </span>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
              Senin–Minggu, 08.00–22.00 WIB
            </span>
          </div>
        </div>

        <div
          style={{
            paddingTop: 20,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
            fontSize: 12.5,
            color: 'var(--ink-3)',
          }}
        >
          <span>&copy; 2026 InfoMase.id — All rights reserved.</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Bikin hajatan lancar jaya &amp; berkesan
            <Heart size={13} fill="#e11d48" color="#e11d48" />
          </span>
        </div>
      </div>
    </footer>
  );
};
