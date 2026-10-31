'use client';

import React, { useMemo, useState } from 'react';
import { CheckCircle2, HelpCircle, MessageSquareHeart, Trash2, XCircle } from 'lucide-react';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
import { rsvpsApi } from '@/lib/api';
import type { Attendance } from '@/types/invitation';

const FILTERS: Array<{ id: 'all' | Attendance; label: string }> = [
  { id: 'all', label: 'Semua' },
  { id: 'hadir', label: 'Hadir' },
  { id: 'ragu', label: 'Ragu' },
  { id: 'tidak', label: 'Tidak hadir' },
];

const ATTENDANCE_META: Record<
  Attendance,
  { label: string; badge: string; icon: typeof CheckCircle2 }
> = {
  hadir: { label: 'Hadir', badge: 'badge-success', icon: CheckCircle2 },
  ragu: { label: 'Ragu', badge: 'badge-warning', icon: HelpCircle },
  tidak: { label: 'Tidak hadir', badge: 'badge-danger', icon: XCircle },
};

export function RsvpSection({ invitationId }: { invitationId: string }) {
  const { invitations, deleteRSVP } = useInvitationStore();
  const toast = useToast();
  const [filter, setFilter] = useState<'all' | Attendance>('all');

  const inv = invitations.find((i) => i.id === invitationId);

  const stats = useMemo(() => {
    if (!inv) return { hadir: 0, ragu: 0, tidak: 0, pax: 0, messages: 0 };
    return inv.rsvpList.reduce(
      (acc, item) => {
        acc[item.attendance] += 1;
        if (item.attendance === 'hadir') acc.pax += item.pax || 1;
        if (item.message.trim()) acc.messages += 1;
        return acc;
      },
      { hadir: 0, ragu: 0, tidak: 0, pax: 0, messages: 0 }
    );
  }, [inv]);

  if (!inv) return null;

  const rows = inv.rsvpList.filter((item) => filter === 'all' || item.attendance === filter);

  const remove = async (id: string) => {
    try {
      await rsvpsApi.delete(inv.id, id);
    } catch {
      /* offline: local removal still applies */
    }
    deleteRSVP(id);
    toast('info', 'Ucapan dihapus.');
  };

  return (
    <div className="studio-section">
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card-label">Konfirmasi hadir</span>
          <span className="stat-card-value" style={{ color: 'var(--success)' }}>
            {stats.hadir}
          </span>
          <span className="stat-card-desc">{stats.pax} pax diperkirakan</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Masih ragu</span>
          <span className="stat-card-value" style={{ color: 'var(--warning)' }}>
            {stats.ragu}
          </span>
          <span className="stat-card-desc">Perlu diingatkan menjelang hari H</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Tidak hadir</span>
          <span className="stat-card-value">{stats.tidak}</span>
          <span className="stat-card-desc">Sudah memberi kabar</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Ucapan</span>
          <span className="stat-card-value">{stats.messages}</span>
          <span className="stat-card-desc">Tampil di buku tamu publik</span>
        </div>
      </div>

      <div className="row" style={{ gap: 'var(--space-1-5)' }}>
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="chip"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            style={
              filter === item.id
                ? { background: 'var(--ink-900)', borderColor: 'var(--ink-900)', color: 'var(--on-inverse)' }
                : undefined
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="empty-state card">
          <MessageSquareHeart size={22} />
          <h3>Belum ada konfirmasi</h3>
          <p>Ucapan dan konfirmasi tamu akan muncul di sini begitu mereka membuka undangan.</p>
        </div>
      ) : (
        <div className="stack-2">
          {rows.map((item) => {
            const meta = ATTENDANCE_META[item.attendance];
            const Icon = meta.icon;
            return (
              <article
                key={item.id}
                className="card"
                style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-4)' }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 620, color: 'var(--ink-900)' }}>
                      {item.guestName}
                    </span>
                    <span className={`badge ${meta.badge}`}>
                      <Icon size={11} /> {meta.label}
                    </span>
                    <span className="meta">{item.pax} pax</span>
                  </div>
                  {item.message && (
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1-5)', lineHeight: 1.6 }}>
                      “{item.message}”
                    </p>
                  )}
                  <span className="meta" style={{ display: 'block', marginTop: 'var(--space-1-5)' }}>
                    {formatRelative(item.createdAt)}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost btn-icon"
                  onClick={() => remove(item.id)}
                  aria-label={`Hapus ucapan dari ${item.guestName}`}
                  style={{ color: 'var(--danger)', flexShrink: 0 }}
                >
                  <Trash2 size={14} />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatRelative(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 1) return 'Baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  if (diffMinutes < 60 * 24) return `${Math.round(diffMinutes / 60)} jam lalu`;
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}
