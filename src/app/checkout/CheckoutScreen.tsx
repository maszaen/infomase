'use client';

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, CreditCard, Lock, QrCode, Smartphone } from 'lucide-react';
import { InvitationProvider, useInvitationStore } from '@/lib/invitationStore';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { MarketingNav } from '@/components/marketing/MarketingNav';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { TEMPLATES, formatIDR, getTemplate } from '@/lib/templates';
import { formatPaymentMethod } from '@/lib/orders';

type Method = 'qris' | 'bank-transfer' | 'ewallet';

const METHODS: Array<{ id: Method; label: string; hint: string; icon: typeof QrCode }> = [
  { id: 'qris', label: 'QRIS', hint: 'Scan dari semua e-wallet & mobile banking', icon: QrCode },
  { id: 'bank-transfer', label: 'Transfer bank', hint: 'BCA, Mandiri, BNI, BRI', icon: CreditCard },
  { id: 'ewallet', label: 'E-wallet', hint: 'GoPay, OVO, DANA, ShopeePay', icon: Smartphone },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { invitations, purchase, licences, data } = useInvitationStore();

  const requestedTemplate = searchParams.get('template');
  const requestedInvitation = searchParams.get('undangan');

  const template = useMemo(
    () => getTemplate(requestedTemplate) ?? TEMPLATES[0],
    [requestedTemplate]
  );

  const [invitationId, setInvitationId] = useState(
    requestedInvitation && invitations.some((i) => i.id === requestedInvitation)
      ? requestedInvitation
      : data.id
  );
  const [method, setMethod] = useState<Method>('qris');
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<{ reference: string; invitationId: string } | null>(null);

  const invitation = invitations.find((i) => i.id === invitationId) ?? invitations[0];
  const alreadyOwned = licences.some(
    (l) => l.invitationId === invitation?.id && l.templateId === template.id
  );

  const handlePay = () => {
    if (!invitation) return;
    setProcessing(true);
    // Simulated gateway round-trip; swap for a real redirect later.
    window.setTimeout(() => {
      const result = purchase({ templateId: template.id, invitationId: invitation.id, method });
      setProcessing(false);
      if (!result) {
        toast('error', 'Pembayaran gagal. Coba lagi.');
        return;
      }
      setReceipt({ reference: result.order.reference, invitationId: invitation.id });
      toast('success', 'Pembayaran berhasil. Lisensi diterbitkan.');
    }, 900);
  };

  if (receipt) {
    return (
      <div className="container-narrow" style={{ paddingBlock: 'var(--space-16)' }}>
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'var(--success-bg)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-4)',
            }}
          >
            <Check size={24} />
          </div>

          <h1 style={{ fontSize: 'var(--text-2xl)' }}>Lisensi aktif.</h1>
          <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
            {template.name} sekarang terikat permanen pada undangan Anda. Tidak ada tanggal berakhir dan
            tidak ada tagihan berulang.
          </p>

          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 'var(--space-2) var(--space-5)',
              margin: 'var(--space-5) 0',
              fontSize: 'var(--text-sm)',
            }}
          >
            <dt className="meta">Nomor referensi</dt>
            <dd style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{receipt.reference}</dd>
            <dt className="meta">Template</dt>
            <dd>{template.name}</dd>
            <dt className="meta">Undangan</dt>
            <dd>{invitation?.title}</dd>
            <dt className="meta">Metode</dt>
            <dd>{formatPaymentMethod(method)}</dd>
            <dt className="meta">Dibayar</dt>
            <dd className="numeric" style={{ fontWeight: 600 }}>
              {formatIDR(template.price)}
            </dd>
          </dl>

          <div className="row" style={{ gap: 'var(--space-2)' }}>
            <Link href={`/dashboard/undangan/${receipt.invitationId}/design`} className="btn btn-primary">
              Kelola undangan <ArrowRight size={14} />
            </Link>
            <Link href="/dashboard/orders" className="btn btn-secondary">
              Lihat semua pesanan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-10)' }}>
      <Link
        href="/#template"
        className="btn btn-sm btn-ghost"
        style={{ marginBottom: 'var(--space-4)', marginLeft: -10 }}
      >
        <ArrowLeft size={14} /> Kembali ke katalog
      </Link>

      <div className="split" style={{ gap: 'var(--space-8)', alignItems: 'start' }}>
        <div>
          <span className="eyebrow">Checkout</span>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
            Beli {template.name}
          </h1>
          <p style={{ fontSize: 'var(--text-sm)' }}>
            Satu pembayaran untuk satu undangan. Setelah ini, desain tersebut menjadi milik acara Anda secara
            permanen.
          </p>

          <div style={{ marginTop: 'var(--space-6)' }} className="stack-4">
            <div className="form-group">
              <label className="form-label" htmlFor="checkout-invitation">
                Undangan yang menerima lisensi
              </label>
              <select
                id="checkout-invitation"
                className="form-select"
                value={invitationId}
                onChange={(e) => setInvitationId(e.target.value)}
              >
                {invitations.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.title} · /invite/{inv.slug}
                  </option>
                ))}
              </select>
              <span className="form-hint">
                Lisensi melekat pada undangan, bukan pada akun. Anda bisa membuat undangan lain nanti.
              </span>
            </div>

            <fieldset style={{ border: 0 }}>
              <legend className="form-label" style={{ marginBottom: 'var(--space-2)' }}>
                Metode pembayaran
              </legend>
              <div className="stack-2">
                {METHODS.map((item) => {
                  const Icon = item.icon;
                  const selected = method === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMethod(item.id)}
                      aria-pressed={selected}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        padding: '10px 12px',
                        textAlign: 'left',
                        border: `1px solid ${selected ? 'var(--brand)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-md)',
                        background: selected ? 'var(--brand-subtle)' : 'var(--surface)',
                        cursor: 'pointer',
                      }}
                    >
                      <Icon size={17} style={{ color: selected ? 'var(--brand)' : 'var(--ink-500)' }} />
                      <span style={{ flex: 1 }}>
                        <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                          {item.label}
                        </span>
                        <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--ink-500)' }}>
                          {item.hint}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          border: `1px solid ${selected ? 'var(--brand)' : 'var(--border-strong)'}`,
                          background: selected ? 'var(--brand)' : 'transparent',
                          boxShadow: selected ? 'inset 0 0 0 3px var(--brand-subtle)' : 'none',
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="notice">
              <Lock size={14} />
              <span>
                Ini lingkungan demo: tidak ada uang yang benar-benar ditarik. Struktur data pesanan dan lisensi
                sama dengan alur produksi.
              </span>
            </div>
          </div>
        </div>

        <aside className="card" style={{ padding: 'var(--space-5)', position: 'sticky', top: 'calc(var(--nav-h) + var(--space-4))' }}>
          <h2 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-3)' }}>Ringkasan</h2>

          <div className="row-nowrap" style={{ gap: 'var(--space-3)', alignItems: 'flex-start' }}>
            <img
              src={template.previewImage}
              alt=""
              width={64}
              height={64}
              style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 620 }}>{template.name}</div>
              <div className="meta">{template.category}</div>
            </div>
          </div>

          <div className="divider" style={{ margin: 'var(--space-4) 0' }} />

          <div className="stack-2" style={{ fontSize: 'var(--text-sm)' }}>
            <div className="row-between">
              <span style={{ color: 'var(--ink-600)' }}>Harga template</span>
              <span className="numeric">{formatIDR(template.price)}</span>
            </div>
            <div className="row-between">
              <span style={{ color: 'var(--ink-600)' }}>Biaya layanan</span>
              <span className="numeric">Rp 0</span>
            </div>
            <div className="row-between">
              <span style={{ color: 'var(--ink-600)' }}>Lisensi</span>
              <span>Permanen · 1 undangan</span>
            </div>
          </div>

          <div className="divider" style={{ margin: 'var(--space-4) 0' }} />

          <div className="row-between">
            <span style={{ fontWeight: 620 }}>Total</span>
            <span className="numeric" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
              {formatIDR(template.price)}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-buy btn-block btn-lg"
            style={{ marginTop: 'var(--space-4)' }}
            onClick={handlePay}
            disabled={processing || alreadyOwned || !invitation}
          >
            {alreadyOwned
              ? 'Sudah dimiliki undangan ini'
              : processing
                ? 'Memproses…'
                : template.price === 0
                  ? 'Aktifkan lisensi gratis'
                  : `Bayar ${formatIDR(template.price)}`}
          </button>

          <p className="meta" style={{ marginTop: 'var(--space-3)', textAlign: 'center' }}>
            Tidak ada langganan. Tidak ada penagihan otomatis.
          </p>

          {alreadyOwned && (
            <p className="form-hint" style={{ marginTop: 'var(--space-2)', textAlign: 'center' }}>
              Undangan ini sudah punya lisensi {template.name}. Pilih undangan lain untuk membeli.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ToastProvider>
      <InvitationProvider>
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
          <MarketingNav />
          <main id="konten" style={{ flex: 1 }}>
            <Suspense fallback={<div className="container" style={{ paddingBlock: 'var(--space-16)' }}>Memuat keranjang…</div>}>
              <CheckoutContent />
            </Suspense>
          </main>
          <MarketingFooter />
        </div>
      </InvitationProvider>
    </ToastProvider>
  );
}
