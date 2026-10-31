'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Lock, Search, X } from 'lucide-react';
import { ConsolePageHeader } from '@/components/console/ConsolePageHeader';
import { useInvitationStore } from '@/lib/invitationStore';
import {
  TEMPLATE_CATEGORIES,
  TEMPLATES,
  UPCOMING_TEMPLATES,
  formatIDR,
} from '@/lib/templates';
import type { TemplateCategory } from '@/lib/templates';

export default function CatalogPage() {
  const { invitations, licences } = useInvitationStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | TemplateCategory>('all');

  const ownedTemplateIds = new Set(licences.map((l) => l.templateId));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter((tpl) => {
      const matchesCategory = category === 'all' || tpl.category === category;
      const matchesQuery =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.tagline.toLowerCase().includes(q) ||
        tpl.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  // Categories with zero results would otherwise render as dead filters.
  const availableCategories = TEMPLATE_CATEGORIES.filter(
    (item) => item.id === 'all' || TEMPLATES.some((tpl) => tpl.category === item.id)
  );

  return (
    <>
      <ConsolePageHeader
        title="Katalog template"
        description={`${TEMPLATES.length} desain tersedia · bayar sekali per undangan`}
        actions={
          <Link href="/dashboard" className="btn btn-sm btn-secondary">
            Kembali ke ringkasan
          </Link>
        }
      />

      <div className="page-content stack-5">
        <div className="row-between" style={{ gap: 'var(--space-3)' }}>
          <div className="search-box" style={{ width: 'min(320px, 100%)' }}>
            <Search size={14} className="search-icon" />
            <input
              type="search"
              className="form-input"
              placeholder="Cari template…"
              aria-label="Cari template"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button type="button" className="search-clear" onClick={() => setQuery('')} aria-label="Hapus pencarian">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="row" style={{ gap: 'var(--space-1-5)' }}>
            {availableCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                className="chip"
                aria-pressed={category === item.id}
                onClick={() => setCategory(item.id)}
                style={
                  category === item.id
                    ? { background: 'var(--ink-900)', borderColor: 'var(--ink-900)', color: 'var(--on-inverse)' }
                    : undefined
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state card">
            <Search size={22} />
            <h3>Tidak ada template yang cocok</h3>
            <p>Ubah kata kunci atau pilih kategori lain.</p>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => {
                setQuery('');
                setCategory('all');
              }}
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
            {filtered.map((tpl) => {
              const owned = ownedTemplateIds.has(tpl.id);
              return (
                <article key={tpl.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: 170, background: 'var(--surface-sunken)' }}>
                    <img
                      src={tpl.previewImage}
                      alt={`Pratinjau ${tpl.name}`}
                      width={400}
                      height={170}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <span
                      className="badge"
                      style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        background: 'var(--surface)',
                        borderColor: 'var(--border)',
                      }}
                    >
                      {tpl.category}
                    </span>
                    {owned && (
                      <span className="badge badge-success" style={{ position: 'absolute', top: 10, right: 10 }}>
                        <Check size={11} /> Dimiliki
                      </span>
                    )}
                  </div>

                  <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
                    <div>
                      <div className="row-between" style={{ gap: 8 }}>
                        <h2 style={{ fontSize: 'var(--text-base)' }}>{tpl.name}</h2>
                        <span style={{ fontWeight: 620, fontSize: 'var(--text-sm)' }}>{formatIDR(tpl.price)}</span>
                      </div>
                      <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-0-5)' }}>{tpl.tagline}</p>
                    </div>

                    <ul className="tick-list">
                      {tpl.includes.slice(0, 4).map((item) => (
                        <li key={item} style={{ fontSize: 'var(--text-xs)' }}>
                          <Check size={12} /> {item}
                        </li>
                      ))}
                    </ul>

                    <div className="row" style={{ gap: 'var(--space-1-5)', marginTop: 'auto' }}>
                      {invitations.length > 0 && (
                        <Link
                          href={`/checkout?template=${tpl.id}&undangan=${invitations[0].id}`}
                          className="btn btn-sm btn-buy"
                        >
                          Beli lisensi <ArrowRight size={13} />
                        </Link>
                      )}
                      {tpl.demoSlug && (
                        <Link href={`/invite/${tpl.demoSlug}`} className="btn btn-sm btn-ghost" target="_blank">
                          Pratinjau
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <section>
          <h2 style={{ fontSize: 'var(--text-md)', marginBottom: 4 }}>Dalam pengerjaan</h2>
          <p className="meta" style={{ marginBottom: 'var(--space-3)' }}>
            Belum bisa dibeli. Kami menampilkannya supaya Anda tahu arah desainnya.
          </p>
          <div className="grid-3">
            {UPCOMING_TEMPLATES.map((tpl) => (
              <div key={tpl.id} className="card" style={{ padding: 'var(--space-4)', background: 'var(--surface-sunken)', boxShadow: 'none' }}>
                <div
                  style={{
                    height: 48,
                    borderRadius: 'var(--radius-sm)',
                    background: `linear-gradient(135deg, ${tpl.palette.primary}, ${tpl.palette.accent})`,
                    marginBottom: 'var(--space-3)',
                    opacity: 0.85,
                  }}
                />
                <div className="row-between" style={{ gap: 8 }}>
                  <h3 style={{ fontSize: 'var(--text-sm)' }}>{tpl.name}</h3>
                  <span className="badge" style={{ fontSize: 'var(--text-2xs)' }}>
                    <Lock size={10} /> Segera
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', marginTop: 4 }}>{tpl.tagline}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
