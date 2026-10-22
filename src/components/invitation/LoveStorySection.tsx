'use client';

import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { InvitationData } from '@/types/invitation';

interface LoveStorySectionProps {
  data: InvitationData;
}

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({ data }) => {
  if (!data.stories || data.stories.length === 0) return null;

  return (
    <section id="kisah" style={{ padding: '36px 16px', textAlign: 'center' }}>
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
          Perjalanan Cinta
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.9rem',
            color: 'var(--inv-primary)',
            marginTop: 4,
          }}
        >
          Kisah Kami
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--inv-text-muted)', marginTop: 4 }}>
          Setiap babak cerita yang mengantarkan kami menuju janji suci
        </p>
      </div>

      <div style={{ position: 'relative', maxWidth: 360, margin: '0 auto', textAlign: 'left' }}>
        {/* Vertical timeline line */}
        <div
          style={{
            position: 'absolute',
            top: 15,
            bottom: 15,
            left: 20,
            width: 2,
            background: 'var(--inv-border)',
          }}
        />

        {data.stories.map((story) => (
          <div
            key={story.id}
            style={{
              position: 'relative',
              paddingLeft: 46,
              marginBottom: 32,
            }}
          >
            {/* Timeline node icon */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 10,
                transform: 'translateX(-50%)',
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'var(--inv-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 4px var(--inv-bg)',
              }}
            >
              <Heart size={12} fill="currentColor" />
            </div>

            {/* Story Card */}
            <div
              style={{
                background: 'var(--inv-card)',
                border: '1px solid var(--inv-border)',
                borderRadius: 18,
                padding: '16px',
                boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--inv-accent)',
                  marginBottom: 4,
                }}
              >
                Tahun {story.year}
              </span>
              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  color: 'var(--inv-primary)',
                  marginBottom: 6,
                }}
              >
                {story.title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--inv-text)', lineHeight: 1.5, marginBottom: story.image ? 10 : 0 }}>
                {story.description}
              </p>

              {story.image && (
                <div style={{ width: '100%', height: 140, borderRadius: 12, overflow: 'hidden', marginTop: 10 }}>
                  <img src={story.image} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
