'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: '#07090e',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '60px 0 30px',
        position: 'relative',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 40,
            marginBottom: 48,
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--gold-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={16} color="#0c1017" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>
                Info<span className="text-gradient-gold">Mase</span>
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 290 }}>
              Info acara mase! Bikin undangan digital sat-set, tamu auto merapat. Praktis disebarkan ke WhatsApp dan media sosial.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: 16, fontWeight: 600 }}>Navigasi</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <a href="#templates">Koleksi Template</a>
              <a href="#fitur">Fitur Unggulan</a>
              <a href="#demo">Coba Simulasi</a>
              <a href="#harga">Pilihan Paket</a>
            </div>
          </div>

          {/* Studio Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: 16, fontWeight: 600 }}>Dashboard</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <Link href="/dashboard">Buka Studio Editor</Link>
              <Link href="/invite/aditya-annisa">Lihat Contoh Undangan</Link>
              <Link href="/dashboard">Generator Link WA</Link>
              <Link href="/dashboard">Buku Tamu / RSVP</Link>
            </div>
          </div>

          {/* Contact / Service */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: 16, fontWeight: 600 }}>Bantuan</h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
              Butuh bantuan atau kustomisasi khusus? Hubungi tim support kami:
            </p>
            <span style={{ fontSize: '0.86rem', color: 'var(--gold-300)', fontWeight: 600, display: 'block' }}>
              WhatsApp: +62 812-3456-7890
            </span>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Senin - Minggu: 08.00 - 22.00 WIB
            </span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            paddingTop: 24,
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
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
