'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvitationStore } from '@/lib/invitationStore';
import { TemplateId } from '@/types/invitation';
import { Sparkles, ArrowRight } from 'lucide-react';

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
    { id: 'rustic', label: 'Rustic Warmth', color: '#78350f' },
    { id: 'royal-gold', label: 'Royal Midnight Gold', color: '#09090b' },
    { id: 'islamic', label: 'Islamic Emerald', color: '#047857' },
    { id: 'sakura', label: 'Blush Sakura', color: '#e11d48' },
  ];

  return (
    <section id="demo" style={{ padding: '70px 0', background: '#ffffff' }}>
      <div className="container">
        <div
          style={{
            borderRadius: 20,
            padding: '40px 32px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 36,
              alignItems: 'center',
            }}
          >
            {/* Left Inputs */}
            <div>
              <div style={{ display: 'inline-flex', marginBottom: 12 }}>
                <span className="badge badge-gold">
                  <Sparkles size={14} color="#2563eb" />
                  Simulasi Sat-Set Tanpa Ribet
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.7rem, 3vw, 2.4rem)',
                  color: '#0f172a',
                  marginBottom: 10,
                }}
              >
                Ketik Nama Kalian, Langsung Jadi Sekejap Mase!
              </h2>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
                Mau lihat gimana elegannya undangan kalian? Coba ketik nama panggilan di bawah ini, liat preview kartu di samping auto berubah seketika. Cocok? Tinggal gas ke studio!
              </p>

              {/* Form Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Nama Mempelai Pria</label>
                    <input
                      type="text"
                      className="form-input"
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="Contoh: Aditya"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Nama Mempelai Wanita</label>
                    <input
                      type="text"
                      className="form-input"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="Contoh: Annisa"
                    />
                  </div>
                </div>

                {/* Theme Selector */}
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: 8 }}>
                    Pilih Gaya Nuansa Desain:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {themes.map((th) => {
                      const isSel = selectedTheme === th.id;
                      return (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => setSelectedTheme(th.id)}
                          style={{
                            padding: '9px 12px',
                            borderRadius: 8,
                            border: isSel ? '2px solid #0f172a' : '1px solid #cbd5e1',
                            background: isSel ? '#ffffff' : '#f8fafc',
                            color: '#0f172a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: '0.82rem',
                            fontWeight: isSel ? 700 : 500,
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: th.color }} />
                          <span>{th.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Continue button */}
              <button
                type="button"
                onClick={handleApplyAndContinue}
                className="btn btn-lg btn-gold"
                style={{ width: '100%' }}
              >
                <span>Gas Lanjut Edit Sat-Set di Studio</span>
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Right Live Card Preview (Flat White) */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: 340,
                  borderRadius: 18,
                  padding: '28px 22px',
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  boxShadow: 'var(--shadow-md)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative header */}
                <div style={{ marginBottom: 14 }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      fontWeight: 700,
                      color: '#64748b',
                    }}
                  >
                    The Wedding Of
                  </span>
                </div>

                {/* Animated Names */}
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.9rem',
                    lineHeight: 1.15,
                    marginBottom: 8,
                    color: '#0f172a',
                  }}
                >
                  {groomName || 'Pria'} &amp; {brideName || 'Wanita'}
                </h3>

                <p
                  style={{
                    fontSize: '0.8rem',
                    color: '#64748b',
                    marginBottom: 16,
                  }}
                >
                  Sabtu, 28 November 2026
                </p>

                {/* Photo frame */}
                <div
                  style={{
                    width: 120,
                    height: 155,
                    borderRadius: 12,
                    overflow: 'hidden',
                    margin: '0 auto 16px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                    alt="Couple"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    padding: '10px',
                    fontSize: '0.78rem',
                    marginBottom: 14,
                  }}
                >
                  <span style={{ display: 'block', color: '#64748b', fontSize: '0.7rem' }}>Kepada Yth:</span>
                  <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>Tamu Undangan Istimewa</strong>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#059669',
                  }}
                >
                  <Sparkles size={13} />
                  <span>Preview Kartu Aktif Real-Time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
