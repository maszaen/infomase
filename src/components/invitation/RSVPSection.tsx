'use client';

import React, { useState } from 'react';
import { InvitationData, RSVPItem } from '@/types/invitation';

interface RSVPSectionProps {
  data: InvitationData;
  onAddRSVP?: (item: Omit<RSVPItem, 'id' | 'createdAt'>) => void;
  guestName?: string;
}

interface LocalWish {
  id: string;
  name: string;
  date: string;
  attendance: 'hadir' | 'tidak';
  message: string;
  likes: number;
  isLiked?: boolean;
}

export const RSVPSection: React.FC<RSVPSectionProps> = ({ data, onAddRSVP, guestName }) => {
  const [name, setName] = useState(guestName || '');
  const [attendance, setAttendance] = useState<'hadir' | 'tidak'>('hadir');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [wishes, setWishes] = useState<LocalWish[]>([
    {
      id: 'wish-1',
      name: 'Andi Saputra',
      date: '24 Mei 2025',
      attendance: 'hadir',
      message: 'Happy wedding Raka & Sinta! Semoga selalu dalam lindungan Allah SWT dan menjadi keluarga yang sakinah mawaddah warahmah.',
      likes: 14,
      isLiked: false,
    },
    {
      id: 'wish-2',
      name: 'Nadia & Dimas',
      date: '24 Mei 2025',
      attendance: 'hadir',
      message: 'Selamat menempuh hidup baru sahabatku tercinta! Bahagia selalu selamanya ya!',
      likes: 9,
      isLiked: false,
    },
  ]);

  const handleToggleLike = (id: string) => {
    setWishes((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const isLiked = !w.isLiked;
          return {
            ...w,
            isLiked,
            likes: isLiked ? w.likes + 1 : w.likes - 1,
          };
        }
        return w;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newWish: LocalWish = {
      id: `wish-${Date.now()}`,
      name: name.trim(),
      date: 'Baru saja',
      attendance,
      message: message.trim(),
      likes: 1,
      isLiked: true,
    };

    setWishes((prev) => [newWish, ...prev]);

    if (onAddRSVP) {
      onAddRSVP({
        guestName: name.trim(),
        attendance,
        pax: 1,
        message: message.trim(),
      });
    }

    setName('');
    setMessage('');
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="ucapan" className="py-8 px-6">
      <div className="paper-card rounded-3xl p-6 relative overflow-hidden reveal">
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--art-accent)] font-semibold block mb-1">
            RSVP &amp; UCAPAN
          </span>
          <h3 className="font-serif text-2xl text-[var(--art-ink)] font-semibold">
            Konfirmasi &amp; Doa Restu
          </h3>
          <p className="text-xs text-[var(--art-ink-muted)] mt-1">
            Kehadiran dan doa Anda adalah kado terindah bagi kami
          </p>
        </div>

        {submitted && (
          <p
            role="status"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-3-5)',
              padding: 'var(--space-1-5) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--success-bg)',
              border: '1px solid var(--success)',
              color: 'var(--success)',
              fontSize: 'var(--text-xs)',
              lineHeight: 1.5,
            }}
          >
            Terima kasih. Ucapan dan konfirmasi Anda sudah tercatat.
          </p>
        )}

        {/* Form Submission */}
        <form onSubmit={handleSubmit} className="space-y-3 mb-6 reveal delay-100">
          <div>
            <label className="block text-[11px] font-bold text-[var(--art-ink)] mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              aria-label="Nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[var(--art-line)] text-xs text-[var(--art-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--art-accent)]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[var(--art-ink)] mb-1">
              Konfirmasi Kehadiran
            </label>
            <select
              value={attendance}
              onChange={(e) => setAttendance(e.target.value as 'hadir' | 'tidak')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[var(--art-line)] text-xs text-[var(--art-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--art-accent)]"
            >
              <option value="hadir">Ya, Saya Akan Hadir</option>
              <option value="tidak">Maaf, Tidak Bisa Hadir</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[var(--art-ink)] mb-1">
              Ucapan &amp; Doa
            </label>
            <textarea
              rows={3}
              maxLength={200}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[var(--art-line)] text-xs text-[var(--art-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--art-accent)] resize-none"
            />
            <span className="block text-right text-[10px] text-[var(--art-ink-muted)] mt-0.5">
              {message.length}/200
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[var(--art-accent-deep)] text-white text-xs font-semibold tracking-wider uppercase shadow hover:bg-[var(--art-ink-deep)] transition cursor-pointer"
          >
            Kirim Konfirmasi &amp; Ucapan
          </button>
        </form>

        {/* Live Stream Wishes Container */}
        <div id="wishesContainer" className="space-y-3 max-h-64 overflow-y-auto pr-1 reveal delay-200">
          {wishes.map((w) => (
            <div
              key={w.id}
              className="p-3.5 rounded-2xl bg-white/95 border border-[var(--art-line)]/70 shadow-xs"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[var(--art-accent)] text-white flex items-center justify-center text-xs font-serif font-semibold">
                    {w.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[var(--art-ink)]">{w.name}</h4>
                    <span className="text-[10px] text-[var(--art-ink-muted)]">{w.date}</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    w.attendance === 'hadir'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {w.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                </span>
              </div>
              <p className="text-xs text-[var(--art-ink-muted)] leading-relaxed mb-2">{w.message}</p>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleToggleLike(w.id)}
                  className="inline-flex items-center gap-1 text-xs text-[var(--art-accent)] hover:scale-110 transition cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                  <span className="text-[10px]">{w.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
