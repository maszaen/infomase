'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Crown, Lock, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
import { TEMPLATES, UPCOMING_TEMPLATES, formatIDR, getTemplate } from '@/lib/templates';

export function DesignSection({ invitationId }: { invitationId: string }) {
  const { invitations, licences, setTemplateId, needsPurchase, togglePublish } = useInvitationStore();
  const toast = useToast();
  const router = useRouter();

  const invitation = invitations.find((i) => i.id === invitationId);
  if (!invitation) return null;

  const current = getTemplate(invitation.templateId);
  const currentLicence = licences.find((l) => l.invitationId === invitationId);
  const pending = needsPurchase(invitationId);

  return (
    <div className="studio-section">
      {/* -------------------------------------------------- licence status */}
      <section className="card" style={{ padding: 'var(--space-4)' }}>
        <div className="row-between" style={{ alignItems: 'flex-start' }}>
          <div style={{ minWidth: 0 }}>
            <span className="label">Lisensi undangan ini</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <h2 style={{ fontSize: 'var(--text-lg)' }}>{current?.name ?? invitation.templateId}</h2>
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
            <p className="meta" style={{ marginTop: 4 }}>
              {currentLicence
                ? `Diterbitkan ${new Date(currentLicence.issuedAt).toLocaleDateString('id-ID')} · tidak ada tanggal berakhir`
                : 'Desain boleh dipakai untuk menyusun undangan; pembayaran diperlukan sebelum undangan ditayangkan.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0, flexWrap: 'wrap' }}>
            {pending && current && (
              <Link
                href={`/checkout?template=${current.id}&undangan=${invitationId}`}
                className="btn btn-buy"
              >
                <Crown size={14} /> Beli lisensi {formatIDR(current.price)}
              </Link>
            )}

            {!pending && (
              <button
                type="button"
                className={`btn ${invitation.isPublished ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => {
                  const result = togglePublish(invitationId);
                  if (!result.ok) {
                    toast('error', 'Lisensi belum aktif untuk undangan ini.');
                    return;
                  }
                  toast(
                    result.isPublished ? 'success' : 'info',
                    result.isPublished
                      ? 'Undangan tayang. Tautan publik sudah bisa dibuka tamu.'
                      : 'Undangan kembali ke draf. Tautan publik dinonaktifkan.'
                  );
                  router.refresh();
                }}
              >
                {invitation.isPublished ? 'Jadikan draf' : 'Tayangkan undangan'}
              </button>
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
      <section className="studio-section-block">
        <div className="row-between" style={{ marginBottom: 'var(--space-3)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-md)' }}>Ganti desain</h2>
            <p className="meta">Mengganti desain tidak menghapus konten yang sudah Anda isi.</p>
          </div>
        </div>

        <div className="design-grid">
          {TEMPLATES.map((tpl) => {
            const selected = tpl.id === invitation.templateId;
            const owned = licences.some(
              (l) => l.invitationId === invitationId && l.templateId === tpl.id
            );

            return (
              <article
                key={tpl.id}
                className="card"
                style={{
                  overflow: 'hidden',
                  borderColor: selected ? 'var(--brand)' : undefined,
                  boxShadow: selected ? '0 0 0 1px var(--brand)' : undefined,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', height: 150, background: 'var(--surface-sunken)' }}>
                  <img
                    src={tpl.previewImage}
                    alt={`Pratinjau ${tpl.name}`}
                    width={320}
                    height={150}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {selected && (
                    <span
                      className="badge badge-blue"
                      style={{ position: 'absolute', top: 10, left: 10, background: 'var(--surface)', borderColor: 'var(--border)' }}
                    >
                      Dipakai
                    </span>
                  )}
                </div>

                <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
                  <div>
                    <div className="row-between" style={{ gap: 8 }}>
                      <h3 style={{ fontSize: 'var(--text-base)' }}>{tpl.name}</h3>
                      <span className="price-note" style={{ fontWeight: 620, color: 'var(--ink-900)' }}>
                        {formatIDR(tpl.price)}
                      </span>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-0-5)' }}>{tpl.tagline}</p>
                  </div>

                  <ul className="tick-list" style={{ fontSize: 'var(--text-xs)' }}>
                    {tpl.includes.slice(0, 3).map((item) => (
                      <li key={item} style={{ fontSize: 'var(--text-xs)' }}>
                        <Check size={13} /> {item}
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: 'auto', display: 'grid', gap: 'var(--space-1-5)' }}>
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
      <section className="studio-section-block">
        <h2 style={{ fontSize: 'var(--text-md)', marginBottom: 4 }}>Desain berikutnya</h2>
        <p className="meta" style={{ marginBottom: 'var(--space-3)' }}>
          Sedang dikerjakan. Pembelian Anda hari ini tidak terpengaruh oleh rilis ini.
        </p>

        <div className="grid-3">
          {UPCOMING_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="card"
              style={{ padding: 'var(--space-4)', background: 'var(--surface-sunken)', boxShadow: 'none' }}
            >
              <div
                style={{
                  height: 56,
                  borderRadius: 'var(--radius-sm)',
                  background: `linear-gradient(135deg, ${tpl.palette.primary} 0%, ${tpl.palette.accent} 100%)`,
                  marginBottom: 'var(--space-3)',
                  opacity: 0.85,
                }}
              />
              <div className="row-between" style={{ gap: 8 }}>
                <h3 style={{ fontSize: 'var(--text-sm)' }}>{tpl.name}</h3>
                <span className="badge" style={{ fontSize: 'var(--text-2xs)' }}>
                  Segera
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', marginTop: 4 }}>{tpl.tagline}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
