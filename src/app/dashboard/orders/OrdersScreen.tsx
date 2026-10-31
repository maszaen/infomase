'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Receipt } from 'lucide-react';
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
            <span className="stat-card-label">Lisensi aktif</span>
            <span className="stat-card-value">{licences.length}</span>
            <span className="stat-card-desc">Tanpa tanggal kedaluwarsa</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">Total pembayaran</span>
            <span className="stat-card-value" style={{ fontSize: 'var(--text-xl)' }}>
              {formatIDR(totalPaid)}
            </span>
            <span className="stat-card-desc">Termasuk template gratis</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">Undangan bisa tayang</span>
            <span className="stat-card-value">{licences.length}</span>
            <span className="stat-card-desc">Tanpa perpanjangan</span>
          </div>
        </div>

        <section>
          <h2 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-3)' }}>Riwayat pesanan</h2>

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
                    <th>Undangan</th>
                    <th>Template</th>
                    <th>Metode</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }}>{order.reference}</td>
                      <td>{order.invitationTitle}</td>
                      <td>{getTemplate(order.templateId)?.name ?? order.templateId}</td>
                      <td>{formatPaymentMethod(order.method)}</td>
                      <td>{formatOrderDate(order.paidAt ?? order.createdAt)}</td>
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

        <section>
          <h2 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-3)' }}>Lisensi</h2>
          {licences.length === 0 ? (
            <div className="notice">
              <BadgeCheck size={15} />
              <span>Lisensi muncul setelah Anda membeli template untuk sebuah undangan.</span>
            </div>
          ) : (
            <div className="stack-2">
              {licences.map((licence) => (
                <div
                  key={licence.id}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-4)',
                    flexWrap: 'wrap',
                  }}
                >
                  <BadgeCheck size={17} style={{ color: 'var(--success)' }} />
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 620 }}>
                      {getTemplate(licence.templateId)?.name ?? licence.templateId}
                    </div>
                    <div className="meta">
                      Diterbitkan {formatOrderDate(licence.issuedAt)} · berlaku permanen
                    </div>
                  </div>
                  <span className="badge badge-success">Permanen</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
