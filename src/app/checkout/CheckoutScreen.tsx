'use client';

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Loader2,
  Lock,
  LogIn,
  QrCode,
  Smartphone,
  Upload,
  UserPlus,
} from 'lucide-react';
import { InvitationProvider, useInvitationStore } from '@/lib/invitationStore';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { MarketingNav } from '@/components/marketing/MarketingNav';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { TEMPLATES, formatIDR, getTemplate, normalizeTemplateId } from '@/lib/templates';
import { formatPaymentMethod, Order } from '@/lib/orders';
import { ordersApi } from '@/lib/api';
import { useAuth } from '@/lib/authContext';

type Method = 'qris' | 'bank-transfer' | 'ewallet';

const METHODS: Array<{ id: Method; label: string; hint: string; icon: typeof QrCode }> = [
  { id: 'qris', label: 'QRIS', hint: 'Scan dari semua e-wallet & mobile banking', icon: QrCode },
  { id: 'bank-transfer', label: 'Transfer bank', hint: 'BCA, Mandiri, BNI, BRI', icon: CreditCard },
  { id: 'ewallet', label: 'E-wallet', hint: 'GoPay, OVO, DANA, ShopeePay', icon: Smartphone },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    templates,
    invitations,
    purchase,
    licences,
    isLoaded,
    loadError,
    refreshOrdersAndLicences,
    markOrderStatus,
  } = useInvitationStore();

  const requestedTemplate = searchParams.get('template');
  const requestedInvitation = searchParams.get('undangan');

  const template = useMemo(() => {
    const cid = normalizeTemplateId(requestedTemplate);
    return templates.find((t) => t.id === cid) ?? getTemplate(requestedTemplate) ?? TEMPLATES[0];
  }, [requestedTemplate, templates]);

  // Default to '' (unbound license for a new invitation) unless ?undangan= is explicitly passed
  const [selectedInvitationId, setInvitationId] = useState<string | null>(null);
  const invitationId = selectedInvitationId ?? (requestedInvitation || '');
  const [method, setMethod] = useState<Method>('qris');
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [receipt, setReceipt] = useState<{
    order: Order;
    invitationId: string;
    status: 'paid' | 'pending' | 'verifying';
  } | null>(null);

  const invitation = invitationId ? invitations.find((i) => i.id === invitationId) : undefined;
  const alreadyOwnedBySelectedInvitation = Boolean(
    invitation && licences.some((l) => l.invitationId === invitation.id && l.templateId === template.id)
  );
  const unassignedCountForTemplate = licences.filter(
    (l) => normalizeTemplateId(l.templateId) === template.id && !l.invitationId
  ).length;

  const checkoutReturnUrl = `/checkout?template=${encodeURIComponent(template.id)}${
    requestedInvitation ? `&undangan=${encodeURIComponent(requestedInvitation)}` : ''
  }`;

  const handlePay = async () => {
    if (processing) return;
    setProcessing(true);
    const result = await purchase({
      templateId: template.id,
      invitationId: invitation ? invitation.id : undefined,
      method,
    });
    setProcessing(false);
    if (!result.ok) {
      toast('error', result.error);
      return;
    }
    setReceipt({ order: result.order, invitationId: invitation?.id || '', status: result.status });
    if (result.status === 'paid') {
      toast('success', 'Pembayaran berhasil. Lisensi diterbitkan.');
    } else if (result.status === 'pending') {
      toast('info', 'Pesanan dibuat. Selesaikan pembayaran lalu unggah bukti transfer.');
    }
  };

  const handleUploadProof = async () => {
    if (!receipt || !proofFile || uploading) return;
    setUploading(true);
    try {
      await ordersApi.submitPaymentProof(receipt.order.id, proofFile);
      markOrderStatus(receipt.order.id, 'payment_submitted');
      await refreshOrdersAndLicences();
      setReceipt({ ...receipt, status: 'verifying' });
      toast('success', 'Bukti pembayaran terkirim. Menunggu verifikasi admin.');
    } catch (err: unknown) {
      toast('error', err instanceof Error ? err.message : 'Bukti pembayaran gagal diunggah. Coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const handleCheckStatus = async () => {
    try {
      const latest = await refreshOrdersAndLicences();
      const order = latest.find((item) => item.id === receipt?.order.id);
      if (order && receipt) {
        setReceipt({
          ...receipt,
          order,
          status:
            order.status === 'paid'
              ? 'paid'
              : order.status === 'payment_submitted'
                ? 'verifying'
                : 'pending',
        });
      }
      toast('info', 'Status pesanan berhasil dimuat ulang.');
    } catch (error) {
      toast('error', error instanceof Error ? error.message : 'Status pesanan gagal dimuat.');
    }
  };

  if (authLoading || !isLoaded) {
    return (
      <div className="container-narrow" style={{ paddingBlock: 'var(--space-16)' }} role="status">
        Memuat checkout…
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="container-narrow" style={{ paddingBlock: 'var(--space-16)' }} role="alert">
        {loadError}
      </div>
    );
  }

  if (receipt && receipt.status !== 'paid') {
    return (
      <div className="container-narrow" style={{ paddingBlock: 'var(--space-16)' }}>
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <span className="badge badge-warning" style={{ marginBottom: 'var(--space-4)' }}>
            {receipt.status === 'pending' ? 'Menunggu pembayaran' : 'Menunggu verifikasi'}
          </span>
          <h1 style={{ fontSize: 'var(--text-2xl)' }}>
            {receipt.status === 'pending' ? 'Selesaikan pembayaran.' : 'Bukti pembayaran terkirim.'}
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
            {receipt.status === 'pending'
              ? `Bayar ${formatIDR(receipt.order.amount)} sesuai metode yang dipilih, lalu unggah bukti transfer di bawah. Lisensi ${template.name} aktif setelah bukti diverifikasi admin.`
              : 'Admin akan memverifikasi bukti pembayaran Anda. Lisensi aktif otomatis setelah disetujui — setelah aktif, Anda bisa langsung membuat undangan dari Katalog atau Konsol.'}
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
            <dt className="meta">Nomor pesanan</dt>
            <dd style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{receipt.order.reference}</dd>
            <dt className="meta">Template</dt>
            <dd>{template.name}</dd>
            <dt className="meta">Peruntukan</dt>
            <dd>{invitation ? invitation.title : 'Undangan baru (buat setelah lisensi aktif)'}</dd>
            <dt className="meta">Metode</dt>
            <dd>{formatPaymentMethod(receipt.order.method)}</dd>
            <dt className="meta">Nominal</dt>
            <dd className="numeric" style={{ fontWeight: 600 }}>{formatIDR(receipt.order.amount)}</dd>
          </dl>

          {receipt.status === 'pending' && (
            <div className="stack-3" style={{ margin: 'var(--space-5) 0' }}>
              <label className="btn btn-secondary" style={{ width: 'fit-content', cursor: 'pointer' }}>
                <Upload size={14} />
                {proofFile ? proofFile.name : 'Pilih bukti transfer (JPG/PNG/WebP, maks 5 MB)'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={(e) => {
                    setProofFile(e.target.files?.[0] ?? null);
                    e.target.value = '';
                  }}
                />
              </label>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: 'fit-content' }}
                disabled={!proofFile || uploading}
                onClick={handleUploadProof}
              >
                {uploading ? <Loader2 size={14} className="spin" /> : <Upload size={14} />}
                {uploading ? 'Mengunggah…' : 'Kirim bukti pembayaran'}
              </button>
            </div>
          )}

          <div className="row" style={{ gap: 'var(--space-2)' }}>
            <Link href="/dashboard/orders" className="btn btn-primary">
              Lihat status pesanan <ArrowRight size={14} />
            </Link>
            <button type="button" className="btn btn-secondary" onClick={handleCheckStatus}>
              Cek status terbaru
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            {receipt.invitationId
              ? `${template.name} sekarang terikat permanen pada undangan Anda.`
              : `Lisensi ${template.name} telah aktif di akun Anda. Sekarang Anda bisa langsung membuat undangan dengan template ini.`}
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
            <dd style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{receipt.order.reference}</dd>
            <dt className="meta">Template</dt>
            <dd>{template.name}</dd>
            <dt className="meta">Peruntukan</dt>
            <dd>{invitation ? invitation.title : 'Siap dipakai untuk undangan baru'}</dd>
            <dt className="meta">Metode</dt>
            <dd>{formatPaymentMethod(method)}</dd>
            <dt className="meta">Dibayar</dt>
            <dd className="numeric" style={{ fontWeight: 600 }}>
              {formatIDR(template.price)}
            </dd>
          </dl>

          <div className="row" style={{ gap: 'var(--space-2)' }}>
            {receipt.invitationId ? (
              <Link href={`/dashboard/undangan/${receipt.invitationId}/content`} className="btn btn-primary">
                Kelola undangan <ArrowRight size={14} />
              </Link>
            ) : (
              <Link href="/dashboard" className="btn btn-primary">
                Buat undangan di Konsol <ArrowRight size={14} />
              </Link>
            )}
            <Link href="/katalog" className="btn btn-secondary">
              Kembali ke katalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-10)' }}>
      <Link
        href="/katalog"
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
            Satu pembayaran untuk satu lisensi undangan permanen. Setelah pembayaran diverifikasi, Anda dapat
            langsung membuat dan mempublikasikan undangan pernikahan Anda.
          </p>

          {!isAuthenticated ? (
            <div className="card stack-4" style={{ marginTop: 'var(--space-6)', padding: 'var(--space-6)' }}>
              <div>
                <h2 style={{ fontSize: 'var(--text-lg)' }}>Masuk atau buat akun terlebih dahulu</h2>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-600)', marginTop: 4 }}>
                  Lisensi <strong>{template.name}</strong> akan disimpan di akun Anda agar Anda bisa membuat dan
                  mengedit undangan kapan saja.
                </p>
              </div>
              <div className="row" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <Link
                  href={`/login?redirect=${encodeURIComponent(checkoutReturnUrl)}`}
                  className="btn btn-primary"
                >
                  <LogIn size={15} /> Masuk ke Akun
                </Link>
                <Link
                  href={`/register?redirect=${encodeURIComponent(checkoutReturnUrl)}`}
                  className="btn btn-secondary"
                >
                  <UserPlus size={15} /> Daftar Akun Baru
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 'var(--space-6)' }} className="stack-4">
              {unassignedCountForTemplate > 0 && (
                <div className="notice">
                  <Check size={14} />
                  <span>
                    Anda sudah memiliki <strong>{unassignedCountForTemplate} lisensi aktif</strong> untuk template ini
                    yang belum dipakai.{' '}
                    <Link href="/katalog" style={{ fontWeight: 600 }}>
                      Buat undangan sekarang
                    </Link>{' '}
                    atau lanjutkan jika ingin membeli lisensi tambahan.
                  </span>
                </div>
              )}

              {invitations.length > 0 && (
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-invitation">
                    Peruntukan lisensi
                  </label>
                  <select
                    id="checkout-invitation"
                    className="form-select"
                    value={invitationId}
                    onChange={(e) => setInvitationId(e.target.value)}
                  >
                    <option value="">Undangan baru (buat setelah pembelian)</option>
                    {invitations.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        Tautkan ke undangan: {inv.title} · /invite/{inv.slug}
                      </option>
                    ))}
                  </select>
                  <span className="form-hint">
                    Pilih &ldquo;Undangan baru&rdquo; untuk membeli template terlebih dahulu lalu mengisi data
                    mempelai setelahnya.
                  </span>
                </div>
              )}

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
                  Pembayaran diverifikasi manual: setelah memesan, unggah bukti transfer. Lisensi aktif setelah admin
                  memverifikasi, lalu Anda dapat langsung membuat undangan.
                </span>
              </div>
            </div>
          )}
        </div>

        <aside
          className="card"
          style={{ padding: 'var(--space-5)', position: 'sticky', top: 'calc(var(--nav-h) + var(--space-4))' }}
        >
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

          {isAuthenticated ? (
            <button
              type="button"
              className="btn btn-buy btn-block btn-lg"
              style={{ marginTop: 'var(--space-4)' }}
              onClick={handlePay}
              disabled={processing || alreadyOwnedBySelectedInvitation}
            >
              {alreadyOwnedBySelectedInvitation
                ? 'Sudah dimiliki undangan ini'
                : processing
                  ? 'Memproses…'
                  : `Buat pesanan ${formatIDR(template.price)}`}
            </button>
          ) : (
            <Link
              href={`/login?redirect=${encodeURIComponent(checkoutReturnUrl)}`}
              className="btn btn-buy btn-block btn-lg"
              style={{ marginTop: 'var(--space-4)' }}
            >
              Masuk untuk membeli
            </Link>
          )}

          <p className="meta" style={{ marginTop: 'var(--space-3)', textAlign: 'center' }}>
            Tidak ada langganan. Tidak ada penagihan otomatis.
          </p>

          {alreadyOwnedBySelectedInvitation && (
            <p className="form-hint" style={{ marginTop: 'var(--space-2)', textAlign: 'center' }}>
              Undangan ini sudah punya lisensi {template.name}. Pilih &ldquo;Undangan baru&rdquo; untuk membeli
              lisensi tambahan.
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
            <Suspense
              fallback={
                <div className="container" style={{ paddingBlock: 'var(--space-16)' }}>
                  Memuat keranjang…
                </div>
              }
            >
              <CheckoutContent />
            </Suspense>
          </main>
          <MarketingFooter />
        </div>
      </InvitationProvider>
    </ToastProvider>
  );
}
