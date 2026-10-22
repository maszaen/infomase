'use client';

import React from 'react';
import { MailOpen, Heart, Sparkles } from 'lucide-react';
import { InvitationData } from '@/types/invitation';

import { formatFullIndonesianDate } from '@/lib/formatDate';

interface EnvelopeCoverProps {
  data: InvitationData;
  guestName?: string;
  onOpen: () => void;
}

export const EnvelopeCover: React.FC<EnvelopeCoverProps> = ({ data, guestName, onOpen }) => {
  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '32px 20px',
        position: 'relative',
        background: `radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.15) 0%, transparent 70%), var(--inv-bg)`,
      }}
    >
      {/* Decorative Ornaments */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--inv-accent)' }}>
        <Sparkles size={16} />
        <span style={{ fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600 }}>
          The Wedding Celebration
        </span>
        <Sparkles size={16} />
      </div>

      {/* Main Couple Names */}
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.5rem',
          lineHeight: 1.15,
          color: 'var(--inv-primary)',
          margin: '8px 0',
        }}
      >
        {data.groom.name} &amp; {data.bride.name}
      </h1>

      <p style={{ fontSize: '0.9rem', color: 'var(--inv-text-muted)', marginBottom: 28, letterSpacing: '0.05em' }}>
        {formatFullIndonesianDate(data.countdownDate)}
      </p>

      {/* Couple Portrait Card with subtle shadow */}
      <div
        style={{
          position: 'relative',
          width: 170,
          height: 230,
          borderRadius: '999px 999px 24px 24px',
          overflow: 'hidden',
          border: '4px solid var(--inv-border)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
          marginBottom: 32,
        }}
      >
        <img
          src={data.gallery[0]?.url || data.groom.photo}
          alt={`${data.groom.name} & ${data.bride.name}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Guest Card Box */}
      <div
        style={{
          background: 'var(--inv-card)',
          border: '1px solid var(--inv-border)',
          borderRadius: '18px',
          padding: '20px 24px',
          maxWidth: '320px',
          width: '100%',
          boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
          marginBottom: 28,
        }}
      >
        <span style={{ fontSize: '0.78rem', color: 'var(--inv-text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block' }}>
          Kepada Yth. Bapak/Ibu/Saudara/i
        </span>
        <h3
          style={{
            fontSize: '1.25rem',
            margin: '8px 0 4px',
            color: 'var(--inv-primary)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {guestName || 'Tamu Undangan Istimewa'}
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--inv-text-muted)' }}>
          Mohon maaf apabila ada kesalahan penulisan nama/gelar
        </p>
      </div>

      {/* Open Button with Pulse */}
      <button
        onClick={onOpen}
        className="btn"
        style={{
          background: 'var(--inv-primary)',
          color: '#ffffff',
          padding: '14px 28px',
          fontSize: '0.95rem',
          fontWeight: 600,
          borderRadius: '999px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
        }}
      >
        <MailOpen size={18} />
        Buka Undangan
      </button>

      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--inv-text-muted)' }}>
        <Heart size={14} fill="currentColor" color="#e74c3c" />
        <span>InfoMase Digital Invitation</span>
      </div>
    </div>
  );
};
