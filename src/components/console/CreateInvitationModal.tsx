'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, AlertCircle, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
import { TEMPLATES, formatIDR, getTemplate } from '@/lib/templates';
import { invitationsApi } from '@/lib/api';

interface Props {
  open: boolean;
  onClose: () => void;
  /** Preselect when the user arrived from a template card. */
  initialTemplateId?: string;
}

export function CreateInvitationModal({ open, onClose, initialTemplateId }: Props) {
  const router = useRouter();
  const { createInvitation } = useInvitationStore();
  const toast = useToast();

  const [templateId, setTemplateId] = useState(initialTemplateId ?? TEMPLATES[0].id);
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Slug check states
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [conflictReason, setConflictReason] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const template = getTemplate(templateId);

  // Auto-generate slug candidate when names change if user hasn't manually customized
  const defaultSlug = useMemo(() => {
    const raw = `${groomName}-${brideName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return raw || '';
  }, [groomName, brideName]);

  const activeSlug = isSlugCustomized ? customSlug : defaultSlug;

  // Real-time debounced slug availability checker
  useEffect(() => {
    if (!activeSlug || activeSlug.trim().length === 0) {
      setSlugStatus('idle');
      setSuggestions([]);
      setConflictReason('');
      return;
    }

    setSlugStatus('checking');
    const timer = setTimeout(() => {
      invitationsApi
        .checkSlug(activeSlug)
        .then((res) => {
          if (res) {
            if (res.available) {
              setSlugStatus('available');
              setSuggestions([]);
              setConflictReason('');
            } else {
              setSlugStatus('taken');
              setConflictReason(res.reason || 'Slug sudah digunakan oleh undangan lain.');
              setSuggestions(res.suggestions || []);
            }
          }
        })
        .catch(() => {
          setSlugStatus('available');
        });
    }, 350);

    return () => clearTimeout(timer);
  }, [activeSlug]);

  const applySuggestion = (sug: string) => {
    setCustomSlug(sug);
    setIsSlugCustomized(true);
    setSlugStatus('available');
    setSuggestions([]);
    setConflictReason('');
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
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

    const created = createInvitation({
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
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Undangan baru"
      description="Mulai dari desain, lalu isi detailnya. Anda tidak ditagih sampai undangan dipublikasikan."
      size="md"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button type="submit" form="create-invitation" className="btn btn-primary">
            Buat undangan <ArrowRight size={14} />
          </button>
        </>
      }
    >
      <form id="create-invitation" onSubmit={submit} className="stack-4">
        <fieldset style={{ border: 0 }}>
          <legend className="form-label" style={{ marginBottom: 'var(--space-2)' }}>
            1. Desain template
          </legend>
          <div className="stack-2">
            {TEMPLATES.map((tpl) => {
              const selected = templateId === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplateId(tpl.id)}
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
                  <span className="price-note" style={{ fontWeight: 600, color: 'var(--ink-900)' }}>
                    {formatIDR(tpl.price)}
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
            {template && template.price > 0 ? `· ${formatIDR(template.price)} saat dipublikasikan` : '· gratis'}
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
