'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EyeOff, ExternalLink, Globe, Lock, ShieldCheck } from 'lucide-react';
import { ConsolePageHeader } from '@/components/console/ConsolePageHeader';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
import { getTemplate, formatIDR } from '@/lib/templates';

export default function StudioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { invitations, setActiveInvitation, data, isPublishable, togglePublish } = useInvitationStore();
  const toast = useToast();

  const invitation = invitations.find((inv) => inv.id === id);

  React.useEffect(() => {
    if (invitation) setActiveInvitation(id);
  }, [invitation, id, setActiveInvitation]);

  if (!invitation) {
    notFound();
  }

  const template = getTemplate(invitation.templateId);
  const publishable = isPublishable(invitation.id);

  const handlePublish = () => {
    const result = togglePublish(invitation.id);
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
  };

  return (
    <>
      <ConsolePageHeader
        title={invitation.title}
        back={{ label: 'Semua undangan', href: '/dashboard' }}
        description={<span style={{ fontFamily: 'var(--font-mono)' }}>/invite/{invitation.slug}</span>}
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

      {children}
    </>
  );
}
