'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  Check,
  Copy,
  FileText,
  MessageCircle,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  Upload,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { formatFullIndonesianDate } from '@/lib/formatDate';
import { DEFAULT_WA_TEMPLATES } from '@/lib/defaultData';
import type { GuestCategory, WhatsAppMessageTemplate } from '@/types/invitation';

const CATEGORIES: GuestCategory[] = ['Keluarga', 'Sahabat', 'Teman Kantor', 'VIP', 'Umum'];

const PLACEHOLDER_TOKENS: Array<{
  token: string;
  label: string;
  sample: string;
}> = [
  { token: '{guestName}', label: 'Nama Tamu', sample: 'Budi Santoso & Keluarga' },
  { token: '{eventDate}', label: 'Tanggal Acara', sample: 'Sabtu, 12 Desember 2026' },
  { token: '{eventTime}', label: 'Jam Acara', sample: '08:00 - 10:00 WIB' },
  { token: '{venueName}', label: 'Nama Tempat', sample: 'Gedung Graha Saka' },
  { token: '{venueAddress}', label: 'Alamat Lengkap', sample: 'Jl. Melati No. 12, Yogyakarta' },
  { token: '{groomName}', label: 'Mempelai Pria', sample: 'Raka' },
  { token: '{brideName}', label: 'Mempelai Wanita', sample: 'Sinta' },
  { token: '{link}', label: 'Link Undangan', sample: 'https://infomase.id/invite/...' },
];

function waNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  return digits;
}

export function GuestsSection({ invitationId }: { invitationId: string }) {
  const { invitations, addGuest, deleteGuest, updateWaTemplates } = useInvitationStore();
  const toast = useToast();

  const inv = invitations.find((i) => i.id === invitationId);

  // Main view switcher: 'guests' (90% daily task: add & send) vs 'templates' (10% setup task: manage WA templates & category rules)
  const [activeView, setActiveView] = useState<'guests' | 'templates'>('guests');

  // Guest list states
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | GuestCategory>('all');
  const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<GuestCategory>('Keluarga');

  const [bulkText, setBulkText] = useState('');
  const [bulkCategory, setBulkCategory] = useState<GuestCategory>('Keluarga');

  const [copied, setCopied] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  // Templates state
  const templates: WhatsAppMessageTemplate[] = useMemo(() => {
    if (!inv?.waTemplates || inv.waTemplates.length === 0) {
      return DEFAULT_WA_TEMPLATES;
    }
    return inv.waTemplates;
  }, [inv?.waTemplates]);

  const [activeTplId, setActiveTplId] = useState<string>(() => templates[0]?.id ?? 'wa-tpl-formal');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const activeTemplate = useMemo(
    () => templates.find((t) => t.id === activeTplId) ?? templates[0],
    [templates, activeTplId]
  );

  const inviteUrl = (slug: string, guestName: string) =>
    `${typeof window !== 'undefined' ? window.location.origin : 'https://infomase.id'}/invite/${slug}?to=${encodeURIComponent(guestName)}`;

  /** Find which template handles a given guest category */
  const getTemplateForCategory = (cat: GuestCategory): WhatsAppMessageTemplate => {
    const matched = templates.find((t) => t.assignedCategories.includes(cat));
    if (matched) return matched;
    return templates.find((t) => t.isDefault) ?? templates[0];
  };

  const formatMessageBody = (body: string, guestName: string) => {
    if (!inv) return '';
    const event = inv.events[0];
    const eventTimeStr = event
      ? `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''} ${event.timezone || 'WIB'}`
      : '';
    return body
      .replaceAll('{guestName}', guestName)
      .replaceAll('{groomName}', inv.groom.name)
      .replaceAll('{brideName}', inv.bride.name)
      .replaceAll('{eventDate}', event ? formatFullIndonesianDate(event.date) : '')
      .replaceAll('{eventTime}', eventTimeStr)
      .replaceAll('{venueName}', event?.locationName ?? '')
      .replaceAll('{venueAddress}', event?.address ?? '')
      .replaceAll('{link}', inviteUrl(inv.slug, guestName));
  };

  const buildMessageForGuest = (guestName: string, guestCat: GuestCategory) => {
    const tpl = getTemplateForCategory(guestCat);
    return formatMessageBody(tpl.body, guestName);
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

  /* ------------------------------------------------ template CRUD handlers */
  const saveTemplates = (next: WhatsAppMessageTemplate[]) => {
    updateWaTemplates(next);
  };

  const handleUpdateActiveTemplate = (patch: Partial<WhatsAppMessageTemplate>) => {
    if (!activeTemplate) return;
    const next = templates.map((t) => (t.id === activeTemplate.id ? { ...t, ...patch } : t));
    saveTemplates(next);
  };

  const handleToggleCategoryForTemplate = (tplId: string, cat: GuestCategory) => {
    const target = templates.find((t) => t.id === tplId);
    if (!target) return;
    const alreadyHas = target.assignedCategories.includes(cat);

    const next = templates.map((tpl) => {
      if (tpl.id === tplId) {
        return {
          ...tpl,
          assignedCategories: alreadyHas
            ? tpl.assignedCategories.filter((c) => c !== cat)
            : [...tpl.assignedCategories, cat],
        };
      }
      if (!alreadyHas && tpl.assignedCategories.includes(cat)) {
        return {
          ...tpl,
          assignedCategories: tpl.assignedCategories.filter((c) => c !== cat),
        };
      }
      return tpl;
    });

    saveTemplates(next);
    toast(
      'info',
      alreadyHas
        ? `Kategori ${cat} dilepas dari "${target.name}".`
        : `Kategori ${cat} sekarang memakai template "${target.name}".`
    );
  };

  const handleAddTemplate = () => {
    const newId = `wa-tpl-${Date.now()}`;
    const newTpl: WhatsAppMessageTemplate = {
      id: newId,
      name: `Template ${templates.length + 1}`,
      assignedCategories: [],
      body: `Selamat pagi/siang/malam {guestName},\n\nTanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di acara pernikahan kami:\n\n*{groomName} & {brideName}*\n📅 {eventDate}\n⏰ {eventTime}\n📍 {venueName}\n\nBuka undangan & konfirmasi kehadiran di tautan berikut:\n{link}\n\nTerima kasih atas doa restunya.`,
    };
    const next = [...templates, newTpl];
    saveTemplates(next);
    setActiveTplId(newId);
    toast('success', 'Template pesan baru dibuat.');
  };

  const handleDeleteTemplate = (tplId: string) => {
    if (templates.length <= 1) {
      toast('error', 'Minimal harus ada satu template pesan.');
      return;
    }
    const target = templates.find((t) => t.id === tplId);
    const next = templates.filter((t) => t.id !== tplId);
    saveTemplates(next);
    if (activeTplId === tplId) {
      setActiveTplId(next[0].id);
    }
    toast('info', `Template "${target?.name ?? ''}" dihapus.`);
  };

  const handleResetDefaultTemplates = () => {
    saveTemplates(DEFAULT_WA_TEMPLATES);
    setActiveTplId(DEFAULT_WA_TEMPLATES[0].id);
    toast('info', 'Semua template dikembalikan ke pengaturan awal.');
  };

  const insertTokenAtCursor = (token: string) => {
    if (!activeTemplate) return;
    const el = textareaRef.current;
    if (!el) {
      handleUpdateActiveTemplate({ body: `${activeTemplate.body} ${token}` });
      return;
    }
    const start = el.selectionStart ?? activeTemplate.body.length;
    const end = el.selectionEnd ?? activeTemplate.body.length;
    const before = activeTemplate.body.slice(0, start);
    const after = activeTemplate.body.slice(end);
    const nextBody = `${before}${token}${after}`;
    handleUpdateActiveTemplate({ body: nextBody });

    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + token.length;
      el.setSelectionRange(cursor, cursor);
    });
  };

  /* ----------------------------------------------------- guest CRUD */
  const addSingle = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    addGuest({ name: name.trim(), category, phone: phone.trim() || undefined });
    setName('');
    setPhone('');
    toast('success', 'Tamu berhasil ditambahkan.');
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
    toast('success', `${lines.length} tamu berhasil diimpor.`);
  };

  const copyLink = async (guestName: string) => {
    try {
      await navigator.clipboard.writeText(inviteUrl(inv.slug, guestName));
      setCopied(guestName);
      toast('success', `Tautan untuk ${guestName} disalin.`);
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

  const sampleGuestName = inv.guests[0]?.name || 'Budi Santoso & Keluarga';

  return (
    <div className="studio-section">
      {/* =====================================================================
          TOP NAVIGATION BAR: Clean Separation of "Daftar & Kirim" vs "Atur Template"
          ===================================================================== */}
      <div className="row-between" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <div className="editor-subnav" role="tablist" aria-label="Menu Tamu dan WhatsApp">
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'guests'}
            aria-pressed={activeView === 'guests'}
            onClick={() => setActiveView('guests')}
          >
            <Users size={14} />
            <span>Daftar Tamu &amp; Kirim</span>
            <span className="badge" style={{ marginLeft: 4 }}>
              {inv.guests.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'templates'}
            aria-pressed={activeView === 'templates'}
            onClick={() => setActiveView('templates')}
          >
            <MessageCircle size={14} />
            <span>Template Pesan WhatsApp</span>
            <span className="badge badge-blue" style={{ marginLeft: 4 }}>
              {templates.length} template
            </span>
          </button>
        </div>

        {activeView === 'guests' ? (
          <div className="row" style={{ gap: 'var(--space-2)' }}>
            <span className="meta">
              Pesan WA otomatis menyesuaikan kategori tamu.
            </span>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => setActiveView('templates')}
            >
              <FileText size={13} /> Ubah kalimat pesan
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => setActiveView('guests')}
          >
            <Users size={13} /> Kembali ke daftar tamu
          </button>
        )}
      </div>

      {/* =====================================================================
          VIEW 1: DAFTAR TAMU & KIRIM UNDANGAN (Clean, Fast, Uncluttered)
          ===================================================================== */}
      {activeView === 'guests' && (
        <>
          {/* Add Guest Card */}
          <section className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Tambah tamu</h2>
                <p className="card-subtitle">
                  Pilih kategori tamu agar template sapaan WhatsApp otomatis menyesuaikan (mis. Formal untuk Keluarga, Santai untuk Sahabat).
                </p>
              </div>
              <div className="segmented" role="group" aria-label="Mode penambahan tamu">
                <button
                  type="button"
                  className={addMode === 'single' ? 'is-active' : ''}
                  onClick={() => setAddMode('single')}
                  aria-pressed={addMode === 'single'}
                >
                  Satu per satu
                </button>
                <button
                  type="button"
                  className={addMode === 'bulk' ? 'is-active' : ''}
                  onClick={() => setAddMode('bulk')}
                  aria-pressed={addMode === 'bulk'}
                >
                  Impor banyak
                </button>
              </div>
            </div>

            <div className="card-body">
              {addMode === 'single' ? (
                <form onSubmit={addSingle} className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="guest-name">
                      Nama tamu (tampil di cover)
                    </label>
                    <input
                      id="guest-name"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Mis: Bpk. Budi Santoso & Keluarga"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="guest-phone">
                      Nomor WhatsApp (opsional)
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
                      Kategori ({getTemplateForCategory(category).name})
                    </label>
                    <select
                      id="guest-category"
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as GuestCategory)}
                    >
                      {CATEGORIES.map((item) => (
                        <option key={item} value={item}>
                          {item} — Template: {getTemplateForCategory(item).name}
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
                      Tempel daftar tamu (satu baris per tamu)
                    </label>
                    <textarea
                      id="guest-bulk"
                      className="form-textarea"
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      placeholder={'Budi Santoso & Keluarga; 08123456789\nDinda Permata; 08987654321'}
                    />
                    <span className="form-hint">
                      Format: <code>Nama Tamu; Nomor WA</code> (nomor telepon boleh dikosongkan).
                    </span>
                  </div>
                  <div className="row" style={{ gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    <select
                      className="form-select"
                      style={{ width: 260 }}
                      value={bulkCategory}
                      onChange={(e) => setBulkCategory(e.target.value as GuestCategory)}
                      aria-label="Kategori untuk tamu yang diimpor"
                    >
                      {CATEGORIES.map((item) => (
                        <option key={item} value={item}>
                          Kategori: {item} ({getTemplateForCategory(item).name})
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="btn btn-primary">
                      <Upload size={14} /> Impor daftar tamu
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* Guest List Table */}
          <section className="page-section">
            <div className="section-bar">
              <div style={{ minWidth: 0 }}>
                <h2>Daftar tamu ({inv.guests.length})</h2>
                <p>
                  {withPhone} tamu memiliki nomor WhatsApp siap kirim · Klik <b>Kirim WA</b> untuk membuka WhatsApp dengan pesan yang sudah terisi otomatis.
                </p>
              </div>
            </div>

            <div className="editor-toolbar">
              <div className="search-box">
                <Search size={14} className="search-icon" />
                <input
                  type="search"
                  className="form-input"
                  placeholder="Cari nama tamu…"
                  aria-label="Cari tamu"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={() => setSearch('')}
                    aria-label="Hapus pencarian"
                  >
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

            {filtered.length === 0 ? (
              <div className="empty-state card">
                <UserPlus size={22} />
                <h3>{inv.guests.length === 0 ? 'Belum ada tamu' : 'Tidak ada tamu yang cocok'}</h3>
                <p>
                  {inv.guests.length === 0
                    ? 'Tambahkan tamu di atas atau impor dari daftar yang sudah Anda siapkan.'
                    : 'Ubah kata kunci pencarian atau pilih kategori lain.'}
                </p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nama Tamu</th>
                      <th>Kategori &amp; Template</th>
                      <th className="col-sm">Nomor WA</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((guest) => {
                      const matchedTpl = getTemplateForCategory(guest.category);
                      return (
                        <tr key={guest.id}>
                          <td>
                            <div style={{ color: 'var(--ink-900)', fontWeight: 560 }}>{guest.name}</div>
                            {guest.phone && <span className="only-sm meta">{guest.phone}</span>}
                          </td>
                          <td>
                            <div className="row" style={{ gap: 6 }}>
                              <span className="badge">{guest.category}</span>
                              <span className="meta" style={{ fontSize: 'var(--text-2xs)' }}>
                                → {matchedTpl.name}
                              </span>
                            </div>
                          </td>
                          <td className="col-sm" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                            {guest.phone || <span style={{ color: 'var(--ink-400)' }}>—</span>}
                          </td>
                          <td>
                            <div className="row-nowrap" style={{ gap: 6, justifyContent: 'flex-end' }}>
                              <button
                                type="button"
                                className="btn btn-sm btn-ghost"
                                onClick={() => copyLink(guest.name)}
                                title="Salin link undangan personal"
                              >
                                {copied === guest.name ? <Check size={13} /> : <Copy size={13} />}
                                <span className="col-sm">{copied === guest.name ? 'Tersalin' : 'Salin Link'}</span>
                              </button>

                              {guest.phone ? (
                                <a
                                  className="btn btn-sm btn-primary"
                                  href={`https://wa.me/${waNumber(guest.phone)}?text=${encodeURIComponent(
                                    buildMessageForGuest(guest.name, guest.category)
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  title={`Kirim pesan memakai template "${matchedTpl.name}"`}
                                >
                                  <MessageCircle size={13} /> Kirim WA
                                </a>
                              ) : (
                                <span className="badge" style={{ color: 'var(--ink-400)' }}>
                                  Tanpa no. WA
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {/* =====================================================================
          VIEW 2: TEMPLATE PESAN WHATSAPP (Dedicated Master-Detail Workspace)
          ===================================================================== */}
      {activeView === 'templates' && (
        <div className="stack-5">
          <div className="wa-templates-split">
            {/* LEFT SIDEBAR: List of Templates + Add Button */}
            <aside className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header" style={{ padding: 'var(--space-3) var(--space-4)' }}>
                <span className="card-title" style={{ fontSize: 'var(--text-sm)' }}>
                  Daftar Template ({templates.length})
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={handleAddTemplate}
                >
                  <Plus size={13} /> Baru
                </button>
              </div>

              <div className="stack-1" style={{ padding: 'var(--space-2)' }}>
                {templates.map((tpl) => {
                  const selected = tpl.id === activeTemplate?.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setActiveTplId(tpl.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 4,
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: selected ? '1px solid var(--brand)' : '1px solid transparent',
                        background: selected ? 'var(--brand-subtle)' : 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 120ms ease',
                      }}
                    >
                      <div className="row-between" style={{ width: '100%', gap: 6 }}>
                        <span
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            color: selected ? 'var(--brand-ink)' : 'var(--ink-900)',
                          }}
                        >
                          {tpl.name}
                        </span>
                      </div>

                      {tpl.assignedCategories.length > 0 ? (
                        <div className="row" style={{ gap: 4, flexWrap: 'wrap' }}>
                          {tpl.assignedCategories.map((cat) => (
                            <span
                              key={cat}
                              className="badge"
                              style={{
                                fontSize: 10,
                                background: selected ? 'var(--surface)' : 'var(--surface-sunken)',
                              }}
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="meta" style={{ fontSize: 'var(--text-2xs)' }}>
                          Belum dipasang ke kategori
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  padding: 'var(--space-3)',
                  borderTop: '1px solid var(--border)',
                  background: 'var(--surface-sunken)',
                }}
              >
                <button
                  type="button"
                  className="btn btn-sm btn-ghost btn-block"
                  onClick={handleResetDefaultTemplates}
                >
                  <RotateCcw size={12} /> Kembalikan ke bawaan
                </button>
              </div>
            </aside>

            {/* RIGHT DETAIL: Editor + Category Chips + Live Preview */}
            {activeTemplate && (
              <div className="card">
                <div className="card-header">
                  <div>
                    <h2 className="card-title">Edit Template: {activeTemplate.name}</h2>
                    <p className="card-subtitle">
                      Atur nama, pilih kategori tamu yang memakai template ini, lalu sesuaikan kalimat pesannya.
                    </p>
                  </div>
                  {templates.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteTemplate(activeTemplate.id)}
                    >
                      <Trash2 size={13} /> Hapus template
                    </button>
                  )}
                </div>

                <div className="card-body stack-5">
                  {/* Step 1: Name & Category Assignment */}
                  <div className="grid-2" style={{ gap: 'var(--space-4)', alignItems: 'start' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="wa-tpl-name">
                        1. Nama Template
                      </label>
                      <input
                        id="wa-tpl-name"
                        className="form-input"
                        value={activeTemplate.name}
                        onChange={(e) => handleUpdateActiveTemplate({ name: e.target.value })}
                        placeholder="Mis: Formal & Keluarga"
                      />
                    </div>

                    <div className="form-group">
                      <span className="form-label">
                        2. Gunakan Otomatis untuk Kategori Tamu:
                      </span>
                      <div className="row" style={{ gap: 6, marginTop: 2 }}>
                        {CATEGORIES.map((cat) => {
                          const isAssignedHere = activeTemplate.assignedCategories.includes(cat);
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => handleToggleCategoryForTemplate(activeTemplate.id, cat)}
                              className={`chip ${isAssignedHere ? 'is-active' : ''}`}
                              style={{ padding: '5px 11px', fontSize: 'var(--text-xs)' }}
                              aria-pressed={isAssignedHere}
                            >
                              {isAssignedHere && <Check size={12} />}
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                      <span className="form-hint">
                        Klik kategori di atas. Semua tamu di kategori terpilih akan otomatis memakai template ini.
                      </span>
                    </div>
                  </div>

                  <hr className="divider" />

                  {/* Step 2: Editor + Live WhatsApp Preview Side-by-Side */}
                  <div className="grid-2" style={{ gap: 'var(--space-5)', alignItems: 'start' }}>
                    {/* Message Editor + Placeholder Buttons */}
                    <div className="stack-3">
                      <div className="form-group">
                        <label className="form-label" htmlFor="wa-tpl-body">
                          3. Isi Pesan Undangan
                        </label>
                        <p className="form-hint" style={{ marginBottom: 6 }}>
                          Klik tombol di bawah untuk menyisipkan data otomatis ke posisi kursor:
                        </p>

                        {/* Clean, Scannable Placeholder Pill Bar */}
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 6,
                            padding: '10px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--surface-sunken)',
                            border: '1px solid var(--border)',
                            marginBottom: 8,
                          }}
                        >
                          {PLACEHOLDER_TOKENS.map((item) => (
                            <button
                              key={item.token}
                              type="button"
                              onClick={() => insertTokenAtCursor(item.token)}
                              className="btn btn-sm btn-secondary"
                              style={{
                                fontSize: 'var(--text-2xs)',
                                padding: '4px 9px',
                                gap: 5,
                              }}
                              title={`Akan berubah menjadi: ${item.sample}`}
                            >
                              <Sparkles size={11} style={{ color: 'var(--brand)' }} />
                              <span>{item.label}</span>
                              <code
                                style={{
                                  fontSize: 10,
                                  color: 'var(--ink-500)',
                                  fontFamily: 'var(--font-mono)',
                                }}
                              >
                                {item.token}
                              </code>
                            </button>
                          ))}
                        </div>

                        <textarea
                          ref={textareaRef}
                          id="wa-tpl-body"
                          className="form-textarea"
                          style={{
                            minHeight: 240,
                            fontFamily: 'var(--font-ui)',
                            fontSize: 'var(--text-sm)',
                            lineHeight: 1.6,
                          }}
                          value={activeTemplate.body}
                          onChange={(e) => handleUpdateActiveTemplate({ body: e.target.value })}
                          placeholder="Tulis pesan WhatsApp di sini..."
                        />
                        <span className="form-hint">
                          Tips: Apit kata dengan tanda bintang seperti <code>*Raka &amp; Sinta*</code> untuk membuat teks tebal di WhatsApp.
                        </span>
                      </div>
                    </div>

                    {/* WhatsApp Live Preview */}
                    <div className="stack-2">
                      <span className="form-label">Pratinjau Hasil di WhatsApp</span>
                      <div
                        style={{
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)',
                          overflow: 'hidden',
                          background: '#efeae2',
                        }}
                      >
                        <div
                          style={{
                            padding: '10px 14px',
                            background: '#075e54',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 8,
                          }}
                        >
                          <div className="row-nowrap" style={{ gap: 8 }}>
                            <MessageCircle size={15} />
                            <div>
                              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                                {sampleGuestName}
                              </div>
                              <div style={{ fontSize: 10, opacity: 0.8 }}>
                                Simulasi pesan terkirim
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{ padding: 'var(--space-4)' }}>
                          <div
                            style={{
                              background: '#dcf8c6',
                              color: '#111b21',
                              padding: '12px 14px',
                              borderRadius: '10px 2px 10px 10px',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                              fontSize: 'var(--text-xs)',
                              lineHeight: 1.6,
                              whiteSpace: 'pre-wrap',
                              overflowWrap: 'anywhere',
                            }}
                          >
                            {formatMessageBody(activeTemplate.body, sampleGuestName)}
                            <div
                              style={{
                                textAlign: 'right',
                                fontSize: 10,
                                color: '#536471',
                                marginTop: 6,
                              }}
                            >
                              09:41 ✓✓
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
