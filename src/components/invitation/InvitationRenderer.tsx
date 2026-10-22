'use client';

import React, { useState, useRef, useEffect } from 'react';
import { InvitationData, RSVPItem } from '@/types/invitation';
import { EnvelopeCover } from './EnvelopeCover';
import { CoupleSection } from './CoupleSection';
import { EventsSection } from './EventsSection';
import { LoveStorySection } from './LoveStorySection';
import { GallerySection } from './GallerySection';
import { GiftEnvelopeSection } from './GiftEnvelopeSection';
import { RSVPSection } from './RSVPSection';
import { FloatingMusicPlayer } from './FloatingMusicPlayer';
import { BottomNavBar } from './BottomNavBar';
import { Sparkles, Heart } from 'lucide-react';
import { formatFullIndonesianDate } from '@/lib/formatDate';

interface InvitationRendererProps {
  data: InvitationData;
  guestName?: string;
  onAddRSVP?: (item: Omit<RSVPItem, 'id' | 'createdAt'>) => void;
  defaultOpened?: boolean;
}

export const InvitationRenderer: React.FC<InvitationRendererProps> = ({
  data,
  guestName,
  onAddRSVP,
  defaultOpened = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpened);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Setup theme CSS class
  const themeClass =
    data.templateId === 'royal-gold'
      ? 'theme-royal-gold'
      : data.templateId === 'islamic'
      ? 'theme-islamic'
      : data.templateId === 'sakura'
      ? 'theme-sakura'
      : 'theme-rustic';

  // Audio setup
  useEffect(() => {
    if (typeof window !== 'undefined' && data.music?.url) {
      const audio = new Audio(data.music.url);
      audio.loop = true;
      audioRef.current = audio;

      return () => {
        audio.pause();
        audioRef.current = null;
      };
    }
  }, [data.music?.url]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch((e) => console.log('Audio playback permission needed', e));
    }
  };

  const handleOpenInvitation = () => {
    setIsOpen(true);
    if (data.music?.url && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch((e) => console.log('Audio autoplay prevented by browser', e));
    }
  };

  const handleScrollTo = (id: string) => {
    if (id === 'cover') {
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = containerRef.current?.querySelector(`#${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      className={themeClass}
      style={{
        width: '100%',
        minHeight: '100%',
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'background-color 0.4s ease, color 0.4s ease',
      }}
    >
      {!isOpen ? (
        <EnvelopeCover data={data} guestName={guestName} onOpen={handleOpenInvitation} />
      ) : (
        <div style={{ position: 'relative', paddingBottom: 60 }}>
          {/* Top Hero / Header */}
          <div
            id="cover"
            style={{
              padding: '40px 16px 20px',
              textAlign: 'center',
              position: 'relative',
              background: 'radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--inv-accent)', marginBottom: 12 }}>
              <Sparkles size={14} />
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
                Walimatul &apos;Urs
              </span>
              <Sparkles size={14} />
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.4rem',
                color: 'var(--inv-primary)',
                lineHeight: 1.15,
                marginBottom: 8,
              }}
            >
              {data.groom.name} &amp; {data.bride.name}
            </h1>

            <p style={{ fontSize: '0.82rem', color: 'var(--inv-text-muted)' }}>
              {formatFullIndonesianDate(data.countdownDate)}
            </p>
          </div>

          {/* Sections */}
          <CoupleSection data={data} />
          <EventsSection data={data} />
          <LoveStorySection data={data} />
          <GallerySection data={data} />
          <GiftEnvelopeSection data={data} />
          <RSVPSection data={data} onAddRSVP={onAddRSVP} guestName={guestName} />

          {/* Footer of the invitation */}
          <div style={{ padding: '32px 16px', textAlign: 'center', borderTop: '1px solid var(--inv-border)', marginTop: 24 }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--inv-text-muted)', marginBottom: 8 }}>
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
            </p>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                color: 'var(--inv-primary)',
                marginBottom: 16,
              }}
            >
              Kami yang berbahagia,
              <br />
              {data.groom.name} &amp; {data.bride.name}
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.7rem', color: 'var(--inv-text-muted)' }}>
              <span>Dibuat dengan</span>
              <Heart size={12} fill="#e11d48" color="#e11d48" />
              <span>melalui InfoMase.id</span>
            </div>
          </div>

          {/* Bottom Dock Navigation */}
          <BottomNavBar onScrollTo={handleScrollTo} />

          {/* Floating Music Button */}
          {data.music?.url && (
            <FloatingMusicPlayer
              musicUrl={data.music.url}
              isPlaying={isPlayingMusic}
              onToggle={toggleMusic}
            />
          )}
        </div>
      )}
    </div>
  );
};
