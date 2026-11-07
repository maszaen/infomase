'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Loader2, Receipt, RefreshCw, ShoppingBag, Upload, Wallet } from 'lucide-react';
import { ConsolePageHeader } from '@/components/console/ConsolePageHeader';
import { useConsoleChrome } from '@/components/console/ConsoleChrome';
import { useInvitationStore } from '@/lib/invitationStore';
import { useToast } from '@/components/ui/Toast';
import { formatIDR, getTemplate } from '@/lib/templates';
import { formatOrderDate, formatOrderStatus, formatPaymentMethod } from '@/lib/orders';
import { ordersApi } from '@/lib/api';

export default function OrdersPage() {
  const { orders, licences, refreshOrdersAndLicences, markOrderStatus } = useInvitationStore();
  const { openCreate } = useConsoleChrome();
  const toast = useToast();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const totalPaid = orders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.amount, 0);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshOrdersAndLicences();
      toast('info', 'Pesanan dan lisensi dimuat ulang dari server.');
    } catch (error) {
      toast('error', error instanceof Error ? error.message : 'Status pesanan gagal dimuat.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleProof = async (orderId: string, file: File) => {
    setUploadingId(orderId);
    try {
      await ordersApi.submitPaymentProof(orderId, file);
      markOrderStatus(orderId, 'payment_submitted');
      await refreshOrdersAndLicences();
      toast('success', 'Bukti pembayaran terkirim. Menunggu verifikasi admin.');
    } catch (err: unknown) {
      toast('error', err instanceof Error ? err.message : 'Bukti pembayaran gagal diunggah.');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <>
      <ConsolePageHeader
        title="Pesanan & lisensi"
        description="Setiap pembelian memberi lisensi permanen untuk satu undangan"
        actions={
          <>
            <button type="button" className="btn btn-sm btn-ghost" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw size={13} className={refreshing ? 'spin' : undefined} />
              <span className="btn-label">Muat ulang</span>
            </button>
            <Link href="/katalog" className="btn btn-sm btn-secondary">
              Beli template
            </Link>
          </>
        }
      />

      <div className="page-content stack-6">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="row-nowrap" style={{ gap: 8, marginBottom: 4 }}>
              <span className="stat-icon" style={{ width: 24, height: 24 }}>
                <BadgeCheck size={14} />
              </span>
              <span className="stat-card-label">Lisensi aktif</span>
            </div>
            <span className="stat-card-value">{licences.length}</span>
            <span className="stat-card-desc">Tanpa tanggal kedaluwarsa</span>
          </div>
          <div className="stat-card">
            <div className="row-nowrap" style={{ gap: 8, marginBottom: 4 }}>
              <span className="stat-icon" style={{ width: 24, height: 24 }}>
                <Wallet size={14} />
              </span>
              <span className="stat-card-label">Total dibayar</span>
            </div>
            <span className="stat-card-value" style={{ fontSize: 'var(--text-lg)' }}>
              {formatIDR(totalPaid)}
            </span>
            <span className="stat-card-desc">Total pembayaran lunas</span>
          </div>
          <div className="stat-card">
            <div className="row-nowrap" style={{ gap: 8, marginBottom: 4 }}>
              <span className="stat-icon" style={{ width: 24, height: 24 }}>
                <ShoppingBag size={14} />
              </span>
              <span className="stat-card-label">Total pesanan</span>
            </div>
            <span className="stat-card-value">{orders.length}</span>
            <span className="stat-card-desc">Semua status</span>
          </div>
        </div>

        <section className="page-section">
          <div className="section-bar">
            <div>
              <h2>Riwayat pesanan</h2>
              <p>Nomor referensi dipakai saat menghubungi dukungan.</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state card">
              <Receipt size={24} />
              <h3>Belum ada pesanan</h3>
              <p>Pembelian template akan muncul di sini lengkap dengan nomor referensi.</p>
              <Link href="/katalog" className="btn btn-sm btn-primary">
                Lihat katalog <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Referensi</th>
                    <th className="col-md">Undangan</th>
                    <th className="col-md">Template</th>
                    <th className="col-md">Metode</th>
                    <th className="col-sm">Tanggal</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }}>
                        {order.reference}
                      </td>
                      <td className="col-md">{order.invitationTitle}</td>
                      <td className="col-md">{getTemplate(order.templateId)?.name ?? order.templateId}</td>
                      <td className="col-md">{formatPaymentMethod(order.method)}</td>
                      <td className="col-sm">{formatOrderDate(order.paidAt ?? order.createdAt)}</td>
                      <td>
                        <span className={`badge ${order.status === 'paid' ? 'badge-success' : order.status === 'payment_submitted' ? 'badge-blue' : 'badge-warning'}`}>
                          {formatOrderStatus(order.status)}
                        </span>
                        {order.status === 'pending' && (
                          <label className="btn btn-xs btn-secondary" style={{ marginLeft: 6, cursor: 'pointer' }}>
                            {uploadingId === order.id ? <Loader2 size={11} className="spin" /> : <Upload size={11} />}
                            <span className="btn-label">Bukti</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              hidden
                              disabled={uploadingId === order.id}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleProof(order.id, file);
                                e.target.value = '';
                              }}
                            />
                          </label>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }} className="numeric">
                        {formatIDR(order.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="page-section">
          <div className="section-bar">
            <h2>Lisensi</h2>
            <span className="badge">{licences.length} aktif</span>
          </div>
          {licences.length === 0 ? (
            <div className="notice">
              <BadgeCheck size={15} />
              <span>Lisensi muncul setelah Anda membeli template untuk sebuah undangan.</span>
            </div>
          ) : (
            <div className="record-list">
              {licences.map((licence) => {
                const template = getTemplate(licence.templateId);
                return (
                  <div key={licence.id} className="card record">
                    <img src={template?.previewImage ?? ''} alt="" className="thumb thumb-portrait" />
                    <div className="record-main">
                      <div className="record-title-row">
                        <span className="record-title" style={{ cursor: 'default' }}>
                          {template?.name ?? licence.templateId}
                        </span>
                        <span className="badge badge-success">
                          <BadgeCheck size={11} /> Permanen
                        </span>
                      </div>
                      <div className="record-meta">
                        Diterbitkan {formatOrderDate(licence.issuedAt)} ·{' '}
                        {licence.invitationId
                          ? licence.invitationTitle || `Terhubung ke undangan`
                          : 'Siap dipakai untuk undangan baru'}
                      </div>
                    </div>
                    <div className="record-actions">
                      {licence.invitationId ? (
                        <Link
                          href={`/dashboard/undangan/${licence.invitationId}/content`}
                          className="btn btn-sm btn-secondary"
                        >
                          Kelola undangan
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => openCreate(licence.templateId)}
                        >
                          Buat undangan <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
