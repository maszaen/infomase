'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { InvitationProvider, useInvitationStore } from '@/lib/invitationStore';
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer';
import { publicApi } from '@/lib/api';
import type { InvitationData, RSVPItem } from '@/types/invitation';

function InvitationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) ?? '';
  const guestName = searchParams.get('to') ?? undefined;

  const { getInvitationBySlug, addRSVP, isLoaded } = useInvitationStore();
  const [remoteData, setRemoteData] = useState<InvitationData | null>(null);
  const [checkedRemote, setCheckedRemote] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let active = true;

    publicApi
      .getBySlug(slug, guestName)
      .then((res) => {
        if (active && res) setRemoteData(res);
      })
      .catch(() => {
        /* unpublished or backend unreachable — fall back to local copy */
      })
      .finally(() => {
        if (active) setCheckedRemote(true);
      });

    return () => {
      active = false;
    };
  }, [slug, guestName]);

  const localCopy = slug ? getInvitationBySlug(slug) : undefined;
  const invitation = remoteData ?? localCopy;

  const handleAddRSVP = async (item: Omit<RSVPItem, 'id' | 'createdAt'>) => {
    if (slug) {
      try {
        await publicApi.submitRsvp(slug, item);
      } catch {
        /* keep the optimistic local copy so guests still see their entry */
      }
    }
    addRSVP(item);
  };

  // Wait for local hydration + one remote attempt before deciding "not found".
  if (!isLoaded || (!checkedRemote && !localCopy)) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--artifact-paper)',
        }}
      >
        <span className="meta">Membuka undangan…</span>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-6)',
          background: 'var(--surface-sunken)',
        }}
      >
        <div className="card" style={{ maxWidth: 420, width: '100%', padding: 'var(--space-8)', textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'var(--warning-bg)',
              color: 'var(--warning)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <Lock size={22} />
          </span>
          <h1 style={{ fontSize: 'var(--text-lg)' }}>Undangan belum bisa dibuka</h1>
          <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
            Tautan ini belum aktif atau sudah tidak tersedia. Silakan hubungi pemilik acara untuk memastikan
            tautan yang Anda terima.
          </p>
          <Link href="/" className="btn btn-secondary" style={{ marginTop: 'var(--space-4)' }}>
            Kembali ke beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--artifact-paper-deep)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 430, minHeight: '100dvh', position: 'relative' }}>
        <InvitationRenderer data={invitation} guestName={guestName} onAddRSVP={handleAddRSVP} />
      </div>
    </div>
  );
}

export default function InvitationPage() {
  return (
    <InvitationProvider>
      <Suspense
        fallback={
          <div
            style={{
              minHeight: '100dvh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--artifact-paper)',
            }}
          >
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--artifact-accent)' }}>Membuka undangan…</span>
          </div>
        }
      >
        <InvitationContent />
      </Suspense>
    </InvitationProvider>
  );
}
