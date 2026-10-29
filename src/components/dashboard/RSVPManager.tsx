'use client';

import React, { useState } from 'react';
import { InvitationData } from '@/types/invitation';
import { rsvpsApi } from '@/lib/api';
import { MessageSquareHeart, CheckCircle, HelpCircle, XCircle, Trash2, Download } from 'lucide-react';

interface RSVPManagerProps {
  data: InvitationData;
  onDeleteRSVP: (id: string) => void;
}

export const RSVPManager: React.FC<RSVPManagerProps> = ({ data, onDeleteRSVP }) => {
  const [filter, setFilter] = useState<'all' | 'hadir' | 'ragu' | 'tidak'>('all');

  const handleDeleteItem = async (rsvpId: string) => {
    try {
      await rsvpsApi.delete(data.id, rsvpId);
    } catch (e) {
      console.warn('Backend delete RSVP offline or failed, deleting locally', e);
    }
    onDeleteRSVP(rsvpId);
  };

  const hadirList = data.rsvpList.filter((r) => r.attendance === 'hadir');
  const raguList = data.rsvpList.filter((r) => r.attendance === 'ragu');
  const tidakList = data.rsvpList.filter((r) => r.attendance === 'tidak');
  const totalPax = hadirList.reduce((acc, curr) => acc + (curr.pax || 1), 0);

  const filteredList = data.rsvpList.filter((r) => {
    if (filter === 'all') return true;
    return r.attendance === filter;
  });

  return (
    <div className="studio-stack">
      {/* Metrics Cards */}
      <div className="rsvp-stats">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="stat-card-label">Pasti Hadir</span>
            <CheckCircle size={16} color="var(--success)" />
          </div>
          <span className="stat-card-value" style={{ color: 'var(--success)' }}>
            {hadirList.length}
          </span>
          <span className="stat-card-desc">
            Total estimasi {totalPax} pax
          </span>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="stat-card-label">Ragu-ragu</span>
            <HelpCircle size={16} color="var(--warning)" />
          </div>
          <span className="stat-card-value" style={{ color: 'var(--warning)' }}>
            {raguList.length}
          </span>
          <span className="stat-card-desc">
            Menunggu kepastian
          </span>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="stat-card-label">Berhalangan</span>
            <XCircle size={16} color="var(--danger)" />
          </div>
          <span className="stat-card-value" style={{ color: 'var(--danger)' }}>
            {tidakList.length}
          </span>
          <span className="stat-card-desc">
            Telah menyampaikan doa
          </span>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="stat-card-label">Total Ucapan</span>
            <MessageSquareHeart size={16} color="var(--brand)" />
          </div>
          <span className="stat-card-value">
            {data.rsvpList.length}
          </span>
          <span className="stat-card-desc">
            Doa &amp; ucapan masuk
          </span>
        </div>
      </div>

      {/* Filter Tabs & Export */}
      <div className="studio-section-toolbar">
        <div className="studio-filters" aria-label="Filter kehadiran">
          {[
            { id: 'all', label: 'Semua Ucapan' },
            { id: 'hadir', label: 'Hadir' },
            { id: 'ragu', label: 'Ragu' },
            { id: 'tidak', label: 'Berhalangan' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as any)}
              className={`chip${filter === tab.id ? ' active' : ''}`}
              aria-pressed={filter === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            // Generate clean CSV export
            const headers = ['Nama Tamu', 'Kehadiran', 'Jumlah Pax', 'Pesan Doa', 'Tanggal'];
            const rows = data.rsvpList.map((r) => [
              `"${r.guestName.replace(/"/g, '""')}"`,
              `"${r.attendance}"`,
              r.pax || 1,
              `"${r.message.replace(/"/g, '""')}"`,
              `"${r.createdAt}"`,
            ]);
            const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `rekap-rsvp-${data.slug}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="btn btn-sm btn-secondary"
          style={{ fontWeight: 500 }}
          title="Export data RSVP ke file Excel CSV"
        >
          <Download size={14} /><span>Ekspor CSV</span>
        </button>
      </div>

      {/* Wishes Feed */}
      <div className="rsvp-feed">
        {filteredList.length === 0 ? (
          <div className="empty-state">
            Belum ada ucapan dalam kategori ini.
          </div>
        ) : (
          filteredList.map((rsvp) => {
            const badgeTone =
              rsvp.attendance === 'hadir'
                ? 'badge-success'
                : rsvp.attendance === 'ragu'
                ? 'badge-warning'
                : 'badge-danger';
            const badgeText =
              rsvp.attendance === 'hadir'
                ? `Hadir (${rsvp.pax || 1} orang)`
                : rsvp.attendance === 'ragu'
                ? 'Ragu-ragu'
                : 'Berhalangan';

            return (
              <div
                key={rsvp.id}
                className="rsvp-item"
              >
                <div className="rsvp-message">
                  <div className="avatar">
                    {rsvp.guestName.charAt(0).toUpperCase()}
                  </div>

                  <div className="rsvp-message-body">
                    <div className="rsvp-message-meta">
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--ink)', fontWeight: 600 }}>
                        {rsvp.guestName}
                      </h4>
                      <span className={`badge ${badgeTone}`}>
                        {badgeText}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                      {rsvp.message}
                    </p>
                    <span className="rsvp-timestamp">{rsvp.createdAt}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteRSVP(rsvp.id)}
                  className="btn btn-sm btn-ghost"
                  style={{ color: 'var(--danger)', flexShrink: 0 }}
                  title="Hapus Ucapan"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
