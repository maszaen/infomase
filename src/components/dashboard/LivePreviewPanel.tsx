'use client';

import React, { useState } from 'react';
import { InvitationData, RSVPItem } from '@/types/invitation';
import { InvitationRenderer } from '../invitation/InvitationRenderer';
import { ExternalLink, RefreshCw, Smartphone, Monitor, UserCheck } from 'lucide-react';

interface LivePreviewPanelProps {
  data: InvitationData;
  onAddRSVP?: (item: Omit<RSVPItem, 'id' | 'createdAt'>) => void;
}

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({ data, onAddRSVP }) => {
  const [previewGuest, setPreviewGuest] = useState('Budi Santoso & Keluarga');
  const [previewKey, setPreviewKey] = useState(0);

  const handleResetPreview = () => {
    setPreviewKey((prev) => prev + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 16 }}>
      {/* Top Preview Controls */}
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: 380,
          padding: '10px 14px',
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <Smartphone size={16} color="var(--gold-400)" />
          <span style={{ fontWeight: 600, color: '#fff' }}>Live Preview</span>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={handleResetPreview}
            className="btn btn-sm btn-glass"
            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
            title="Ulangi Buka Undangan"
          >
            <RefreshCw size={13} />
            Reset Cover
          </button>

          <a
            href={`/invite/${data.slug}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-gold"
            style={{ padding: '6px 10px', fontSize: '0.75rem', textDecoration: 'none' }}
            title="Buka Undangan Layar Penuh"
          >
            <ExternalLink size={13} />
            Layar Penuh
          </a>
        </div>
      </div>

      {/* Guest Name Simulation Bar */}
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(255,255,255,0.03)',
          padding: '6px 12px',
          borderRadius: 10,
          border: '1px solid var(--border-glass)',
        }}
      >
        <UserCheck size={14} color="var(--gold-400)" />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Tamu Mockup:</span>
        <input
          type="text"
          value={previewGuest}
          onChange={(e) => setPreviewGuest(e.target.value)}
          placeholder="Nama tamu di cover..."
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '0.8rem',
            width: '100%',
            outline: 'none',
          }}
        />
      </div>

      {/* Phone Mockup Frame */}
      <div className="phone-mockup">
        <div className="phone-notch" />
        <div className="phone-screen">
          <InvitationRenderer
            key={previewKey}
            data={data}
            guestName={previewGuest}
            onAddRSVP={onAddRSVP}
          />
        </div>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 320 }}>
        💡 Preview di atas mencerminkan tampilan sebenarnya pada ponsel tamu Anda secara real-time.
      </p>
    </div>
  );
};
