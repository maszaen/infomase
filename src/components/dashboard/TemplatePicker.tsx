'use client';

import React from 'react';
import { AVAILABLE_TEMPLATES } from '@/lib/defaultData';
import { TemplateId } from '@/types/invitation';
import { Check, Sparkles } from 'lucide-react';

interface TemplatePickerProps {
  selectedTemplateId: TemplateId;
  onSelect: (id: TemplateId) => void;
  onPreviewClick?: (id: TemplateId) => void;
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  selectedTemplateId,
  onSelect,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: '#0f172a', marginBottom: 4, fontWeight: 700 }}>
          Pilih Template Undangan
        </h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
          Pilih tema desain yang paling pas sama konsep acara mase. Klik template untuk langsung menerapkan ke preview.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
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
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                border: isSelected ? '2px solid #0f172a' : '1px solid #e2e8f0',
                background: '#ffffff',
                boxShadow: isSelected ? 'var(--shadow-sm)' : 'var(--shadow-xs)',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Image banner */}
              <div style={{ position: 'relative', height: 160, overflow: 'hidden', background: '#f8fafc' }}>
                <img
                  src={tmpl.previewImage}
                  alt={tmpl.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Badge if any */}
                {tmpl.badge && (
                  <span
                    className="badge"
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: '#ffffff',
                      color: '#0f172a',
                      border: '1px solid #e2e8f0',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <Sparkles size={11} color="#2563eb" />
                    {tmpl.badge}
                  </span>
                )}

                {/* Color swatches */}
                <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', gap: 6 }}>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: tmpl.themeColor,
                      border: '2px solid #ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    }}
                    title="Warna Utama"
                  />
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: tmpl.accentColor,
                      border: '2px solid #ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    }}
                    title="Warna Aksen"
                  />
                </div>
              </div>

              {/* Template details */}
              <div style={{ padding: '16px' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    color: '#64748b',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  {tmpl.category}
                </span>

                <h4
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.1rem',
                    color: '#0f172a',
                    margin: '4px 0 6px',
                    fontWeight: 700,
                  }}
                >
                  {tmpl.name}
                </h4>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                  {tmpl.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: isSelected ? '#0f172a' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {isSelected ? (
                      <>
                        <Check size={14} color="#059669" />
                        Aktif
                      </>
                    ) : (
                      'Pilih Template'
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(tmpl.id);
                    }}
                    className={`btn btn-sm ${isSelected ? 'btn-gold' : 'btn-outline-gold'}`}
                    style={{ padding: '5px 12px', fontSize: '0.76rem', borderRadius: 6 }}
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
