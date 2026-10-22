'use client';

import React, { useState } from 'react';
import { InvitationData } from '@/types/invitation';
import { MessageSquareHeart, CheckCircle, HelpCircle, XCircle, Users, Trash2, Filter } from 'lucide-react';

interface RSVPManagerProps {
  data: InvitationData;
  onDeleteRSVP: (id: string) => void;
}

export const RSVPManager: React.FC<RSVPManagerProps> = ({ data, onDeleteRSVP }) => {
  const [filter, setFilter] = useState<'all' | 'hadir' | 'ragu' | 'tidak'>('all');

  const hadirList = data.rsvpList.filter((r) => r.attendance === 'hadir');
  const raguList = data.rsvpList.filter((r) => r.attendance === 'ragu');
  const tidakList = data.rsvpList.filter((r) => r.attendance === 'tidak');
  const totalPax = hadirList.reduce((acc, curr) => acc + (curr.pax || 1), 0);

  const filteredList = data.rsvpList.filter((r) => {
    if (filter === 'all') return true;
    return r.attendance === filter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: '#0f172a', marginBottom: 6, fontWeight: 700 }}>
          Data RSVP &amp; Buku Tamu Digital
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Pantau konfirmasi kehadiran tamu secara langsung dan baca doa restu yang telah dikirimkan.
        </p>
      </div>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <div className="glass-card" style={{ padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pasti Hadir</span>
            <CheckCircle size={18} color="#10b981" />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10b981' }}>
            {hadirList.length}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: 4 }}>
            Total estimasi {totalPax} pax
          </span>
        </div>

        <div className="glass-card" style={{ padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ragu-ragu</span>
            <HelpCircle size={18} color="#f59e0b" />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f59e0b' }}>
            {raguList.length}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: 4 }}>
            Menunggu kepastian
          </span>
        </div>

        <div className="glass-card" style={{ padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Berhalangan</span>
            <XCircle size={18} color="#ef4444" />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ef4444' }}>
            {tidakList.length}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: 4 }}>
            Telah menyampaikan doa
          </span>
        </div>

        <div className="glass-card" style={{ padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Ucapan</span>
            <MessageSquareHeart size={18} color="#2563eb" />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a' }}>
            {data.rsvpList.length}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: 4 }}>
            Doa &amp; ucapan masuk
          </span>
        </div>
      </div>

      {/* Filter Tabs & Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: 4 }}>Filter:</span>
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
              className={`btn btn-sm ${filter === tab.id ? 'btn-gold' : 'btn-glass'}`}
              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
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
          className="btn btn-sm btn-glass"
          style={{ padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600 }}
          title="Export data RSVP ke file Excel CSV"
        >
          <span>Unduh Rekap CSV / Excel</span>
        </button>
      </div>

      {/* Wishes Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredList.length === 0 ? (
          <div className="glass-card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
            Belum ada ucapan dalam kategori ini.
          </div>
        ) : (
          filteredList.map((rsvp) => {
            const badgeColor =
              rsvp.attendance === 'hadir'
                ? '#10b981'
                : rsvp.attendance === 'ragu'
                ? '#f59e0b'
                : '#ef4444';
            const badgeText =
              rsvp.attendance === 'hadir'
                ? `Hadir (${rsvp.pax || 1} orang)`
                : rsvp.attendance === 'ragu'
                ? 'Ragu-ragu'
                : 'Berhalangan';

            return (
              <div
                key={rsvp.id}
                className="glass-card"
                style={{
                  padding: 18,
                  borderRadius: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 16,
                }}
              >
                <div style={{ display: 'flex', gap: 14 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#f1f5f9',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      flexShrink: 0,
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    {rsvp.guestName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                      <h4 style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
                        {rsvp.guestName}
                      </h4>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 999,
                          background: `${badgeColor}20`,
                          color: badgeColor,
                          border: `1px solid ${badgeColor}40`,
                        }}
                      >
                        {badgeText}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {rsvp.createdAt}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      "{rsvp.message}"
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteRSVP(rsvp.id)}
                  className="btn btn-sm btn-subtle"
                  style={{ color: '#ef4444', flexShrink: 0 }}
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
