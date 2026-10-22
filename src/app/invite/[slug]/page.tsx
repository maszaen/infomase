'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useInvitationStore } from '@/lib/invitationStore';
import { publicApi } from '@/lib/api';
import { InvitationData, RSVPItem } from '@/types/invitation';
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer';
import { Sparkles } from 'lucide-react';

function InvitationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || '';
  const guestName = searchParams.get('to') || undefined;

  const { data: localData, isLoaded: localLoaded, addRSVP: addLocalRSVP } = useInvitationStore();
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch real invitation data from backend API
  useEffect(() => {
    let isMounted = true;

    if (slug) {
      publicApi
        .getBySlug(slug, guestName)
        .then((res) => {
          if (isMounted && res) {
            setInvitationData(res);
          }
        })
        .catch(() => {
          // If backend offline or slug not found on server, fallback to local store
          if (isMounted) {
            setInvitationData(null);
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [slug, guestName]);

  const activeData = invitationData || localData;

  const handleAddRSVP = async (item: Omit<RSVPItem, 'id' | 'createdAt'>) => {
    // 1. Submit to backend API if slug exists
    if (slug) {
      try {
        await publicApi.submitRsvp(slug, item);
      } catch (err) {
        console.warn('Backend RSVP submit offline or failed, saving locally', err);
      }
    }
    // 2. Always update local store so user sees instant feedback in preview
    addLocalRSVP(item);
  };

  if (loading && !localLoaded) {
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
          data={activeData}
          guestName={guestName}
          onAddRSVP={handleAddRSVP}
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
