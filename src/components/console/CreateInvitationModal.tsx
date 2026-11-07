'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, AlertCircle, CheckCircle2, Sparkles, Loader2, ShoppingBag } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
import { getTemplate, normalizeTemplateId } from '@/lib/templates';
import { unassignedLicences } from '@/lib/orders';
import { invitationsApi } from '@/lib/api';

interface Props {
  open: boolean;
  onClose: () => void;
  /** Preselect when the user arrived from a template card. */
  initialTemplateId?: string;
}

export function CreateInvitationModal({ open, onClose, initialTemplateId }: Props) {
  const router = useRouter();
  const { createInvitation, licences, templates } = useInvitationStore();
  const toast = useToast();

  // Only allow selecting templates for which the user has an unassigned active licence
  const availableLicences = useMemo(() => unassignedLicences(licences), [licences]);
  const ownedTemplates = useMemo(() => {
    const ownedIds = new Set(availableLicences.map((l) => normalizeTemplateId(l.templateId)));
    return templates.filter((tpl) => ownedIds.has(tpl.id));
  }, [availableLicences, templates]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const templateId = useMemo(() => {
    if (initialTemplateId) {
      const normalizedInit = normalizeTemplateId(initialTemplateId);
      if (ownedTemplates.some((t) => t.id === normalizedInit)) {
        return normalizedInit;
      }
    }
    if (selectedTemplateId && ownedTemplates.some((t) => t.id === selectedTemplateId)) {
      return selectedTemplateId;
    }
    return ownedTemplates[0]?.id ?? '';
  }, [initialTemplateId, ownedTemplates, selectedTemplateId]);

  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Slug check states
  const [slugCheck, setSlugCheck] = useState<{
    slug: string;
    status: 'available' | 'taken';
    reason: string;
    suggestions: string[];
  } | null>(null);

  // Auto-generate slug candidate when names change if user hasn't manually customized
  const defaultSlug = useMemo(() => {
    const raw = `${groomName}-${brideName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return raw || '';
  }, [groomName, brideName]);

  const activeSlug = isSlugCustomized ? customSlug : defaultSlug;
  const slugStatus: 'idle' | 'checking' | 'available' | 'taken' =
    !activeSlug || activeSlug.trim().length === 0
      ? 'idle'
      : slugCheck?.slug === activeSlug
        ? slugCheck.status
        : 'checking';
  const conflictReason = slugStatus === 'taken' ? slugCheck?.reason ?? '' : '';
  const suggestions = slugStatus === 'taken' ? slugCheck?.suggestions ?? [] : [];

  const template = getTemplate(templateId);

  // Real-time debounced slug availability checker
  useEffect(() => {
    if (!activeSlug || activeSlug.trim().length === 0) return;

    const timer = setTimeout(() => {
      invitationsApi
        .checkSlug(activeSlug)
        .then((res) => {
          if (res) {
            if (res.available) {
              setSlugCheck({ slug: activeSlug, status: 'available', reason: '', suggestions: [] });
            } else {
              setSlugCheck({
                slug: activeSlug,
                status: 'taken',
                reason: res.reason || 'Slug sudah digunakan oleh undangan lain.',
                suggestions: res.suggestions || [],
              });
            }
          }
        })
        .catch(() => {
          setSlugCheck({ slug: activeSlug, status: 'available', reason: '', suggestions: [] });
        });
    }, 350);

    return () => clearTimeout(timer);
  }, [activeSlug]);

  const applySuggestion = (sug: string) => {
    setCustomSlug(sug);
    setIsSlugCustomized(true);
    setSlugCheck({ slug: sug, status: 'available', reason: '', suggestions: [] });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (creating) return;
    if (!templateId) {
      setError('Anda belum memiliki lisensi template yang siap dipakai. Silakan beli template terlebih dahulu.');
      return;
    }
    if (!groomName.trim() || !brideName.trim()) {
      setError('Isi nama panggilan kedua mempelai.');
      return;
    }

    const finalSlug = (activeSlug || 'undangan')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    if (slugStatus === 'taken') {
      setError('Slug tautan ini sudah digunakan. Silakan pilih salah satu saran tautan unik di atas atau ubah slug.');
      return;
    }

    setError(null);

    setCreating(true);
    try {
    const created = await createInvitation({
      title: `${groomName.trim()} & ${brideName.trim()}`,
      slug: finalSlug,
      templateId,
      groomName: groomName.trim(),
      brideName: brideName.trim(),
      eventDate: eventDate || undefined,
    });

    onClose();
    toast('success', `Undangan "${created.title}" dibuat sebagai draf.`);
    router.push(`/dashboard/undangan/${created.id}/content`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Undangan gagal dibuat.');
    } finally {
      setCreating(false);
    }
  };

  if (ownedTemplates.length === 0) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        title="Beli template terlebih dahulu"
        description="Untuk membuat undangan baru, Anda memerlukan lisensi template aktif yang belum terpakai."
        size="md"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Tutup
            </button>
            <Link href="/katalog" className="btn btn-primary" onClick={onClose}>
              Lihat katalog template <ArrowRight size={14} />
            </Link>
          </>
        }
      >
        <div className="empty-state" style={{ padding: 'var(--space-6) var(--space-4)' }}>
          <ShoppingBag size={24} />
          <h3>Belum ada lisensi siap pakai</h3>
          <p>
            Pilih desain undangan di Katalog dan selesaikan pembayaran sekali bayar. Setelah lisensi aktif, Anda bisa
            langsung membuat dan menayangkan undangan.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Buat undangan"
      description="Gunakan lisensi template yang sudah Anda miliki untuk membuat undangan baru."
      size="md"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button type="submit" form="create-invitation" className="btn btn-primary" disabled={creating || !templateId}>
            {creating ? 'Membuat…' : 'Buat undangan'} <ArrowRight size={14} />
          </button>
        </>
      }
    >
      <form id="create-invitation" onSubmit={submit} className="stack-4">
        <fieldset style={{ border: 0 }}>
          <legend className="form-label" style={{ marginBottom: 'var(--space-2)' }}>
            1. Pilih lisensi template Anda ({ownedTemplates.length} siap dipakai)
          </legend>
          <div className="stack-2">
            {ownedTemplates.map((tpl) => {
              const selected = templateId === tpl.id;
              const count = availableLicences.filter((l) => normalizeTemplateId(l.templateId) === tpl.id).length;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  aria-pressed={selected}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    width: '100%',
                    padding: '10px 12px',
                    textAlign: 'left',
                    border: `1px solid ${selected ? 'var(--brand)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    background: selected ? 'var(--brand-subtle)' : 'var(--surface)',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 'var(--radius-xs)',
                      background: tpl.palette.surface,
                      border: `1px solid ${tpl.palette.accent}55`,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 620 }}>
                      {tpl.name}
                    </span>
                    <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--ink-500)' }}>
                      {tpl.tagline}
                    </span>
                  </span>
                  <span className="badge badge-success" style={{ flexShrink: 0 }}>
                    {count > 1 ? `${count} Lisensi Aktif` : 'Lisensi Aktif'}
                  </span>
                  {selected && <Check size={16} style={{ color: 'var(--brand)', flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="create-groom">
              Mempelai pria <span className="req">*</span>
            </label>
            <input
              id="create-groom"
              className="form-input"
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
              placeholder="Raka"
              autoComplete="off"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="create-bride">
              Mempelai wanita <span className="req">*</span>
            </label>
            <input
              id="create-bride"
              className="form-input"
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              placeholder="Sinta"
              autoComplete="off"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="create-date">
            Tanggal acara
          </label>
          <input
            id="create-date"
            type="date"
            className="form-input"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
          <span className="form-hint">Bisa diubah kapan saja setelah undangan dibuat.</span>
        </div>

        {/* ----------------- Slug Tautan Publik & Live Collision Check ----------------- */}
        <div className="form-group">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <label className="form-label" htmlFor="create-slug" style={{ marginBottom: 0 }}>
              Slug tautan publik <span className="req">*</span>
            </label>
            {slugStatus === 'checking' && (
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-500)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Loader2 size={12} className="spin" /> Memeriksa tautan…
              </span>
            )}
            {slugStatus === 'available' && activeSlug && (
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--success-700, #177245)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={12} /> Tautan tersedia
              </span>
            )}
            {slugStatus === 'taken' && (
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--danger-600, #b42323)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <AlertCircle size={12} /> Tautan sudah digunakan
              </span>
            )}
          </div>

          <div className="input-icon-left" style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 'var(--text-2xs)', color: 'var(--ink-400)', pointerEvents: 'none', fontFamily: 'var(--font-mono)' }}>
              /invite/
            </span>
            <input
              id="create-slug"
              className={`form-input ${slugStatus === 'taken' ? 'border-danger-400' : ''}`}
              style={{
                paddingLeft: 'calc(var(--space-8) + var(--space-6) + var(--space-0-5))',
                fontFamily: 'var(--font-mono)',
                borderColor: slugStatus === 'taken' ? 'var(--danger-500, #b42323)' : slugStatus === 'available' ? 'var(--success-500, #22c55e)' : undefined,
              }}
              value={activeSlug}
              onChange={(e) => {
                setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, ''));
                setIsSlugCustomized(true);
              }}
              placeholder="nama-pasangan"
              required
            />
          </div>

          {/* Collision suggestions pill box */}
          {slugStatus === 'taken' && (
            <div
              style={{
                marginTop: 'var(--space-2)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--warn-50, #fdf8ed)',
                border: '1px solid var(--warn-200, #f3d9a4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--warn-700, #8a5a00)', fontWeight: 600, marginBottom: 6 }}>
                <Sparkles size={14} />
                <span>{conflictReason || 'Slug ini sudah dipakai. Gunakan rekomendasi tautan unik berikut:'}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {suggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => applySuggestion(sug)}
                    className="btn btn-xs"
                    style={{
                      background: 'white',
                      border: '1px solid var(--warn-300, #fbbf24)',
                      color: 'var(--ink-800)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    + Pakai {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          <span className="form-hint">
            Tautan ini adalah URL yang akan dibuka oleh tamu undangan Anda di WhatsApp.
          </span>
        </div>

        <div className="notice">
          <span>
            Tautan final: <code style={{ fontFamily: 'var(--font-mono)' }}>/invite/{activeSlug || 'nama-pasangan'}</code>{' '}
            {template ? `· Lisensi ${template.name} siap diaktifkan` : ''}
          </span>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
