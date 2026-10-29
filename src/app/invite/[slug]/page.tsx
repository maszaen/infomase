'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';
import { useInvitationStore } from '@/lib/invitationStore';
import { publicApi } from '@/lib/api';
import { InvitationData, RSVPItem } from '@/types/invitation';
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer';
import { Sparkles, Lock } from 'lucide-react';

function InvitationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || '';
  const guestName = searchParams.get('to') || undefined;

  const { getInvitationBySlug, data: fallbackData, isLoaded: localLoaded, addRSVP: addLocalRSVP } = useInvitationStore();
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
          // Fallback to local store
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

  const matchedLocal = slug ? getInvitationBySlug(slug) : undefined;
  const activeData = invitationData || matchedLocal || fallbackData;

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

  if (activeData && activeData.isPublished === false) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          padding: '24px 16px',
        }}
      >
        <div
          className="glass-card"
          style={{
            maxWidth: 440,
            width: '100%',
            padding: '36px 28px',
            borderRadius: 16,
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Lock size={26} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#0f172a', marginBottom: 8 }}>
            Undangan Belum Dipublikasikan
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.6, marginBottom: 24 }}>
            Undangan digital ini saat ini sedang dalam mode <strong>Draft</strong> atau masa aktif publikasinya belum dibuka oleh pemilik acara.
          </p>
          <Link
            href="/"
            className="btn btn-gold"
            style={{ width: '100%', padding: '11px', textDecoration: 'none', display: 'inline-block', borderRadius: 8, fontWeight: 500 }}
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#E6DDD1',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          minHeight: '100vh',
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
