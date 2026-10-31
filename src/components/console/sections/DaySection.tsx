'use client';

import React, { useMemo, useState } from 'react';
import { Check, Download, Search, Utensils } from 'lucide-react';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
import { formatFullIndonesianDate } from '@/lib/formatDate';

/**
 * Day-of tools. Previously these were two global sidebar destinations
 * ("Kalkulator Katering", "Meja Resepsionis") even though both are pure
 * functions of one invitation's RSVP/guest data. They belong here.
 */
export function DaySection({ invitationId }: { invitationId: string }) {
  const { invitations } = useInvitationStore();
  const toast = useToast();
  const [checkedIn, setCheckedIn] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [buffer, setBuffer] = useState(1.15);

  const inv = invitations.find((i) => i.id === invitationId);

  const derived = useMemo(() => {
    if (!inv) return { pax: 0, hadir: 0, total: 0, recommended: 0 };
    const hadir = inv.rsvpList.filter((r) => r.attendance === 'hadir');
    const pax = hadir.reduce((sum, r) => sum + (r.pax || 1), 0);
    return {
      pax,
      hadir: hadir.length,
      total: inv.rsvpList.length,
      recommended: Math.round(pax * buffer),
    };
  }, [inv, buffer]);

  if (!inv) return null;

  const guests = inv.guests.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));
  const checkedCount = Object.values(checkedIn).filter(Boolean).length;
  const recommended = derived.recommended;
  const prasmanan = Math.round(recommended * 0.6);

  const exportCsv = () => {
    const header = ['Nama', 'Kategori', 'Telepon', 'Status RSVP', 'Pax', 'Pesan'];
    const rows = inv.rsvpList.map((r) => [
      r.guestName,
      '',
      '',
      r.attendance,
      String(r.pax),
      r.message.replace(/[\r\n;]+/g, ' '),
    ]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `rsvp-${inv.slug}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast('success', 'Rekap RSVP diunduh.');
  };

  return (
    <div className="studio-section">
      {/* ------------------------------------------------------------- catering */}
      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Estimasi porsi katering</h2>
            <p className="card-subtitle">Dihitung dari konfirmasi hadir, bukan dari jumlah tamu yang diundang.</p>
          </div>
          <div className="row" style={{ gap: 'var(--space-2)' }}>
            <select
              id="buffer"
              className="form-select"
              style={{ width: 'auto' }}
              value={buffer}
              onChange={(e) => setBuffer(Number(e.target.value))}
              aria-label="Buffer porsi"
            >
              <option value={1}>Tanpa buffer</option>
              <option value={1.1}>+10%</option>
              <option value={1.15}>+15% (disarankan)</option>
              <option value={1.25}>+25%</option>
            </select>
            <Utensils size={17} style={{ color: 'var(--ink-400)' }} />
          </div>
        </div>

        <div className="card-body">
          <div className="catering-grid">
            <div className="catering-metric">
              <span className="stat-card-label">Sudah hadir (RSVP)</span>
              <span className="catering-value">{derived.hadir}</span>
              <span className="stat-card-desc">{derived.pax} pax</span>
            </div>
            <div className="catering-metric">
              <span className="stat-card-label">Porsi disarankan</span>
              <span className="catering-value" style={{ color: 'var(--brand)' }}>
                {recommended}
              </span>
              <span className="stat-card-desc">Buffer {Math.round((buffer - 1) * 100)}%</span>
            </div>
            <div className="catering-metric">
              <span className="stat-card-label">Rincian porsi</span>
              <span className="catering-split">
                <span>Prasmanan</span>
                <b className="numeric">{prasmanan}</b>
              </span>
              <span className="catering-split">
                <span>Gubukan</span>
                <b className="numeric">{Math.max(0, recommended - prasmanan)}</b>
              </span>
            </div>
          </div>

          <p className="meta" style={{ marginTop: 'var(--space-3)' }}>
            Angka ini perkiraan. Konfirmasi final tetap dengan katering Anda.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- check-in */}
      <section className="page-section">
        <div className="section-bar">
          <div>
            <h2>Check-in tamu</h2>
            <p>
              {formatFullIndonesianDate(inv.events[0]?.date ?? '')} · {checkedCount} dari {inv.guests.length} tamu
            </p>
          </div>
          <button type="button" className="btn btn-sm btn-secondary" onClick={exportCsv}>
            <Download size={13} /> Unduh RSVP
          </button>
        </div>

        <div className="editor-toolbar">
          <div className="search-box">
            <Search size={14} className="search-icon" />
            <input
              className="form-input"
              placeholder="Cari nama…"
              aria-label="Cari nama tamu"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {guests.length === 0 ? (
          <div className="empty-state card">
            <Search size={22} />
            <h3>Tidak ada tamu yang cocok</h3>
            <p>Ubah kata kunci pencarian atau tambahkan tamu lebih dulu.</p>
          </div>
        ) : (
          <div className="record-list">
            {guests.map((guest) => {
              const done = Boolean(checkedIn[guest.id]);
              return (
                <div key={guest.id} className={`card record checkin-row ${done ? 'is-done' : ''}`}>
                  <div className="record-main">
                    <div className="record-title-row">
                      <span className="record-title rsvp-name">{guest.name}</span>
                      {done && <span className="badge badge-success">Hadir</span>}
                    </div>
                    <div className="record-meta">
                      {guest.category}
                      {guest.phone ? ` · ${guest.phone}` : ''}
                    </div>
                  </div>
                  <div className="record-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => setCheckedIn((prev) => ({ ...prev, [guest.id]: !done }))}
                      aria-pressed={done}
                    >
                      {done ? (
                        <>
                          <Check size={12} /> Batalkan
                        </>
                      ) : (
                        'Tandai hadir'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
