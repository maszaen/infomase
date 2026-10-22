'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX, Disc } from 'lucide-react';

interface FloatingMusicPlayerProps {
  musicUrl?: string;
  autoplay?: boolean;
  isPlaying: boolean;
  onToggle: () => void;
}

export const FloatingMusicPlayer: React.FC<FloatingMusicPlayerProps> = ({
  musicUrl,
  isPlaying,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className={`floating-music-btn ${isPlaying ? 'music-spinning' : ''}`}
      aria-label="Toggle background music"
      title={isPlaying ? 'Pause Musik' : 'Putar Musik'}
    >
      {isPlaying ? <Disc size={24} /> : <VolumeX size={24} />}
    </button>
  );
};
