import React from 'react';
import { Heart } from 'lucide-react';
import { InvitationData } from '@/types/invitation';

const InstagramIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

interface CoupleSectionProps {
  data: InvitationData;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ data }) => {
  return (
    <section id="mempelai" style={{ padding: '36px 16px', textAlign: 'center' }}>
      {/* Quote Header */}
      {data.quote && (
        <div
          style={{
            background: 'var(--inv-card)',
            border: '1px solid var(--inv-border)',
            borderRadius: 16,
            padding: '20px 18px',
            marginBottom: 36,
            boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
          }}
        >
          <p
            style={{
              fontStyle: 'italic',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              color: 'var(--inv-text)',
              marginBottom: 10,
            }}
          >
            "{data.quote.text}"
          </p>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--inv-accent)' }}>
            {data.quote.source}
          </span>
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <span
          style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--inv-accent)',
            fontWeight: 700,
          }}
        >
          Pasangan Mempelai
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.9rem',
            color: 'var(--inv-primary)',
            marginTop: 4,
          }}
        >
          Maha Suci Allah
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--inv-text-muted)', marginTop: 4, maxWidth: 300, marginInline: 'auto' }}>
          Yang telah mempertemukan dan menyatukan kami dalam ikatan pernikahan yang suci.
        </p>
      </div>

      {/* Groom Profile */}
      <div
        style={{
          background: 'var(--inv-card)',
          border: '1px solid var(--inv-border)',
          borderRadius: 24,
          padding: '24px 20px',
          marginBottom: 24,
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '0 auto 16px',
            border: '4px solid var(--inv-accent)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
          }}
        >
          <img
            src={data.groom.photo}
            alt={data.groom.fullName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.45rem',
            color: 'var(--inv-primary)',
            marginBottom: 4,
          }}
        >
          {data.groom.fullName}
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--inv-text-muted)', marginBottom: 12 }}>
          Putra dari {data.groom.fatherName} &amp; {data.groom.motherName}
        </p>

        {data.groom.bio && (
          <p style={{ fontSize: '0.8rem', color: 'var(--inv-text)', fontStyle: 'italic', marginBottom: 14 }}>
            "{data.groom.bio}"
          </p>
        )}

        {data.groom.instagram && (
          <a
            href={`https://instagram.com/${data.groom.instagram.replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.8rem',
              color: 'var(--inv-accent)',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: 999,
              border: '1px solid var(--inv-border)',
              background: 'rgba(0,0,0,0.03)',
            }}
          >
            <InstagramIcon size={14} />
            {data.groom.instagram}
          </a>
        )}
      </div>

      {/* Heart Separator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '20px 0' }}>
        <div style={{ height: 1, width: 60, background: 'var(--inv-border)' }} />
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'var(--inv-accent)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Heart size={18} fill="currentColor" />
        </div>
        <div style={{ height: 1, width: 60, background: 'var(--inv-border)' }} />
      </div>

      {/* Bride Profile */}
      <div
        style={{
          background: 'var(--inv-card)',
          border: '1px solid var(--inv-border)',
          borderRadius: 24,
          padding: '24px 20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '0 auto 16px',
            border: '4px solid var(--inv-accent)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
          }}
        >
          <img
            src={data.bride.photo}
            alt={data.bride.fullName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.45rem',
            color: 'var(--inv-primary)',
            marginBottom: 4,
          }}
        >
          {data.bride.fullName}
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--inv-text-muted)', marginBottom: 12 }}>
          Putri dari {data.bride.fatherName} &amp; {data.bride.motherName}
        </p>

        {data.bride.bio && (
          <p style={{ fontSize: '0.8rem', color: 'var(--inv-text)', fontStyle: 'italic', marginBottom: 14 }}>
            "{data.bride.bio}"
          </p>
        )}

        {data.bride.instagram && (
          <a
            href={`https://instagram.com/${data.bride.instagram.replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.8rem',
              color: 'var(--inv-accent)',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: 999,
              border: '1px solid var(--inv-border)',
              background: 'rgba(0,0,0,0.03)',
            }}
          >
            <InstagramIcon size={14} />
            {data.bride.instagram}
          </a>
        )}
      </div>
    </section>
  );
};
