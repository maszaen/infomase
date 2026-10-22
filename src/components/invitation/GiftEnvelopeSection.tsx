'use client';

import React, { useState } from 'react';
import { Gift, CreditCard, Copy, Check, QrCode, MapPin } from 'lucide-react';
import { InvitationData } from '@/types/invitation';

interface GiftEnvelopeSectionProps {
  data: InvitationData;
}

export const GiftEnvelopeSection: React.FC<GiftEnvelopeSectionProps> = ({ data }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQRIS, setShowQRIS] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <section id="amplop" style={{ padding: '36px 16px', textAlign: 'center' }}>
      <div style={{ marginBottom: 24 }}>
        <span
          style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--inv-accent)',
            fontWeight: 700,
          }}
        >
          Tanda Kasih
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.9rem',
            color: 'var(--inv-primary)',
            marginTop: 4,
          }}
        >
          Amplop Digital
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--inv-text-muted)', marginTop: 4, maxWidth: 300, marginInline: 'auto' }}>
          Doa restu Anda merupakan karunia terindah bagi kami. Bagi Anda yang ingin memberi tanda kasih, dapat mengirimkan melalui:
        </p>
      </div>

      {/* Bank Account Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 340, margin: '0 auto' }}>
        {data.bankAccounts.map((account) => {
          const isCopied = copiedId === account.id;

          return (
            <div
              key={account.id}
              style={{
                background: 'var(--inv-card)',
                border: '1px solid var(--inv-border)',
                borderRadius: 20,
                padding: '20px',
                textAlign: 'left',
                boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--inv-primary)',
                    background: 'rgba(212, 175, 55, 0.12)',
                    padding: '4px 10px',
                    borderRadius: 999,
                  }}
                >
                  {account.bankName}
                </span>
                <CreditCard size={18} color="var(--inv-accent)" />
              </div>

              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--inv-text-muted)', display: 'block' }}>
                  Nomor Rekening
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: 'var(--inv-text)',
                  }}
                >
                  {account.accountNumber}
                </span>
              </div>

              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--inv-text-muted)', display: 'block' }}>
                  Atas Nama
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--inv-text)' }}>
                  {account.accountHolder}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleCopy(account.accountNumber, account.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 999,
                    border: '1px solid var(--inv-border)',
                    background: isCopied ? '#10b981' : 'var(--inv-primary)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  {isCopied ? 'Tersalin!' : 'Salin Rekening'}
                </button>

                {account.qrisUrl && (
                  <button
                    onClick={() => setShowQRIS(showQRIS === account.id ? null : account.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      padding: '8px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      borderRadius: 999,
                      border: '1px solid var(--inv-border)',
                      background: 'rgba(0,0,0,0.04)',
                      color: 'var(--inv-text)',
                      cursor: 'pointer',
                    }}
                  >
                    <QrCode size={14} />
                    QRIS
                  </button>
                )}
              </div>

              {/* Show QRIS toggle */}
              {showQRIS === account.id && account.qrisUrl && (
                <div style={{ marginTop: 16, textAlign: 'center', padding: 12, background: '#fff', borderRadius: 12 }}>
                  <img src={account.qrisUrl} alt="QRIS Code" style={{ width: 180, height: 180, margin: '0 auto', display: 'block' }} />
                  <span style={{ fontSize: '0.72rem', color: '#333', marginTop: 6, display: 'block' }}>
                    Scan QRIS melalui GoPay, OVO, Dana, BCA, dll.
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Physical Gift Delivery Address */}
        {data.giftAddress && (
          <div
            style={{
              background: 'var(--inv-card)',
              border: '1px solid var(--inv-border)',
              borderRadius: 20,
              padding: '20px',
              textAlign: 'left',
              boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <MapPin size={18} color="var(--inv-accent)" />
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--inv-primary)' }}>
                Kirim Kado Fisik
              </h4>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--inv-text)', lineHeight: 1.5, marginBottom: 8 }}>
              {data.giftAddress.recipientName} ({data.giftAddress.phone})
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--inv-text-muted)', lineHeight: 1.4, marginBottom: 14 }}>
              {data.giftAddress.fullAddress}
            </p>

            <button
              onClick={() => handleCopy(`${data.giftAddress?.recipientName} - ${data.giftAddress?.phone}\n${data.giftAddress?.fullAddress}`, 'addr')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: 999,
                border: '1px solid var(--inv-border)',
                background: copiedId === 'addr' ? '#10b981' : 'rgba(0,0,0,0.04)',
                color: copiedId === 'addr' ? '#ffffff' : 'var(--inv-text)',
                cursor: 'pointer',
              }}
            >
              {copiedId === 'addr' ? <Check size={14} /> : <Copy size={14} />}
              {copiedId === 'addr' ? 'Alamat Tersalin!' : 'Salin Alamat Lengkap'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
