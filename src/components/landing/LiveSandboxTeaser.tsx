'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvitationStore } from '@/lib/invitationStore';
import { TemplateId } from '@/types/invitation';
import { ArrowRight, Sparkles } from 'lucide-react';

export const LiveSandboxTeaser: React.FC = () => {
  const router = useRouter();
  const { data, updateGroom, updateBride, setTemplateId } = useInvitationStore();

  const [groomName, setGroomName] = useState(data.groom.name);
  const [brideName, setBrideName] = useState(data.bride.name);
  const [selectedTheme, setSelectedTheme] = useState<TemplateId>(data.templateId);

  const handleApplyAndContinue = () => {
    updateGroom({ name: groomName, fullName: `${groomName} & Keluarga` });
    updateBride({ name: brideName, fullName: `${brideName} & Keluarga` });
    setTemplateId(selectedTheme);
    router.push('/dashboard');
  };

  const themes: { id: TemplateId; label: string; color: string }[] = [
    { id: 'undangan-1', label: 'Boho Botanical Masterpiece', color: '#79624C' },
  ];

  return (
    <section id="demo" className="section">
      <div className="container">
        <div className="card" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
              gap: 0,
              alignItems: 'stretch',
            }}
            className="sandbox-grid"
          >
            {/* Left: form */}
            <div style={{ padding: '36px 32px' }}>
              <div className="section-eyebrow">
                <Sparkles size={13} />
                Demo interaktif tanpa daftar
              </div>

              <h2 style={{ fontSize: 'clamp(1.4rem, 2.6vw, 1.9rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>
                Ketik nama kalian, preview langsung berubah.
              </h2>

              <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.65, margin: '10px 0 24px' }}>
                Semua yang mase ketik di sini langsung tersinkron ke preview kartu di samping —
                persis seperti pengalaman mengedit di Studio nanti.
              </p>

              <div className="stack-md">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="sandbox-inputs">
                  <div className="form-group">
                    <label className="form-label">Nama mempelai pria</label>
                    <input
                      type="text"
                      className="form-input"
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="Contoh: Raka"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nama mempelai wanita</label>
                    <input
                      type="text"
                      className="form-input"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="Contoh: Sinta"
                    />
                  </div>
                </div>

                <div>
                  <span className="form-label" style={{ display: 'block', marginBottom: 7 }}>
                    Gaya nuansa desain
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {themes.map((th) => {
                      const isSel = selectedTheme === th.id;
                      return (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => setSelectedTheme(th.id)}
                          style={{
                            padding: '10px 13px',
                            borderRadius: 'var(--radius-sm)',
                            border: isSel ? '1.5px solid var(--brand)' : '1px solid var(--border-strong)',
                            background: isSel ? 'var(--brand-subtle)' : 'var(--surface)',
                            color: 'var(--ink)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 9,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'border-color 0.12s ease, background 0.12s ease',
                          }}
                        >
                          <span
                            style={{
                              width: 11,
                              height: 11,
                              borderRadius: '50%',
                              background: th.color,
                              border: `2px solid ${isSel ? 'var(--brand)' : 'var(--surface)'}`,
                              boxShadow: '0 0 0 1px var(--border-strong)',
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ flex: 1 }}>{th.label}</span>
                          {isSel && <span style={{ color: 'var(--brand)', fontWeight: 700 }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyAndContinue}
                  className="btn btn-lg btn-primary"
                  style={{ width: '100%', marginTop: 4 }}
                >
                  <span>Lanjut Edit di Studio</span>
                  <ArrowRight size={16} />
                </button>

                <p style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>
                  Data demo otomatis tersimpan di perangkat mase.
                </p>
              </div>
            </div>

            {/* Right: live card preview */}
            <div
              style={{
                background: 'var(--canvas)',
                borderLeft: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '36px 24px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: 320,
                  borderRadius: 'var(--radius-lg)',
                  padding: '30px 24px',
                  background: '#fffdfb',
                  color: '#382e25',
                  border: '1px solid #e5ddd2',
                  boxShadow: 'var(--shadow-md)',
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 16, opacity: 0.75 }}>
                  <span style={{ width: 22, height: 1, background: '#c9b8a4' }} />
                  <span style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 600, color: '#8c735b' }}>
                    The Wedding Of
                  </span>
                  <span style={{ width: 22, height: 1, background: '#c9b8a4' }} />
                </div>

                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '1.9rem',
                    lineHeight: 1.15,
                    color: '#382e25',
                    fontWeight: 600,
                  }}
                >
                  {groomName || 'Pria'} &amp; {brideName || 'Wanita'}
                </h3>

                <p style={{ fontSize: 12, color: '#8c735b', marginTop: 4 }}>Sabtu, 28 November 2026</p>

                <div
                  style={{
                    width: 118,
                    height: 148,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    margin: '16px auto',
                    border: '1px solid #e5ddd2',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                    alt="Foto pasangan"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div
                  style={{
                    background: 'rgba(121, 98, 76, 0.06)',
                    border: '1px solid #e5ddd2',
                    borderRadius: 'var(--radius-sm)',
                    padding: '9px 10px',
                    fontSize: 12,
                    color: '#8c735b',
                  }}
                >
                  <span style={{ display: 'block', fontSize: 10.5 }}>Kepada Yth:</span>
                  <strong style={{ fontSize: 13, color: '#382e25' }}>Tamu Undangan Istimewa</strong>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'var(--success)',
                    marginTop: 14,
                  }}
                >
                  <span className="status-dot status-dot-live" />
                  Preview real-time aktif
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 880px) {
          .sandbox-grid { grid-template-columns: 1fr; }
          .sandbox-grid > div:last-child { border-left: none; border-top: 1px solid var(--border); }
        }

        @media (max-width: 480px) {
          .sandbox-inputs { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
};
