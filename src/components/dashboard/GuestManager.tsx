'use client';

import React, { useState } from 'react';
import { GuestItem, InvitationData } from '@/types/invitation';
import {
  UserPlus,
  Copy,
  Check,
  MessageCircle,
  Trash2,
  Search,
  Download,
  UploadCloud,
  Settings2,
  FileText,
  X,
} from 'lucide-react';
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
  const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<GuestItem['category']>('Umum');
  const [phone, setPhone] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [customWATemplate, setCustomWATemplate] = useState<string>(
    `Kepada Yth.
*{guestName}*

_Assalamu’alaikum Warahmatullahi Wabarakatuh_

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada hari bahagia pernikahan kami:

🤵👰 *{groomName} & {brideName}*
({groomFullName} & {brideFullName})

🗓️ *{eventDate}*
📍 *{venueName}*

Informasi lengkap mengenai jadwal, lokasi, dan konfirmasi kehadiran dapat diakses melalui tautan undangan online resmi berikut:
🔗 {link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.

Terima kasih atas doa restunya.
_Wassalamu’alaikum Warahmatullahi Wabarakatuh_`
  );

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://infomase.id';

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddGuest({ name: name.trim(), category, phone: phone.trim() || undefined });
    setName('');
    setPhone('');
  };

  const handleAddBulk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
    let count = 0;

    lines.forEach((line) => {
      // Clean up numbering like "1. ", "1 - ", etc.
      const cleaned = line.replace(/^\d+[\.\-\)]\s*/, '').trim();
      if (!cleaned) return;

      // Check if line contains phone or category separated by comma or dash
      // Format examples: "Bpk. Hendra", "Bpk. Hendra - 0812345678", "Bpk. Hendra, 0812345678, VIP"
      const parts = cleaned.split(/[-–,]/).map((p) => p.trim());
      const guestName = parts[0];
      let guestPhone: string | undefined = undefined;
      let guestCat: GuestItem['category'] = category;

      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        if (/^[0-9+\s]+$/.test(part) && part.replace(/[^0-9]/g, '').length >= 9) {
          guestPhone = part.replace(/[^0-9+]/g, '');
        } else if (['VIP', 'Keluarga', 'Sahabat', 'Teman Kantor', 'Umum'].includes(part)) {
          guestCat = part as GuestItem['category'];
        }
      }

      if (guestName) {
        onAddGuest({ name: guestName, category: guestCat, phone: guestPhone });
        count++;
      }
    });

    setBulkText('');
    setAddMode('single');
  };

  const generateGuestLink = (guestName: string) => {
    return `${baseUrl}/invite/${data.slug}?to=${encodeURIComponent(guestName)}`;
  };

  const generateWhatsAppMessage = (guestName: string) => {
    const link = generateGuestLink(guestName);
    return customWATemplate
      .replace(/{guestName}/g, guestName)
      .replace(/{groomName}/g, data.groom.name)
      .replace(/{brideName}/g, data.bride.name)
      .replace(/{groomFullName}/g, data.groom.fullName || data.groom.name)
      .replace(/{brideFullName}/g, data.bride.fullName || data.bride.name)
      .replace(/{eventDate}/g, formatFullIndonesianDate(data.countdownDate))
      .replace(/{venueName}/g, data.events[0]?.locationName || 'Gedung Acara')
      .replace(/{link}/g, link);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportCSV = () => {
    const headers = ['Nama Tamu', 'Kategori', 'No WhatsApp', 'Tautan Khusus Undangan'];
    const rows = data.guests.map((g) => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.category}"`,
      `"${g.phone || '-'}"`,
      `"${generateGuestLink(g.name)}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `daftar-tamu-${data.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredGuests = data.guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase()) ||
      (g.phone && g.phone.includes(search));
    const matchesCat = categoryFilter === 'all' || g.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="studio-stack">
      <div className="studio-section-toolbar">
        <span className="studio-result-count"><strong>{data.guests.length}</strong> tamu terdaftar</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button
            type="button"
            onClick={() => setShowTemplateModal(true)}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            title="Kustomisasi Format Pesan WhatsApp"
          >
            <Settings2 size={14} />
            <span>Format Pesan WA</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            title="Download Kontak Tamu ke Excel"
          >
            <Download size={14} />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher: Satuan vs Import Massal */}
      <div className="studio-surface">
        <div className="guest-add-header">
          <div className="segmented">
            <button
              type="button"
              onClick={() => setAddMode('single')}
              className={addMode === 'single' ? 'active' : ''}
            >
              + Tambah Tamu
            </button>
            <button
              type="button"
              onClick={() => setAddMode('bulk')}
              className={addMode === 'bulk' ? 'active' : ''}
            >
              Import Nama
            </button>
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--ink-3)' }}>
            {addMode === 'single' ? 'Input manual per orang' : 'Tempel daftar dari Excel atau catatan'}
          </span>
        </div>

        {addMode === 'single' ? (
          <form onSubmit={handleAddSingle}>
            <div className="guest-form-grid">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="guest-name">Nama Tamu / Keluarga</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. H. Hendra Wijaya &amp; Keluarga"
                  className="form-input"
                  id="guest-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="guest-phone">Nomor WhatsApp (Opsional)</label>
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  className="form-input"
                  id="guest-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="guest-category">Kategori Tamu</label>
                <select
                  className="form-select"
                  id="guest-category"
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

            <button type="submit" className="btn btn-sm btn-primary" style={{ marginTop: 14 }}>
              <UserPlus size={14} />
              <span>Tambah Tamu</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleAddBulk}>
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-2)', marginBottom: 8 }}>
              <strong>Satu nama per baris.</strong> Sertakan nomor WhatsApp setelah tanda strip (contoh: <code>Bpk Surya - 0812345678</code>).
            </p>
            <textarea
              rows={5}
              aria-label="Daftar nama untuk diimport"
              required
              placeholder={`Bpk. H. Hendra Wijaya - 08123456789 - VIP\nKeluarga Besar Bpk Surya\nDinda Permata - 08987654321 - Sahabat\nRekan-rekan Tim Engineering`}
              className="form-input"
              style={{ fontFamily: 'monospace', fontSize: '0.82rem', resize: 'vertical' }}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
            />

            <div className="guest-import-footer">
              <div className="guest-import-category">
                <label htmlFor="bulk-category" className="form-label">Kategori default</label>
                <select
                  className="form-select"
                  id="bulk-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                >
                  <option value="Umum">Umum</option>
                  <option value="VIP">VIP</option>
                  <option value="Keluarga">Keluarga</option>
                  <option value="Sahabat">Sahabat</option>
                  <option value="Teman Kantor">Teman Kantor</option>
                </select>
              </div>

              <button type="submit" className="btn btn-sm btn-primary">
                <UploadCloud size={14} />
                <span>Import Semua Nama</span>
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="studio-section-toolbar">
        <span className="studio-result-count">Menampilkan <strong>{filteredGuests.length}</strong> dari {data.guests.length} tamu</span>
        <div className="search-box">
          <Search size={14} className="search-icon" />
          <input type="search" aria-label="Cari tamu" placeholder="Cari nama atau nomor WhatsApp..." className="form-input" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="studio-filters" aria-label="Kategori tamu">
        {['all', 'VIP', 'Keluarga', 'Sahabat', 'Teman Kantor', 'Umum'].map((cat) => (
          <button key={cat} type="button" onClick={() => setCategoryFilter(cat)} aria-pressed={categoryFilter === cat} className={`chip${categoryFilter === cat ? ' active' : ''}`}>
            {cat === 'all' ? 'Semua' : cat}
          </button>
        ))}
      </div>

      {/* Guest Table */}
      <div className="table-wrap">
        <table className="table guest-table" aria-label="Daftar tamu">
          <thead>
            <tr>
              <th>Nama Tamu</th>
              <th>Kategori</th>
              <th>No. WhatsApp</th>
              <th>Tautan Khusus</th>
              <th style={{ textAlign: 'right' }}>Aksi Broadcast</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-empty">
                  Tidak ada tamu yang sesuai dengan pencarian atau filter.
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest) => {
                const link = generateGuestLink(guest.name);
                const isCopiedLink = copiedId === `link-${guest.id}`;
                const isCopiedWA = copiedId === `wa-${guest.id}`;
                const waNumber = guest.phone ? guest.phone.replace(/^0/, '62').replace(/[^0-9]/g, '') : '';

                return (
                  <tr key={guest.id}>
                    <td className="guest-name">
                      {guest.name}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          guest.category === 'VIP'
                            ? 'badge-gold'
                            : guest.category === 'Keluarga'
                            ? 'badge-rose'
                            : guest.category === 'Sahabat'
                            ? 'badge-emerald'
                            : 'badge-dark'
                        }`}
                      >
                        {guest.category}
                      </span>
                    </td>
                    <td data-label="WhatsApp">
                      {guest.phone || '-'}
                    </td>
                    <td className="guest-link" data-label="Undangan">
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--brand)', fontSize: '0.8rem', textDecoration: 'none' }}
                      >
                        {link.replace(/^https?:\/\//, '')}
                      </a>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="guest-row-actions">
                        <button
                          type="button"
                          onClick={() => handleCopyText(link, `link-${guest.id}`)}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '5px 9px', fontSize: '0.74rem' }}
                          title="Salin Tautan Personal Tamu Ini"
                        >
                          {isCopiedLink ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                          <span>{isCopiedLink ? 'Tersalin' : 'Link'}</span>
                        </button>

                        {waNumber ? (
                          <a
                            href={`https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(generateWhatsAppMessage(guest.name))}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-primary"
                            style={{ padding: '5px 10px', fontSize: '0.74rem', textDecoration: 'none' }}
                            title={`Buka WhatsApp Kirim ke ${guest.phone}`}
                          >
                            <MessageCircle size={13} />
                            <span>Kirim WA</span>
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleCopyText(generateWhatsAppMessage(guest.name), `wa-${guest.id}`)}
                            className="btn btn-sm btn-secondary"
                            style={{ padding: '5px 9px', fontSize: '0.74rem' }}
                            title="Salin Pesan WA Lengkap"
                          >
                            {isCopiedWA ? <Check size={13} color="var(--success)" /> : <FileText size={13} />}
                            <span>{isCopiedWA ? 'Tersalin!' : 'Salin Pesan'}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onDeleteGuest(guest.id)}
                          className="btn btn-sm btn-ghost"
                          style={{ padding: '5px 8px', color: 'var(--danger)' }}
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

      {/* WhatsApp Template Modal */}
      {showTemplateModal && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowTemplateModal(false); }}>
          <div className="modal" style={{ maxWidth: 580 }}>
            <div className="modal-header">
              <div>
                <h4 className="modal-title">
                  Kustomisasi Format Pesan WhatsApp
                </h4>
                <p className="modal-subtitle">
                  Gunakan placeholder otomatis: <code>&#123;guestName&#125;</code>, <code>&#123;groomName&#125;</code>, <code>&#123;brideName&#125;</code>, <code>&#123;eventDate&#125;</code>, <code>&#123;venueName&#125;</code>, <code>&#123;link&#125;</code>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="btn btn-sm btn-ghost"
                style={{ padding: 4 }}
                aria-label="Tutup format pesan"
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <textarea
                rows={9}
                aria-label="Format pesan WhatsApp"
                className="form-input"
                style={{ fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.5, resize: 'vertical' }}
                value={customWATemplate}
                onChange={(e) => setCustomWATemplate(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="btn btn-sm btn-primary"
              >
                Simpan Format Pesan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
