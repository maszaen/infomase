'use client';

import React from 'react';
import { InvitationData } from '@/types/invitation';

interface CoupleSectionProps {
  data: InvitationData;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ data }) => {
  const groomPhoto =
    data.groom.photo ||
    '/asset/img/foto_mempelai_dummy.jpg';

  const bridePhoto =
    data.bride.photo ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80';

  return (
    <section id="mempelai" className="py-12 px-6 text-center relative overflow-hidden">
      {/* Section Title */}
      <div className="mb-8 reveal">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C735B] font-semibold block mb-1">
          THE HAPPY COUPLE
        </span>
        <h2 className="font-serif text-3xl text-[#382E25] font-semibold">
          Mempelai Bahagia
        </h2>
        <p className="text-xs text-[#786755] mt-1.5 max-w-xs mx-auto leading-relaxed">
          Dengan memohon rahmat Allah SWT, kami mengundang Bapak/Ibu/Saudara/i pada pernikahan putra-putri kami:
        </p>
      </div>

      {/* Groom Profile (Raka) */}
      <div className="flex flex-col items-center mb-8 reveal-scale delay-100">
        <div className="relative w-36 h-36 rounded-full p-1 bg-gradient-to-b from-[#E7DAC7] to-[#8C735B] shadow-md mb-3">
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            <img
              src={groomPhoto}
              alt={data.groom.fullName || data.groom.name}
              className="w-full h-full object-cover object-top sepia-[.10]"
            />
          </div>
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#382E25]">
          {data.groom.fullName || `${data.groom.name} Pratama, S.T.`}
        </h3>
        <p className="text-xs text-[#786755] mt-1">
          {data.groom.fatherName && data.groom.motherName
            ? `Putra dari ${data.groom.fatherName} & ${data.groom.motherName}`
            : data.groom.bio || 'Putra pertama dari Bapak Surya & Ibu Dewi'}
        </p>
        {data.groom.instagram && (
          <a
            href={`https://instagram.com/${data.groom.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-xs text-[#8C735B] hover:text-[#79624C] font-medium"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z" />
            </svg>
            <span>{data.groom.instagram}</span>
          </a>
        )}
      </div>

      {/* Romantic Ampersand Divider */}
      <div className="my-4 flex items-center justify-center gap-3 reveal delay-150">
        <span className="w-12 h-[1px] bg-[#D5C6B1]"></span>
        <span className="font-script text-3xl text-[#8C735B]">&amp;</span>
        <span className="w-12 h-[1px] bg-[#D5C6B1]"></span>
      </div>

      {/* Bride Profile (Sinta) */}
      <div className="flex flex-col items-center mt-4 reveal-scale delay-200">
        <div className="relative w-36 h-36 rounded-full p-1 bg-gradient-to-b from-[#E7DAC7] to-[#8C735B] shadow-md mb-3">
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            <img
              src={bridePhoto}
              alt={data.bride.fullName || data.bride.name}
              className="w-full h-full object-cover object-top sepia-[.10]"
            />
          </div>
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#382E25]">
          {data.bride.fullName || `${data.bride.name} Maharani, S.Pd.`}
        </h3>
        <p className="text-xs text-[#786755] mt-1">
          {data.bride.fatherName && data.bride.motherName
            ? `Putri dari ${data.bride.fatherName} & ${data.bride.motherName}`
            : data.bride.bio || 'Putri kedua dari Bapak Budi & Ibu Rina'}
        </p>
        {data.bride.instagram && (
          <a
            href={`https://instagram.com/${data.bride.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-xs text-[#8C735B] hover:text-[#79624C] font-medium"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z" />
            </svg>
            <span>{data.bride.instagram}</span>
          </a>
        )}
      </div>
    </section>
  );
};
