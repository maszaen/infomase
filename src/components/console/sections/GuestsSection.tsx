'use client';

import React, { useMemo, useState } from 'react';
import { Check, Copy, MessageCircle, Search, Trash2, Upload, UserPlus, X } from 'lucide-react';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { formatFullIndonesianDate } from '@/lib/formatDate';
import type { GuestCategory } from '@/types/invitation';

const CATEGORIES: GuestCategory[] = ['Keluarga', 'Sahabat', 'Teman Kantor', 'VIP', 'Umum'];

const DEFAULT_MESSAGE = `Kepada Yth. {guestName}

Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada pernikahan kami:

{groomName} & {brideName}
{eventDate} · {venueName}

Detail acara dan konfirmasi kehadiran:
{link}

Terima kasih atas doa restunya.`;

function waNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  return digits;
}

export function GuestsSection({ invitationId }: { invitationId: string }) {
  const { invitations, addGuest, deleteGuest } = useInvitationStore();
  const toast = useToast();

  const inv = invitations.find((i) => i.id === invitationId);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | GuestCategory>('all');
  const [mode, setMode] = useState<'single' | 'bulk'>('single');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<GuestCategory>('Umum');

  const [bulkText, setBulkText] = useState('');
  const [bulkCategory, setBulkCategory] = useState<GuestCategory>('Umum');

  const [copied, setCopied] = useState<string | null>(null);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [messageTemplate, setMessageTemplate] = useState(DEFAULT_MESSAGE);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const inviteUrl = (slug: string, guestName: string) =>
    `${typeof window !== 'undefined' ? window.location.origin : 'https://infomase.id'}/invite/${slug}?to=${encodeURIComponent(guestName)}`;

  const buildMessage = (guestName: string) => {
    if (!inv) return '';
    const event = inv.events[0];
    return messageTemplate
      .replaceAll('{guestName}', guestName)
      .replaceAll('{groomName}', inv.groom.name)
      .replaceAll('{brideName}', inv.bride.name)
      .replaceAll('{eventDate}', event ? formatFullIndonesianDate(event.date) : '')
      .replaceAll('{venueName}', event?.locationName ?? '')
      .replaceAll('{link}', inviteUrl(inv.slug, guestName));
  };

  const filtered = useMemo(() => {
    if (!inv) return [];
    return inv.guests.filter((guest) => {
      const matchSearch = guest.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'all' || guest.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [inv, search, categoryFilter]);

  if (!inv) return null;

  const withPhone = inv.guests.filter((guest) => guest.phone).length;

  const addSingle = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    addGuest({ name: name.trim(), category, phone: phone.trim() || undefined });
    setName('');
    setPhone('');
    toast('success', 'Tamu ditambahkan.');
  };

  const addBulk = (event: React.FormEvent) => {
    event.preventDefault();
    const lines = bulkText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) return;

    lines.forEach((line) => {
      const [guestName, guestPhone] = line.split(/[;,|\t]/).map((part) => part?.trim() ?? '');
      if (guestName) addGuest({ name: guestName, category: bulkCategory, phone: guestPhone || undefined });
    });

    setBulkText('');
    toast('success', `${lines.length} tamu ditambahkan.`);
  };

  const copyLink = async (guestName: string) => {
    try {
      await navigator.clipboard.writeText(inviteUrl(inv.slug, guestName));
      setCopied(guestName);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      toast('error', 'Clipboard tidak tersedia di browser ini.');
    }
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteGuest(pendingDelete.id);
    toast('info', `${pendingDelete.name} dihapus dari daftar tamu.`);
    setPendingDelete(null);
  };

  return (
    <div className="studio-section">
      {/* ------------------------------------------------------------ add form */}
      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Tambah tamu</h2>
            <p className="card-subtitle">Nama tamu dipakai untuk personalisasi cover undangan.</p>
          </div>
          <div className="segmented" role="group" aria-label="Mode penambahan tamu">
            <button
              type="button"
              className={mode === 'single' ? 'is-active' : ''}
              onClick={() => setMode('single')}
              aria-pressed={mode === 'single'}
            >
              Satu tamu
            </button>
            <button
              type="button"
              className={mode === 'bulk' ? 'is-active' : ''}
              onClick={() => setMode('bulk')}
              aria-pressed={mode === 'bulk'}
            >
              Impor banyak
            </button>
          </div>
        </div>

        <div className="card-body">
          {mode === 'single' ? (
            <form onSubmit={addSingle} className="form-grid-3">
              <div className="form-group">
                <label className="form-label" htmlFor="guest-name">
                  Nama tamu
                </label>
                <input
                  id="guest-name"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Budi Santoso & Keluarga"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="guest-phone">
                  Nomor WhatsApp
                </label>
                <input
                  id="guest-phone"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812…"
                  inputMode="tel"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="guest-category">
                  Kategori
                </label>
                <select
                  id="guest-category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GuestCategory)}
                >
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                <UserPlus size={14} /> Tambah
              </button>
            </form>
          ) : (
            <form onSubmit={addBulk} className="stack-3">
              <div className="form-group">
                <label className="form-label" htmlFor="guest-bulk">
                  Satu tamu per baris
                </label>
                <textarea
                  id="guest-bulk"
                  className="form-textarea"
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={'Budi Santoso & Keluarga; 08123456789\nDinda Permata; 08987654321'}
                />
                <span className="form-hint">
                  Format: <code>Nama; nomor</code>. Nomor telepon opsional.
                </span>
              </div>
              <div className="row" style={{ gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <select
                  className="form-select"
                  style={{ width: 180 }}
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value as GuestCategory)}
                  aria-label="Kategori untuk tamu yang diimpor"
                >
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn btn-primary">
                  <Upload size={14} /> Impor
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------- guest list */}
      <section className="page-section">
        <div className="section-bar">
          <div style={{ minWidth: 0 }}>
            <h2>Daftar tamu</h2>
            <p>
              {inv.guests.length} tamu · {withPhone} punya nomor WhatsApp
            </p>
          </div>
          <button
            type="button"
            className={`btn btn-sm ${templateOpen ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setTemplateOpen((value) => !value)}
            aria-expanded={templateOpen}
          >
            <MessageCircle size={13} /> Template pesan
          </button>
        </div>

        <div className="editor-toolbar">
          <div className="search-box">
            <Search size={14} className="search-icon" />
            <input
              type="search"
              className="form-input"
              placeholder="Cari tamu…"
              aria-label="Cari tamu"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button type="button" className="search-clear" onClick={() => setSearch('')} aria-label="Hapus pencarian">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="filter-scroll" role="group" aria-label="Filter kategori">
            <button
              type="button"
              className={`chip ${categoryFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setCategoryFilter('all')}
              aria-pressed={categoryFilter === 'all'}
            >
              Semua ({inv.guests.length})
            </button>
            {CATEGORIES.map((item) => {
              const count = inv.guests.filter((g) => g.category === item).length;
              if (count === 0) return null;
              return (
                <button
                  key={item}
                  type="button"
                  className={`chip ${categoryFilter === item ? 'is-active' : ''}`}
                  onClick={() => setCategoryFilter(item)}
                  aria-pressed={categoryFilter === item}
                >
                  {item} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {templateOpen && (
          <section className="card" style={{ padding: 'var(--space-4)' }}>
            <div className="section-bar" style={{ marginBottom: 'var(--space-2)' }}>
              <div>
                <h2>Template pesan WhatsApp</h2>
                <p>
                  Placeholder: <code>{'{guestName}'}</code>, <code>{'{eventDate}'}</code>,{' '}
                  <code>{'{venueName}'}</code>, <code>{'{link}'}</code>.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => setMessageTemplate(DEFAULT_MESSAGE)}
              >
                Kembalikan default
              </button>
            </div>
            <textarea
              className="form-textarea"
              style={{ minHeight: 168, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              aria-label="Template pesan WhatsApp"
            />
          </section>
        )}

        {filtered.length === 0 ? (
          <div className="empty-state card">
            <UserPlus size={22} />
            <h3>{inv.guests.length === 0 ? 'Belum ada tamu' : 'Tidak ada tamu yang cocok'}</h3>
            <p>
              {inv.guests.length === 0
                ? 'Tambahkan tamu satu per satu atau tempel daftar dari spreadsheet Anda.'
                : 'Ubah kata kunci atau filter kategori.'}
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th className="col-sm">WhatsApp</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((guest) => (
                  <tr key={guest.id}>
                    <td>
                      <div className="row" style={{ gap: 6, flexWrap: 'wrap', minWidth: 0 }}>
                        <span style={{ color: 'var(--ink-900)', fontWeight: 560 }}>{guest.name}</span>
                        <span className="badge">{guest.category}</span>
                      </div>
                      {guest.phone && <span className="only-sm meta">{guest.phone}</span>}
                    </td>
                    <td className="col-sm" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }}>
                      {guest.phone || <span style={{ color: 'var(--ink-400)' }}>—</span>}
                    </td>
                    <td>
                      <div className="row-nowrap" style={{ gap: 4, justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn btn-sm btn-ghost btn-icon"
                          onClick={() => copyLink(guest.name)}
                          aria-label={`Salin tautan untuk ${guest.name}`}
                          title="Salin tautan personal"
                        >
                          {copied === guest.name ? <Check size={13} /> : <Copy size={13} />}
                        </button>

                        {guest.phone ? (
                          <a
                            className="btn btn-sm btn-secondary"
                            href={`https://wa.me/${waNumber(guest.phone)}?text=${encodeURIComponent(buildMessage(guest.name))}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <MessageCircle size={12} /> Kirim
                          </a>
                        ) : (
                          <span className="meta" style={{ fontSize: 'var(--text-2xs)' }}>
                            tanpa nomor
                          </span>
                        )}

                        <button
                          type="button"
                          className="btn btn-sm btn-ghost btn-icon"
                          onClick={() => setPendingDelete({ id: guest.id, name: guest.name })}
                          aria-label={`Hapus ${guest.name}`}
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="meta">
          Menampilkan {filtered.length} dari {inv.guests.length} tamu. Tautan personal membawa nama tamu ke cover
          undangan melalui parameter <code>?to=</code>.
        </p>
      </section>

      <Modal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Hapus tamu?"
        description={pendingDelete ? `“${pendingDelete.name}” akan dihapus dari daftar tamu.` : undefined}
        size="sm"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setPendingDelete(null)}>
              Batal
            </button>
            <button type="button" className="btn btn-danger-solid" onClick={confirmDelete}>
              <Trash2 size={14} /> Hapus tamu
            </button>
          </>
        }
      >
        <p className="meta">
          Ucapan dan konfirmasi kehadiran yang sudah masuk tidak ikut terhapus, tetapi tautan personal tamu ini tidak
          bisa dipakai lagi.
        </p>
      </Modal>
    </div>
  );
}
