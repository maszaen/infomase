'use client';

import React from 'react';

interface FloatingMusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
  isVisible?: boolean;
}

export const FloatingMusicPlayer: React.FC<FloatingMusicPlayerProps> = ({
  isPlaying,
  onToggle,
  isVisible = true,
}) => {
  return (
    <div
      id="musicControlWrap"
      className="sticky top-4 left-0 right-0 max-w-[430px] mx-auto z-40 pointer-events-none px-4 flex justify-end h-0 overflow-visible"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'opacity 0.6s ease',
      }}
    >
      <button
        id="musicToggleBtn"
        onClick={onToggle}
        title={isPlaying ? 'Matikan Musik' : 'Putar Musik'}
        aria-label={isPlaying ? 'Matikan Musik' : 'Putar Musik'}
        className={`pointer-events-auto w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-[#D5C6B1] text-[#79624C] flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer ${
          !isPlaying ? 'opacity-60 bg-stone-100' : ''
        }`}
      >
        {isPlaying ? (
          /* Icon Vinyl Piringan Hitam Berputar saat Musik Aktif */
          <svg
            id="audioIconPlaying"
            className="w-5 h-5 music-disc-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
        ) : (
          /* Icon Speaker Mute saat Musik Dimatikan */
          <svg
            id="audioIconMuted"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.586 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round" />
            <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
};
