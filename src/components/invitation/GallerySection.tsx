'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { InvitationData } from '@/types/invitation';

interface GallerySectionProps {
  data: InvitationData;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ data }) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  if (!data.gallery || data.gallery.length === 0) return null;

  return (
    <section id="galeri" style={{ padding: '36px 16px', textAlign: 'center' }}>
      <div style={{ marginBottom: 24 }}>
        <span
          style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--inv-accent)',
            fontWeight: 700,
          }}
        >
          Memori Bahagia
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.9rem',
            color: 'var(--inv-primary)',
            marginTop: 4,
          }}
        >
          Galeri Foto
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--inv-text-muted)', marginTop: 4 }}>
          Momen berharga yang terabadikan dalam lembaran kisah kami
        </p>
      </div>

      {/* Grid of Photos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10,
          maxWidth: 360,
          margin: '0 auto',
        }}
      >
        {data.gallery.map((photo, idx) => (
          <div
            key={photo.id || idx}
            onClick={() => setActivePhotoIdx(idx)}
            style={{
              position: 'relative',
              height: idx % 3 === 0 ? 180 : 130,
              gridColumn: idx % 3 === 0 ? 'span 2' : 'span 1',
              borderRadius: 16,
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              border: '2px solid var(--inv-border)',
              transition: 'transform 0.2s ease',
            }}
          >
            <img
              src={photo.url}
              alt={photo.caption || 'Foto Pernikahan'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {photo.caption && (
              <div
                style={{
                  position: 'absolute',
                  inset: 'auto 0 0 0',
                  padding: '8px 10px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  textAlign: 'left',
                }}
              >
                {photo.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhotoIdx !== null && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setActivePhotoIdx(null)}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>

          {/* Image */}
          <div style={{ maxWidth: '90%', maxHeight: '75%', position: 'relative' }}>
            <img
              src={data.gallery[activePhotoIdx].url}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                borderRadius: 16,
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            />
            {data.gallery[activePhotoIdx].caption && (
              <p style={{ color: '#fff', marginTop: 12, fontSize: '0.88rem' }}>
                {data.gallery[activePhotoIdx].caption}
              </p>
            )}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
            <button
              onClick={() => setActivePhotoIdx((prev) => (prev! > 0 ? prev! - 1 : data.gallery.length - 1))}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: 44,
                height: 44,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => setActivePhotoIdx((prev) => (prev! < data.gallery.length - 1 ? prev! + 1 : 0))}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: 44,
                height: 44,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
