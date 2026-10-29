'use client';

import React, { useState } from 'react';
import { InvitationData } from '@/types/invitation';

interface GiftEnvelopeSectionProps {
  data: InvitationData;
}

export const GiftEnvelopeSection: React.FC<GiftEnvelopeSectionProps> = ({ data }) => {
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMap((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedMap((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    }).catch(() => {
      alert('Nomor rekening: ' + text);
    });
  };

  const defaultAccounts = [
    {
      id: 'bca',
      bankName: 'BANK BCA',
      accountNumber: '1234567890',
      formattedNumber: '1234 5678 90',
      accountHolder: 'Raka Pratama',
      textColor: 'text-blue-800',
      revealClass: 'reveal-left delay-100',
    },
    {
      id: 'mandiri',
      bankName: 'BANK MANDIRI',
      accountNumber: '0987654321',
      formattedNumber: '0987 6543 21',
      accountHolder: 'Sinta Maharani',
      textColor: 'text-amber-700',
      revealClass: 'reveal-right delay-200',
    },
  ];

  const bankList = (data.bankAccounts && data.bankAccounts.length >= 2)
    ? data.bankAccounts.map((acc, idx) => ({
        id: acc.id || String(idx),
        bankName: acc.bankName,
        accountNumber: acc.accountNumber,
        formattedNumber: acc.accountNumber.replace(/(\d{4})(?=\d)/g, '$1 '),
        accountHolder: acc.accountHolder,
        textColor: acc.bankName.includes('BCA') ? 'text-blue-800' : 'text-amber-700',
        revealClass: idx % 2 === 0 ? 'reveal-left delay-100' : 'reveal-right delay-200',
      }))
    : defaultAccounts;

  const physicalAddress = data.giftAddress?.fullAddress
    ? `${data.giftAddress.fullAddress} (u.p ${data.giftAddress.recipientName || 'Raka & Sinta'})`
    : 'Jl. Melati No. 12, Kotabaru, Kec. Gondokusuman, Kota Yogyakarta (u.p Raka & Sinta)';

  return (
    <section className="py-8 px-6">
      <div className="paper-card rounded-3xl p-6 text-center relative overflow-hidden reveal">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C735B] font-semibold block mb-1">
          WEDDING GIFT
        </span>
        <h3 className="font-serif text-2xl text-[#382E25] font-semibold mb-2">
          Tanda Kasih
        </h3>
        <p className="text-xs text-[#786755] leading-relaxed mb-6">
          Doa restu Anda merupakan karunia terindah bagi kami. Namun jika memberi adalah tanda kasih Anda, kami menyediakan dompet digital berikut:
        </p>

        {/* Bank Cards */}
        {bankList.map((card) => {
          const isCopied = !!copiedMap[card.id];

          return (
            <div
              key={card.id}
              className={`p-4 rounded-2xl bg-white/90 border border-[#D5C6B1]/70 mb-4 shadow-xs text-left ${card.revealClass}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-bold text-sm ${card.textColor} tracking-wider`}>
                  {card.bankName}
                </span>
                <svg className="w-5 h-5 text-[#8C735B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
              </div>
              <p className="font-mono text-base font-bold text-[#382E25] tracking-wider mb-1">
                {card.formattedNumber}
              </p>
              <p className="text-xs text-[#786755] mb-3">
                a.n. {card.accountHolder}
              </p>
              <button
                onClick={() => copyToClipboard(card.accountNumber, card.id)}
                className={`w-full py-2 rounded-xl border border-[#8C735B] text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isCopied
                    ? 'bg-[#363D2E] text-[#FAF7F2]'
                    : 'text-[#8C735B] hover:bg-[#8C735B] hover:text-white'
                }`}
              >
                {!isCopied && (
                  <svg className="w-3.5 h-3.5 fill-none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                )}
                <span>{isCopied ? 'Tersalin ✓' : 'Salin Nomor Rekening'}</span>
              </button>
            </div>
          );
        })}

        {/* Physical Gift Address */}
        <div className="p-3 rounded-xl bg-[#FAF5EE] text-left text-xs text-[#786755] reveal delay-250">
          <span className="font-bold text-[#382E25] block mb-0.5">📦 Kirim Kado Fisik:</span>
          <p>{physicalAddress}</p>
        </div>
      </div>
    </section>
  );
};
