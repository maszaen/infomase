'use client';

import React, { useState, useEffect } from 'react';
import { InvitationData } from '@/types/invitation';

interface EventsSectionProps {
  data: InvitationData;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: '24',
    hours: '05',
    minutes: '19',
    seconds: '34',
  });

  useEffect(() => {
    let target = new Date(data.countdownDate).getTime();
    const nowCheck = new Date().getTime();
    if (isNaN(target) || target <= nowCheck) {
      target = nowCheck + 24 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000 + 19 * 60 * 1000;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [data.countdownDate]);

  const targetDateObj = new Date(data.countdownDate);
  const dayStr = isNaN(targetDateObj.getTime()) ? '24' : String(targetDateObj.getDate()).padStart(2, '0');
  const monthStr = isNaN(targetDateObj.getTime()) ? '05' : String(targetDateObj.getMonth() + 1).padStart(2, '0');
  const yearStr = isNaN(targetDateObj.getTime()) ? '2025' : String(targetDateObj.getFullYear());

  const akadEvent = data.events.find((e) => e.id === 'akad' || e.title.toLowerCase().includes('akad')) || data.events[0] || {
    title: 'Akad Nikah',
    date: '2025-05-24',
    startTime: '08.00',
    endTime: 'Selesai',
    locationName: 'Gedung Graha Saka',
    address: 'Jl. Melati No. 12, Yogyakarta',
    mapsUrl: 'https://maps.google.com/?q=Gedung+Graha+Saka+Yogyakarta',
  };

  const resepsiEvent = data.events.find((e) => e.id === 'resepsi' || e.title.toLowerCase().includes('resepsi')) || data.events[1] || {
    title: 'Resepsi Pernikahan',
    date: '2025-05-24',
    startTime: '11.00',
    endTime: '14.00 WIB',
    locationName: 'Gedung Graha Saka',
    address: 'Jl. Melati No. 12, Yogyakarta',
    mapsUrl: 'https://maps.google.com/?q=Gedung+Graha+Saka+Yogyakarta',
  };

  const venuePhoto =
    data.gallery[2]?.url ||
    data.gallery[0]?.url ||
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80';

  return (
    <section id="acara" className="py-8 px-6">
      {/* Brown Header Card with Countdown */}
      <div className="brown-card rounded-t-3xl p-6 text-center relative overflow-hidden reveal">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--art-line-soft)] font-semibold block mb-1">
          SAVE THE DATE
        </span>
        <h3 className="font-serif text-3xl font-bold tracking-wider mb-4">
          {dayStr} . {monthStr} . {yearStr}
        </h3>

        {/* Countdown Timer 4 Boxes */}
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-2 reveal delay-150">
          <div className="bg-black/20 rounded-xl p-2 border border-white/10">
            <span id="cd-days" className="font-serif text-2xl font-bold block leading-none">
              {timeLeft.days}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[var(--art-line-soft)]">HARI</span>
          </div>
          <div className="bg-black/20 rounded-xl p-2 border border-white/10">
            <span id="cd-hours" className="font-serif text-2xl font-bold block leading-none">
              {timeLeft.hours}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[var(--art-line-soft)]">JAM</span>
          </div>
          <div className="bg-black/20 rounded-xl p-2 border border-white/10">
            <span id="cd-minutes" className="font-serif text-2xl font-bold block leading-none">
              {timeLeft.minutes}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[var(--art-line-soft)]">MENIT</span>
          </div>
          <div className="bg-black/20 rounded-xl p-2 border border-white/10">
            <span id="cd-seconds" className="font-serif text-2xl font-bold block leading-none">
              {timeLeft.seconds}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[var(--art-line-soft)]">DETIK</span>
          </div>
        </div>
      </div>

      {/* Main Event Card Body */}
      <div className="paper-card rounded-b-3xl p-6 pb-12 relative overflow-hidden reveal delay-100">
        {/* Top Couple Banner in Card */}
        <div className="w-full h-44 rounded-2xl overflow-hidden mb-6 shadow-xs reveal-scale delay-150">
          <img
            src={venuePhoto}
            alt="Venue"
            className="w-full h-full object-cover sepia-[.10]"
          />
        </div>

        {/* Akad Nikah Details */}
        <div className="text-center mb-6 reveal delay-150">
          <div className="w-9 h-9 mx-auto rounded-full bg-[var(--art-line-soft)] text-[var(--art-accent)] flex items-center justify-center mb-2 reveal-scale delay-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <h4 className="font-serif text-2xl font-bold text-[var(--art-ink)] reveal delay-200">
            {akadEvent.title}
          </h4>
          <p className="text-xs text-[var(--art-ink-muted)] font-medium mt-1 reveal delay-250">
            Sabtu, 24 Mei 2025
          </p>
          <p className="text-xs font-bold text-[var(--art-accent)] mt-0.5 reveal delay-250">
            Pukul {akadEvent.startTime} - {akadEvent.endTime}
          </p>
          <p className="text-xs text-[var(--art-ink-muted)] mt-1 reveal delay-300">
            {akadEvent.locationName}, {akadEvent.address}
          </p>
          <a
            href={akadEvent.mapsUrl || 'https://maps.google.com/?q=Gedung+Graha+Saka+Yogyakarta'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full bg-[var(--art-accent)] text-white text-[11px] font-medium shadow hover:bg-[var(--art-accent-deep)] reveal-scale delay-300"
          >
            <span>Buka Google Maps</span> &#x2197;
          </a>
        </div>

        {/* Divider line */}
        <div className="my-6 flex items-center justify-center gap-3 reveal-fade delay-300">
          <span className="w-16 h-[1px] bg-[var(--art-line)]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--art-accent)]"></span>
          <span className="w-16 h-[1px] bg-[var(--art-line)]"></span>
        </div>

        {/* Resepsi Details */}
        <div className="text-center mb-4 reveal delay-350">
          <div className="w-9 h-9 mx-auto rounded-full bg-[var(--art-line-soft)] text-[var(--art-accent)] flex items-center justify-center mb-2 reveal-scale delay-350">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="9" cy="12" r="5" strokeWidth="1.8"/>
              <circle cx="15" cy="12" r="5" strokeWidth="1.8"/>
            </svg>
          </div>
          <h4 className="font-serif text-2xl font-bold text-[var(--art-ink)] reveal delay-350">
            {resepsiEvent.title}
          </h4>
          <p className="text-xs text-[var(--art-ink-muted)] font-medium mt-1 reveal delay-400">
            Sabtu, 24 Mei 2025
          </p>
          <p className="text-xs font-bold text-[var(--art-accent)] mt-0.5 reveal delay-400">
            Pukul {resepsiEvent.startTime} - {resepsiEvent.endTime}
          </p>
          <p className="text-xs text-[var(--art-ink-muted)] mt-1 reveal delay-400">
            {resepsiEvent.locationName}, {resepsiEvent.address}
          </p>
          <a
            href={resepsiEvent.mapsUrl || 'https://maps.google.com/?q=Gedung+Graha+Saka+Yogyakarta'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full bg-[var(--art-accent)] text-white text-[11px] font-medium shadow hover:bg-[var(--art-accent-deep)] reveal-scale delay-450"
          >
            <span>Buka Google Maps</span> &#x2197;
          </a>
        </div>

        {/* Card Corner Bouquets (Animasi Mekar 1 per 1 Terpisah: Gandum -> Daun -> Bunga) */}
        {/* Left Bottom Corner */}
        <div className="absolute -bottom-1 -left-1 w-24 h-24 pointer-events-none select-none z-10 overflow-visible">
          {/* 1. Rumput Pampas (Gandum) - Mekar Pertama */}
          <div className="absolute inset-0 pointer-events-none reveal-pampas">
            <img
              src="/asset/img/bunga_7.png"
              alt="Pampas"
              className="botanical-img absolute bottom-4 left-1 w-[52px] rotate-[18deg] origin-bottom-left wind-pampas-2 opacity-85"
            />
          </div>

          {/* 2. Daun Hijau Monstera - Mekar Kedua */}
          <div className="absolute inset-0 pointer-events-none reveal-leaf">
            <img
              src="/asset/img/daun_3.png"
              alt="Monstera"
              className="botanical-img absolute bottom-3.5 left-0 w-[44px] -rotate-[14deg] origin-bottom-left wind-palm-1 opacity-95"
            />
          </div>

          {/* 3. Bunga Anggrek Putih - Mekar Ketiga */}
          <div className="absolute inset-0 pointer-events-none reveal-flower">
            <img
              src="/asset/img/bunga_1.png"
              alt="Orchid"
              className="botanical-img absolute bottom-0 left-0 w-[44px] rotate-[4deg] origin-center wind-orchid-1 drop-shadow-md"
            />
          </div>
        </div>

        {/* Right Bottom Corner */}
        <div className="absolute -bottom-1 -right-1 w-24 h-24 pointer-events-none select-none z-10 overflow-visible">
          {/* 1. Rumput Pampas (Gandum) - Mekar Pertama */}
          <div className="absolute inset-0 pointer-events-none reveal-pampas">
            <div className="absolute bottom-6 right-1 w-[52px]" style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }}>
              <img
                src="/asset/img/bunga_8.png"
                alt="Pampas"
                className="botanical-img w-full wind-pampas-1 opacity-85"
              />
            </div>
          </div>

          {/* 2. Daun Hijau Monstera - Mekar Kedua */}
          <div className="absolute inset-0 pointer-events-none reveal-leaf">
            <img
              src="/asset/img/daun_3.png"
              alt="Monstera"
              className="botanical-img absolute bottom-3.5 right-0 w-[44px] rotate-[14deg] origin-bottom-right wind-palm-2 opacity-95"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>

          {/* 3. Bunga Anthurium - Mekar Ketiga */}
          <div className="absolute inset-0 pointer-events-none reveal-flower">
            <img
              src="/asset/img/bunga_5.png"
              alt="Anthurium"
              className="botanical-img absolute -bottom-1.5 right-0 w-[46px] -rotate-[4deg] origin-center wind-anthurium drop-shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
