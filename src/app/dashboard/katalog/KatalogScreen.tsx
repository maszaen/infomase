'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Lock, Search, X } from 'lucide-react';
import { ConsolePageHeader } from '@/components/console/ConsolePageHeader';
import { useConsoleChrome } from '@/components/console/ConsoleChrome';
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
  const { openCreate } = useConsoleChrome();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | TemplateCategory>('all');

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
        <div className="page-section">
          <div className="editor-toolbar">
            <div className="search-box">
              <Search size={14} className="search-icon" />
              <input
                type="search"
                className="form-input"
                placeholder="Cari nama, gaya, atau kategori…"
                aria-label="Cari template"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setQuery('')}
                  aria-label="Hapus pencarian"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <span className="meta" style={{ marginLeft: 'auto' }}>
              {filtered.length} dari {TEMPLATES.length} desain
            </span>
          </div>

          <div className="filter-scroll" role="group" aria-label="Filter kategori">
            {availableCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`chip${category === item.id ? ' is-active' : ''}`}
                aria-pressed={category === item.id}
                onClick={() => setCategory(item.id)}
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
          <div className="template-grid">
            {filtered.map((tpl) => {
              const licence = licences.find((l) => l.templateId === tpl.id);
              const owned = Boolean(licence);
              return (
                <article key={tpl.id} className="card template-card">
                  <div className="template-card-media">
                    <img
                      src={tpl.previewImage}
                      alt={`Pratinjau ${tpl.name}`}
                      width={400}
                      height={168}
                      loading="lazy"
                    />
                    <span
                      className="badge"
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: 'var(--surface)',
                        borderColor: 'var(--border)',
                      }}
                    >
                      {tpl.category}
                    </span>
                    {owned && (
                      <span className="badge badge-success" style={{ position: 'absolute', top: 8, right: 8 }}>
                        <Check size={11} /> Dimiliki
                      </span>
                    )}
                  </div>

                  <div className="template-card-body">
                    <div>
                      <div className="template-card-head">
                        <h2 className="template-card-title">{tpl.name}</h2>
                        <span className="template-card-price">{formatIDR(tpl.price)}</span>
                      </div>
                      <p className="template-card-tagline">{tpl.tagline}</p>
                    </div>

                    <ul className="tick-list">
                      {tpl.includes.slice(0, 4).map((item) => (
                        <li key={item}>
                          <Check size={12} /> {item}
                        </li>
                      ))}
                    </ul>

                    <div className="template-card-actions">
                      {owned && licence ? (
                        <Link
                          href={`/dashboard/undangan/${licence.invitationId}/design`}
                          className="btn btn-sm btn-secondary"
                        >
                          Kelola undangan <ArrowRight size={12} />
                        </Link>
                      ) : invitations.length > 0 ? (
                        <Link
                          href={`/checkout?template=${tpl.id}&undangan=${invitations[0].id}`}
                          className="btn btn-sm btn-buy"
                        >
                          Beli lisensi <ArrowRight size={12} />
                        </Link>
                      ) : (
                        <button type="button" className="btn btn-sm btn-buy" onClick={openCreate}>
                          Buat undangan <ArrowRight size={12} />
                        </button>
                      )}
                      {tpl.demoSlug && tpl.demoSlug !== '' && (
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

        <section className="page-section">
          <div className="section-bar">
            <div>
              <h2>Dalam pengerjaan</h2>
              <p>Belum bisa dibeli. Kami menampilkannya supaya Anda tahu arah desainnya.</p>
            </div>
          </div>
          <div className="grid-3">
            {UPCOMING_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="card"
                style={{ padding: 'var(--space-3)', background: 'var(--surface-sunken)', boxShadow: 'none' }}
              >
                <div
                  style={{
                    height: 42,
                    borderRadius: 'var(--radius-sm)',
                    background: `linear-gradient(135deg, ${tpl.palette.primary}, ${tpl.palette.accent})`,
                    marginBottom: 'var(--space-2-5)',
                    opacity: 0.9,
                  }}
                />
                <div className="row-between" style={{ gap: 8 }}>
                  <h3 style={{ fontSize: 'var(--text-sm)' }}>{tpl.name}</h3>
                  <span className="badge">
                    <Lock size={10} /> Segera
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', marginTop: 3 }}>{tpl.tagline}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
