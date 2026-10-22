'use client';

import React, { useState } from 'react';
import { GuestItem, InvitationData } from '@/types/invitation';
import { UserPlus, Copy, Check, MessageCircle, Trash2, Search, Share2, Sparkles } from 'lucide-react';
import { formatFullIndonesianDate } from '@/lib/formatDate';

interface GuestManagerProps {
  data: InvitationData;
  onAddGuest: (guest: Omit<GuestItem, 'id'>) => void;
  onDeleteGuest: (id: string) => void;
}

export const GuestManager: React.FC<GuestManagerProps> = ({
  data,
  onAddGuest,
  onDeleteGuest,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<GuestItem['category']>('Umum');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://infomase.id';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddGuest({ name: name.trim(), category });
    setName('');
  };

  const generateGuestLink = (guestName: string) => {
    return `${baseUrl}/invite/${data.slug}?to=${encodeURIComponent(guestName)}`;
  };

  const generateWhatsAppMessage = (guestName: string) => {
    const link = generateGuestLink(guestName);
    return `Kepada Yth.
*${guestName}*

_Assalamu’alaikum Warahmatullahi Wabarakatuh_

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada hari bahagia pernikahan kami:

🤵👰 *${data.groom.name} & ${data.bride.name}*
(${data.groom.fullName} & ${data.bride.fullName})

🗓️ *${formatFullIndonesianDate(data.countdownDate)}*
📍 *${data.events[0]?.locationName || 'Lokasi Acara'}*

Informasi lengkap mengenai jadwal, lokasi, dan konfirmasi kehadiran dapat diakses melalui tautan undangan online resmi berikut:
🔗 ${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.

Terima kasih atas doa restunya.
_Wassalamu’alaikum Warahmatullahi Wabarakatuh_`;
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredGuests = data.guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: '#0f172a', marginBottom: 6, fontWeight: 700 }}>
          Manajemen Tamu &amp; Generator Link WhatsApp
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Buat undangan khusus dengan nama tamu tertera di cover secara personal. Anda dapat menyalin pesan undangan siap kirim ke WhatsApp dengan sekali klik.
        </p>
      </div>

      {/* Add Guest Form */}
      <form
        onSubmit={handleAdd}
        className="glass-card"
        style={{ padding: 20, borderRadius: 14 }}
      >
        <h4 style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserPlus size={16} color="#0f172a" />
          Tambah Tamu Undangan Baru
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Nama Tamu / Keluarga</label>
            <input
              type="text"
              required
              placeholder="Contoh: Bpk. H. Hendra Wijaya & Keluarga"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Kategori Tamu</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <option value="VIP">VIP</option>
              <option value="Keluarga">Keluarga</option>
              <option value="Sahabat">Sahabat</option>
              <option value="Teman Kantor">Teman Kantor</option>
              <option value="Umum">Umum</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-sm btn-gold" style={{ marginTop: 14 }}>
          <UserPlus size={14} />
          Tambahkan ke Daftar
        </button>
      </form>

      {/* Search & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Cari nama tamu..."
            className="form-input"
            style={{ paddingLeft: 38 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <span className="badge badge-gold">Total: {data.guests.length} Tamu</span>
          <span className="badge badge-emerald">{data.guests.filter((g) => g.category === 'VIP').length} VIP</span>
        </div>
      </div>

      {/* Guest Table / List */}
      <div className="glass-card" style={{ borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Nama Tamu</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Kategori</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Tautan Personal</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                    Tidak ada tamu yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const link = generateGuestLink(guest.name);
                  const isCopiedLink = copiedId === `link-${guest.id}`;
                  const isCopiedWA = copiedId === `wa-${guest.id}`;

                  return (
                    <tr
                      key={guest.id}
                      style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s ease' }}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a' }}>
                        {guest.name}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          className={`badge ${
                            guest.category === 'VIP'
                              ? 'badge-gold'
                              : guest.category === 'Keluarga'
                              ? 'badge-rose'
                              : 'badge-dark'
                          }`}
                        >
                          {guest.category}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#2563eb', textDecoration: 'underline' }}
                        >
                          {link}
                        </a>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => handleCopyText(link, `link-${guest.id}`)}
                            className="btn btn-sm btn-glass"
                            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                            title="Salin Tautan Khusus"
                          >
                            {isCopiedLink ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                            {isCopiedLink ? 'Tersalin' : 'Link'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyText(generateWhatsAppMessage(guest.name), `wa-${guest.id}`)}
                            className="btn btn-sm btn-gold"
                            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                            title="Salin Teks WhatsApp Lengkap"
                          >
                            {isCopiedWA ? <Check size={13} /> : <MessageCircle size={13} />}
                            {isCopiedWA ? 'Teks WA Tersalin!' : 'Teks WA'}
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteGuest(guest.id)}
                            className="btn btn-sm btn-subtle"
                            style={{ padding: '6px 8px', color: '#ef4444' }}
                            title="Hapus Tamu"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
