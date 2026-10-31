'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
import { TEMPLATES, formatIDR, getTemplate } from '@/lib/templates';

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
  const [error, setError] = useState<string | null>(null);

  const template = getTemplate(templateId);
  const slugPreview = useMemo(() => {
    const raw = `${groomName}-${brideName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return raw || 'nama-pasangan';
  }, [groomName, brideName]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!groomName.trim() || !brideName.trim()) {
      setError('Isi nama panggilan kedua mempelai.');
      return;
    }
    setError(null);

    const created = createInvitation({
      title: `${groomName.trim()} & ${brideName.trim()}`,
      slug: slugPreview,
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

        <div className="notice">
          <span>
            Tautan undangan: <code style={{ fontFamily: 'var(--font-mono)' }}>/invite/{slugPreview}</code>{' '}
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
