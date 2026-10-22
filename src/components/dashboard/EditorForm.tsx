'use client';

import React, { useState } from 'react';
import { InvitationData, EventDetail, LoveStory, GalleryPhoto, BankAccount } from '@/types/invitation';
import { PRESET_PHOTOS } from '@/lib/defaultData';
import { uploadApi } from '@/lib/api';
import {
  Users,
  Calendar,
  Heart,
  Image as ImageIcon,
  Gift,
  Music,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  UploadCloud,
  Loader2,
  Check,
} from 'lucide-react';

interface EditorFormProps {
  data: InvitationData;
  onUpdateGroom: (updates: Partial<InvitationData['groom']>) => void;
  onUpdateBride: (updates: Partial<InvitationData['bride']>) => void;
  onUpdateGeneral: (title: string, slug: string) => void;
  onUpdateQuote: (quote: InvitationData['quote']) => void;
  onUpdateCountdownDate: (date: string) => void;
  onUpdateEvent: (id: string, updates: Partial<EventDetail>) => void;
  onAddEvent: (event: EventDetail) => void;
  onDeleteEvent: (id: string) => void;
  onUpdateStories: (stories: LoveStory[]) => void;
  onUpdateGallery: (gallery: GalleryPhoto[]) => void;
  onUpdateBankAccounts: (accounts: BankAccount[]) => void;
  onUpdateGiftAddress: (address: InvitationData['giftAddress']) => void;
  onUpdateMusic: (music: InvitationData['music']) => void;
}

export const EditorForm: React.FC<EditorFormProps> = ({
  data,
  onUpdateGroom,
  onUpdateBride,
  onUpdateGeneral,
  onUpdateQuote,
  onUpdateCountdownDate,
  onUpdateEvent,
  onAddEvent,
  onDeleteEvent,
  onUpdateStories,
  onUpdateGallery,
  onUpdateBankAccounts,
  onUpdateGiftAddress,
  onUpdateMusic,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'mempelai' | 'acara' | 'quote' | 'kisah' | 'galeri' | 'kado' | 'musik'>('mempelai');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [uploadingGroom, setUploadingGroom] = useState(false);
  const [uploadingBride, setUploadingBride] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUploadGroomPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGroom(true);
    try {
      const res = await uploadApi.uploadPhoto(data.id, file, 'groom');
      if (res?.url) {
        onUpdateGroom({ photo: res.url });
        showToast('Foto mempelai pria berhasil diunggah ke server!');
      }
    } catch (err: any) {
      // Local preview fallback if backend server is not running
      const localUrl = URL.createObjectURL(file);
      onUpdateGroom({ photo: localUrl });
      showToast('Backend offline: Foto dimuat sebagai preview lokal');
    } finally {
      setUploadingGroom(false);
      e.target.value = '';
    }
  };

  const handleUploadBridePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBride(true);
    try {
      const res = await uploadApi.uploadPhoto(data.id, file, 'bride');
      if (res?.url) {
        onUpdateBride({ photo: res.url });
        showToast('Foto mempelai wanita berhasil diunggah ke server!');
      }
    } catch (err: any) {
      const localUrl = URL.createObjectURL(file);
      onUpdateBride({ photo: localUrl });
      showToast('Backend offline: Foto dimuat sebagai preview lokal');
    } finally {
      setUploadingBride(false);
      e.target.value = '';
    }
  };

  const handleUploadGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const fileArray = Array.from(files);
      const res = await uploadApi.uploadGalleryBatch(data.id, fileArray);
      if (Array.isArray(res) && res.length > 0) {
        onUpdateGallery([
          ...data.gallery,
          ...res.map((item, idx) => ({
            id: item.id || 'gal-' + Date.now() + idx,
            url: item.url,
            caption: item.caption || '',
          })),
        ]);
        showToast(`${res.length} foto berhasil diunggah ke server!`);
      }
    } catch {
      // Fallback local preview
      const newItems: GalleryPhoto[] = Array.from(files).map((f, idx) => ({
        id: 'gal-local-' + Date.now() + idx,
        url: URL.createObjectURL(f),
        caption: f.name.replace(/\.[^/.]+$/, ''),
      }));
      onUpdateGallery([...data.gallery, ...newItems]);
      showToast('Backend offline: Foto galeri dimuat secara lokal');
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleUploadMusicAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMusic(true);
    try {
      const res = await uploadApi.uploadAudio(data.id, file, file.name);
      if (res?.url) {
        onUpdateMusic({
          ...data.music,
          url: res.url,
          title: res.title || file.name.replace(/\.[^/.]+$/, ''),
        });
        showToast('Audio musik berhasil diunggah ke server!');
      }
    } catch {
      const localAudioUrl = URL.createObjectURL(file);
      onUpdateMusic({
        ...data.music,
        url: localAudioUrl,
        title: file.name.replace(/\.[^/.]+$/, ''),
      });
      showToast('Backend offline: Audio musik dimuat secara lokal');
    } finally {
      setUploadingMusic(false);
      e.target.value = '';
    }
  };

  const subTabs = [
    { id: 'mempelai', label: 'Mempelai', icon: Users },
    { id: 'acara', label: 'Acara & Waktu', icon: Calendar },
    { id: 'quote', label: 'Kutipan & Doa', icon: Heart },
    { id: 'kisah', label: 'Kisah Cinta', icon: Sparkles },
    { id: 'galeri', label: 'Galeri Foto', icon: ImageIcon },
    { id: 'kado', label: 'Amplop Digital', icon: Gift },
    { id: 'musik', label: 'Musik Latar', icon: Music },
  ];

  const handleAddGalleryPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    const newPhoto: GalleryPhoto = {
      id: 'gal-' + Date.now(),
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || undefined,
    };
    onUpdateGallery([...data.gallery, newPhoto]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
  };

  const handleDeletePhoto = (id: string) => {
    onUpdateGallery(data.gallery.filter((g) => g.id !== id));
  };

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: 14 }}>
      {/* Sub Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 12,
          marginBottom: 24,
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`btn btn-sm ${isActive ? 'btn-gold' : 'btn-glass'}`}
              style={{
                borderRadius: 999,
                fontSize: '0.8rem',
                padding: '8px 16px',
                flexShrink: 0,
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Upload Toast Notification */}
      {toastMessage && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. MEMPELAI TAB */}
      {activeSubTab === 'mempelai' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* General Title & Slug */}
          <div style={{ background: '#f8fafc', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600, marginBottom: 12 }}>
              Judul Undangan &amp; Tautan Slug
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Judul Undangan</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.title}
                  onChange={(e) => onUpdateGeneral(e.target.value, data.slug)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Slug URL (infomase.id/invite/{data.slug})</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.slug}
                  onChange={(e) => onUpdateGeneral(data.title, e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* Mempelai Pria */}
            <div style={{ background: '#ffffff', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h4 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 600 }}>Mempelai Pria</h4>
                <span className="badge badge-gold">Groom</span>
              </div>

              <div className="form-group">
                <label className="form-label">Nama Panggilan</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.groom.name}
                  onChange={(e) => onUpdateGroom({ name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nama Lengkap &amp; Gelar</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.groom.fullName}
                  onChange={(e) => onUpdateGroom({ fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nama Ayah</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.groom.fatherName}
                  onChange={(e) => onUpdateGroom({ fatherName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nama Ibu</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.groom.motherName}
                  onChange={(e) => onUpdateGroom({ motherName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="form-label" style={{ margin: 0 }}>Foto Pria</label>
                  <label
                    className="btn btn-sm btn-glass"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      cursor: uploadingGroom ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {uploadingGroom ? <Loader2 size={13} className="music-spinning" /> : <UploadCloud size={13} />}
                    {uploadingGroom ? 'Mengunggah...' : 'Upload Gambar'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadGroomPhoto}
                      disabled={uploadingGroom}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="URL Foto Gambar..."
                  value={data.groom.photo}
                  onChange={(e) => onUpdateGroom({ photo: e.target.value })}
                />
                {/* Preset Picker */}
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pilih Foto Siap Pakai:</span>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    {PRESET_PHOTOS.grooms.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onUpdateGroom({ photo: p.url })}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 8,
                          overflow: 'hidden',
                          border: data.groom.photo === p.url ? '2px solid #0f172a' : '1px solid #e2e8f0',
                          padding: 0,
                          cursor: 'pointer',
                        }}
                        title={p.label}
                      >
                        <img src={p.url} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Instagram (@username)</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.groom.instagram || ''}
                  onChange={(e) => onUpdateGroom({ instagram: e.target.value })}
                />
              </div>
            </div>

            {/* Mempelai Wanita */}
            <div style={{ background: '#ffffff', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h4 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 600 }}>Mempelai Wanita</h4>
                <span className="badge badge-rose">Bride</span>
              </div>

              <div className="form-group">
                <label className="form-label">Nama Panggilan</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.bride.name}
                  onChange={(e) => onUpdateBride({ name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nama Lengkap &amp; Gelar</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.bride.fullName}
                  onChange={(e) => onUpdateBride({ fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nama Ayah</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.bride.fatherName}
                  onChange={(e) => onUpdateBride({ fatherName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nama Ibu</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.bride.motherName}
                  onChange={(e) => onUpdateBride({ motherName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="form-label" style={{ margin: 0 }}>Foto Wanita</label>
                  <label
                    className="btn btn-sm btn-glass"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      cursor: uploadingBride ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {uploadingBride ? <Loader2 size={13} className="music-spinning" /> : <UploadCloud size={13} />}
                    {uploadingBride ? 'Mengunggah...' : 'Upload Gambar'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadBridePhoto}
                      disabled={uploadingBride}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="URL Foto Gambar..."
                  value={data.bride.photo}
                  onChange={(e) => onUpdateBride({ photo: e.target.value })}
                />
                {/* Preset Picker */}
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pilih Foto Siap Pakai:</span>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    {PRESET_PHOTOS.brides.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onUpdateBride({ photo: p.url })}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 8,
                          overflow: 'hidden',
                          border: data.bride.photo === p.url ? '2px solid #0f172a' : '1px solid #e2e8f0',
                          padding: 0,
                          cursor: 'pointer',
                        }}
                        title={p.label}
                      >
                        <img src={p.url} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Instagram (@username)</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.bride.instagram || ''}
                  onChange={(e) => onUpdateBride({ instagram: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACARA TAB */}
      {activeSubTab === 'acara' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <label className="form-label" style={{ color: '#0f172a', fontWeight: 600 }}>
              Target Tanggal Countdown (Hari H)
            </label>
            <input
              type="datetime-local"
              className="form-input"
              value={data.countdownDate.slice(0, 16)}
              onChange={(e) => onUpdateCountdownDate(e.target.value)}
            />
          </div>

          {data.events.map((event, idx) => (
            <div
              key={event.id || idx}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: 18,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600 }}>Acara #{idx + 1}: {event.title}</h4>
                {data.events.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onDeleteEvent(event.id)}
                    className="btn btn-sm btn-subtle"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={15} />
                    Hapus
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Nama Rangkaian Acara</label>
                  <input
                    type="text"
                    className="form-input"
                    value={event.title}
                    onChange={(e) => onUpdateEvent(event.id, { title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    className="form-input"
                    value={event.date}
                    onChange={(e) => onUpdateEvent(event.id, { date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Waktu Mulai</label>
                  <input
                    type="time"
                    className="form-input"
                    value={event.startTime}
                    onChange={(e) => onUpdateEvent(event.id, { startTime: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Waktu Selesai</label>
                  <input
                    type="time"
                    className="form-input"
                    value={event.endTime}
                    onChange={(e) => onUpdateEvent(event.id, { endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nama Gedung / Masjid / Tempat</label>
                <input
                  type="text"
                  className="form-input"
                  value={event.locationName}
                  onChange={(e) => onUpdateEvent(event.id, { locationName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Alamat Lengkap</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={event.address}
                  onChange={(e) => onUpdateEvent(event.id, { address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tautan Google Maps</label>
                <input
                  type="url"
                  className="form-input"
                  value={event.mapsUrl}
                  onChange={(e) => onUpdateEvent(event.id, { mapsUrl: e.target.value })}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              onAddEvent({
                id: 'ev-' + Date.now(),
                title: 'Acara Tambahan / Syukuran',
                date: '2026-11-29',
                startTime: '19:00',
                endTime: '21:00',
                timezone: 'WIB',
                locationName: 'Kediaman Mempelai',
                address: 'Jl. Contoh Alamat No. 12',
                mapsUrl: 'https://maps.google.com',
              })
            }
            className="btn btn-glass"
            style={{ alignSelf: 'flex-start' }}
          >
            <Plus size={16} />
            Tambah Sesi Acara Baru
          </button>
        </div>
      )}

      {/* 3. QUOTE TAB */}
      {activeSubTab === 'quote' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Kutipan / Ayat Suci</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={data.quote.text}
              onChange={(e) => onUpdateQuote({ ...data.quote, text: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Sumber Kutipan / Surah (Contoh: QS. Ar-Rum: 21)</label>
            <input
              type="text"
              className="form-input"
              value={data.quote.source}
              onChange={(e) => onUpdateQuote({ ...data.quote, source: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Pesan / Harapan Pembuka</label>
            <input
              type="text"
              className="form-input"
              value={data.quote.translation || ''}
              onChange={(e) => onUpdateQuote({ ...data.quote, translation: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* 4. KISAH CINTA TAB */}
      {activeSubTab === 'kisah' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {data.stories.map((story, idx) => (
            <div
              key={story.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span className="badge badge-gold">Milestone #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => onUpdateStories(data.stories.filter((s) => s.id !== story.id))}
                  className="btn btn-sm btn-subtle"
                  style={{ color: '#ef4444' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Tahun</label>
                  <input
                    type="text"
                    className="form-input"
                    value={story.year}
                    onChange={(e) => {
                      const updated = data.stories.map((s) => (s.id === story.id ? { ...s, year: e.target.value } : s));
                      onUpdateStories(updated);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Judul Momen</label>
                  <input
                    type="text"
                    className="form-input"
                    value={story.title}
                    onChange={(e) => {
                      const updated = data.stories.map((s) => (s.id === story.id ? { ...s, title: e.target.value } : s));
                      onUpdateStories(updated);
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Cerita Singkat</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={story.description}
                  onChange={(e) => {
                    const updated = data.stories.map((s) => (s.id === story.id ? { ...s, description: e.target.value } : s));
                    onUpdateStories(updated);
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Foto Kenangan (Opsional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={story.image || ''}
                  onChange={(e) => {
                    const updated = data.stories.map((s) => (s.id === story.id ? { ...s, image: e.target.value } : s));
                    onUpdateStories(updated);
                  }}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              onUpdateStories([
                ...data.stories,
                {
                  id: 'story-' + Date.now(),
                  year: '2026',
                  title: 'Menuju Pelaminan',
                  description: 'Kisah indah kami berlanjut dalam ikatan suci yang abadi.',
                },
              ]);
            }}
            className="btn btn-glass"
            style={{ alignSelf: 'flex-start' }}
          >
            <Plus size={16} />
            Tambah Cerita Cinta
          </button>
        </div>
      )}

      {/* 5. GALERI FOTO TAB */}
      {activeSubTab === 'galeri' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Add photo card */}
          <div style={{ background: '#f8fafc', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600, marginBottom: 12 }}>
              Tambah Foto ke Galeri
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
              <input
                type="text"
                placeholder="URL Gambar (misal dari Unsplash / Cloudinary)"
                className="form-input"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
              />
              <input
                type="text"
                placeholder="Keterangan / Caption singkat"
                className="form-input"
                value={newPhotoCaption}
                onChange={(e) => setNewPhotoCaption(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" onClick={handleAddGalleryPhoto} className="btn btn-sm btn-gold">
                <Plus size={15} />
                Tambahkan via URL
              </button>

              <label
                className="btn btn-sm btn-glass"
                style={{
                  cursor: uploadingGallery ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {uploadingGallery ? <Loader2 size={14} className="music-spinning" /> : <UploadCloud size={14} />}
                {uploadingGallery ? 'Mengunggah ke Server...' : 'Upload Foto Galeri (Bisa Banyak)'}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleUploadGalleryFiles}
                  disabled={uploadingGallery}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Presets Quick Pick */}
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                Atau pilih langsung foto profesional siap pakai:
              </span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PRESET_PHOTOS.couples.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onUpdateGallery([
                        ...data.gallery,
                        { id: 'gal-' + Date.now(), url: p.url, caption: p.label },
                      ]);
                    }}
                    style={{
                      borderRadius: 8,
                      overflow: 'hidden',
                      width: 50,
                      height: 50,
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                    title={`Tambahkan: ${p.label}`}
                  >
                    <img src={p.url} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Gallery List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
            {data.gallery.map((photo) => (
              <div
                key={photo.id}
                style={{
                  position: 'relative',
                  height: 120,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                }}
              >
                <img src={photo.url} alt="Galeri" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(photo.id)}
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    background: 'rgba(239, 68, 68, 0.85)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 26,
                    height: 26,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Hapus foto"
                >
                  <Trash2 size={13} />
                </button>
                {photo.caption && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 'auto 0 0 0',
                      padding: '4px 6px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {photo.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. KADO & AMPLOP TAB */}
      {activeSubTab === 'kado' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600 }}>Akun Rekening Transfer</h4>
          {data.bankAccounts.map((account, idx) => (
            <div
              key={account.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="badge badge-gold">Rekening #{idx + 1}</span>
                {data.bankAccounts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onUpdateBankAccounts(data.bankAccounts.filter((a) => a.id !== account.id))}
                    className="btn btn-sm btn-subtle"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Nama Bank / e-Wallet</label>
                  <input
                    type="text"
                    className="form-input"
                    value={account.bankName}
                    onChange={(e) => {
                      const updated = data.bankAccounts.map((a) => (a.id === account.id ? { ...a, bankName: e.target.value } : a));
                      onUpdateBankAccounts(updated);
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nomor Rekening</label>
                  <input
                    type="text"
                    className="form-input"
                    value={account.accountNumber}
                    onChange={(e) => {
                      const updated = data.bankAccounts.map((a) => (a.id === account.id ? { ...a, accountNumber: e.target.value } : a));
                      onUpdateBankAccounts(updated);
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Atas Nama Rekening</label>
                  <input
                    type="text"
                    className="form-input"
                    value={account.accountHolder}
                    onChange={(e) => {
                      const updated = data.bankAccounts.map((a) => (a.id === account.id ? { ...a, accountHolder: e.target.value } : a));
                      onUpdateBankAccounts(updated);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              onUpdateBankAccounts([
                ...data.bankAccounts,
                {
                  id: 'bank-' + Date.now(),
                  bankName: 'Bank Syariah Indonesia (BSI)',
                  accountNumber: '7192837192',
                  accountHolder: `${data.groom.name} / ${data.bride.name}`,
                },
              ])
            }
            className="btn btn-glass"
            style={{ alignSelf: 'flex-start' }}
          >
            <Plus size={16} />
            Tambah Rekening Baru
          </button>

          {/* Physical Address */}
          <div style={{ marginTop: 12, paddingTop: 18, borderTop: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600, marginBottom: 12 }}>
              Alamat Pengiriman Kado Fisik
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Nama Penerima</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.giftAddress?.recipientName || ''}
                  onChange={(e) => onUpdateGiftAddress({ ...data.giftAddress!, recipientName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nomor HP</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.giftAddress?.phone || ''}
                  onChange={(e) => onUpdateGiftAddress({ ...data.giftAddress!, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Alamat Lengkap Rumah</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={data.giftAddress?.fullAddress || ''}
                onChange={(e) => onUpdateGiftAddress({ ...data.giftAddress!, fullAddress: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. MUSIK TAB */}
      {activeSubTab === 'musik' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Judul Lagu</label>
            <input
              type="text"
              className="form-input"
              value={data.music.title}
              onChange={(e) => onUpdateMusic({ ...data.music, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nama Artis / Musisi</label>
            <input
              type="text"
              className="form-input"
              value={data.music.artist}
              onChange={(e) => onUpdateMusic({ ...data.music, artist: e.target.value })}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="form-label" style={{ margin: 0 }}>URL Audio MP3 (Direct link)</label>
              <label
                className="btn btn-sm btn-glass"
                style={{
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  cursor: uploadingMusic ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {uploadingMusic ? <Loader2 size={13} className="music-spinning" /> : <UploadCloud size={13} />}
                {uploadingMusic ? 'Mengunggah MP3...' : 'Upload File MP3'}
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleUploadMusicAudio}
                  disabled={uploadingMusic}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <input
              type="url"
              className="form-input"
              value={data.music.url}
              onChange={(e) => onUpdateMusic({ ...data.music, url: e.target.value })}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Gunakan link audio berformat .mp3 atau upload langsung file lagu romantis pilihan Anda.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
