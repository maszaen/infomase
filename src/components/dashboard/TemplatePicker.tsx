'use client';

import React from 'react';
import { AVAILABLE_TEMPLATES, TemplateMeta } from '@/lib/defaultData';
import { TemplateId } from '@/types/invitation';
import { Check, Sparkles, Eye } from 'lucide-react';

interface TemplatePickerProps {
  selectedTemplateId: TemplateId;
  onSelect: (id: TemplateId) => void;
  onPreviewClick?: (id: TemplateId) => void;
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  selectedTemplateId,
  onSelect,
  onPreviewClick,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: '#ffffff', marginBottom: 6 }}>
          Pilih Template Undangan
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Pilih tema desain yang paling menggambarkan konsep pesta pernikahan Anda. Semua template responsif dan siap pakai.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
        }}
      >
        {AVAILABLE_TEMPLATES.map((tmpl) => {
          const isSelected = selectedTemplateId === tmpl.id;

          return (
            <div
              key={tmpl.id}
              onClick={() => onSelect(tmpl.id)}
              className="glass-card"
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--gold-400)' : '1px solid var(--border-glass)',
                boxShadow: isSelected ? '0 12px 30px rgba(212, 175, 55, 0.25)' : 'var(--shadow-sm)',
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
            >
              {/* Image banner with overlay */}
              <div style={{ position: 'relative', height: 170, overflow: 'hidden' }}>
                <img
                  src={tmpl.previewImage}
                  alt={tmpl.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(16, 22, 34, 0.9) 0%, transparent 60%)',
                  }}
                />

                {/* Badge if any */}
                {tmpl.badge && (
                  <span
                    className="badge badge-gold"
                    style={{ position: 'absolute', top: 12, right: 12 }}
                  >
                    <Sparkles size={12} />
                    {tmpl.badge}
                  </span>
                )}

                {/* Color swatches */}
                <div style={{ position: 'absolute', bottom: 12, left: 16, display: 'flex', gap: 6 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: tmpl.themeColor,
                      border: '2px solid #ffffff',
                    }}
                    title="Warna Utama"
                  />
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: tmpl.accentColor,
                      border: '2px solid #ffffff',
                    }}
                    title="Warna Aksen"
                  />
                </div>
              </div>

              {/* Template details */}
              <div style={{ padding: '18px 20px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'var(--gold-400)',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                  }}
                >
                  {tmpl.category}
                </span>

                <h4
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    color: '#ffffff',
                    margin: '6px 0 8px',
                  }}
                >
                  {tmpl.name}
                </h4>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                  {tmpl.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: isSelected ? 'var(--gold-300)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {isSelected ? (
                      <>
                        <Check size={16} color="var(--gold-400)" />
                        Sedang Aktif
                      </>
                    ) : (
                      'Klik untuk Terapkan'
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(tmpl.id);
                    }}
                    className={`btn btn-sm ${isSelected ? 'btn-gold' : 'btn-outline-gold'}`}
                    style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  >
                    {isSelected ? 'Terpilih' : 'Pilih'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
