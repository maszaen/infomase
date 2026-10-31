'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Receipt, ShoppingBag, Wallet } from 'lucide-react';
import { ConsolePageHeader } from '@/components/console/ConsolePageHeader';
import { useInvitationStore } from '@/lib/invitationStore';
import { formatIDR, getTemplate } from '@/lib/templates';
import { formatOrderDate, formatOrderStatus, formatPaymentMethod } from '@/lib/orders';

export default function OrdersPage() {
  const { orders, licences } = useInvitationStore();

  const totalPaid = orders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.amount, 0);

  return (
    <>
      <ConsolePageHeader
        title="Pesanan & lisensi"
        description="Setiap pembelian memberi lisensi permanen untuk satu undangan"
        actions={
          <Link href="/dashboard/katalog" className="btn btn-sm btn-secondary">
            Katalog template
          </Link>
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
            <span className="stat-card-desc">Termasuk template gratis</span>
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
              <Link href="/dashboard/katalog" className="btn btn-sm btn-primary">
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
                        <span className={`badge ${order.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                          {formatOrderStatus(order.status)}
                        </span>
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
                        Diterbitkan {formatOrderDate(licence.issuedAt)} · permanen
                      </div>
                    </div>
                    <div className="record-actions">
                      <Link
                        href={`/dashboard/undangan/${licence.invitationId}/design`}
                        className="btn btn-sm btn-secondary"
                      >
                        Kelola
                      </Link>
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
