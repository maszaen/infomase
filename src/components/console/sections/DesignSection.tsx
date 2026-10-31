'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Crown, Lock, Palette, ShieldCheck } from 'lucide-react';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
import { TEMPLATES, UPCOMING_TEMPLATES, formatIDR, getTemplate } from '@/lib/templates';
import { formatOrderDate } from '@/lib/orders';

export function DesignSection({ invitationId }: { invitationId: string }) {
  const { invitations, licences, setTemplateId, needsPurchase } = useInvitationStore();
  const toast = useToast();

  const invitation = invitations.find((i) => i.id === invitationId);
  if (!invitation) return null;

  const current = getTemplate(invitation.templateId);
  const currentLicence = licences.find((l) => l.invitationId === invitationId);
  const pending = needsPurchase(invitationId);

  return (
    <div className="studio-section">
      {/* -------------------------------------------------- licence status */}
      <section className="card" style={{ padding: 'var(--space-4)' }}>
        <div className="row-between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', minWidth: 0 }}>
            <span className="stat-icon" style={{ width: 36, height: 36 }}>
              <Palette size={17} />
            </span>
            <div style={{ minWidth: 0 }}>
              <span className="label" style={{ fontSize: 'var(--text-2xs)' }}>
                Lisensi undangan ini
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', lineHeight: 1.3 }}>
                  {current?.name ?? invitation.templateId}
                </h2>
                {pending ? (
                  <span className="badge badge-warning">
                    <Lock size={11} /> Belum dibeli
                  </span>
                ) : (
                  <span className="badge badge-success">
                    <ShieldCheck size={11} /> Aktif permanen
                  </span>
                )}
              </div>
              <p className="meta" style={{ marginTop: 2 }}>
                {currentLicence
                  ? `Diterbitkan ${formatOrderDate(currentLicence.issuedAt)} · tidak ada tanggal berakhir`
                  : 'Desain boleh dipakai untuk menyusun undangan; pembayaran diperlukan sebelum undangan ditayangkan.'}
              </p>
            </div>
          </div>

          <div className="row" style={{ gap: 'var(--space-2)', flexShrink: 0 }}>
            {pending && current ? (
              <Link
                href={`/checkout?template=${current.id}&undangan=${invitationId}`}
                className="btn btn-buy"
              >
                <Crown size={14} /> Beli lisensi {formatIDR(current.price)}
              </Link>
            ) : (
              <span className="meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={13} style={{ color: 'var(--success)' }} />
                Sudah bisa tayang
              </span>
            )}
          </div>
        </div>

        {pending && (
          <div className="notice notice-warning" style={{ marginTop: 'var(--space-3)' }}>
            <Lock size={14} />
            <span>
              Undangan belum bisa dibuka tamu. Anda tetap bisa mengisi semua konten sekarang, lalu membayar
              saat siap menyebarkan.
            </span>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------- template list */}
      <section className="page-section">
        <div className="section-bar">
          <div>
            <h2>Ganti desain</h2>
            <p>Mengganti desain tidak menghapus konten yang sudah Anda isi.</p>
          </div>
          <span className="meta">{TEMPLATES.length} desain tersedia</span>
        </div>

        <div className="template-grid">
          {TEMPLATES.map((tpl) => {
            const selected = tpl.id === invitation.templateId;
            const owned = licences.some(
              (l) => l.invitationId === invitationId && l.templateId === tpl.id
            );

            return (
              <article
                key={tpl.id}
                className="card template-card"
                style={{
                  borderColor: selected ? 'var(--brand)' : undefined,
                  boxShadow: selected ? '0 0 0 1px var(--brand)' : undefined,
                }}
              >
                <div className="template-card-media" style={{ height: 150 }}>
                  <img src={tpl.previewImage} alt={`Pratinjau ${tpl.name}`} width={320} height={150} loading="lazy" />
                  {selected && (
                    <span
                      className="badge badge-blue"
                      style={{ position: 'absolute', top: 8, left: 8, background: 'var(--surface)', borderColor: 'var(--border)' }}
                    >
                      Dipakai
                    </span>
                  )}
                </div>

                <div className="template-card-body">
                  <div>
                    <div className="template-card-head">
                      <h3 className="template-card-title">{tpl.name}</h3>
                      <span className="template-card-price">{formatIDR(tpl.price)}</span>
                    </div>
                    <p className="template-card-tagline">{tpl.tagline}</p>
                  </div>

                  <ul className="tick-list">
                    {tpl.includes.slice(0, 3).map((item) => (
                      <li key={item}>
                        <Check size={12} /> {item}
                      </li>
                    ))}
                  </ul>

                  <div className="template-card-actions">
                    <button
                      type="button"
                      className={`btn btn-sm ${selected ? 'btn-secondary' : 'btn-primary'}`}
                      disabled={selected}
                      onClick={() => {
                        setTemplateId(tpl.id);
                        toast('success', `Desain diganti ke ${tpl.name}.`);
                      }}
                    >
                      {selected ? 'Sedang dipakai' : 'Pakai desain ini'}
                    </button>

                    {tpl.price > 0 && !owned && (
                      <Link
                        href={`/checkout?template=${tpl.id}&undangan=${invitationId}`}
                        className="btn btn-sm btn-ghost"
                      >
                        Beli lisensi <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------- roadmap */}
      <section className="page-section">
        <div className="section-bar">
          <div>
            <h2>Desain berikutnya</h2>
            <p>Sedang dikerjakan. Pembelian Anda hari ini tidak terpengaruh oleh rilis ini.</p>
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
                  height: 52,
                  borderRadius: 'var(--radius-sm)',
                  background: `linear-gradient(135deg, ${tpl.palette.primary} 0%, ${tpl.palette.accent} 100%)`,
                  marginBottom: 'var(--space-2-5)',
                  opacity: 0.9,
                }}
              />
              <div className="row-between" style={{ gap: 8 }}>
                <h3 style={{ fontSize: 'var(--text-sm)' }}>{tpl.name}</h3>
                <span className="badge">Segera</span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', marginTop: 3 }}>{tpl.tagline}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
