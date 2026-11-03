'use client';

import React, { useState, useRef, useEffect } from 'react';
import { InvitationData, RSVPItem } from '@/types/invitation';
import { FloatingMusicPlayer } from '../FloatingMusicPlayer';
import { BottomNavBar } from '../BottomNavBar';
import { CountdownTimer } from '../CountdownTimer';
import { Check, Copy, Heart, MapPin, Calendar, Send } from 'lucide-react';

export interface TemplateProps {
  data: InvitationData;
  guestName?: string;
  onAddRSVP?: (item: Omit<RSVPItem, 'id' | 'createdAt'>) => void;
  defaultOpened?: boolean;
}

export const TemplateModernMinimalist: React.FC<TemplateProps> = ({
  data,
  guestName,
  onAddRSVP,
  defaultOpened = false,
}) => {
  const [isOpened, setIsOpened] = useState(defaultOpened);
  const [isNavVisible, setIsNavVisible] = useState(defaultOpened);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Form RSVP state
  const [rsvpName, setRsvpName] = useState(guestName || '');
  const [rsvpStatus, setRsvpStatus] = useState<'hadir' | 'tidak' | 'ragu'>('hadir');
  const [rsvpPax, setRsvpPax] = useState(1);
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const musicUrl =
    data.music?.url || '/template/undangan_2/music/Coral Island Overture.mp3';

  // Audio setup
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

  // Date parsing
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
    '/template/undangan_2/img/foto_editorial_hero.jpg';

  return (
    <div
      ref={containerRef}
      className="artifact template-modern-minimalist"
      style={{
        width: '100%',
        minHeight: '100%',
        position: 'relative',
        backgroundColor: '#727464',
        overflowX: 'clip',
      }}
    >
      <FloatingMusicPlayer
        isPlaying={isPlayingMusic}
        onToggle={toggleMusic}
        isVisible={isNavVisible}
      />

      {/* ENVELOPE / GATE COVER */}
      {!isOpened && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-700"
          style={{ position: 'fixed' }}
        >
          <div
            className="relative w-full max-w-[430px] h-full flex flex-col items-center justify-between overflow-hidden shadow-2xl text-center px-6 py-12"
            style={{
              backgroundColor: '#D8D3C5',
              backgroundImage: 'linear-gradient(180deg, #A2A796 0%, #BAC0B1 36%, #D4D3C9 64%, #D8D3C5 100%)',
            }}
          >
            {/* Top botanical accent */}
            <div className="w-20 h-20 opacity-80 mb-2">
              <img
                src="/template/undangan_2/img/bucket_bunga.png"
                alt="Botanical"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Couple photo preview */}
            <div className="relative w-44 h-56 rounded-2xl overflow-hidden shadow-lg border-2 border-white/60 mx-auto my-auto">
              <img
                src={heroPhoto}
                alt="Couple"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Typography */}
            <div className="mt-4 mb-6">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#0C0D0C]/75 font-semibold block mb-1">
                WEDDING INVITATION
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#0C0D0C] font-normal tracking-wide my-1">
                {data.groom.name} <span className="font-light italic text-[#727464]">&amp;</span> {data.bride.name}
              </h1>
              <p className="text-xs text-[#0C0D0C]/70 mt-1">{dateFormatted}</p>

              {guestName && (
                <div className="mt-4 py-2 px-4 rounded-lg bg-white/40 border border-[#727464]/20 backdrop-blur-sm inline-block">
                  <span className="text-[10px] text-[#0C0D0C]/60 uppercase tracking-wider block">Kepada Yth.</span>
                  <span className="text-sm font-semibold text-[#0C0D0C]">{guestName}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleOpenInvitation}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#0C0D0C] text-[#FAF8F5] text-xs uppercase tracking-widest font-semibold hover:bg-[#727464] transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Buka Undangan</span>
              <Heart size={14} className="fill-current text-rose-300" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div
        className="mobile-app-container mx-auto"
        style={{
          width: '100%',
          maxWidth: 430,
          backgroundColor: '#D8D3C5',
          minHeight: '100vh',
          boxShadow: '0 25px 80px -15px rgba(12, 13, 12, 0.45)',
          color: '#0C0D0C',
          position: 'relative',
        }}
      >
        {/* HERO SECTION */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col justify-between px-6 pt-12 pb-16 text-center"
          style={{ backgroundColor: '#D8D3C5' }}
        >
          <div className="w-16 h-16 mx-auto opacity-70">
            <img
              src="/template/undangan_2/img/bucket_bunga.png"
              alt="Botanical"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="my-auto py-8">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#7F8170] font-semibold mb-2 block">
              THE WEDDING CELEBRATION
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#0C0D0C] leading-tight mb-3">
              {data.groom.name}
              <span className="block font-light italic text-[#727464] text-3xl my-1">&amp;</span>
              {data.bride.name}
            </h1>
            <div className="w-12 h-px bg-[#7F8170] mx-auto my-4 opacity-50"></div>
            <p className="text-xs uppercase tracking-widest text-[#0C0D0C]/80 font-medium">
              {dateFormatted}
            </p>
          </div>

          <div className="w-full max-w-[280px] mx-auto">
            <CountdownTimer targetDate={data.countdownDate} />
          </div>
        </section>

        {/* PROLOGUE / QUOTE */}
        <section
          id="prologue"
          className="py-12 px-6 text-center text-white relative overflow-hidden"
          style={{ backgroundColor: '#727464' }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#FAF8F5]/70 block mb-3 font-semibold">
            AR-RUM : 21
          </span>
          <p className="font-serif text-sm sm:text-base leading-relaxed italic max-w-sm mx-auto mb-4 text-[#FAF8F5]">
            &ldquo;{data.quote.text}&rdquo;
          </p>
          <span className="text-xs text-[#FAF8F5]/80 font-medium">
            {data.quote.source}
          </span>
        </section>

        {/* MEMPELAI */}
        <section id="mempelai" className="py-14 px-6 text-center relative" style={{ backgroundColor: '#D8D3C5' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#7F8170] font-semibold block mb-2">
            PASANGAN MEMPELAI
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#0C0D0C] mb-8">
            Groom &amp; Bride
          </h2>

          <div className="space-y-8 max-w-xs mx-auto">
            {/* Groom */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] shadow-sm border border-[#7F8170]/20 text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow mb-4 border border-[#727464]/30">
                <img
                  src={data.groom.photo || '/template/undangan_2/img/foto_editorial_groom.jpg'}
                  alt={data.groom.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#0C0D0C]">{data.groom.fullName || data.groom.name}</h3>
              <p className="text-xs text-[#7F8170] mt-1 mb-2">Putra dari</p>
              <p className="text-xs text-[#0C0D0C]/80 font-medium">
                Bpk. {data.groom.fatherName || 'Ayah'} &amp; Ibu {data.groom.motherName || 'Ibu'}
              </p>
              {data.groom.instagram && (
                <a
                  href={`https://instagram.com/${data.groom.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-[11px] text-[#727464] hover:underline"
                >
                  @{data.groom.instagram.replace('@', '')}
                </a>
              )}
            </div>

            {/* Bride */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] shadow-sm border border-[#7F8170]/20 text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow mb-4 border border-[#727464]/30">
                <img
                  src={data.bride.photo || '/template/undangan_2/img/foto_editorial_bride.jpg'}
                  alt={data.bride.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#0C0D0C]">{data.bride.fullName || data.bride.name}</h3>
              <p className="text-xs text-[#7F8170] mt-1 mb-2">Putri dari</p>
              <p className="text-xs text-[#0C0D0C]/80 font-medium">
                Bpk. {data.bride.fatherName || 'Ayah'} &amp; Ibu {data.bride.motherName || 'Ibu'}
              </p>
              {data.bride.instagram && (
                <a
                  href={`https://instagram.com/${data.bride.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-[11px] text-[#727464] hover:underline"
                >
                  @{data.bride.instagram.replace('@', '')}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* EVENTS SECTION */}
        <section id="acara" className="py-14 px-6 text-center text-white" style={{ backgroundColor: '#727464' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#FAF8F5]/70 font-semibold block mb-2">
            RANGKAIAN ACARA
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] mb-8">
            Agenda Pernikahan
          </h2>

          <div className="space-y-6 max-w-sm mx-auto">
            {data.events.map((evt) => (
              <div
                key={evt.id}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center"
              >
                <h3 className="font-serif text-xl text-[#FAF8F5] font-medium mb-2">{evt.title}</h3>
                <div className="w-8 h-px bg-[#FAF8F5]/40 mx-auto my-3"></div>
                <p className="text-xs uppercase tracking-wider text-[#FAF8F5]/90 mb-1">{evt.date}</p>
                <p className="text-xs text-[#FAF8F5]/80 mb-3">{evt.startTime} - {evt.endTime} {evt.timezone}</p>
                <p className="text-xs font-semibold text-[#FAF8F5]">{evt.locationName}</p>
                <p className="text-[11px] text-[#FAF8F5]/75 mt-0.5 mb-4">{evt.address}</p>
                {evt.mapsUrl && (
                  <a
                    href={evt.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF8F5] text-[#727464] text-xs font-semibold hover:bg-white transition-all shadow"
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
        <section id="galeri" className="py-14 px-6 text-center" style={{ backgroundColor: '#D8D3C5' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#7F8170] font-semibold block mb-2">
            MOMEN BAHAGIA
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#0C0D0C] mb-8">
            Galeri Foto
          </h2>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {data.gallery.slice(0, 6).map((img, idx) => (
              <div
                key={img.id || idx}
                className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm border border-[#7F8170]/20"
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
        <section id="tanda-kasih" className="py-14 px-6 text-center text-white" style={{ backgroundColor: '#727464' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#FAF8F5]/70 font-semibold block mb-2">
            TANDA KASIH
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] mb-4">
            Amplop Digital
          </h2>
          <p className="text-xs text-[#FAF8F5]/80 max-w-xs mx-auto mb-8">
            Doa restu Anda merupakan karunia terindah bagi kami. Namun apabila ingin memberikan tanda kasih:
          </p>

          <div className="space-y-4 max-w-xs mx-auto">
            {data.bankAccounts.map((bank) => (
              <div
                key={bank.id}
                className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-left"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase text-[#FAF8F5]">{bank.bankName}</span>
                  <span className="text-[10px] text-[#FAF8F5]/60 uppercase">Rekening</span>
                </div>
                <p className="font-mono text-base font-semibold text-[#FAF8F5] tracking-wider mb-1">
                  {bank.accountNumber}
                </p>
                <p className="text-xs text-[#FAF8F5]/80 mb-3">a.n. {bank.accountHolder}</p>
                <button
                  onClick={() => handleCopyAccount(bank.accountNumber, bank.id)}
                  className="w-full py-2 px-3 rounded-lg bg-[#FAF8F5] text-[#727464] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white transition-all cursor-pointer"
                >
                  {copiedBank === bank.id ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span>Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Salin Nomor Rekening</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* RSVP & UCAPAN */}
        <section id="ucapan" className="py-14 px-6 text-center" style={{ backgroundColor: '#D8D3C5' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#7F8170] font-semibold block mb-2">
            KONFIRMASI KEHADIRAN
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#0C0D0C] mb-6">
            Buku Tamu &amp; RSVP
          </h2>

          <div className="max-w-sm mx-auto">
            {rsvpSubmitted ? (
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-emerald-500/30 text-center mb-6">
                <Check size={28} className="text-emerald-600 mx-auto mb-2" />
                <h4 className="font-medium text-sm text-[#0C0D0C]">Terima Kasih!</h4>
                <p className="text-xs text-[#7F8170] mt-1">Konfirmasi dan ucapan Anda telah tersimpan.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRSVP} className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#7F8170]/20 text-left shadow-sm mb-8 space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#0C0D0C] block mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    required
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#7F8170]/30 focus:border-[#727464] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#0C0D0C] block mb-1">Konfirmasi Kehadiran</label>
                  <select
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#7F8170]/30 focus:border-[#727464] outline-none bg-white"
                  >
                    <option value="hadir">Hadir</option>
                    <option value="tidak">Tidak Hadir</option>
                    <option value="ragu">Ragu-ragu</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#0C0D0C] block mb-1">Jumlah Tamu</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rsvpPax}
                    onChange={(e) => setRsvpPax(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#7F8170]/30 focus:border-[#727464] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#0C0D0C] block mb-1">Ucapan &amp; Doa Restu</label>
                  <textarea
                    rows={3}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Tuliskan ucapan selamat..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#7F8170]/30 focus:border-[#727464] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#0C0D0C] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#727464] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={12} />
                  <span>Kirim Konfirmasi</span>
                </button>
              </form>
            )}

            {/* List ucapan */}
            <div className="space-y-3 text-left">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7F8170]">
                Ucapan Tamu ({data.rsvpList.length})
              </h4>
              {data.rsvpList.slice(0, 5).map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#7F8170]/20">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-[#0C0D0C]">{item.guestName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#727464]/10 text-[#727464] font-medium">
                      {item.attendance === 'hadir' ? 'Hadir' : item.attendance === 'tidak' ? 'Tidak Hadir' : 'Ragu'}
                    </span>
                  </div>
                  <p className="text-xs text-[#0C0D0C]/80 mt-1">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING / TERIMA KASIH */}
        <section id="terimakasih" className="py-16 px-6 text-center" style={{ backgroundColor: '#D8D3C5' }}>
          <p className="text-xs text-[#0C0D0C]/75 leading-relaxed max-w-xs mx-auto mb-6">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi kami.
          </p>

          <span className="text-[11px] uppercase tracking-widest text-[#7F8170] block mb-1">
            KAMI YANG BERBAHAGIA
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#0C0D0C] mb-6">
            {data.groom.name} &amp; {data.bride.name}
          </h3>

          <p className="text-[10px] text-[#7F8170] uppercase tracking-widest">
            &copy; 2025 The Wedding of {data.groom.name} &amp; {data.bride.name}
          </p>
        </section>

        <BottomNavBar onScrollTo={handleScrollTo} isVisible={isNavVisible} />
      </div>
    </div>
  );
};
