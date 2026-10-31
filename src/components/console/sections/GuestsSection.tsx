'use client';

import React, { useMemo, useState } from 'react';
import { Check, Copy, MessageCircle, Search, Trash2, Upload, UserPlus, X } from 'lucide-react';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
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

  return (
    <div className="studio-section">
      {/* ------------------------------------------------------------ add form */}
      <section className="card" style={{ padding: 'var(--space-5)' }}>
        <div className="row-between" style={{ marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-sm)' }}>Tambah tamu</h2>
            <p className="meta">Nama tamu dipakai untuk personalisasi cover undangan.</p>
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

        {mode === 'single' ? (
          <form onSubmit={addSingle} className="grid-2" style={{ gap: 'var(--space-3)', alignItems: 'end' }}>
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
            <div className="row" style={{ gap: 'var(--space-2)' }}>
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
      </section>

      {/* --------------------------------------------------------------- toolbar */}
      <div className="row-between" style={{ gap: 'var(--space-2)' }}>
        <div className="search-box" style={{ width: 'min(320px, 100%)' }}>
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

        <div className="row" style={{ gap: 'var(--space-1-5)' }}>
          <button
            type="button"
            className="chip"
            onClick={() => setCategoryFilter('all')}
            aria-pressed={categoryFilter === 'all'}
            style={
              categoryFilter === 'all'
                ? { background: 'var(--ink-900)', borderColor: 'var(--ink-900)', color: 'var(--on-inverse)' }
                : undefined
            }
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
                className="chip"
                onClick={() => setCategoryFilter(item)}
                aria-pressed={categoryFilter === item}
                style={
                  categoryFilter === item
                    ? { background: 'var(--ink-900)', borderColor: 'var(--ink-900)', color: 'var(--on-inverse)' }
                    : undefined
                }
              >
                {item} ({count})
              </button>
            );
          })}
        </div>

        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setTemplateOpen((v) => !v)}>
          <MessageCircle size={13} /> Template pesan
        </button>
      </div>

      {templateOpen && (
        <section className="card" style={{ padding: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-0-5)' }}>Template pesan WhatsApp</h2>
          <p className="meta" style={{ marginBottom: 'var(--space-3)' }}>
            Gunakan placeholder <code>{'{guestName}'}</code>, <code>{'{eventDate}'}</code>,{' '}
            <code>{'{venueName}'}</code>, dan <code>{'{link}'}</code>.
          </p>
          <textarea
            className="form-textarea"
            style={{ minHeight: 180, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
            aria-label="Template pesan WhatsApp"
          />
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            style={{ marginTop: 'var(--space-2)', width: 'fit-content' }}
            onClick={() => setMessageTemplate(DEFAULT_MESSAGE)}
          >
            Kembalikan ke default
          </button>
        </section>
      )}

      {/* ------------------------------------------------------------- guest list */}
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
                <th>Kategori</th>
                <th>WhatsApp</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((guest) => (
                <tr key={guest.id}>
                  <td style={{ color: 'var(--ink-900)', fontWeight: 560 }}>{guest.name}</td>
                  <td>
                    <span className="badge">{guest.category}</span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }}>
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
                        onClick={() => deleteGuest(guest.id)}
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
        Menampilkan {filtered.length} dari {inv.guests.length} tamu. Tautan personal membawa nama tamu ke
        cover undangan melalui parameter <code>?to=</code>.
      </p>
    </div>
  );
}
