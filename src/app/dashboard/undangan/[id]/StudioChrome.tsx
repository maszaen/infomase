'use client';

import React, { useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, Lock, ShieldCheck } from 'lucide-react';
import { ConsolePageHeader } from '@/components/console/ConsolePageHeader';
import { useInvitationStore } from '@/lib/invitationStore';
import { getTemplate } from '@/lib/templates';

export default function StudioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { invitations, activeId, setActiveInvitation, data, isPublishable } = useInvitationStore();

  const exists = invitations.some((inv) => inv.id === id);

  useEffect(() => {
    if (exists && activeId !== id) setActiveInvitation(id);
  }, [exists, id, activeId, setActiveInvitation]);

  if (!exists) {
    notFound();
  }

  const invitation = invitations.find((inv) => inv.id === id) ?? data;
  const template = getTemplate(invitation.templateId);
  const publishable = isPublishable(invitation.id);

  return (
    <>
      <ConsolePageHeader
        title={invitation.title}
        back={{ label: 'Semua undangan', href: '/dashboard' }}
        description={
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }}>/invite/{invitation.slug}</span>
        }
        actions={
          <>
            <span className={`badge ${invitation.isPublished ? 'badge-success' : publishable ? '' : 'badge-warning'}`}>
              {invitation.isPublished ? 'Tayang' : publishable ? 'Draf' : 'Belum berlisensi'}
            </span>

            <Link href={`/dashboard/undangan/${invitation.id}/design`} className="btn btn-sm btn-secondary">
              {invitation.isPublished ? 'Kelola tayang' : 'Tayangkan'}
            </Link>

            <Link
              href={`/invite/${invitation.slug}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-ghost"
              aria-label="Buka undangan publik"
            >
              <ExternalLink size={14} />
              <span className="hide-sm">Lihat</span>
            </Link>
          </>
        }
      />

      {template && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px var(--space-5)',
            background: publishable ? 'var(--surface)' : 'var(--warning-bg)',
            borderBottom: `1px solid ${publishable ? 'var(--border-subtle)' : 'var(--warning-border)'}`,
            fontSize: 'var(--text-2xs)',
            color: publishable ? 'var(--ink-500)' : 'var(--warning)',
          }}
        >
          {publishable ? (
            <>
              <ShieldCheck size={13} style={{ color: 'var(--success)' }} />
              Lisensi {template.name} aktif permanen untuk undangan ini.
            </>
          ) : (
            <>
              <Lock size={13} />
              Draf. Beli lisensi {template.name} agar tautan bisa dibuka tamu — isi kontennya tetap tersimpan.
            </>
          )}
        </div>
      )}

      {children}

    </>
  );
}
