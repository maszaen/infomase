'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Gift,
  Heart,
  Image as ImageIcon,
  Music4,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer';
import { uploadApi } from '@/lib/api';
import { PRESET_PHOTOS } from '@/lib/defaultData';
import type { EventDetail, GalleryPhoto } from '@/types/invitation';

const TABS = [
  { id: 'couple', label: 'Mempelai', icon: Users },
  { id: 'events', label: 'Acara', icon: Calendar },
  { id: 'quote', label: 'Kutipan', icon: Heart },
  { id: 'story', label: 'Kisah', icon: Sparkles },
  { id: 'gallery', label: 'Galeri', icon: ImageIcon },
  { id: 'gift', label: 'Amplop', icon: Gift },
  { id: 'music', label: 'Musik', icon: Music4 },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function ContentSection({ invitationId }: { invitationId: string }) {
  const store = useInvitationStore();
  const toast = useToast();
  const [tab, setTab] = useState<TabId>('couple');
  const [previewGuest, setPreviewGuest] = useState('Budi Santoso & Keluarga');
  const [busy, setBusy] = useState<string | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

  const inv = store.invitations.find((i) => i.id === invitationId) ?? store.data;

  /* ------------------------------------------------------------- uploads */
  const uploadPhoto = async (file: File, type: 'groom' | 'bride') => {
    setBusy(type);
    try {
      const res = await uploadApi.uploadPhoto(inv.id, file, type);
      if (res?.url) {
        type === 'groom' ? store.updateGroom({ photo: res.url }) : store.updateBride({ photo: res.url });
        toast('success', 'Foto tersimpan di server.');
      }
    } catch {
      const localUrl = URL.createObjectURL(file);
      type === 'groom' ? store.updateGroom({ photo: localUrl }) : store.updateBride({ photo: localUrl });
      toast('info', 'Server belum tersedia — foto dipakai sebagai pratinjau lokal.');
    } finally {
      setBusy(null);
    }
  };

  const addGalleryFiles = async (files: FileList) => {
    setBusy('gallery');
    try {
      const res = await uploadApi.uploadGalleryBatch(inv.id, Array.from(files));
      if (Array.isArray(res) && res.length > 0) {
        store.updateGallery([
          ...inv.gallery,
          ...res.map((item, index) => ({
            id: item.id || `gal-${Date.now()}-${index}`,
            url: item.url,
            caption: item.caption || '',
          })),
        ]);
        toast('success', `${res.length} foto ditambahkan.`);
      }
    } catch {
      const local: GalleryPhoto[] = Array.from(files).map((file, index) => ({
        id: `gal-local-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        caption: file.name.replace(/\.[^/.]+$/, ''),
      }));
      store.updateGallery([...inv.gallery, ...local]);
      toast('info', 'Server belum tersedia — foto ditambahkan sebagai pratinjau lokal.');
    } finally {
      setBusy(null);
    }
  };

  const uploadAudio = async (file: File) => {
    setBusy('music');
    try {
      const res = await uploadApi.uploadAudio(inv.id, file, file.name);
      if (res?.url) {
        store.updateMusic({ ...inv.music, url: res.url, title: res.title || file.name });
        toast('success', 'Musik diperbarui.');
      }
    } catch {
      store.updateMusic({ ...inv.music, url: URL.createObjectURL(file), title: file.name });
      toast('info', 'Server belum tersedia — musik dipakai sebagai pratinjau lokal.');
    } finally {
      setBusy(null);
    }
  };

  /* ---------------------------------------------------------- field helpers */
  const sectionCard = (title: string, hint: string | undefined, children: React.ReactNode) => (
    <section className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">{title}</h2>
          {hint && <p className="card-subtitle">{hint}</p>}
        </div>
      </div>
      <div className="card-body">{children}</div>
    </section>
  );

  const renderCouple = () => (
    <div className="stack-4">
      {sectionCard('Identitas undangan', 'Judul dipakai di konsol; slug menentukan tautan publik.', (
        <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="inv-title">
              Judul undangan
            </label>
            <input
              id="inv-title"
              className="form-input"
              value={inv.title}
              onChange={(e) => store.updateGeneral(e.target.value, inv.slug)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="inv-slug">
              Slug tautan
            </label>
            <div className="input-icon-left">
              <span style={{ position: 'absolute', left: 10, fontSize: 'var(--text-2xs)', color: 'var(--ink-400)', pointerEvents: 'none' }}>
                /invite/
              </span>
              <input
                id="inv-slug"
                className="form-input"
                style={{ paddingLeft: 'calc(var(--space-8) + var(--space-6) + var(--space-0-5))' }}
                value={inv.slug}
                onChange={(e) => store.updateGeneral(inv.title, e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      {(['groom', 'bride'] as const).map((role) => {
        const person = role === 'groom' ? inv.groom : inv.bride;
        const label = role === 'groom' ? 'Mempelai pria' : 'Mempelai wanita';
        return (
          <section key={role} className="card">
            <div className="card-header">
              <h2 className="card-title">{label}</h2>
            </div>
            <div className="card-body">
              <div className="row-nowrap" style={{ gap: 'var(--space-4)', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: 'var(--surface-sunken)',
                  flexShrink: 0,
                  border: '1px solid var(--border)',
                }}
              >
                {person.photo && (
                  <img
                    src={person.photo}
                    alt=""
                    width={72}
                    height={72}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }} className="stack-2">
                <label className="btn btn-sm btn-secondary" style={{ width: 'fit-content' }}>
                  <Upload size={13} />
                  {busy === role ? 'Mengunggah…' : 'Unggah foto'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadPhoto(file, role);
                      e.target.value = '';
                    }}
                  />
                </label>
                <input
                  className="form-input"
                  aria-label={`URL foto ${label.toLowerCase()}`}
                  placeholder="atau tempel URL foto"
                  value={person.photo}
                  onChange={(e) =>
                    role === 'groom'
                      ? store.updateGroom({ photo: e.target.value })
                      : store.updateBride({ photo: e.target.value })
                  }
                />
                <div className="row" style={{ gap: 'var(--space-1-5)' }}>
                  {(role === 'groom' ? PRESET_PHOTOS.grooms : PRESET_PHOTOS.brides).map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      className="chip"
                      style={{ fontSize: 'var(--text-2xs)' }}
                      onClick={() =>
                        role === 'groom'
                          ? store.updateGroom({ photo: preset.url })
                          : store.updateBride({ photo: preset.url })
                      }
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor={`${role}-name`}>
                  Nama panggilan
                </label>
                <input
                  id={`${role}-name`}
                  className="form-input"
                  value={person.name}
                  onChange={(e) =>
                    role === 'groom'
                      ? store.updateGroom({ name: e.target.value })
                      : store.updateBride({ name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor={`${role}-full`}>
                  Nama lengkap &amp; gelar
                </label>
                <input
                  id={`${role}-full`}
                  className="form-input"
                  value={person.fullName}
                  onChange={(e) =>
                    role === 'groom'
                      ? store.updateGroom({ fullName: e.target.value })
                      : store.updateBride({ fullName: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor={`${role}-father`}>
                  Nama ayah
                </label>
                <input
                  id={`${role}-father`}
                  className="form-input"
                  value={person.fatherName}
                  onChange={(e) =>
                    role === 'groom'
                      ? store.updateGroom({ fatherName: e.target.value })
                      : store.updateBride({ fatherName: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor={`${role}-mother`}>
                  Nama ibu
                </label>
                <input
                  id={`${role}-mother`}
                  className="form-input"
                  value={person.motherName}
                  onChange={(e) =>
                    role === 'groom'
                      ? store.updateGroom({ motherName: e.target.value })
                      : store.updateBride({ motherName: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor={`${role}-ig`}>
                  Instagram
                </label>
                <input
                  id={`${role}-ig`}
                  className="form-input"
                  placeholder="@akun"
                  value={person.instagram ?? ''}
                  onChange={(e) =>
                    role === 'groom'
                      ? store.updateGroom({ instagram: e.target.value })
                      : store.updateBride({ instagram: e.target.value })
                  }
                />
              </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );

  const renderEvents = () => (
    <div className="stack-4">
      {inv.events.map((event, index) => (
        <section key={event.id} className="card">
          <div className="card-header">
            <h2 className="card-title">
              Acara {index + 1} · {event.title || 'Tanpa judul'}
            </h2>
            {inv.events.length > 1 && (
              <button
                type="button"
                className="btn btn-sm btn-ghost btn-icon"
                onClick={() => store.deleteEvent(event.id)}
                aria-label={`Hapus acara ${index + 1}`}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <div className="card-body">
            <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor={`${event.id}-title`}>
                Nama acara
              </label>
              <input
                id={`${event.id}-title`}
                className="form-input"
                value={event.title}
                onChange={(e) => store.updateEvent(event.id, { title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor={`${event.id}-date`}>
                Tanggal
              </label>
              <input
                id={`${event.id}-date`}
                type="date"
                className="form-input"
                value={event.date}
                onChange={(e) => store.updateEvent(event.id, { date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor={`${event.id}-start`}>
                Mulai
              </label>
              <input
                id={`${event.id}-start`}
                type="time"
                className="form-input"
                value={event.startTime}
                onChange={(e) => store.updateEvent(event.id, { startTime: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor={`${event.id}-end`}>
                Selesai
              </label>
              <input
                id={`${event.id}-end`}
                type="time"
                className="form-input"
                value={event.endTime}
                onChange={(e) => store.updateEvent(event.id, { endTime: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor={`${event.id}-place`}>
                Nama lokasi
              </label>
              <input
                id={`${event.id}-place`}
                className="form-input"
                value={event.locationName}
                onChange={(e) => store.updateEvent(event.id, { locationName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor={`${event.id}-tz`}>
                Zona waktu
              </label>
              <select
                id={`${event.id}-tz`}
                className="form-select"
                value={event.timezone}
                onChange={(e) => store.updateEvent(event.id, { timezone: e.target.value })}
              >
                <option value="WIB">WIB</option>
                <option value="WITA">WITA</option>
                <option value="WIT">WIT</option>
              </select>
            </div>
          </div>

          <div className="stack-3" style={{ marginTop: 'var(--space-3)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor={`${event.id}-address`}>
                Alamat lengkap
              </label>
              <textarea
                id={`${event.id}-address`}
                className="form-textarea"
                style={{ minHeight: 64 }}
                value={event.address}
                onChange={(e) => store.updateEvent(event.id, { address: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor={`${event.id}-maps`}>
                Tautan Google Maps
              </label>
              <input
                id={`${event.id}-maps`}
                className="form-input"
                value={event.mapsUrl}
                onChange={(e) => store.updateEvent(event.id, { mapsUrl: e.target.value })}
              />
            </div>
          </div>
          </div>
        </section>
      ))}

      <button
        type="button"
        className="btn btn-secondary"
        style={{ width: 'fit-content' }}
        onClick={() => {
          const base = inv.events[0];
          const next: EventDetail = {
            id: `ev-${Date.now()}`,
            title: 'Acara tambahan',
            date: base?.date ?? new Date().toISOString().slice(0, 10),
            startTime: '09:00',
            endTime: '11:00',
            timezone: base?.timezone ?? 'WIB',
            locationName: '',
            address: '',
            mapsUrl: '',
          };
          store.addEvent(next);
          toast('info', 'Acara ditambahkan. Lengkapi detailnya.');
        }}
      >
        <Plus size={14} /> Tambah acara
      </button>
    </div>
  );

  const renderQuote = () =>
    sectionCard('Kutipan pembuka', 'Tampil tepat setelah cover undangan.', (
      <div className="stack-3">
        <div className="form-group">
          <label className="form-label" htmlFor="quote-text">
            Teks kutipan
          </label>
          <textarea
            id="quote-text"
            className="form-textarea"
            value={inv.quote.text}
            onChange={(e) => store.updateQuote({ ...inv.quote, text: e.target.value })}
          />
        </div>
        <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="quote-source">
              Sumber
            </label>
            <input
              id="quote-source"
              className="form-input"
              value={inv.quote.source}
              onChange={(e) => store.updateQuote({ ...inv.quote, source: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="quote-translation">
              Catatan tambahan
            </label>
            <input
              id="quote-translation"
              className="form-input"
              value={inv.quote.translation ?? ''}
              onChange={(e) => store.updateQuote({ ...inv.quote, translation: e.target.value })}
            />
          </div>
        </div>
      </div>
    ));

  const renderStory = () => (
    <div className="stack-4">
      {inv.stories.map((story, index) => (
        <section key={story.id} className="card">
          <div className="card-header">
            <h2 className="card-title">Momen {index + 1}</h2>
            <button
              type="button"
              className="btn btn-sm btn-ghost btn-icon"
              onClick={() => store.updateStories(inv.stories.filter((s) => s.id !== story.id))}
              aria-label={`Hapus momen ${index + 1}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="card-body">
          <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor={`${story.id}-year`}>
                Tahun
              </label>
              <input
                id={`${story.id}-year`}
                className="form-input"
                value={story.year}
                onChange={(e) =>
                  store.updateStories(
                    inv.stories.map((s) => (s.id === story.id ? { ...s, year: e.target.value } : s))
                  )
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor={`${story.id}-title`}>
                Judul
              </label>
              <input
                id={`${story.id}-title`}
                className="form-input"
                value={story.title}
                onChange={(e) =>
                  store.updateStories(
                    inv.stories.map((s) => (s.id === story.id ? { ...s, title: e.target.value } : s))
                  )
                }
              />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 'var(--space-3)' }}>
            <label className="form-label" htmlFor={`${story.id}-desc`}>
              Cerita
            </label>
            <textarea
              id={`${story.id}-desc`}
              className="form-textarea"
              value={story.description}
              onChange={(e) =>
                store.updateStories(
                  inv.stories.map((s) => (s.id === story.id ? { ...s, description: e.target.value } : s))
                )
              }
            />
          </div>
          </div>
        </section>
      ))}
      <button
        type="button"
        className="btn btn-secondary"
        style={{ width: 'fit-content' }}
        onClick={() =>
          store.updateStories([
            ...inv.stories,
            { id: `story-${Date.now()}`, year: '', title: '', description: '' },
          ])
        }
      >
        <Plus size={14} /> Tambah momen
      </button>
    </div>
  );

  const renderGallery = () => (
    <div className="stack-4">
      {sectionCard('Tambah foto', 'Unggah beberapa foto sekaligus, atau tempel tautan gambar.', (
        <div className="stack-3">
          <label className="btn btn-secondary" style={{ width: 'fit-content' }}>
            <Upload size={14} />
            {busy === 'gallery' ? 'Mengunggah…' : 'Pilih dari perangkat'}
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                if (e.target.files?.length) addGalleryFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </label>

          <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="gal-url">
                URL gambar
              </label>
              <input
                id="gal-url"
                className="form-input"
                placeholder="https://…"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="gal-caption">
                Keterangan
              </label>
              <input
                id="gal-caption"
                className="form-input"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-primary"
            style={{ width: 'fit-content' }}
            disabled={!newPhotoUrl.trim()}
            onClick={() => {
              store.updateGallery([
                ...inv.gallery,
                { id: `gal-${Date.now()}`, url: newPhotoUrl.trim(), caption: newCaption.trim() || undefined },
              ]);
              setNewPhotoUrl('');
              setNewCaption('');
            }}
          >
            <Plus size={13} /> Tambah foto
          </button>
        </div>
      ))}

      <div className="design-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))' }}>
        {inv.gallery.map((photo) => (
          <figure key={photo.id} className="card" style={{ overflow: 'hidden', margin: 0 }}>
            <img
              src={photo.url}
              alt={photo.caption ?? ''}
              width={150}
              height={110}
              style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}
            />
            <figcaption style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)' }}>
              <span
                style={{
                  flex: 1,
                  fontSize: 'var(--text-2xs)',
                  color: 'var(--ink-500)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {photo.caption || 'Tanpa keterangan'}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-ghost btn-icon"
                onClick={() => store.updateGallery(inv.gallery.filter((g) => g.id !== photo.id))}
                aria-label="Hapus foto"
              >
                <Trash2 size={12} />
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );

  const renderGift = () => (
    <div className="stack-4">
      {inv.bankAccounts.map((account, index) => (
        <section key={account.id} className="card">
          <div className="card-header">
            <h2 className="card-title">Rekening {index + 1}</h2>
            <button
              type="button"
              className="btn btn-sm btn-ghost btn-icon"
              onClick={() => store.updateBankAccounts(inv.bankAccounts.filter((a) => a.id !== account.id))}
              aria-label={`Hapus rekening ${index + 1}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="card-body">
          <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor={`${account.id}-bank`}>
                Bank
              </label>
              <input
                id={`${account.id}-bank`}
                className="form-input"
                value={account.bankName}
                onChange={(e) =>
                  store.updateBankAccounts(
                    inv.bankAccounts.map((a) => (a.id === account.id ? { ...a, bankName: e.target.value } : a))
                  )
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor={`${account.id}-number`}>
                Nomor rekening
              </label>
              <input
                id={`${account.id}-number`}
                className="form-input numeric"
                value={account.accountNumber}
                onChange={(e) =>
                  store.updateBankAccounts(
                    inv.bankAccounts.map((a) =>
                      a.id === account.id ? { ...a, accountNumber: e.target.value } : a
                    )
                  )
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor={`${account.id}-holder`}>
                Atas nama
              </label>
              <input
                id={`${account.id}-holder`}
                className="form-input"
                value={account.accountHolder}
                onChange={(e) =>
                  store.updateBankAccounts(
                    inv.bankAccounts.map((a) =>
                      a.id === account.id ? { ...a, accountHolder: e.target.value } : a
                    )
                  )
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor={`${account.id}-qris`}>
                URL QRIS (opsional)
              </label>
              <input
                id={`${account.id}-qris`}
                className="form-input"
                placeholder="https://…"
                value={account.qrisUrl ?? ''}
                onChange={(e) =>
                  store.updateBankAccounts(
                    inv.bankAccounts.map((a) => (a.id === account.id ? { ...a, qrisUrl: e.target.value } : a))
                  )
                }
              />
            </div>
          </div>
          </div>
        </section>
      ))}

      <button
        type="button"
        className="btn btn-secondary"
        style={{ width: 'fit-content' }}
        onClick={() =>
          store.updateBankAccounts([
            ...inv.bankAccounts,
            { id: `bank-${Date.now()}`, bankName: '', accountNumber: '', accountHolder: '' },
          ])
        }
      >
        <Plus size={14} /> Tambah rekening
      </button>

      {sectionCard('Alamat kirim kado', 'Ditampilkan untuk tamu yang ingin mengirim hadiah fisik.', (
        <div className="stack-3">
          <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="gift-name">
                Nama penerima
              </label>
              <input
                id="gift-name"
                className="form-input"
                value={inv.giftAddress?.recipientName ?? ''}
                onChange={(e) =>
                  store.updateGiftAddress({
                    recipientName: e.target.value,
                    phone: inv.giftAddress?.phone ?? '',
                    fullAddress: inv.giftAddress?.fullAddress ?? '',
                  })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="gift-phone">
                Nomor telepon
              </label>
              <input
                id="gift-phone"
                className="form-input"
                value={inv.giftAddress?.phone ?? ''}
                onChange={(e) =>
                  store.updateGiftAddress({
                    recipientName: inv.giftAddress?.recipientName ?? '',
                    phone: e.target.value,
                    fullAddress: inv.giftAddress?.fullAddress ?? '',
                  })
                }
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="gift-address">
              Alamat lengkap
            </label>
            <textarea
              id="gift-address"
              className="form-textarea"
              value={inv.giftAddress?.fullAddress ?? ''}
              onChange={(e) =>
                store.updateGiftAddress({
                  recipientName: inv.giftAddress?.recipientName ?? '',
                  phone: inv.giftAddress?.phone ?? '',
                  fullAddress: e.target.value,
                })
              }
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderMusic = () =>
    sectionCard('Musik latar', 'Diputar setelah tamu membuka undangan. Gunakan file pendek agar tidak memperlambat halaman.', (
      <div className="stack-3">
        <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="music-title">
              Judul lagu
            </label>
            <input
              id="music-title"
              className="form-input"
              value={inv.music.title}
              onChange={(e) => store.updateMusic({ ...inv.music, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="music-artist">
              Artis
            </label>
            <input
              id="music-artist"
              className="form-input"
              value={inv.music.artist}
              onChange={(e) => store.updateMusic({ ...inv.music, artist: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="music-url">
            URL audio
          </label>
          <input
            id="music-url"
            className="form-input"
            value={inv.music.url}
            onChange={(e) => store.updateMusic({ ...inv.music, url: e.target.value })}
          />
        </div>

        <div className="row" style={{ gap: 'var(--space-2)' }}>
          <label className="btn btn-sm btn-secondary">
            <Upload size={13} />
            {busy === 'music' ? 'Mengunggah…' : 'Unggah MP3'}
            <input
              type="file"
              accept="audio/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadAudio(file);
                e.target.value = '';
              }}
            />
          </label>

          <label className="row-nowrap" style={{ gap: 'var(--space-1-5)', fontSize: 'var(--text-xs)' }}>
            <input
              type="checkbox"
              aria-label="Putar musik otomatis setelah undangan dibuka"
              checked={inv.music.autoplay}
              onChange={(e) => store.updateMusic({ ...inv.music, autoplay: e.target.checked })}
            />
            Putar otomatis setelah dibuka
          </label>
        </div>
      </div>
    ));

  return (
    <div className="studio-split">
      <div style={{ minWidth: 0 }}>
        <div className="editor-subnav" style={{ marginBottom: 'var(--space-4)' }} aria-label="Bagian konten">
          {TABS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={tab === item.id}
                onClick={() => setTab(item.id)}
              >
                <Icon size={13} />
                {item.label}
              </button>
            );
          })}
        </div>

        {tab === 'couple' && renderCouple()}
        {tab === 'events' && renderEvents()}
        {tab === 'quote' && renderQuote()}
        {tab === 'story' && renderStory()}
        {tab === 'gallery' && renderGallery()}
        {tab === 'gift' && renderGift()}
        {tab === 'music' && renderMusic()}
      </div>

      <aside className="preview-sticky">
        <div className="card" style={{ padding: 'var(--space-3)' }}>
          <div className="row-between" style={{ gap: 8, marginBottom: 'var(--space-2)' }}>
            <span className="label">Pratinjau langsung</span>
            <span className="badge badge-success">
              <span className="status-dot status-dot-live" /> tersinkron
            </span>
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-3)' }}>
            <label className="form-label" htmlFor="preview-guest" style={{ fontSize: 'var(--text-2xs)' }}>
              Nama tamu di cover
            </label>
            <input
              id="preview-guest"
              className="form-input"
              value={previewGuest}
              onChange={(e) => setPreviewGuest(e.target.value)}
            />
          </div>

          <div className="content-preview">
            <div className="content-preview-inner">
              <div className="phone-screen" style={{ height: '100%' }}>
                <InvitationRenderer data={inv} guestName={previewGuest} defaultOpened />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
