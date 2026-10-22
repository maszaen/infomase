'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '50px 0 24px',
        position: 'relative',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 36,
            marginBottom: 40,
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  background: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={14} color="#ffffff" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                Info<span style={{ color: '#2563eb' }}>Mase</span>
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 290 }}>
              Info acara mase! Bikin undangan digital sat-set, tamu auto merapat. Praktis disebarkan ke WhatsApp dan media sosial.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#0f172a', marginBottom: 14, fontWeight: 700 }}>Navigasi</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <a href="#templates">Koleksi Template</a>
              <a href="#fitur">Fitur Unggulan</a>
              <a href="#demo">Coba Simulasi</a>
              <a href="#harga">Pilihan Paket</a>
            </div>
          </div>

          {/* Studio Links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#0f172a', marginBottom: 14, fontWeight: 700 }}>Dashboard Studio</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Link href="/dashboard">Buka Studio Editor</Link>
              <Link href="/invite/aditya-annisa">Lihat Contoh Undangan</Link>
              <Link href="/dashboard">Generator Link WA</Link>
              <Link href="/dashboard">Buku Tamu / RSVP</Link>
            </div>
          </div>

          {/* Contact / Service */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#0f172a', marginBottom: 14, fontWeight: 700 }}>Bantuan &amp; Konsultasi</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 6 }}>
              Ada yang mau ditanyakan? Tim kami siap bantu hajatan mase:
            </p>
            <span style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600, display: 'block' }}>
              WhatsApp: +62 812-3456-7890
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Senin - Minggu: 08.00 - 22.00 WIB
            </span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            paddingTop: 20,
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            &copy; 2026 InfoMase.id • All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Bikin hajatan mase lancar jaya &amp; berkesan</span>
            <Heart size={14} fill="#e11d48" color="#e11d48" />
          </div>
        </div>
      </div>
    </footer>
  );
};
