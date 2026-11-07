'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  ExternalLink,
  Plus,
  Receipt,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { ConsolePageHeader } from '@/components/console/ConsolePageHeader';
import { useConsoleChrome } from '@/components/console/ConsoleChrome';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
import { formatIDR, getTemplate } from '@/lib/templates';
import { formatOrderDate, unassignedLicences } from '@/lib/orders';
import { formatFullIndonesianDate } from '@/lib/formatDate';

export default function OverviewPage() {
  const { invitations, orders, licences, data, needsPurchase, togglePublish } = useInvitationStore();
  const { openCreate } = useConsoleChrome();
  const toast = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const hasInvitations = invitations.length > 0;
  const availableLicences = unassignedLicences(licences);
  const hasAvailableLicence = availableLicences.length > 0;

  const totalGuests = invitations.reduce((sum, inv) => sum + inv.guests.length, 0);
  const totalConfirmed = invitations.reduce(
    (sum, inv) => sum + inv.rsvpList.filter((r) => r.attendance === 'hadir').reduce((n, r) => n + r.pax, 0),
    0
  );
  const spent = orders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.amount, 0);

  const activeTemplate = getTemplate(data.templateId);
  const nextEvent = [...data.events].sort((a, b) => a.date.localeCompare(b.date))[0];

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

  const publish = async (id: string) => {
    if (needsPurchase(id)) {
      toast('info', 'Beli lisensi template terlebih dahulu untuk menayangkan undangan.');
      return;
    }
    const result = await togglePublish(id);
    if (!result.ok) toast('error', result.error || 'Publikasi gagal. Periksa lisensi undangan.');
    if (result.ok) {
      toast(
        result.isPublished ? 'success' : 'info',
        result.isPublished ? 'Undangan tayang.' : 'Undangan kembali ke draf.'
      );
    }
  };

  return (
    <>
      <ConsolePageHeader
        title="Ringkasan"
        description={`${invitations.length} undangan · ${licences.length} lisensi aktif`}
        actions={
          hasAvailableLicence ? (
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => openCreate(availableLicences[0]?.templateId)}
            >
              <Plus size={14} /> Buat undangan
            </button>
          ) : (
            <Link href="/katalog" className="btn btn-sm btn-primary">
              <ShoppingBag size={14} /> Beli template
            </Link>
          )
        }
      />

      <div className="page-content stack-6">
        {/* ------------------------------------------------ active invitation or empty state */}
        {hasInvitations ? (
          <section className="card invite-hero">
            <div className="invite-hero-main">
              <div className="invite-hero-head">
                {activeTemplate ? (
                  <img
                    src={activeTemplate.previewImage}
                    alt=""
                    className="thumb"
                    style={{ width: 52, height: 64, objectFit: 'cover' }}
                  />
                ) : null}

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="invite-hero-meta" style={{ marginBottom: 2 }}>
                    <span className="label" style={{ fontSize: 'var(--text-2xs)' }}>
                      Terakhir dibuka
                    </span>
                    {data.isPublished ? (
                      <span className="badge badge-success">
                        <span className="status-dot status-dot-live" /> Tayang
                      </span>
                    ) : (
                      <span className="badge">Draf</span>
                    )}
                  </div>

                  <h2 className="invite-hero-title">{data.title}</h2>

                  <div className="invite-hero-meta" style={{ marginTop: 3 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <CalendarDays size={12} />
                      {nextEvent ? formatFullIndonesianDate(nextEvent.date) : 'Tanggal belum diisi'}
                    </span>
                    <span aria-hidden>·</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>/invite/{data.slug}</span>
                  </div>
                </div>
              </div>

              <div className="invite-hero-actions">
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
                <div className="notice notice-warning">
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

            <div className="stat-quad">
              <div className="stat-tile">
                <span className="stat-card-label">Tamu</span>
                <span className="stat-tile-value">{totalGuests}</span>
                <span className="stat-card-desc">Di semua undangan</span>
              </div>
              <div className="stat-tile">
                <span className="stat-card-label">Konfirmasi hadir</span>
                <span className="stat-tile-value">{totalConfirmed}</span>
                <span className="stat-card-desc">Total pax</span>
              </div>
              <div className="stat-tile">
                <span className="stat-card-label">Lisensi</span>
                <span className="stat-tile-value">{licences.length}</span>
                <span className="stat-card-desc">Permanen</span>
              </div>
              <div className="stat-tile">
                <span className="stat-card-label">Total belanja</span>
                <span className="stat-tile-value" style={{ fontSize: 'var(--text-md)' }}>
                  {formatIDR(spent)}
                </span>
                <span className="stat-card-desc">{orders.length} pesanan</span>
              </div>
            </div>
          </section>
        ) : (
          <section className="card empty-state">
            <CalendarDays size={24} />
            <h2>Belum ada undangan</h2>
            {hasAvailableLicence ? (
              <>
                <p>
                  Anda memiliki {availableLicences.length} lisensi template aktif yang siap digunakan untuk membuat
                  undangan pernikahan digital Anda.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => openCreate(availableLicences[0]?.templateId)}
                >
                  <Plus size={14} /> Buat undangan
                </button>
              </>
            ) : (
              <>
                <p>
                  Pilih dan beli lisensi template pilihan Anda di katalog untuk mulai membuat undangan pernikahan
                  digital.
                </p>
                <Link href="/katalog" className="btn btn-primary">
                  <ShoppingBag size={14} /> Beli template
                </Link>
              </>
            )}
          </section>
        )}

        {/* -------------------------------------------- purchased templates ready to use */}
        {hasAvailableLicence && (
          <section className="page-section">
            <div className="section-bar">
              <div>
                <h2>Template Siap Digunakan</h2>
                <p>Lisensi template yang sudah Anda beli dan siap dijadikan undangan baru.</p>
              </div>
              <span className="badge badge-success">{availableLicences.length} siap dipakai</span>
            </div>

            <div className="record-list">
              {availableLicences.map((licence) => {
                const tpl = getTemplate(licence.templateId);
                return (
                  <article key={licence.id} className="card record">
                    <img
                      src={tpl?.previewImage ?? ''}
                      alt=""
                      className="thumb thumb-portrait"
                      loading="lazy"
                    />
                    <div className="record-main">
                      <div className="record-title-row">
                        <span className="record-title" style={{ cursor: 'default' }}>
                          {tpl?.name ?? licence.templateId}
                        </span>
                        <span className="badge badge-success">
                          <BadgeCheck size={11} /> Siap Dipakai
                        </span>
                      </div>
                      <div className="record-meta">
                        Diterbitkan {formatOrderDate(licence.issuedAt)} · Lisensi permanen untuk 1 undangan
                      </div>
                    </div>
                    <div className="record-actions">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => openCreate(licence.templateId)}
                      >
                        <Plus size={13} /> Buat undangan
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ------------------------------------------------------ invitation list */}
        {hasInvitations && (
          <section className="page-section">
            <div className="section-bar">
              <h2>Undangan Anda</h2>
              {hasAvailableLicence ? (
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => openCreate(availableLicences[0]?.templateId)}
                >
                  <Plus size={13} /> Buat undangan
                </button>
              ) : (
                <Link href="/katalog" className="btn btn-sm btn-secondary">
                  <ShoppingBag size={13} /> Beli template lain
                </Link>
              )}
            </div>

            <div className="record-list">
              {invitations.map((inv) => {
                const tpl = getTemplate(inv.templateId);
                const pending = needsPurchase(inv.id);
                return (
                  <article key={inv.id} className="card record">
                    <img
                      src={tpl?.previewImage ?? ''}
                      alt=""
                      className="thumb thumb-portrait"
                      loading="lazy"
                    />

                    <div className="record-main">
                      <div className="record-title-row">
                        <Link href={`/dashboard/undangan/${inv.id}/content`} className="record-title">
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
                      <div
                        className="record-meta"
                        style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}
                      >
                        <span style={{ fontWeight: 600 }}>{tpl?.name ?? 'Template tidak dikenal'}</span>
                        <span>·</span>
                        <code
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11.5px',
                            background: 'var(--surface-sunken)',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          /invite/{inv.slug}
                        </code>
                        <span>·</span>
                        <span>
                          {inv.events[0] ? formatFullIndonesianDate(inv.events[0].date) : 'tanggal kosong'}
                        </span>
                      </div>
                    </div>

                    <div className="record-stats">
                      <div className="record-stat">
                        <b className="numeric">{inv.guests.length}</b>
                        <span>Tamu</span>
                      </div>
                      <div className="record-stat">
                        <b className="numeric">
                          {inv.rsvpList.filter((r) => r.attendance === 'hadir').length}
                        </b>
                        <span>Hadir</span>
                      </div>
                    </div>

                    <div className="record-actions">
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost btn-icon"
                        onClick={() => copyLink(inv.slug)}
                        aria-label={`Salin tautan ${inv.title}`}
                        title="Salin tautan"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => publish(inv.id)}
                      >
                        {inv.isPublished ? 'Jadikan draf' : 'Tayangkan'}
                      </button>
                    </div>
                  </article>
                );
              })}

              {hasAvailableLicence ? (
                <button
                  type="button"
                  onClick={() => openCreate(availableLicences[0]?.templateId)}
                  className="card record record-add"
                >
                  <Plus size={16} /> Buat undangan dari lisensi aktif
                </button>
              ) : (
                <Link href="/katalog" className="card record record-add">
                  <ShoppingBag size={16} /> Beli template baru di Katalog
                </Link>
              )}
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- orders */}
        <section className="page-section">
          <div className="section-bar">
            <h2>Pesanan terakhir</h2>
            <Link href="/dashboard/orders" className="btn btn-sm btn-ghost">
              Semua pesanan <ArrowRight size={13} />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="card empty-state" style={{ padding: 'var(--space-8) var(--space-4)' }}>
              <Receipt size={22} />
              <h3>Belum ada pembelian</h3>
              <p>Semua pesanan dan lisensi template yang Anda beli akan tercatat di sini.</p>
              <Link href="/katalog" className="btn btn-sm btn-secondary">
                Lihat katalog template
              </Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Referensi</th>
                    <th className="col-md">Undangan</th>
                    <th className="col-md">Template</th>
                    <th>Tanggal</th>
                    <th style={{ textAlign: 'right' }}>Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }}>
                        {order.reference}
                      </td>
                      <td className="col-md">{order.invitationTitle}</td>
                      <td className="col-md">{getTemplate(order.templateId)?.name ?? order.templateId}</td>
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
        {hasInvitations && (
          <section className="card" style={{ padding: 'var(--space-4)' }}>
            <div className="section-bar" style={{ marginBottom: 'var(--space-3)' }}>
              <h2>Langkah sebelum menyebar</h2>
              <Link href={`/dashboard/undangan/${data.id}/content`} className="btn btn-sm btn-ghost">
                Buka editor <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid-3" style={{ gap: 'var(--space-3)' }}>
              {[
                {
                  icon: Users,
                  title: 'Daftar tamu',
                  body: 'Impor atau tambah tamu, lalu kirim tautan personal.',
                  href: `/dashboard/undangan/${data.id}/guests`,
                },
                {
                  icon: Clock,
                  title: 'Jadwal acara',
                  body: 'Akad dan resepsi dengan waktu serta lokasi terpisah.',
                  href: `/dashboard/undangan/${data.id}/content`,
                },
                {
                  icon: BadgeCheck,
                  title: 'Lisensi template',
                  body: 'Pastikan desain sudah dibeli agar tautan bisa dibuka tamu.',
                  href: `/dashboard/undangan/${data.id}/design`,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.title} href={item.href} className="quick-link">
                    <span className="quick-link-icon">
                      <Icon size={15} />
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span className="quick-link-title">{item.title}</span>
                      <span className="quick-link-body">{item.body}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
