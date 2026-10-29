'use client';

import React, { useEffect, useRef, useState } from 'react';
import { InvitationData, RSVPItem } from '@/types/invitation';
import { InvitationRenderer } from '../invitation/InvitationRenderer';
import { ExternalLink, RefreshCw, Smartphone, UserCheck } from 'lucide-react';

interface LivePreviewPanelProps {
  data: InvitationData;
  onAddRSVP?: (item: Omit<RSVPItem, 'id' | 'createdAt'>) => void;
}

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({ data, onAddRSVP }) => {
  const [previewGuest, setPreviewGuest] = useState('Budi Santoso & Keluarga');
  const [previewKey, setPreviewKey] = useState(0);
  const [previewScale, setPreviewScale] = useState(1);
  const deviceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const device = deviceRef.current;
    if (!device) return;
    const observer = new ResizeObserver(([entry]) => {
      setPreviewScale(Math.min(1, entry.contentRect.width / 350));
    });
    observer.observe(device);
    return () => observer.disconnect();
  }, []);

  const handleResetPreview = () => {
    setPreviewKey((prev) => prev + 1);
  };

  return (
    <div className="live-preview">
      <div className="preview-controls">
        <div className="preview-controls-header">
          <span className="preview-controls-title"><Smartphone size={15} />Live Preview</span>
          <div className="studio-actions">
            <button type="button" onClick={handleResetPreview} className="btn btn-icon btn-sm btn-ghost" title="Reset cover undangan" aria-label="Reset cover undangan">
              <RefreshCw size={14} />
            </button>
            <a href={`/invite/${data.slug}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-secondary" title="Buka undangan layar penuh">
              <ExternalLink size={13} />Layar Penuh
            </a>
          </div>
        </div>
        <div className="preview-guest">
          <UserCheck size={14} style={{ flexShrink: 0 }} />
          <label htmlFor="preview-guest">Tamu</label>
          <input id="preview-guest" type="text" value={previewGuest} onChange={(e) => setPreviewGuest(e.target.value)} placeholder="Nama tamu di cover..." />
        </div>
      </div>
      <div className="preview-device" ref={deviceRef} style={{ height: 700 * previewScale }}>
        <div className="phone-mockup" style={{ transform: `scale(${previewScale})` }}>
          <div className="phone-notch" />
          <div className="phone-screen">
            <InvitationRenderer key={previewKey} data={data} guestName={previewGuest} onAddRSVP={onAddRSVP} />
          </div>
        </div>
      </div>
      <p className="preview-note">Perubahan tampil langsung di preview. Simulasikan nama tamu sebelum membagikan undangan.</p>
    </div>
  );
};
