'use client';

import React, { useState, useRef, useEffect } from 'react';
import { InvitationData, RSVPItem } from '@/types/invitation';
import { EnvelopeCover } from './EnvelopeCover';
import { CoupleSection } from './CoupleSection';
import { LoveStorySection } from './LoveStorySection';
import { EventsSection } from './EventsSection';
import { LocationSection } from './LocationSection';
import { GallerySection } from './GallerySection';
import { GiftEnvelopeSection } from './GiftEnvelopeSection';
import { RSVPSection } from './RSVPSection';
import { FloatingMusicPlayer } from './FloatingMusicPlayer';
import { BottomNavBar } from './BottomNavBar';

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
  const [isOpened, setIsOpened] = useState(defaultOpened);
  const [isNavVisible, setIsNavVisible] = useState(defaultOpened);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const musicUrl =
    data.music?.url || '/asset/music/Coral Island Overture.mp3';

  // 1. Audio initialization
  useEffect(() => {
    if (typeof window !== 'undefined' && musicUrl) {
      const audio = new Audio(musicUrl);
      audio.loop = true;
      audio.volume = 0.75;
      audioRef.current = audio;

      audio.addEventListener('play', () => setIsPlayingMusic(true));
      audio.addEventListener('pause', () => setIsPlayingMusic(false));
      audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        audio.play().catch((e) => console.log('Audio loop restart failed:', e));
      });

      return () => {
        audio.pause();
        audioRef.current = null;
      };
    }
  }, [musicUrl]);

  const playMusic = () => {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .then(() => setIsPlayingMusic(true))
      .catch((e) => console.log('Audio autoplay blocked or waiting for user interaction:', e));
  };

  const pauseMusic = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlayingMusic(false);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  // 2. Continuous Two-Way Scroll Reveal Observer
  const initScrollObserver = () => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const container = containerRef.current || document;

    const elements = container.querySelectorAll(
      '.reveal, .reveal-fade, .reveal-scale, .reveal-left, .reveal-right, .reveal-flower-tl, .reveal-flower-br, .reveal-pampas, .reveal-leaf, .reveal-flower, .reveal-foliage, .reveal-flower-pair'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          } else {
            // Two-way scroll animation
            entry.target.classList.remove('is-revealed');
          }
        });
      },
      {
        root: null,
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
    return observer;
  };

  // Trigger blooming entrance on Hero (#home)
  const triggerHeroReveal = () => {
    const container = containerRef.current || document;
    const homeElements = container.querySelectorAll(
      '#home .reveal, #home .reveal-fade, #home .reveal-scale, #home .reveal-flower-tl, #home .reveal-flower-br'
    );

    setTimeout(() => {
      homeElements.forEach((el) => {
        el.classList.add('is-revealed');
      });
    }, 100);
  };

  // 3. Gate Open Action
  const handleOpenInvitation = () => {
    // 1. Immediately trigger hero blooming entrance
    triggerHeroReveal();

    // 2. Start romantic audio
    playMusic();

    // 3. Smoothly fade in bottom nav and floating music controller at 550ms
    setTimeout(() => {
      setIsNavVisible(true);
    }, 550);

    // 4. After 3D book flip completes (1150ms), set isOpened and start scroll observer
    setTimeout(() => {
      setIsOpened(true);
      initScrollObserver();
    }, 1150);
  };

  useEffect(() => {
    if (defaultOpened) {
      triggerHeroReveal();
      initScrollObserver();
    }
  }, [defaultOpened]);

  // 4. Smooth scrolling handler
  const handleScrollTo = (id: string) => {
    const container = containerRef.current;
    if (id === 'home') {
      if (container && container.scrollTop !== undefined && container.scrollHeight > container.clientHeight) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const targetEl = (container || document).querySelector(`#${id}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 5. Date parsing for Hero section
  const eventDateObj = new Date(data.countdownDate);
  const dayNames = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
  const monthNames = [
    'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
    'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER',
  ];
  const dayName = isNaN(eventDateObj.getTime()) ? 'SABTU' : dayNames[eventDateObj.getDay()];
  const dateNum = isNaN(eventDateObj.getTime()) ? '24' : String(eventDateObj.getDate());
  const monthYearStr = isNaN(eventDateObj.getTime())
    ? 'MEI 2025'
    : `${monthNames[eventDateObj.getMonth()]} ${eventDateObj.getFullYear()}`;

  const closingCouplePhoto =
    data.gallery[0]?.url ||
    data.groom.photo ||
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=500&q=80';

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '100%',
        position: 'relative',
        backgroundColor: '#E6DDD1',
        overflowX: 'clip',
      }}
    >
      {/* 3D Gate Cover / Pintu Masuk Overlay */}
      <EnvelopeCover
        data={data}
        guestName={guestName}
        onOpen={handleOpenInvitation}
        isOpened={defaultOpened}
      />

      {/* Floating Background Music Controller */}
      <FloatingMusicPlayer
        isPlaying={isPlayingMusic}
        onToggle={toggleMusic}
        isVisible={isNavVisible}
      />

      {/* Main Mobile App Frame */}
      <div className="mobile-app-container">
        {/* ==============================================================
            1. HERO / COVER SECTION (#home)
            ============================================================== */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col items-center justify-between pt-5 pb-5 px-4 text-center overflow-hidden"
        >
          {/* Top-Left Corner Bouquet */}
          <div className="bouquet-top-left">
            <div className="reveal-flower-tl">
              <img
                src="/asset/img/bucket_kiri.png"
                alt="Botanical Bouquet"
                className="bouquet-img wind-sway-corner"
              />
            </div>
          </div>

          {/* Center Typography & Content */}
          <div className="relative z-20 flex flex-col items-center justify-center my-auto px-4 max-w-[320px] mx-auto text-center pt-10 pb-6">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-[var(--art-ink-muted)] font-semibold mb-3 block reveal">
              THE WEDDING OF
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl text-[var(--art-ink-deepest)] font-normal tracking-wide leading-tight mb-2 reveal delay-100">
              {data.groom.name} <span className="font-light italic text-[var(--art-ink-soft)]">&amp;</span> {data.bride.name}
            </h1>

            <div className="flex items-center justify-center gap-2.5 w-24 mx-auto mb-5 opacity-70 reveal delay-150">
              <span className="h-px bg-[var(--art-accent)] flex-1"></span>
              <span className="text-[var(--art-accent)] text-xs">❖</span>
              <span className="h-px bg-[var(--art-accent)] flex-1"></span>
            </div>

            <p className="text-xs sm:text-[13px] text-[var(--art-ink-mid)] leading-relaxed max-w-[270px] mx-auto mb-6 font-normal reveal delay-200">
              Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan kami:
            </p>

            <div className="mb-7 flex flex-col items-center reveal delay-250">
              <span className="text-[11px] uppercase tracking-[0.28em] text-[var(--art-ink-soft)] font-semibold mb-1">
                {dayName}
              </span>
              <span className="font-serif text-5xl sm:text-6xl font-normal text-[var(--art-ink-deepest)] tracking-tight leading-none my-0.5">
                {dateNum}
              </span>
              <span className="text-[11px] uppercase tracking-[0.28em] text-[var(--art-ink-soft)] font-semibold mt-1">
                {monthYearStr}
              </span>
            </div>

            <a
              href="#mempelai"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo('mempelai');
                if (!isPlayingMusic) playMusic();
              }}
              className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-[var(--art-ink-deep)] hover:bg-[var(--art-ink-deep)] text-white text-xs font-medium tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all reveal delay-300 cursor-pointer"
            >
              <span>Buka Undangan</span>
              <svg
                className="w-3.5 h-3.5 animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>

          {/* Bottom-Right Corner Bouquet */}
          <div className="bouquet-bottom-right">
            <div className="reveal-flower-br">
              <img
                src="/asset/img/bucket_kiri.png"
                alt="Botanical Bouquet"
                className="bouquet-img wind-sway-corner"
              />
            </div>
          </div>
        </section>

        {/* ==============================================================
            2. INTRO AYAT AL-QURAN SECTION (WARM BROWN BLOCK)
            ============================================================== */}
        <section className="brown-card py-10 px-6 text-center relative overflow-hidden reveal">
          <div className="w-10 h-10 mx-auto rounded-full bg-white/15 flex items-center justify-center mb-3">
            <svg
              className="w-5 h-5 text-[var(--art-paper-warm)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
              <path d="M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            </svg>
          </div>

          <p className="font-serif text-base sm:text-lg leading-relaxed text-[var(--art-paper-warm)] italic mb-4 max-w-sm mx-auto">
            &ldquo;{data.quote.text}&rdquo;
          </p>

          <span className="text-xs uppercase tracking-widest text-[var(--art-line-soft)] font-semibold block">
            ({data.quote.source})
          </span>
        </section>

        {/* ==============================================================
            3. MEMPELAI (COUPLE PROFILES)
            ============================================================== */}
        <CoupleSection data={data} />

        {/* ==============================================================
            4. KISAH CINTA (OUR STORY)
            ============================================================== */}
        <LoveStorySection data={data} />

        {/* ==============================================================
            5. SAVE THE DATE & DETAIL ACARA
            ============================================================== */}
        <EventsSection data={data} />

        {/* ==============================================================
            6. LOKASI & DENAH ACARA
            ============================================================== */}
        <LocationSection data={data} />

        {/* ==============================================================
            7. GALERI FOTO (MOMENTS)
            ============================================================== */}
        <GallerySection data={data} />

        {/* ==============================================================
            8. TANDA KASIH (WEDDING GIFT)
            ============================================================== */}
        <GiftEnvelopeSection data={data} />

        {/* ==============================================================
            9. RSVP & BUKU TAMU
            ============================================================== */}
        <RSVPSection data={data} onAddRSVP={onAddRSVP} guestName={guestName} />

        {/* ==============================================================
            10. CLOSING & UCAPAN TERIMA KASIH
            ============================================================== */}
        <section className="py-12 px-6 text-center relative overflow-hidden">
          {/* Circular Thank You Couple Photo */}
          <div className="relative w-36 h-36 mx-auto rounded-full p-1 bg-gradient-to-b from-[var(--art-line-soft)] to-[var(--art-accent)] shadow-md mb-4 reveal-scale">
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              <img
                src={closingCouplePhoto}
                alt="Thank you"
                className="w-full h-full object-cover sepia-[.10]"
              />
            </div>
          </div>

          <p className="text-xs text-[var(--art-ink-muted)] leading-relaxed max-w-xs mx-auto mb-4 reveal delay-100">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi kami.
          </p>

          <p className="text-xs font-semibold text-[var(--art-accent)] mb-1 reveal delay-150">
            Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="text-[11px] text-[var(--art-ink-muted)] mb-4">Kami yang berbahagia,</p>

          <h3 className="font-script text-4xl text-[var(--art-ink-soft)] mb-8 reveal delay-200">
            {data.groom.name} &amp; {data.bride.name}
          </h3>

          {/* Bottom Corner Bouquets (Mekar 1 per 1: Daun/Gandum -> Bunga) */}
          <div className="absolute bottom-12 left-0 w-28 h-28 pointer-events-none select-none z-10 overflow-visible">
            {/* 1. Daun Palm (daun hijau) */}
            <div className="absolute inset-0 pointer-events-none reveal-foliage">
              <div
                className="absolute bottom-0 -left-[24px] w-22"
                style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }}
              >
                <img src="/asset/img/daun_1.png" alt="Palm" className="botanical-img w-full wind-palm-1 opacity-80" />
              </div>
            </div>
            {/* 2. Bunga Anggrek */}
            <div className="absolute inset-0 pointer-events-none reveal-flower-pair">
              <img
                src="/asset/img/bunga_1.png"
                alt="Orchid"
                className="botanical-img absolute bottom-1.5 -left-2.5 w-14 rotate-[10deg] origin-center wind-orchid-1 drop-shadow-sm"
              />
            </div>
          </div>

          <div className="absolute bottom-12 right-0 w-28 h-28 pointer-events-none select-none z-10 overflow-visible">
            {/* 1. Pampas (daun gandum) */}
            <div className="absolute inset-0 pointer-events-none reveal-foliage">
              <div
                className="absolute bottom-0 -right-[24px] w-22"
                style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }}
              >
                <img src="/asset/img/bunga_8.png" alt="Pampas" className="botanical-img w-full wind-pampas-1 opacity-80" />
              </div>
            </div>
            {/* 2. Bunga Anthurium */}
            <div className="absolute inset-0 pointer-events-none reveal-flower-pair">
              <img
                src="/asset/img/bunga_5.png"
                alt="Anthurium"
                className="botanical-img absolute bottom-1.5 -right-2.5 w-14 -rotate-[15deg] origin-bottom-right wind-anthurium drop-shadow-sm"
              />
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="pt-6 border-t border-[var(--art-line)]/40 text-center reveal-fade delay-250">
            <p className="text-[10px] text-[var(--art-accent)] tracking-wider uppercase font-medium">
              &copy; 2025 The Wedding of {data.groom.name} &amp; {data.bride.name}
            </p>
          </div>
        </section>

        {/* Fixed Bottom Floating Navigation Bar */}
        <BottomNavBar onScrollTo={handleScrollTo} isVisible={isNavVisible} />
      </div>
    </div>
  );
};
