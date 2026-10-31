'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  ExternalLink,
  Plus,
  Receipt,
  Users,
} from 'lucide-react';
import { ConsolePageHeader } from '@/components/console/ConsolePageHeader';
import { CreateInvitationModal } from '@/components/console/CreateInvitationModal';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
import { formatIDR, getTemplate } from '@/lib/templates';
import { formatOrderDate } from '@/lib/orders';
import { formatFullIndonesianDate } from '@/lib/formatDate';

function StatValue({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span className="stat-card-value numeric" style={style}>
      {children}
    </span>
  );
}

export default function OverviewPage() {
  const { invitations, orders, licences, data, needsPurchase, togglePublish } = useInvitationStore();
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const totalGuests = invitations.reduce((sum, inv) => sum + inv.guests.length, 0);
  const totalConfirmed = invitations.reduce(
    (sum, inv) => sum + inv.rsvpList.filter((r) => r.attendance === 'hadir').reduce((n, r) => n + r.pax, 0),
    0
  );
  const spent = orders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.amount, 0);

  const copyLink = async (slug: string) => {
    const link = `${window.location.origin}/invite/${slug}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(slug);
      toast('success', 'Tautan undangan disalin.');
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      toast('error', 'Browser menolak akses clipboard. Salin manual dari kolom tautan.');
    }
  };

  const nextEvent = [...data.events].sort((a, b) => a.date.localeCompare(b.date))[0];

  return (
    <>
      <ConsolePageHeader
        title="Ringkasan"
        description={`${invitations.length} undangan · ${licences.length} lisensi aktif`}
        actions={
          <button type="button" className="btn btn-sm btn-primary" onClick={() => setCreateOpen(true)}>
            <Plus size={14} /> Undangan baru
          </button>
        }
      />

      <div className="page-content stack-6">
        {/* ------------------------------------------------ primary action card */}
        <section className="card" style={{ overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
              gap: 'var(--space-6)',
              padding: 'var(--space-6)',
            }}
            className="overview-hero"
          >
            <div style={{ minWidth: 0 }}>
              <div className="row" style={{ gap: 'var(--space-1-5)', marginBottom: 'var(--space-2)' }}>
                <span className="label">Undangan terakhir dibuka</span>
                {data.isPublished ? (
                  <span className="badge badge-success">
                    <span className="status-dot status-dot-live" /> Tayang
                  </span>
                ) : (
                  <span className="badge">Draf</span>
                )}
              </div>

              <h2 style={{ fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em' }}>{data.title}</h2>

              <div className="row" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <span className="meta">
                  {nextEvent ? formatFullIndonesianDate(nextEvent.date) : 'Tanggal belum diisi'}
                </span>
                <span className="meta">·</span>
                <span className="meta" style={{ fontFamily: 'var(--font-mono)' }}>
                  /invite/{data.slug}
                </span>
              </div>

              <div className="row" style={{ marginTop: 'var(--space-4)', gap: 'var(--space-2)' }}>
                <Link href={`/dashboard/undangan/${data.id}/content`} className="btn btn-primary">
                  Lanjut mengedit <ArrowRight size={14} />
                </Link>
                <button type="button" className="btn btn-secondary" onClick={() => copyLink(data.slug)}>
                  {copied === data.slug ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                  {copied === data.slug ? 'Tersalin' : 'Salin tautan'}
                </button>
                <Link
                  href={`/invite/${data.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                >
                  <ExternalLink size={14} /> Pratinjau
                </Link>
              </div>

              {needsPurchase(data.id) && (
                <div className="notice notice-warning" style={{ marginTop: 'var(--space-4)' }}>
                  <Crown size={15} />
                  <span>
                    Template ini belum dibeli. Undangan boleh diedit, tetapi baru bisa tayang setelah lisensi
                    aktif.{' '}
                    <Link href={`/dashboard/undangan/${data.id}/design`} style={{ fontWeight: 600 }}>
                      Lihat lisensi
                    </Link>
                  </span>
                </div>
              )}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-3)',
                alignContent: 'start',
              }}
            >
              <div>
                <div className="stat-card-label">Tamu</div>
                <StatValue>{totalGuests}</StatValue>
                <div className="stat-card-desc">Di semua undangan</div>
              </div>
              <div>
                <div className="stat-card-label">Konfirmasi hadir</div>
                <StatValue>{totalConfirmed}</StatValue>
                <div className="stat-card-desc">Total pax</div>
              </div>
              <div>
                <div className="stat-card-label">Lisensi</div>
                <StatValue>{licences.length}</StatValue>
                <div className="stat-card-desc">Permanen</div>
              </div>
              <div>
                <div className="stat-card-label">Total belanja</div>
                <StatValue style={{ fontSize: 'var(--text-lg)' }}>{formatIDR(spent)}</StatValue>
                <div className="stat-card-desc">{orders.length} pesanan</div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ invitation list */}
        <section>
          <div className="row-between" style={{ marginBottom: 'var(--space-3)' }}>
            <h2 style={{ fontSize: 'var(--text-md)' }}>Undangan Anda</h2>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => setCreateOpen(true)}>
              <Plus size={13} /> Tambah
            </button>
          </div>

          <div className="stack-2">
            {invitations.map((inv) => {
              const tpl = getTemplate(inv.templateId);
              const pending = needsPurchase(inv.id);
              return (
                <article
                  key={inv.id}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    padding: 'var(--space-3) var(--space-4)',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-sm)',
                      background: tpl?.palette.surface ?? 'var(--surface-sunken)',
                      border: `1px solid ${tpl?.palette.accent ?? 'var(--border)'}44`,
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <Link
                        href={`/dashboard/undangan/${inv.id}/content`}
                        style={{ fontSize: 'var(--text-sm)', fontWeight: 620, color: 'var(--ink-900)', textDecoration: 'none' }}
                      >
                        {inv.title}
                      </Link>
                      {inv.isPublished ? (
                        <span className="badge badge-success">Tayang</span>
                      ) : pending ? (
                        <span className="badge badge-warning">Perlu lisensi</span>
                      ) : (
                        <span className="badge">Draf</span>
                      )}
                    </div>
                    <div className="meta" style={{ marginTop: 'var(--space-0-5)' }}>
                      {tpl?.name ?? 'Template tidak dikenal'} ·{' '}
                      {inv.events[0] ? formatFullIndonesianDate(inv.events[0].date) : 'tanggal kosong'}
                    </div>
                  </div>

                  <div className="row-nowrap" style={{ gap: 'var(--space-4)' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 620 }} className="numeric">
                        {inv.guests.length}
                      </div>
                      <div className="stat-card-label" style={{ fontSize: 'var(--text-2xs)' }}>
                        Tamu
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 620 }} className="numeric">
                        {inv.rsvpList.filter((r) => r.attendance === 'hadir').length}
                      </div>
                      <div className="stat-card-label" style={{ fontSize: 'var(--text-2xs)' }}>
                        Hadir
                      </div>
                    </div>
                  </div>

                  <div className="row-nowrap" style={{ gap: 4 }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost btn-icon"
                      onClick={() => copyLink(inv.slug)}
                      aria-label={`Salin tautan ${inv.title}`}
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        if (pending) {
                          toast('info', 'Beli lisensi template terlebih dahulu untuk menayangkan undangan.');
                          return;
                        }
                        const result = togglePublish(inv.id);
                        if (result.ok) {
                          toast(result.isPublished ? 'success' : 'info', result.isPublished ? 'Undangan tayang.' : 'Undangan kembali ke draf.');
                        }
                      }}
                    >
                      {inv.isPublished ? 'Jadikan draf' : 'Tayangkan'}
                    </button>
                  </div>
                </article>
              );
            })}

            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-5)',
                borderStyle: 'dashed',
                background: 'transparent',
                color: 'var(--ink-500)',
                cursor: 'pointer',
                boxShadow: 'none',
              }}
            >
              <Plus size={16} /> Buat undangan baru
            </button>
          </div>
        </section>

        {/* ------------------------------------------------------------- orders */}
        <section>
          <div className="row-between" style={{ marginBottom: 'var(--space-3)' }}>
            <h2 style={{ fontSize: 'var(--text-md)' }}>Pesanan terakhir</h2>
            <Link href="/dashboard?view=orders" className="btn btn-sm btn-ghost">
              Semua pesanan <ArrowRight size={13} />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <Receipt size={20} style={{ color: 'var(--ink-400)' }} />
              <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                Belum ada pembelian. Template pertama Anda gratis — mulai dari sana.
              </p>
              <Link href="#template-katalog" className="btn btn-sm btn-secondary" style={{ marginTop: 'var(--space-3)' }}>
                Lihat katalog
              </Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Referensi</th>
                    <th>Undangan</th>
                    <th>Template</th>
                    <th>Tanggal</th>
                    <th style={{ textAlign: 'right' }}>Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }}>{order.reference}</td>
                      <td>{order.invitationTitle}</td>
                      <td>{getTemplate(order.templateId)?.name ?? order.templateId}</td>
                      <td>{formatOrderDate(order.createdAt)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }} className="numeric">
                        {formatIDR(order.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ----------------------------------------------------------- quick help */}
        <section className="card" style={{ padding: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-3)' }}>
            Yang biasanya dibutuhkan sebelum menyebar
          </h2>
          <div className="grid-3" style={{ gap: 'var(--space-4)' }}>
            {[
              { icon: Users, title: 'Daftar tamu', body: 'Impor atau tambah tamu satu per satu, lalu kirim tautan personal.', href: `/dashboard/undangan/${data.id}/guests` },
              { icon: Clock, title: 'Jadwal acara', body: 'Akad dan resepsi dengan waktu serta lokasi terpisah.', href: `/dashboard/undangan/${data.id}/content` },
              { icon: Crown, title: 'Lisensi template', body: 'Pastikan desain sudah dibeli agar tautan bisa dibuka tamu.', href: `/dashboard/undangan/${data.id}/design` },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="row-nowrap" style={{ gap: 8, marginBottom: 4 }}>
                    <Icon size={15} style={{ color: 'var(--brand)' }} />
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 620, color: 'var(--ink-900)' }}>
                      {item.title}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', lineHeight: 1.6 }}>{item.body}</p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <CreateInvitationModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <style jsx>{`
        @media (max-width: 860px) {
          .overview-hero {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </>
  );
}
