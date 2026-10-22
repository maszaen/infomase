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
          background: '#f8fafc',
          color: '#0f172a',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Sparkles size={32} color="#0f172a" className="music-spinning" />
          <p style={{ marginTop: 14, fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
            Membuka Undangan Digital InfoMase...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f1f5f9',
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
          background: '#ffffff',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          borderLeft: '1px solid #e2e8f0',
          borderRight: '1px solid #e2e8f0',
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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
          <Sparkles size={32} color="#0f172a" className="music-spinning" />
        </div>
      }
    >
      <InvitationContent />
    </Suspense>
  );
}
