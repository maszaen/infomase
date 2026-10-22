'use client';

import React, { useState } from 'react';
import { Send, MessageSquareHeart, CheckCircle, HelpCircle, XCircle, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { InvitationData, RSVPItem } from '@/types/invitation';

interface RSVPSectionProps {
  data: InvitationData;
  onAddRSVP?: (item: Omit<RSVPItem, 'id' | 'createdAt'>) => void;
  guestName?: string;
}

export const RSVPSection: React.FC<RSVPSectionProps> = ({ data, onAddRSVP, guestName }) => {
  const [name, setName] = useState(guestName || '');
  const [attendance, setAttendance] = useState<'hadir' | 'tidak' | 'ragu'>('hadir');
  const [pax, setPax] = useState(1);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#d4af37', '#f43f5e', '#10b981', '#38bdf8'],
    });

    if (onAddRSVP) {
      onAddRSVP({
        guestName: name.trim(),
        attendance,
        pax,
        message: message.trim(),
      });
    }

    setSubmitted(true);
    setMessage('');
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="ucapan" style={{ padding: '36px 16px', textAlign: 'center' }}>
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
          Konfirmasi &amp; Doa
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.9rem',
            color: 'var(--inv-primary)',
            marginTop: 4,
          }}
        >
          Buku Tamu &amp; RSVP
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--inv-text-muted)', marginTop: 4 }}>
          Mohon konfirmasi kehadiran serta berikan doa restu Anda untuk kami berdua
        </p>
      </div>

      {/* RSVP Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--inv-card)',
          border: '1px solid var(--inv-border)',
          borderRadius: 24,
          padding: '24px 20px',
          maxWidth: 360,
          margin: '0 auto 32px',
          textAlign: 'left',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        }}
      >
        {/* Name input */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--inv-text)', marginBottom: 6 }}>
            Nama Anda
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Bpk. Bambang & Keluarga"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 12,
              border: '1px solid var(--inv-border)',
              background: 'rgba(0,0,0,0.02)',
              fontSize: '0.85rem',
              color: 'var(--inv-text)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Attendance radio choices */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--inv-text)', marginBottom: 8 }}>
            Konfirmasi Kehadiran
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { id: 'hadir', label: 'Hadir', icon: CheckCircle, color: '#10b981' },
              { id: 'ragu', label: 'Ragu-ragu', icon: HelpCircle, color: '#f59e0b' },
              { id: 'tidak', label: 'Berhalangan', icon: XCircle, color: '#ef4444' },
            ].map((opt) => {
              const Icon = opt.icon;
              const isSelected = attendance === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setAttendance(opt.id as any)}
                  style={{
                    padding: '8px 6px',
                    borderRadius: 10,
                    border: isSelected ? `2px solid ${opt.color}` : '1px solid var(--inv-border)',
                    background: isSelected ? `${opt.color}15` : 'transparent',
                    color: isSelected ? opt.color : 'var(--inv-text-muted)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={16} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pax selector (if hadir) */}
        {attendance === 'hadir' && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--inv-text)', marginBottom: 6 }}>
              Jumlah Orang yang Hadir
            </label>
            <select
              value={pax}
              onChange={(e) => setPax(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 12,
                border: '1px solid var(--inv-border)',
                background: 'rgba(0,0,0,0.02)',
                fontSize: '0.85rem',
                color: 'var(--inv-text)',
                outline: 'none',
              }}
            >
              <option value={1}>1 Orang</option>
              <option value={2}>2 Orang</option>
              <option value={3}>3 Orang</option>
              <option value={4}>4 Orang</option>
              <option value={5}>5+ Orang (Rombongan)</option>
            </select>
          </div>
        )}

        {/* Message / Doa */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--inv-text)', marginBottom: 6 }}>
            Doa &amp; Ucapan Selamat
          </label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tuliskan ucapan dan doa terbaik Anda untuk kedua mempelai..."
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 12,
              border: '1px solid var(--inv-border)',
              background: 'rgba(0,0,0,0.02)',
              fontSize: '0.85rem',
              color: 'var(--inv-text)',
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn"
          style={{
            width: '100%',
            background: 'var(--inv-primary)',
            color: '#ffffff',
            padding: '12px',
            fontSize: '0.9rem',
            fontWeight: 600,
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            border: 'none',
          }}
        >
          <Send size={16} />
          Kirim Ucapan &amp; Konfirmasi
        </button>

        {submitted && (
          <div
            style={{
              marginTop: 12,
              padding: '8px 12px',
              borderRadius: 8,
              background: '#10b98120',
              color: '#10b981',
              fontSize: '0.78rem',
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            ✓ Terima kasih atas doa dan konfirmasinya!
          </div>
        )}
      </form>

      {/* Guest Wishes List (Buku Tamu) */}
      <div style={{ maxWidth: 360, margin: '0 auto', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--inv-primary)' }}>
            Doa &amp; Harapan ({data.rsvpList.length})
          </h4>
          <span style={{ fontSize: '0.72rem', color: 'var(--inv-text-muted)' }}>
            {data.rsvpList.filter((r) => r.attendance === 'hadir').length} Tamu Hadir
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 380, overflowY: 'auto' }}>
          {data.rsvpList.map((rsvp) => {
            const badgeBg =
              rsvp.attendance === 'hadir'
                ? '#10b98120'
                : rsvp.attendance === 'ragu'
                ? '#f59e0b20'
                : '#ef444420';
            const badgeColor =
              rsvp.attendance === 'hadir'
                ? '#10b981'
                : rsvp.attendance === 'ragu'
                ? '#f59e0b'
                : '#ef4444';
            const badgeText =
              rsvp.attendance === 'hadir' ? 'Hadir' : rsvp.attendance === 'ragu' ? 'Ragu' : 'Berhalangan';

            return (
              <div
                key={rsvp.id}
                style={{
                  background: 'var(--inv-card)',
                  border: '1px solid var(--inv-border)',
                  borderRadius: 16,
                  padding: '14px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'rgba(212, 175, 55, 0.2)',
                        color: 'var(--inv-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {rsvp.guestName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--inv-text)', display: 'block' }}>
                        {rsvp.guestName}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--inv-text-muted)' }}>
                        {rsvp.createdAt}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: badgeBg,
                      color: badgeColor,
                    }}
                  >
                    {badgeText} {rsvp.attendance === 'hadir' && `(${rsvp.pax})`}
                  </span>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--inv-text)', lineHeight: 1.45, marginTop: 4 }}>
                  {rsvp.message}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
