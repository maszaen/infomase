'use client';

import React from 'react';

interface BottomNavBarProps {
  onScrollTo: (id: string) => void;
  isVisible?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  onScrollTo,
  isVisible = true,
}) => {
  return (
    <nav
      className="fixed bottom-4 left-0 right-0 max-w-[430px] mx-auto z-40 pointer-events-none px-4 flex items-center justify-center"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'opacity 0.6s ease',
      }}
    >
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-3xl py-2 px-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.20)] border border-[#E8DFD4] flex items-center justify-center gap-3">
        {/* 1. Home / Cover */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onScrollTo('home');
          }}
          title="Cover"
          className="w-11 h-11 rounded-2xl bg-[#9C8169] hover:bg-[#866E58] active:scale-95 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </a>

        {/* 2. Mempelai (Heart) */}
        <a
          href="#mempelai"
          onClick={(e) => {
            e.preventDefault();
            onScrollTo('mempelai');
          }}
          title="Mempelai"
          className="w-11 h-11 rounded-2xl bg-[#9C8169] hover:bg-[#866E58] active:scale-95 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </a>

        {/* 3. Acara (Calendar) */}
        <a
          href="#acara"
          onClick={(e) => {
            e.preventDefault();
            onScrollTo('acara');
          }}
          title="Acara"
          className="w-11 h-11 rounded-2xl bg-[#9C8169] hover:bg-[#866E58] active:scale-95 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </a>

        {/* 4. Galeri (Image) */}
        <a
          href="#galeri"
          onClick={(e) => {
            e.preventDefault();
            onScrollTo('galeri');
          }}
          title="Galeri"
          className="w-11 h-11 rounded-2xl bg-[#9C8169] hover:bg-[#866E58] active:scale-95 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </a>

        {/* 5. Ucapan (Chat Bubble) */}
        <a
          href="#ucapan"
          onClick={(e) => {
            e.preventDefault();
            onScrollTo('ucapan');
          }}
          title="Ucapan"
          className="w-11 h-11 rounded-2xl bg-[#9C8169] hover:bg-[#866E58] active:scale-95 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </a>
      </div>
    </nav>
  );
};
