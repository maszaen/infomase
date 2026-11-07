'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertCircle, CheckCircle2, Cloud, EyeOff, ExternalLink, Globe, Lock, RefreshCw, ShieldCheck } from 'lucide-react';
import { ConsolePageHeader } from '@/components/console/ConsolePageHeader';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
import { getTemplate, formatIDR } from '@/lib/templates';
import { hasServerSession } from '@/lib/api';

function formatSavedClock(iso?: string): string {
  if (!iso) return '';
  try {
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return '';
    return dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return '';
  }
}

export default function StudioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { invitations, setActiveInvitation, isPublishable, togglePublish, isLoaded, loadError, saveStates, saveNow } = useInvitationStore();
  const [publishing, setPublishing] = React.useState(false);
  const toast = useToast();

  const invitation = invitations.find((inv) => inv.id === id);

  React.useEffect(() => {
    if (invitation) setActiveInvitation(id);
  }, [invitation, id, setActiveInvitation]);

  if (!isLoaded) return <div className="page-content" role="status">Memuat undangan…</div>;
  if (loadError) return <div className="page-content" role="alert">{loadError}</div>;
  if (!invitation) notFound();

  const template = getTemplate(invitation.templateId);
  const publishable = isPublishable(invitation.id);
  const saveState = saveStates[id];
  const savedClock = formatSavedClock(saveState?.savedAt || invitation.updatedAt);

  const handlePublish = async () => {
    if (publishing) return;
    setPublishing(true);
    const result = await togglePublish(invitation.id);
    setPublishing(false);
    if (!result.ok) {
      toast('error', result.error || 'Lisensi belum aktif untuk undangan ini.');
      return;
    }
    toast(
      result.isPublished ? 'success' : 'info',
      result.isPublished
        ? 'Undangan tayang. Tautan publik sudah bisa dibuka tamu.'
        : 'Undangan kembali ke draf. Tautan publik dinonaktifkan.'
    );
  };

  return (
    <>
      <ConsolePageHeader
        title={invitation.title}
        description={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)' }}>/invite/{invitation.slug}</span>
            {hasServerSession() && (
              <span
                role="status"
                aria-live="polite"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.78rem',
                  padding: '2px 8px',
                  borderRadius: 999,
                  background:
                    saveState?.status === 'error'
                      ? 'rgba(220, 38, 38, 0.1)'
                      : saveState?.status === 'unsaved'
                        ? 'rgba(217, 119, 6, 0.12)'
                        : 'var(--surface-muted, rgba(0,0,0,0.04))',
                  color:
                    saveState?.status === 'error'
                      ? 'var(--danger, #b91c1c)'
                      : saveState?.status === 'unsaved'
                        ? '#b45309'
                        : 'var(--text-muted)',
                }}
              >
                {saveState?.status === 'saving' ? (
                  <>
                    <RefreshCw size={12} className="spin" />
                    <span>Menyimpan perubahan…</span>
                  </>
                ) : saveState?.status === 'unsaved' ? (
                  <>
                    <Cloud size={12} />
                    <span>Perubahan belum disimpan (simpan otomatis tiap 5 dtk)</span>
                  </>
                ) : saveState?.status === 'error' ? (
                  <>
                    <AlertCircle size={12} />
                    <span>Gagal menyimpan</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={12} style={{ color: 'var(--success)' }} />
                    <span>Semua perubahan disimpan di server{savedClock ? ` · ${savedClock}` : ''}</span>
                  </>
                )}
              </span>
            )}
          </span>
        }
        actions={
          <>
            <span
              className={`badge ${
                invitation.isPublished ? 'badge-success' : publishable ? '' : 'badge-warning'
              }`}
            >
              {invitation.isPublished ? 'Tayang' : publishable ? 'Draf' : 'Belum berlisensi'}
            </span>

            {publishable ? (
              <button
                type="button"
                className={`btn btn-sm ${invitation.isPublished ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handlePublish}
                disabled={publishing}
              >
                {invitation.isPublished ? <EyeOff size={13} /> : <Globe size={13} />}
                <span className="btn-label">{invitation.isPublished ? 'Jadikan draf' : 'Tayangkan'}</span>
              </button>
            ) : template ? (
              <Link
                href={`/checkout?template=${template.id}&undangan=${invitation.id}`}
                className="btn btn-sm btn-buy"
              >
                <Lock size={13} />
                <span className="btn-label">Beli {formatIDR(template.price)}</span>
              </Link>
            ) : null}

            <Link
              href={`/invite/${invitation.slug}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-ghost"
              aria-label="Buka undangan publik"
              title="Buka undangan publik"
            >
              <ExternalLink size={14} />
              <span className="btn-label">Lihat</span>
            </Link>
          </>
        }
      />

      {template && (
        <div className={`studio-strip${publishable ? '' : ' is-warning'}`}>
          {publishable ? (
            <>
              <ShieldCheck size={13} style={{ color: 'var(--success)', flexShrink: 0 }} />
              <span>
                Lisensi <b>{template.name}</b> aktif permanen untuk undangan ini.
              </span>
            </>
          ) : (
            <>
              <Lock size={13} style={{ flexShrink: 0 }} />
              <span>
                Draf. Beli lisensi <b>{template.name}</b> agar tautan bisa dibuka tamu — isi konten tetap
                tersimpan.
              </span>
            </>
          )}
        </div>
      )}

      <div className="studio-strip" role="status" aria-live="polite" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        {saveState?.status === 'error' ? (
          <>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--danger, #b91c1c)' }}>
              <AlertCircle size={13} />
              <span>Belum tersimpan: {saveState.message}</span>
            </span>
            <button className="btn btn-sm btn-secondary" onClick={() => { void saveNow(id).catch(() => undefined); }}>
              Coba simpan lagi
            </button>
          </>
        ) : saveState?.status === 'saving' ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={13} className="spin" />
            <span>Menyimpan perubahan ke server…</span>
          </span>
        ) : saveState?.status === 'unsaved' ? (
          <>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Cloud size={13} />
              <span>Ada perubahan belum disimpan — otomatis disimpan setiap 5 detik.</span>
            </span>
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={() => { void saveNow(id).catch(() => undefined); }}
            >
              Simpan sekarang
            </button>
          </>
        ) : saveState?.status === 'saved' ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={13} style={{ color: 'var(--success)' }} />
            <span>
              Semua perubahan disimpan di server{savedClock ? ` (terakhir disimpan pukul ${savedClock})` : ''} · Simpan otomatis aktif tiap 5 detik jika ada perubahan data.
            </span>
          </span>
        ) : hasServerSession() ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Cloud size={13} />
            <span>Simpan otomatis aktif setiap 5 detik jika ada perubahan data.</span>
          </span>
        ) : (
          <span>Mode demo: perubahan hanya tersimpan di browser ini. Masuk untuk menyimpan ke server.</span>
        )}
      </div>
      {children}
    </>
  );
}
