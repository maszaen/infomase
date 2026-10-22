'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInvitationStore } from '@/lib/invitationStore';
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer';
import { Sparkles } from 'lucide-react';

function InvitationContent() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get('to') || undefined;
  const { data, isLoaded, addRSVP } = useInvitationStore();

  if (!isLoaded) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0d14',
          color: '#ffffff',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Sparkles size={32} color="#d4af37" className="music-spinning" />
          <p style={{ marginTop: 14, fontSize: '0.9rem', color: '#94a3b8' }}>
            Membuka Undangan Pernikahan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0d14',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {/* Mobile centered container */}
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          minHeight: '100vh',
          background: 'var(--inv-bg, #ffffff)',
          boxShadow: '0 0 50px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
      >
        <InvitationRenderer
          data={data}
          guestName={guestName}
          onAddRSVP={addRSVP}
        />
      </div>
    </div>
  );
}

export default function InvitationPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0d14' }}>
          <Sparkles size={32} color="#d4af37" className="music-spinning" />
        </div>
      }
    >
      <InvitationContent />
    </Suspense>
  );
}
