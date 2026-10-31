import React from 'react';
import Link from 'next/link';
import { Wordmark } from '@/components/ui/Brand';

const COLUMNS = [
  {
    title: 'Produk',
    links: [
      { href: '#template', label: 'Katalog template' },
      { href: '#fitur', label: 'Fitur undangan' },
      { href: '#harga', label: 'Harga' },
      { href: '/invite/raka-sinta', label: 'Contoh undangan' },
    ],
  },
  {
    title: 'Konsol',
    links: [
      { href: '/dashboard', label: 'Buka konsol' },
      { href: '/dashboard?view=orders', label: 'Pesanan saya' },
      { href: '/login', label: 'Masuk' },
      { href: '/register', label: 'Daftar' },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div className="container" style={{ paddingBlock: 'var(--space-12)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.6fr) repeat(2, minmax(0, 1fr)) minmax(0, 1.2fr)',
            gap: 'var(--space-8)',
          }}
          className="footer-grid"
        >
          <div>
            <Wordmark />
            <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)', maxWidth: '32ch' }}>
              Template undangan pernikahan digital, dibeli per desain. Sekali bayar, satu acara, tanpa
              langganan.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="label" style={{ marginBottom: 'var(--space-3)' }}>
                {column.title}
              </h2>
              <div className="stack-2">
                {column.links.map((link) =>
                  link.href.startsWith('#') ? (
                    <a
                      key={link.href}
                      href={link.href}
                      style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-600)', textDecoration: 'none' }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-600)', textDecoration: 'none' }}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}

          <div>
            <h2 className="label" style={{ marginBottom: 'var(--space-3)' }}>
              Bantuan
            </h2>
            <p style={{ fontSize: 'var(--text-sm)' }}>
              Pertanyaan soal pesanan atau desain? Hubungi kami dan sebutkan nomor referensi Anda.
            </p>
            <a
              href="https://wa.me/6281234567890"
              style={{ fontSize: 'var(--text-sm)', fontWeight: 600, display: 'inline-block', marginTop: 'var(--space-2)' }}
            >
              WhatsApp +62 812-3456-7890
            </a>
            <div className="meta" style={{ marginTop: 'var(--space-0-5)' }}>
              Senin–Sabtu, 09.00–21.00 WIB
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            marginTop: 'var(--space-10)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <span className="meta">© 2026 InfoMase. Seluruh hak cipta dilindungi.</span>
          <span className="meta">Dibuat untuk pasangan yang tidak ingin ribet.</span>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 860px) { .footer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }
            @media (max-width: 520px) { .footer-grid { grid-template-columns: minmax(0, 1fr) !important; } }
          `,
        }}
      />
    </footer>
  );
}
