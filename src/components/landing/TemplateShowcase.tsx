'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AVAILABLE_TEMPLATES, TemplateMeta } from '@/lib/defaultData';
import { TemplateId } from '@/types/invitation';
import { useInvitationStore } from '@/lib/invitationStore';
import { Eye, Check, ArrowRight, Layers } from 'lucide-react';
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
    return t.category === filter;
  });

  const categories = [
    { id: 'all', label: 'Semua Desain' },
    { id: 'Botanical & Rustic', label: 'Boho Botanical Masterpiece' },
  ];

  return (
    <section id="templates" className="section section-sunken">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 40px' }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            <Layers size={13} />
            Desain resmi premium
          </div>
          <h2 className="section-title">Koleksi undangan digital eksklusif</h2>
          <p className="section-subtitle" style={{ margin: '12px auto 0' }}>
            Gate cover 3D book flip, tekstur watercolor wash, animasi dedaunan bergoyang alami,
            dan soundtrack orkestra romantis — semua sudah teruji di ribuan perangkat.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`chip ${filter === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {filtered.map((tmpl) => (
            <div key={tmpl.id} className="card card-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: 210, overflow: 'hidden', background: 'var(--canvas)' }}>
                <img
                  src={tmpl.previewImage}
                  alt={tmpl.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />

                {tmpl.tier && (
                  <span
                    className="badge"
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background:
                        tmpl.tier === 'vip' ? '#1e1b4b' : tmpl.tier === 'pro' ? 'var(--ink)' : 'var(--success)',
                      color: '#fff',
                      border: 'none',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {tmpl.tier.toUpperCase()}
                  </span>
                )}

                {tmpl.badge && (
                  <span
                    className="badge"
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: 'var(--surface)',
                      color: 'var(--ink)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {tmpl.badge}
                  </span>
                )}

                <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', gap: 5 }}>
                  {[tmpl.themeColor, tmpl.accentColor, tmpl.bgColor].map((c, i) => (
                    <span
                      key={i}
                      style={{
                        width: 17,
                        height: 17,
                        borderRadius: '50%',
                        background: c,
                        border: '2px solid #fff',
                        boxShadow: '0 1px 3px rgba(16,24,40,0.25)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--ink-3)', fontWeight: 600, letterSpacing: '0.05em' }}>
                      {tmpl.category}
                    </span>
                    <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{tmpl.styleTag}</span>
                  </div>

                  <h3 style={{ fontSize: 16.5, fontWeight: 600, lineHeight: 1.3 }}>{tmpl.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55, marginTop: 5 }}>{tmpl.description}</p>
                </div>

                <div
                  style={{
                    background: 'var(--surface-hover)',
                    padding: '8px 11px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    fontSize: 12,
                    color: 'var(--ink-2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--ink)' }}>Ornamen:</strong> {tmpl.ornament}
                  </div>
                  <div>
                    <strong style={{ color: 'var(--ink)' }}>Tipografi:</strong> {tmpl.fontHeading}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 8, marginTop: 'auto' }}>
                  <button type="button" onClick={() => setPreviewTemplate(tmpl)} className="btn btn-sm btn-secondary">
                    <Eye size={14} />
                    Pratinjau
                  </button>
                  <button type="button" onClick={() => handleUseTemplate(tmpl.id)} className="btn btn-sm btn-primary">
                    <span>Gunakan</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live preview modal */}
        {previewTemplate && (
          <div className="modal-backdrop" onClick={() => setPreviewTemplate(null)}>
            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, maxHeight: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="phone-mockup" style={{ height: 660, maxWidth: '92vw' }}>
                <div className="phone-notch" />
                <div className="phone-screen">
                  <InvitationRenderer
                    data={{ ...data, templateId: previewTemplate.id }}
                    guestName="Tamu Undangan Istimewa"
                    defaultOpened={false}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button type="button" onClick={() => setPreviewTemplate(null)} className="btn btn-secondary">
                  Tutup
                </button>
                <button type="button" onClick={() => handleUseTemplate(previewTemplate.id)} className="btn btn-primary">
                  <Check size={15} />
                  Gunakan Template Ini
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
