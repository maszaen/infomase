'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AVAILABLE_TEMPLATES, TemplateMeta } from '@/lib/defaultData';
import { TemplateId } from '@/types/invitation';
import { useInvitationStore } from '@/lib/invitationStore';
import { Sparkles, Eye, Check, ArrowRight, X } from 'lucide-react';
import { InvitationRenderer } from '../invitation/InvitationRenderer';

export const TemplateShowcase: React.FC = () => {
  const router = useRouter();
  const { setTemplateId, data } = useInvitationStore();
  const [filter, setFilter] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateMeta | null>(null);

  const handleUseTemplate = (id: TemplateId) => {
    setTemplateId(id);
    router.push('/dashboard');
  };

  const filtered = AVAILABLE_TEMPLATES.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'rustic') return t.id === 'rustic';
    if (filter === 'luxury') return t.id === 'royal-gold';
    if (filter === 'islamic') return t.id === 'islamic';
    if (filter === 'pastel') return t.id === 'sakura';
    return true;
  });

  return (
    <section id="templates" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 48px' }}>
          <div style={{ display: 'inline-flex', marginBottom: 12 }}>
            <span className="badge badge-gold">
              <Sparkles size={14} />
              Template Siap Pakai Tinggal Pake
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              color: '#ffffff',
              marginBottom: 16,
            }}
          >
            Desain Mewah Siap Pakai, Bikin Tamu Kagum Mase!
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Pilih tema yang paling pas sama konsep acara mase. Semuanya mobile-first, enteng dibuka di semua HP, dan gampang diedit foto serta teksnya.
          </p>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 40,
          }}
        >
          {[
            { id: 'all', label: 'Semua Koleksi' },
            { id: 'rustic', label: 'Rustic & Flora' },
            { id: 'luxury', label: 'Royal Midnight Gold' },
            { id: 'islamic', label: 'Islami Modern' },
            { id: 'pastel', label: 'Blush Sakura' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`btn btn-sm ${filter === item.id ? 'btn-gold' : 'btn-glass'}`}
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 28,
          }}
        >
          {filtered.map((tmpl) => (
            <div
              key={tmpl.id}
              className="glass-card"
              style={{
                borderRadius: 24,
                overflow: 'hidden',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image Preview with overlay */}
              <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
                <img
                  src={tmpl.previewImage}
                  alt={tmpl.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(10, 13, 20, 0.95) 0%, rgba(10, 13, 20, 0.2) 60%, transparent 100%)',
                  }}
                />

                {tmpl.badge && (
                  <span className="badge badge-gold" style={{ position: 'absolute', top: 14, right: 14 }}>
                    <Sparkles size={12} />
                    {tmpl.badge}
                  </span>
                )}

                {/* Color Swatches */}
                <div style={{ position: 'absolute', bottom: 16, left: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: tmpl.themeColor,
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    }}
                    title="Warna Latar Utama"
                  />
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: tmpl.accentColor,
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    }}
                    title="Warna Aksen Emas/Pastel"
                  />
                  <span style={{ fontSize: '0.75rem', color: '#ffffff', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    {tmpl.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.4rem',
                      color: '#ffffff',
                      marginBottom: 8,
                    }}
                  >
                    {tmpl.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 20 }}>
                    {tmpl.description}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(tmpl)}
                    className="btn btn-sm btn-glass"
                    style={{ fontSize: '0.82rem' }}
                  >
                    <Eye size={15} />
                    Pratinjau
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUseTemplate(tmpl.id)}
                    className="btn btn-sm btn-gold"
                    style={{ fontSize: '0.82rem' }}
                  >
                    <span>Gunakan</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Preview Modal */}
        {previewTemplate && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxHeight: '94vh',
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                style={{
                  position: 'absolute',
                  top: -46,
                  right: 0,
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 38,
                  height: 38,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>

              {/* Smartphone Preview Frame */}
              <div className="phone-mockup" style={{ height: 680 }}>
                <div className="phone-notch" />
                <div className="phone-screen">
                  <InvitationRenderer
                    data={{ ...data, templateId: previewTemplate.id }}
                    guestName="Tamu Undangan Istimewa"
                    defaultOpened={false}
                  />
                </div>
              </div>

              {/* Bottom Action inside Modal */}
              <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => handleUseTemplate(previewTemplate.id)}
                  className="btn btn-gold"
                  style={{ padding: '10px 24px', fontSize: '0.9rem' }}
                >
                  <Check size={16} />
                  Gunakan Template {previewTemplate.name}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
