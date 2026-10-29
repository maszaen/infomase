'use client';

import React from 'react';
import { InvitationData } from '@/types/invitation';

interface LocationSectionProps {
  data: InvitationData;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ data }) => {
  const primaryEvent = data.events[0] || {
    locationName: 'Gedung Graha Saka',
    address: 'Jl. Melati No. 12, Kotabaru, Yogyakarta',
    mapsUrl: 'https://maps.google.com/?q=Gedung+Graha+Saka+Yogyakarta',
  };

  return (
    <section id="lokasi" className="py-8 px-6">
      <div className="paper-card rounded-3xl p-6 text-center relative overflow-hidden reveal">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C735B] font-semibold block mb-1">
          LOKASI GEDUNG
        </span>
        <h3 className="font-serif text-2xl text-[#382E25] font-semibold mb-1">
          {primaryEvent.locationName || 'Gedung Graha Saka'}
        </h3>
        <p className="text-xs text-[#786755] mb-4">
          {primaryEvent.address || 'Jl. Melati No. 12, Kotabaru, Yogyakarta'}
        </p>

        {/* Simulated Map Box */}
        <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-[#E7DAC7] border border-[#D5C6B1] flex flex-col items-center justify-center p-3 mb-4 group shadow-inner">
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 120" preserveAspectRatio="none">
            <path d="M-20,40 Q60,30 110,80 T220,100" stroke="#79624C" strokeWidth="6" fill="none" />
            <path d="M40,-10 L80,130" stroke="#79624C" strokeWidth="4" fill="none" />
            <path d="M120,-10 L150,130" stroke="#79624C" strokeWidth="3" fill="none" />
          </svg>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#8C735B] text-white flex items-center justify-center shadow-md mb-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <a
              href={primaryEvent.mapsUrl || 'https://maps.google.com/?q=Gedung+Graha+Saka+Yogyakarta'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-[#382E25] text-white text-[11px] font-medium shadow hover:bg-black transition"
            >
              Petunjuk Arah Google Maps ↗
            </a>
          </div>
        </div>

        {/* Venue photo & Parking info */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 border border-[#D5C6B1]/60 text-left">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=200&q=80"
            alt="Venue"
            className="w-14 h-14 rounded-xl object-cover shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#382E25]">
              <span className="w-4 h-4 rounded-full bg-[#8C735B] text-white flex items-center justify-center text-[10px]">
                P
              </span>
              <span>Area Parkir Luas &amp; Aman</span>
            </div>
            <p className="text-[11px] text-[#786755] mt-0.5">
              Tersedia parkir kendaraan roda 2 dan roda 4.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
