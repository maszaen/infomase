'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvitationStore } from '@/lib/invitationStore';
import { TemplateId } from '@/types/invitation';
import { Sparkles, ArrowRight, Heart, Calendar, Image as ImageIcon } from 'lucide-react';

export const LiveSandboxTeaser: React.FC = () => {
  const router = useRouter();
  const { data, updateGroom, updateBride, setTemplateId, updateCountdownDate } = useInvitationStore();

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
    { id: 'rustic', label: 'Rustic Warmth', color: '#c49a6c' },
    { id: 'royal-gold', label: 'Royal Midnight Gold', color: '#d4af37' },
    { id: 'islamic', label: 'Islamic Emerald', color: '#10b981' },
    { id: 'sakura', label: 'Blush Sakura', color: '#f43f5e' },
  ];

  return (
    <section id="demo" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        <div
          className="glass-panel"
          style={{
            borderRadius: 32,
            padding: '48px 36px',
            background: 'radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.08) 0%, rgba(16, 22, 34, 0.9) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 40,
              alignItems: 'center',
            }}
          >
            {/* Left Inputs */}
            <div>
              <div style={{ display: 'inline-flex', marginBottom: 12 }}>
                <span className="badge badge-gold">
                  <Sparkles size={14} />
                  Simulasi Sat-Set Tanpa Ribet
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                  color: '#ffffff',
                  marginBottom: 12,
                }}
              >
                Ketik Nama Kalian, Langsung Jadi Sekejap Mase!
              </h2>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 28 }}>
                Mau lihat gimana elegannya undangan kalian? Coba ketik nama panggilan di bawah ini, liat preview kartu di samping auto berubah seketika. Cocok? Tinggal gas ke studio!
              </p>

              {/* Form Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
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
                            padding: '10px 14px',
                            borderRadius: 12,
                            border: isSel ? `2px solid ${th.color}` : '1px solid var(--border-glass)',
                            background: isSel ? `${th.color}20` : 'rgba(255,255,255,0.03)',
                            color: isSel ? '#ffffff' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <div style={{ width: 12, height: 12, borderRadius: '50%', background: th.color }} />
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
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Right Live Card Preview */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  borderRadius: 28,
                  padding: '32px 24px',
                  background:
                    selectedTheme === 'royal-gold'
                      ? 'linear-gradient(180deg, #090f19 0%, #101a2c 100%)'
                      : selectedTheme === 'islamic'
                      ? 'linear-gradient(180deg, #06261d 0%, #0c3e30 100%)'
                      : selectedTheme === 'sakura'
                      ? 'linear-gradient(180deg, #fff5f7 0%, #ffe3e8 100%)'
                      : 'linear-gradient(180deg, #fbf7ee 0%, #f4ecdc 100%)',
                  color: selectedTheme === 'sakura' || selectedTheme === 'rustic' ? '#332219' : '#f8fafc',
                  border:
                    selectedTheme === 'royal-gold'
                      ? '2px solid rgba(212, 175, 55, 0.4)'
                      : selectedTheme === 'islamic'
                      ? '2px solid rgba(230, 200, 117, 0.4)'
                      : selectedTheme === 'sakura'
                      ? '2px solid #f8c2cb'
                      : '2px solid #c49a6c',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative header */}
                <div style={{ marginBottom: 16 }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.22em',
                      fontWeight: 700,
                      color:
                        selectedTheme === 'royal-gold'
                          ? '#d4af37'
                          : selectedTheme === 'islamic'
                          ? '#e6c875'
                          : selectedTheme === 'sakura'
                          ? '#9d3b55'
                          : '#70482f',
                    }}
                  >
                    The Wedding Of
                  </span>
                </div>

                {/* Animated Names */}
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.2rem',
                    lineHeight: 1.15,
                    marginBottom: 10,
                    color:
                      selectedTheme === 'royal-gold'
                        ? '#f3d47d'
                        : selectedTheme === 'islamic'
                        ? '#e6c875'
                        : selectedTheme === 'sakura'
                        ? '#9d3b55'
                        : '#70482f',
                  }}
                >
                  {groomName || 'Pria'} &amp; {brideName || 'Wanita'}
                </h3>

                <p
                  style={{
                    fontSize: '0.82rem',
                    opacity: 0.8,
                    marginBottom: 20,
                  }}
                >
                  Sabtu, 28 November 2026
                </p>

                {/* Photo frame */}
                <div
                  style={{
                    width: 130,
                    height: 170,
                    borderRadius: '80px 80px 18px 18px',
                    overflow: 'hidden',
                    margin: '0 auto 20px',
                    border: '3px solid rgba(255,255,255,0.4)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
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
                    background: selectedTheme === 'royal-gold' || selectedTheme === 'islamic' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    borderRadius: 14,
                    padding: '12px',
                    fontSize: '0.78rem',
                    marginBottom: 16,
                  }}
                >
                  <span style={{ display: 'block', opacity: 0.7, fontSize: '0.7rem' }}>Kepada Yth:</span>
                  <strong style={{ fontSize: '0.88rem' }}>Tamu Undangan Istimewa</strong>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: selectedTheme === 'royal-gold' ? '#d4af37' : '#10b981',
                  }}
                >
                  <Sparkles size={14} />
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
