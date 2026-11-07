'use client';

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Plus,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { InvitationProvider, useInvitationStore } from '@/lib/invitationStore';
import { ToastProvider } from '@/components/ui/Toast';
import { MarketingNav } from '@/components/marketing/MarketingNav';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { CreateInvitationModal } from '@/components/console/CreateInvitationModal';
import { TEMPLATE_CATEGORIES, formatIDR, normalizeTemplateId } from '@/lib/templates';
import type { TemplateCategory } from '@/lib/templates';
import { unassignedLicences } from '@/lib/orders';

function KatalogContent() {
  const { templates, licences, orders } = useInvitationStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | TemplateCategory>('all');
  const [createTemplateId, setCreateTemplateId] = useState<string | null>(null);

  const availableLicences = useMemo(() => unassignedLicences(licences), [licences]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((tpl) => {
      const matchesCategory = category === 'all' || tpl.category === category;
      const matchesQuery =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.tagline.toLowerCase().includes(q) ||
        tpl.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [templates, query, category]);

  const availableCategories = TEMPLATE_CATEGORIES.filter(
    (item) => item.id === 'all' || templates.some((tpl) => tpl.category === item.id)
  );

  return (
    <section className="section" style={{ paddingTop: 'var(--space-10)' }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: 'var(--space-6)' }}>
          <span className="eyebrow">
            <Sparkles size={13} /> Katalog Undangan Digital
          </span>
          <h1 className="section-title" style={{ fontSize: 'var(--text-3xl)' }}>
            Pilih desain untuk acara Anda.
          </h1>
          <p className="section-subtitle">
            Setiap template dibeli sekali untuk satu undangan pernikahan — aktif permanen, tanpa biaya bulanan.
            Jika Anda sudah membeli lisensi, klik <strong>Buat Undangan</strong> langsung pada kartu template.
          </p>
        </div>

        {availableLicences.length > 0 && (
          <div
            className="card"
            style={{
              padding: 'var(--space-4) var(--space-5)',
              marginBottom: 'var(--space-6)',
              borderColor: 'var(--brand)',
              background: 'var(--brand-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
            }}
          >
            <div>
              <div style={{ fontWeight: 650, fontSize: 'var(--text-sm)', color: 'var(--ink-900)' }}>
                Anda memiliki {availableLicences.length} lisensi template aktif yang siap digunakan
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)', marginTop: 2 }}>
                Klik tombol <strong>Buat Undangan</strong> pada template yang sudah Anda beli di bawah ini.
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => setCreateTemplateId(availableLicences[0].templateId)}
            >
              <Plus size={14} /> Buat undangan sekarang
            </button>
          </div>
        )}

        <div className="stack-4" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="editor-toolbar">
            <div className="search-box" style={{ maxWidth: 420, flex: 1 }}>
              <Search size={14} className="search-icon" />
              <input
                type="search"
                className="form-input"
                placeholder="Cari nama template, gaya, atau adat…"
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
              Menampilkan {filtered.length} dari {templates.length} desain
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
          <div className="empty-state card" style={{ padding: 'var(--space-10)' }}>
            <Search size={24} />
            <h3>Tidak ada template yang cocok</h3>
            <p>Ubah kata kunci pencarian atau pilih kategori desain lainnya.</p>
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
          <div className="grid-2" style={{ gap: 'var(--space-5)' }}>
            {filtered.map((tpl) => {
              const readyLicence = licences.find(
                (l) => normalizeTemplateId(l.templateId) === tpl.id && !l.invitationId
              );
              const boundLicence = licences.find(
                (l) => normalizeTemplateId(l.templateId) === tpl.id && Boolean(l.invitationId)
              );
              const pendingOrder = orders.find(
                (o) =>
                  normalizeTemplateId(o.templateId) === tpl.id &&
                  (o.status === 'pending' || o.status === 'payment_submitted')
              );

              return (
                <article
                  key={tpl.id}
                  className="card"
                  style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ position: 'relative', height: 240, background: 'var(--surface-sunken)' }}>
                    <img
                      src={tpl.previewImage}
                      alt={`Pratinjau template ${tpl.name}`}
                      width={560}
                      height={240}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      loading="lazy"
                    />
                    <span
                      className="badge"
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        background: 'var(--surface)',
                        borderColor: 'var(--border)',
                        color: 'var(--ink-700)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      {tpl.category}
                    </span>

                    {readyLicence ? (
                      <span
                        className="badge badge-success"
                        style={{ position: 'absolute', top: 12, right: 12, boxShadow: 'var(--shadow-sm)' }}
                      >
                        <Check size={12} /> Sudah Dibeli · Siap Dipakai
                      </span>
                    ) : boundLicence ? (
                      <span
                        className="badge badge-success"
                        style={{ position: 'absolute', top: 12, right: 12, boxShadow: 'var(--shadow-sm)' }}
                      >
                        <Check size={12} /> Dimiliki
                      </span>
                    ) : pendingOrder ? (
                      <span
                        className="badge badge-warning"
                        style={{ position: 'absolute', top: 12, right: 12, boxShadow: 'var(--shadow-sm)' }}
                      >
                        <Clock size={12} />{' '}
                        {pendingOrder.status === 'payment_submitted'
                          ? 'Menunggu Verifikasi'
                          : 'Menunggu Pembayaran'}
                      </span>
                    ) : tpl.badge ? (
                      <span
                        className="badge"
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: 'var(--ink-900)',
                          color: 'var(--on-inverse)',
                          borderColor: 'var(--ink-900)',
                        }}
                      >
                        {tpl.badge}
                      </span>
                    ) : null}
                  </div>

                  <div
                    style={{
                      padding: 'var(--space-5)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-4)',
                      flex: 1,
                    }}
                  >
                    <div>
                      <div className="row-between" style={{ alignItems: 'flex-start', gap: 12 }}>
                        <h2 style={{ fontSize: 'var(--text-xl)' }}>{tpl.name}</h2>
                        <div className="price" style={{ flexShrink: 0, textAlign: 'right' }}>
                          {tpl.compareAt && tpl.compareAt > tpl.price && (
                            <span
                              style={{
                                display: 'block',
                                fontSize: 'var(--text-xs)',
                                color: 'var(--ink-400)',
                                textDecoration: 'line-through',
                              }}
                            >
                              {formatIDR(tpl.compareAt)}
                            </span>
                          )}
                          <span className="price-amount" style={{ fontSize: 'var(--text-xl)' }}>
                            {formatIDR(tpl.price)}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: 'var(--text-sm)', marginTop: 4 }}>{tpl.tagline}</p>
                    </div>

                    <ul className="tick-list">
                      {tpl.includes.map((item) => (
                        <li key={item}>
                          <Check size={14} /> {item}
                        </li>
                      ))}
                    </ul>

                    <div className="row" style={{ marginTop: 'auto', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      {tpl.demoSlug && (
                        <Link href={`/invite/${tpl.demoSlug}`} className="btn btn-secondary" style={{ flex: 1 }}>
                          <ArrowUpRight size={14} /> Buka demo
                        </Link>
                      )}

                      {readyLicence ? (
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ flex: 1 }}
                          onClick={() => setCreateTemplateId(tpl.id)}
                        >
                          <Plus size={14} /> Buat Undangan
                        </button>
                      ) : boundLicence ? (
                        <>
                          <Link
                            href={`/dashboard/undangan/${boundLicence.invitationId}/content`}
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                          >
                            Kelola Undangan <ArrowRight size={14} />
                          </Link>
                          <Link href={`/checkout?template=${tpl.id}`} className="btn btn-ghost">
                            Beli Lagi
                          </Link>
                        </>
                      ) : pendingOrder ? (
                        <Link href="/dashboard/orders" className="btn btn-secondary" style={{ flex: 1 }}>
                          Lihat Pesanan <ArrowRight size={14} />
                        </Link>
                      ) : (
                        <Link href={`/checkout?template=${tpl.id}`} className="btn btn-buy" style={{ flex: 1 }}>
                          Beli Template · {formatIDR(tpl.price)}
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <CreateInvitationModal
        open={Boolean(createTemplateId)}
        onClose={() => setCreateTemplateId(null)}
        initialTemplateId={createTemplateId ?? undefined}
      />
    </section>
  );
}

export default function KatalogClient() {
  return (
    <ToastProvider>
      <InvitationProvider>
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
          <MarketingNav />
          <main id="konten" style={{ flex: 1 }}>
            <Suspense
              fallback={
                <div className="container" style={{ paddingBlock: 'var(--space-16)' }}>
                  Memuat katalog template…
                </div>
              }
            >
              <KatalogContent />
            </Suspense>
          </main>
          <MarketingFooter />
        </div>
      </InvitationProvider>
    </ToastProvider>
  );
}
