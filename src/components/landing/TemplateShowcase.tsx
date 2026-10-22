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
    <section id="templates" style={{ padding: '70px 0', background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 40px' }}>
          <div style={{ display: 'inline-flex', marginBottom: 12 }}>
            <span className="badge badge-gold">
              <Sparkles size={14} color="#2563eb" />
              Template Siap Pakai Tinggal Pake
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)',
              color: '#0f172a',
              marginBottom: 12,
            }}
          >
            Desain Mewah Siap Pakai, Bikin Tamu Kagum Mase!
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Pilih tema yang paling pas sama konsep acara mase. Semuanya mobile-first, enteng dibuka di semua HP, dan gampang diedit foto serta teksnya.
          </p>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 36,
          }}
        >
          {[
            { id: 'all', label: 'Semua Koleksi' },
            { id: 'rustic', label: 'Rustic & Flora' },
            { id: 'luxury', label: 'Royal Midnight Gold' },
            { id: 'islamic', label: 'Islami Modern' },
            { id: 'pastel', label: 'Blush Sakura' },
          ].map((item) => {
            const isSelected = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className="btn btn-sm"
                style={{
                  padding: '7px 16px',
                  fontSize: '0.82rem',
                  background: isSelected ? '#0f172a' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#475569',
                  border: isSelected ? '1px solid #0f172a' : '1px solid #e2e8f0',
                  borderRadius: 8,
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Templates Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: 24,
          }}
        >
          {filtered.map((tmpl) => (
            <div
              key={tmpl.id}
              className="glass-card"
              style={{
                borderRadius: 14,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image Preview */}
              <div style={{ position: 'relative', height: 230, overflow: 'hidden', background: '#f8fafc' }}>
                <img
                  src={tmpl.previewImage}
                  alt={tmpl.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {tmpl.badge && (
                  <span
                    className="badge"
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: '#ffffff',
                      color: '#0f172a',
                      border: '1px solid #e2e8f0',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <Sparkles size={12} color="#2563eb" />
                    {tmpl.badge}
                  </span>
                )}

                {/* Color Swatches */}
                <div style={{ position: 'absolute', bottom: 12, left: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: tmpl.themeColor,
                      border: '2px solid #ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                    title="Warna Latar Utama"
                  />
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: tmpl.accentColor,
                      border: '2px solid #ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                    title="Warna Aksen"
                  />
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      color: '#64748b',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      display: 'block',
                      marginBottom: 4,
                    }}
                  >
                    {tmpl.category}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.25rem',
                      color: '#0f172a',
                      marginBottom: 6,
                    }}
                  >
                    {tmpl.name}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 18 }}>
                    {tmpl.description}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(tmpl)}
                    className="btn btn-sm btn-glass"
                    style={{ fontSize: '0.8rem', borderRadius: 8 }}
                  >
                    <Eye size={14} />
                    Pratinjau
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUseTemplate(tmpl.id)}
                    className="btn btn-sm btn-gold"
                    style={{ fontSize: '0.8rem', borderRadius: 8 }}
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
              background: 'rgba(15, 23, 42, 0.65)',
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
                  top: -42,
                  right: 0,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <X size={18} />
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
              <div style={{ marginTop: 14 }}>
                <button
                  type="button"
                  onClick={() => handleUseTemplate(previewTemplate.id)}
                  className="btn btn-gold"
                  style={{ padding: '9px 22px', fontSize: '0.88rem', borderRadius: 8 }}
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
