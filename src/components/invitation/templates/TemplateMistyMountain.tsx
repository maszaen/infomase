'use client';

import React, { useState, useRef, useEffect } from 'react';
import { InvitationData, RSVPItem } from '@/types/invitation';
import { FloatingMusicPlayer } from '../FloatingMusicPlayer';
import { BottomNavBar } from '../BottomNavBar';
import { CountdownTimer } from '../CountdownTimer';
import { Check, Copy, Heart, MapPin, Send } from 'lucide-react';

export interface TemplateProps {
  data: InvitationData;
  guestName?: string;
  onAddRSVP?: (item: Omit<RSVPItem, 'id' | 'createdAt'>) => void;
  defaultOpened?: boolean;
}

export const TemplateMistyMountain: React.FC<TemplateProps> = ({
  data,
  guestName,
  onAddRSVP,
  defaultOpened = false,
}) => {
  const [isOpened, setIsOpened] = useState(defaultOpened);
  const [isNavVisible, setIsNavVisible] = useState(defaultOpened);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const [rsvpName, setRsvpName] = useState(guestName || '');
  const [rsvpStatus, setRsvpStatus] = useState<'hadir' | 'tidak' | 'ragu'>('hadir');
  const [rsvpPax, setRsvpPax] = useState(1);
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const musicUrl =
    data.music?.url || '/template/undangan_5/music/Alpine Serenade.mp3';

  useEffect(() => {
    if (typeof window !== 'undefined' && musicUrl) {
      const audio = new Audio(musicUrl);
      audio.loop = true;
      audio.volume = 0.75;
      audioRef.current = audio;

      audio.addEventListener('play', () => setIsPlayingMusic(true));
      audio.addEventListener('pause', () => setIsPlayingMusic(false));

      return () => {
        audio.pause();
        audioRef.current = null;
      };
    }
  }, [musicUrl]);

  const playMusic = () => {
    if (!audioRef.current) return;
    audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
  };

  const pauseMusic = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlayingMusic(false);
  };

  const toggleMusic = () => {
    if (isPlayingMusic) pauseMusic();
    else playMusic();
  };

  const handleOpenInvitation = () => {
    playMusic();
    setIsNavVisible(true);
    setIsOpened(true);
  };

  const handleCopyAccount = (accountNo: string, bankId: string) => {
    navigator.clipboard.writeText(accountNo);
    setCopiedBank(bankId);
    setTimeout(() => setCopiedBank(null), 2500);
  };

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
    if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    if (onAddRSVP) {
      onAddRSVP({
        guestName: rsvpName,
        attendance: rsvpStatus,
        pax: rsvpPax,
        message: rsvpMessage,
      });
    }
    setRsvpSubmitted(true);
  };

  const eventDate = new Date(data.countdownDate);
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const dateFormatted = isNaN(eventDate.getTime())
    ? 'Sabtu, 24 Mei 2025'
    : `${dayNames[eventDate.getDay()]}, ${eventDate.getDate()} ${monthNames[eventDate.getMonth()]} ${eventDate.getFullYear()}`;

  const heroPhoto =
    data.gallery[0]?.url ||
    data.groom.photo ||
    '/template/undangan_5/img/bg/mountain_bg.jpg';

  return (
    <div
      ref={containerRef}
      className="artifact template-misty-mountain"
      style={{
        width: '100%',
        minHeight: '100%',
        position: 'relative',
        backgroundColor: '#244135',
        backgroundImage: 'radial-gradient(circle at 50% 20%, #446857 0%, #2D4C3E 45%, #1F382D 80%, #13241C 100%)',
        overflowX: 'clip',
      }}
    >
      <FloatingMusicPlayer
        isPlaying={isPlayingMusic}
        onToggle={toggleMusic}
        isVisible={isNavVisible}
      />

      {/* GATE COVER */}
      {!isOpened && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div
            className="relative w-full max-w-[430px] h-full flex flex-col items-center justify-between overflow-hidden shadow-2xl text-center px-6 py-12"
            style={{
              backgroundColor: '#FAF9F5',
              backgroundImage: 'linear-gradient(rgba(243, 246, 242, 0.85), rgba(243, 246, 242, 0.90)), url("/template/undangan_5/img/bg/mountain_bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center bottom',
            }}
          >
            <div className="w-16 h-16 opacity-80 mb-2">
              <span className="text-3xl text-[#36594B]">🌲</span>
            </div>

            <div className="relative w-48 h-60 rounded-3xl overflow-hidden shadow-xl border-4 border-white/80 mx-auto my-auto">
              <img src={heroPhoto} alt="Couple" className="w-full h-full object-cover" />
            </div>

            <div className="mt-4 mb-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#36594B] font-semibold block mb-1">
                ALPINE WEDDING INVITATION
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1E352B] font-normal tracking-wide my-1">
                {data.groom.name} <span className="font-light italic text-[#C59A45]">&amp;</span> {data.bride.name}
              </h1>
              <p className="text-xs text-[#1E352B]/70 mt-1">{dateFormatted}</p>

              {guestName && (
                <div className="mt-4 py-2 px-5 rounded-full bg-white/80 border border-[#36594B]/20 backdrop-blur-sm inline-block shadow-sm">
                  <span className="text-[10px] text-[#36594B] uppercase tracking-wider block">Yth. Tamu Undangan</span>
                  <span className="text-sm font-semibold text-[#1E352B]">{guestName}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleOpenInvitation}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#1E352B] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#244135] transition-all shadow-xl active:scale-95 cursor-pointer"
            >
              <span>Buka Undangan</span>
              <Heart size={14} className="fill-current text-[#C59A45]" />
            </button>
          </div>
        </div>
      )}

      {/* MOBILE CONTAINER */}
      <div
        className="mobile-app-container mx-auto"
        style={{
          width: '100%',
          maxWidth: 430,
          backgroundColor: '#FAF9F5',
          minHeight: '100vh',
          boxShadow: '0 25px 70px -12px rgba(18, 36, 28, 0.40)',
          color: '#1E352B',
          position: 'relative',
        }}
      >
        {/* HERO */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col justify-between px-6 pt-12 pb-16 text-center"
          style={{
            backgroundImage: 'linear-gradient(180deg, rgba(250, 249, 245, 0.92) 0%, rgba(250, 249, 245, 0.65) 55%, #FAF9F5 100%), url("/template/undangan_5/img/bg/mountain_bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
          }}
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-[#36594B]/10 flex items-center justify-center text-[#36594B]">
            <span>🌲</span>
          </div>

          <div className="my-auto py-8">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#36594B] font-semibold mb-2 block">
              MISTY MOUNTAIN &amp; ALPINE
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#1E352B] leading-tight mb-2">
              {data.groom.name}
              <span className="block font-light italic text-[#C59A45] text-3xl my-1">&amp;</span>
              {data.bride.name}
            </h1>
            <div className="flex items-center justify-center gap-2 my-4">
              <span className="w-8 h-px bg-[#C59A45]"></span>
              <span className="text-xs text-[#C59A45]">❖</span>
              <span className="w-8 h-px bg-[#C59A45]"></span>
            </div>
            <p className="text-xs uppercase tracking-widest text-[#1E352B]/80 font-medium">
              {dateFormatted}
            </p>
          </div>

          <div className="w-full max-w-[280px] mx-auto">
            <CountdownTimer targetDate={data.countdownDate} />
          </div>
        </section>

        {/* QUOTE */}
        <section id="prologue" className="py-12 px-6 text-center text-white" style={{ backgroundColor: '#1E352B' }}>
          <p className="font-serif text-sm sm:text-base leading-relaxed italic max-w-sm mx-auto mb-4 text-[#FAF9F5]">
            &ldquo;{data.quote.text}&rdquo;
          </p>
          <span className="text-xs text-[#C59A45] font-semibold uppercase tracking-widest">
            {data.quote.source}
          </span>
        </section>

        {/* MEMPELAI */}
        <section id="mempelai" className="py-14 px-6 text-center" style={{ backgroundColor: '#FAF9F5' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#36594B] font-semibold block mb-2">
            PASANGAN MEMPELAI
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1E352B] mb-8">
            Groom &amp; Bride
          </h2>

          <div className="space-y-8 max-w-xs mx-auto">
            <div className="p-6 rounded-3xl bg-white shadow-sm border border-[#36594B]/15 text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow mb-4 border-2 border-[#C59A45]/40">
                <img
                  src={data.groom.photo || '/template/undangan_5/img/mempelai/foto_editorial_groom.jpg'}
                  alt={data.groom.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#1E352B]">{data.groom.fullName || data.groom.name}</h3>
              <p className="text-xs text-[#36594B] mt-1 mb-2 font-medium">Putra dari</p>
              <p className="text-xs text-[#1E352B]/80">
                Bpk. {data.groom.fatherName || 'Ayah'} &amp; Ibu {data.groom.motherName || 'Ibu'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white shadow-sm border border-[#36594B]/15 text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow mb-4 border-2 border-[#C59A45]/40">
                <img
                  src={data.bride.photo || '/template/undangan_5/img/mempelai/foto_editorial_bride.jpg'}
                  alt={data.bride.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#1E352B]">{data.bride.fullName || data.bride.name}</h3>
              <p className="text-xs text-[#36594B] mt-1 mb-2 font-medium">Putri dari</p>
              <p className="text-xs text-[#1E352B]/80">
                Bpk. {data.bride.fatherName || 'Ayah'} &amp; Ibu {data.bride.motherName || 'Ibu'}
              </p>
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section id="acara" className="py-14 px-6 text-center text-white" style={{ backgroundColor: '#1E352B' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C59A45] font-semibold block mb-2">
            ACARA PERNIKAHAN
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white mb-8">
            Save The Date
          </h2>

          <div className="space-y-6 max-w-sm mx-auto">
            {data.events.map((evt) => (
              <div
                key={evt.id}
                className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-center"
              >
                <h3 className="font-serif text-xl text-[#C59A45] font-medium mb-2">{evt.title}</h3>
                <div className="w-8 h-px bg-[#C59A45]/40 mx-auto my-3"></div>
                <p className="text-xs uppercase tracking-wider text-white/90 mb-1">{evt.date}</p>
                <p className="text-xs text-white/80 mb-3">{evt.startTime} - {evt.endTime} {evt.timezone}</p>
                <p className="text-xs font-semibold text-white">{evt.locationName}</p>
                <p className="text-[11px] text-white/75 mt-0.5 mb-4">{evt.address}</p>
                {evt.mapsUrl && (
                  <a
                    href={evt.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#C59A45] text-[#1E352B] text-xs font-semibold hover:bg-white transition-all shadow"
                  >
                    <MapPin size={12} />
                    <span>Petunjuk Lokasi</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section id="galeri" className="py-14 px-6 text-center" style={{ backgroundColor: '#FAF9F5' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#36594B] font-semibold block mb-2">
            GALERI FOTO
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1E352B] mb-8">
            Momen Kebersamaan
          </h2>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {data.gallery.slice(0, 6).map((img, idx) => (
              <div
                key={img.id || idx}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm border border-[#36594B]/20"
              >
                <img
                  src={img.url}
                  alt={img.caption || `Foto ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* TANDA KASIH */}
        <section id="tanda-kasih" className="py-14 px-6 text-center text-white" style={{ backgroundColor: '#1E352B' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C59A45] font-semibold block mb-2">
            TANDA KASIH
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white mb-4">
            Kado Digital
          </h2>
          <p className="text-xs text-white/80 max-w-xs mx-auto mb-8">
            Doa restu Anda merupakan karunia terindah bagi kami. Bagi yang berkenan memberikan tanda kasih:
          </p>

          <div className="space-y-4 max-w-xs mx-auto">
            {data.bankAccounts.map((bank) => (
              <div
                key={bank.id}
                className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-left"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase text-[#C59A45]">{bank.bankName}</span>
                  <span className="text-[10px] text-white/60 uppercase">Rekening</span>
                </div>
                <p className="font-mono text-base font-semibold text-white tracking-wider mb-1">
                  {bank.accountNumber}
                </p>
                <p className="text-xs text-white/80 mb-3">a.n. {bank.accountHolder}</p>
                <button
                  onClick={() => handleCopyAccount(bank.accountNumber, bank.id)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#C59A45] text-[#1E352B] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white transition-all cursor-pointer"
                >
                  {copiedBank === bank.id ? (
                    <>
                      <Check size={14} className="text-emerald-700" />
                      <span>Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Salin Rekening</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* RSVP */}
        <section id="ucapan" className="py-14 px-6 text-center" style={{ backgroundColor: '#F3F6F2' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#36594B] font-semibold block mb-2">
            KONFIRMASI
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1E352B] mb-6">
            Buku Tamu &amp; RSVP
          </h2>

          <div className="max-w-sm mx-auto">
            {rsvpSubmitted ? (
              <div className="p-6 rounded-3xl bg-white border border-emerald-500/30 text-center mb-6 shadow-sm">
                <Check size={28} className="text-emerald-600 mx-auto mb-2" />
                <h4 className="font-medium text-sm text-[#1E352B]">Terima Kasih!</h4>
                <p className="text-xs text-[#36594B] mt-1">Konfirmasi dan ucapan Anda telah tersimpan.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRSVP} className="p-6 rounded-3xl bg-white border border-[#36594B]/20 text-left shadow-sm mb-8 space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#1E352B] block mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    required
                    placeholder="Nama Anda"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#36594B]/30 focus:border-[#1E352B] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#1E352B] block mb-1">Kehadiran</label>
                  <select
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#36594B]/30 focus:border-[#1E352B] outline-none bg-white"
                  >
                    <option value="hadir">Hadir</option>
                    <option value="tidak">Tidak Hadir</option>
                    <option value="ragu">Ragu-ragu</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#1E352B] block mb-1">Jumlah Tamu</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rsvpPax}
                    onChange={(e) => setRsvpPax(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#36594B]/30 focus:border-[#1E352B] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#1E352B] block mb-1">Ucapan &amp; Doa Restu</label>
                  <textarea
                    rows={3}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Tuliskan ucapan selamat..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#36594B]/30 focus:border-[#1E352B] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#1E352B] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#244135] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send size={12} />
                  <span>Kirim Konfirmasi</span>
                </button>
              </form>
            )}

            <div className="space-y-3 text-left">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#36594B]">
                Ucapan Tamu ({data.rsvpList.length})
              </h4>
              {data.rsvpList.slice(0, 5).map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-white border border-[#36594B]/15 shadow-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-[#1E352B]">{item.guestName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#36594B]/15 text-[#36594B] font-medium">
                      {item.attendance === 'hadir' ? 'Hadir' : item.attendance === 'tidak' ? 'Tidak Hadir' : 'Ragu'}
                    </span>
                  </div>
                  <p className="text-xs text-[#1E352B]/80 mt-1">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <section id="terimakasih" className="py-16 px-6 text-center" style={{ backgroundColor: '#FAF9F5' }}>
          <p className="text-xs text-[#1E352B]/75 leading-relaxed max-w-xs mx-auto mb-6">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi kami.
          </p>

          <span className="text-[11px] uppercase tracking-widest text-[#36594B] block mb-1">
            KAMI YANG BERBAHAGIA
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#1E352B] mb-6">
            {data.groom.name} &amp; {data.bride.name}
          </h3>

          <p className="text-[10px] text-[#36594B] uppercase tracking-widest">
            &copy; 2025 Misty Mountain Wedding · {data.groom.name} &amp; {data.bride.name}
          </p>
        </section>

        <BottomNavBar onScrollTo={handleScrollTo} isVisible={isNavVisible} />
      </div>
    </div>
  );
};
