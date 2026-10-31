'use client';

import React, { useState } from 'react';
import { InvitationData } from '@/types/invitation';

interface EnvelopeCoverProps {
  data: InvitationData;
  guestName?: string;
  onOpen: () => void;
  isOpened?: boolean;
}

export const EnvelopeCover: React.FC<EnvelopeCoverProps> = ({
  data,
  guestName,
  onOpen,
  isOpened = false,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [isDismissed, setIsDismissed] = useState(isOpened);

  if (isDismissed) return null;

  const handleOpenClick = () => {
    setIsFlipping(true);
    onOpen();
    setTimeout(() => {
      setIsDismissed(true);
    }, 1150);
  };

  const couplePhoto =
    data.groom.photo ||
    data.gallery[0]?.url ||
    '/asset/img/foto_mempelai_dummy.jpg';

  return (
    <div
      id="gateCover"
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
    >
      {/* 3D Book Cover Page (Flips open to the left like opening a book) */}
      <div
        id="gatePage"
        className={`relative w-full max-w-[430px] h-full flex flex-col items-center justify-between overflow-hidden bg-[var(--art-paper)] ${
          isFlipping ? 'book-opened' : ''
        }`}
      >
        {/* Book Spine Crease Shadow (Left Edge) */}
        <div className="absolute left-0 top-0 bottom-0 w-3 pointer-events-none bg-gradient-to-r from-black/15 to-transparent z-40"></div>

        {/* Background Watercolor Wash Texture */}
        <div
          className="absolute inset-0 bg-cover bg-top pointer-events-none opacity-40 z-0"
          style={{ backgroundImage: "url('/asset/img/bg_watercolor.jpg')" }}
        ></div>

        {/* 1. Upper Half: Couple Photo with Seamless Gradient Fade */}
        <div className="absolute top-0 left-0 right-0 w-full h-[55%] overflow-hidden pointer-events-none z-10 gate-anim-photo">
          <img
            src={couplePhoto}
            alt="Foto Mempelai"
            className="w-full h-full object-cover object-top"
          />
          {/* Soft Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--art-paper)]/30 via-50% to-[var(--art-paper)]"></div>
        </div>

        {/* 2. Two Diagonal Corner Bouquets (Top-Right & Bottom-Left) */}
        {/* Top-Right Corner Bouquet */}
        <div className="gate-bouquet-top-right gate-anim-fade">
          <img
            src="/asset/img/bucket_kanan.png"
            alt="Botanical Bouquet"
            className="bouquet-img wind-sway-corner"
          />
        </div>
        {/* Bottom-Left Corner Bouquet */}
        <div
          className="gate-bouquet-bottom-left gate-anim-fade"
          style={{ transform: 'rotate(180deg)', transformOrigin: 'center center' }}
        >
          <img
            src="/asset/img/bucket_kanan.png"
            alt="Botanical Bouquet"
            className="bouquet-img wind-sway-corner"
          />
        </div>

        {/* 3. Lower Half: Typography & "Buka Undangan" Button */}
        <div className="relative z-30 w-full mt-auto flex flex-col items-center justify-center text-center px-6 pb-10 pt-4">
          {/* Tagline: THE WEDDING OF */}
          <span className="text-[11px] uppercase tracking-[0.32em] text-[var(--art-ink-muted)] font-semibold mb-1 block gate-anim-1">
            THE WEDDING OF
          </span>

          {/* Couple Name in Luxury Calligraphy Script */}
          <h1 className="font-script text-4xl sm:text-5xl text-[var(--art-ink-soft)] tracking-wide mb-3 gate-anim-2">
            {data.groom.name} &amp; {data.bride.name}
          </h1>

          {/* Kepada Bapak/Ibu/Saudara/i */}
          <p className="text-xs text-[var(--art-ink-faintest)] font-normal mb-1 gate-anim-3">
            Kepada Bapak/Ibu/Saudara/i
          </p>

          {/* Dynamic Guest Name */}
          <div
            id="coverGuestName"
            className="font-serif text-xl sm:text-2xl font-semibold text-[var(--art-ink-deepest)] tracking-wide mb-5 gate-anim-4"
          >
            {guestName || 'Nama Tamu'}
          </div>

          {/* Action Button: Buka Undangan */}
          <button
            onClick={handleOpenClick}
            className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full bg-[var(--art-accent-deep)] hover:bg-[var(--art-ink-deep)] active:scale-95 text-white text-xs sm:text-sm font-medium tracking-wide shadow-lg hover:shadow-xl transition-all cursor-pointer gate-anim-5"
          >
            {/* Envelope Icon */}
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>Buka Undangan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
