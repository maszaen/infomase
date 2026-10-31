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
      <section className="card" style={{ padding: 'var(--space-5)' }}>
        <div className="row-between" style={{ marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-sm)' }}>Estimasi porsi katering</h2>
            <p className="meta">Dihitung dari konfirmasi hadir, bukan dari jumlah tamu yang diundang.</p>
          </div>
          <Utensils size={17} style={{ color: 'var(--ink-400)' }} />
        </div>

        <div className="grid-3" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div>
            <div className="stat-card-label">Sudah hadir (RSVP)</div>
            <div className="stat-card-value">{derived.hadir}</div>
            <div className="stat-card-desc">{derived.pax} pax</div>
          </div>
          <div>
            <div className="stat-card-label">Porsi disarankan</div>
            <div className="stat-card-value" style={{ color: 'var(--brand)' }}>
              {derived.recommended}
            </div>
            <div className="stat-card-desc">Buffer {Math.round((buffer - 1) * 100)}%</div>
          </div>
          <div>
            <div className="stat-card-label">Rincian</div>
            <div style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, marginTop: 4 }}>
              <div className="row-between">
                <span>Prasmanan</span>
                <span className="numeric">{Math.round(derived.recommended * 0.6)}</span>
              </div>
              <div className="row-between">
                <span>Gubukan</span>
                <span className="numeric">{Math.max(0, derived.recommended - Math.round(derived.recommended * 0.6))}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: 320 }}>
          <label className="form-label" htmlFor="buffer">
            Buffer untuk keluarga &amp; panitia
          </label>
          <select
            id="buffer"
            className="form-select"
            value={buffer}
            onChange={(e) => setBuffer(Number(e.target.value))}
          >
            <option value={1}>Tanpa buffer</option>
            <option value={1.1}>+10%</option>
            <option value={1.15}>+15% (disarankan)</option>
            <option value={1.25}>+25%</option>
          </select>
        </div>

        <p className="meta" style={{ marginTop: 'var(--space-3)' }}>
          Angka ini perkiraan. Konfirmasi final tetap dengan katering Anda.
        </p>
      </section>

      {/* ------------------------------------------------------------- check-in */}
      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Check-in tamu</h2>
            <p className="card-subtitle">
              {formatFullIndonesianDate(inv.events[0]?.date ?? '')} · {checkedCount} dari {inv.guests.length} tamu
            </p>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <div className="search-box" style={{ width: 220 }}>
              <Search size={14} className="search-icon" />
              <input
                className="form-input"
                placeholder="Cari nama…"
                aria-label="Cari nama tamu"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-sm btn-secondary" onClick={exportCsv}>
              <Download size={13} /> Unduh RSVP
            </button>
          </div>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
          {guests.length === 0 ? (
            <p className="meta">Tidak ada tamu yang cocok.</p>
          ) : (
            guests.map((guest) => {
              const done = Boolean(checkedIn[guest.id]);
              return (
                <div
                  key={guest.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: '8px 10px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: done ? 'var(--success-bg)' : 'var(--surface)',
                    borderColor: done ? 'var(--success-border)' : 'var(--border)',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 560, color: 'var(--ink-900)' }}>
                      {guest.name}
                    </div>
                    <div className="meta">
                      {guest.category}
                      {guest.phone ? ` · ${guest.phone}` : ''}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`btn btn-sm ${done ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => setCheckedIn((prev) => ({ ...prev, [guest.id]: !done }))}
                    aria-pressed={done}
                  >
                    {done ? (
                      <>
                        <Check size={12} /> Sudah hadir
                      </>
                    ) : (
                      'Tandai hadir'
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
