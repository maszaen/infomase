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

export const TemplateLuxuryIslamic: React.FC<TemplateProps> = ({
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
    data.music?.url || '/template/undangan_4/song.mp3';

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
    '/template/undangan_4/LUXURY-09-FOTO.jpg';

  return (
    <div
      ref={containerRef}
      className="artifact template-luxury-islamic"
      style={{
        width: '100%',
        minHeight: '100%',
        position: 'relative',
        backgroundColor: '#132A22',
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div
            className="relative w-full max-w-[430px] h-full flex flex-col items-center justify-between overflow-hidden shadow-2xl text-center px-6 py-12"
            style={{
              backgroundColor: '#1B4D3E',
              backgroundImage: 'radial-gradient(circle at 50% 30%, #2A6653 0%, #1B4D3E 60%, #132A22 100%)',
            }}
          >
            {/* Basmalah */}
            <div className="text-xl text-[#D4AF37] tracking-wider my-2 font-serif">
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>

            {/* Arch Mihrab Photo Frame */}
            <div
              className="relative w-48 h-64 overflow-hidden shadow-2xl mx-auto my-auto border-2 border-[#D4AF37]"
              style={{
                borderRadius: '100px 100px 20px 20px',
              }}
            >
              <img src={heroPhoto} alt="Couple" className="w-full h-full object-cover" />
            </div>

            {/* Typography */}
            <div className="mt-4 mb-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold block mb-1">
                WALIMATUL &lsquo;URS
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal tracking-wide my-1">
                {data.groom.name} <span className="font-light italic text-[#D4AF37]">&amp;</span> {data.bride.name}
              </h1>
              <p className="text-xs text-white/70 mt-1">{dateFormatted}</p>

              {guestName && (
                <div className="mt-4 py-2 px-5 rounded-full bg-white/10 border border-[#D4AF37]/50 backdrop-blur-md inline-block">
                  <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider block">Kepada Yth.</span>
                  <span className="text-sm font-semibold text-white">{guestName}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleOpenInvitation}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3DEB8] text-[#132A22] text-xs uppercase tracking-widest font-bold transition-all shadow-xl hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <span>Buka Undangan</span>
              <Heart size={14} className="fill-current text-[#132A22]" />
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
          backgroundColor: '#F7FAF8',
          minHeight: '100vh',
          boxShadow: '0 25px 70px -12px rgba(19, 42, 34, 0.45)',
          color: '#132A22',
          position: 'relative',
        }}
      >
        {/* HERO */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col justify-between px-6 pt-12 pb-16 text-center text-white"
          style={{
            backgroundColor: '#1B4D3E',
            backgroundImage: 'radial-gradient(circle at 50% 20%, #2A6653 0%, #1B4D3E 65%, #132A22 100%)',
          }}
        >
          <div className="text-lg text-[#D4AF37] font-serif tracking-widest pt-4">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>

          <div className="my-auto py-6">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold mb-2 block">
              THE WEDDING OF
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-white leading-tight mb-2">
              {data.groom.name}
              <span className="block font-light italic text-[#D4AF37] text-3xl my-1">&amp;</span>
              {data.bride.name}
            </h1>
            <div className="w-16 h-px bg-[#D4AF37] mx-auto my-4 opacity-70"></div>
            <p className="text-xs uppercase tracking-widest text-white/80 font-medium">
              {dateFormatted}
            </p>
          </div>

          <div className="w-full max-w-[280px] mx-auto">
            <CountdownTimer targetDate={data.countdownDate} />
          </div>
        </section>

        {/* QUOTE / AR-RUM */}
        <section id="prologue" className="py-12 px-6 text-center relative" style={{ backgroundColor: '#F7FAF8' }}>
          <div className="w-10 h-10 mx-auto rounded-full bg-[#1B4D3E]/10 flex items-center justify-center text-[#1B4D3E] mb-3">
            <span className="text-sm">✦</span>
          </div>
          <p className="font-serif text-sm sm:text-base leading-relaxed italic max-w-sm mx-auto mb-4 text-[#132A22]">
            &ldquo;{data.quote.text}&rdquo;
          </p>
          <span className="text-xs text-[#1B4D3E] font-semibold tracking-wider">
            ({data.quote.source})
          </span>
        </section>

        {/* MEMPELAI */}
        <section id="mempelai" className="py-14 px-6 text-center" style={{ backgroundColor: '#F0F5F2' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#1B4D3E] font-semibold block mb-2">
            MEMPELAI
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#132A22] mb-8">
            Pasangan Pengantin
          </h2>

          <div className="space-y-8 max-w-xs mx-auto">
            <div
              className="p-6 bg-white shadow-md border border-[#D4AF37]/30 text-center"
              style={{ borderRadius: '40px 40px 20px 20px' }}
            >
              <div
                className="w-24 h-32 mx-auto overflow-hidden shadow mb-4 border border-[#D4AF37]"
                style={{ borderRadius: '50px 50px 10px 10px' }}
              >
                <img
                  src={data.groom.photo || '/template/undangan_4/groom.jpg'}
                  alt={data.groom.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#132A22]">{data.groom.fullName || data.groom.name}</h3>
              <p className="text-xs text-[#1B4D3E] mt-1 mb-2 font-medium">Putra dari</p>
              <p className="text-xs text-[#132A22]/80">
                Bpk. {data.groom.fatherName || 'Ayah'} &amp; Ibu {data.groom.motherName || 'Ibu'}
              </p>
            </div>

            <div
              className="p-6 bg-white shadow-md border border-[#D4AF37]/30 text-center"
              style={{ borderRadius: '40px 40px 20px 20px' }}
            >
              <div
                className="w-24 h-32 mx-auto overflow-hidden shadow mb-4 border border-[#D4AF37]"
                style={{ borderRadius: '50px 50px 10px 10px' }}
              >
                <img
                  src={data.bride.photo || '/template/undangan_4/bride.jpg'}
                  alt={data.bride.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#132A22]">{data.bride.fullName || data.bride.name}</h3>
              <p className="text-xs text-[#1B4D3E] mt-1 mb-2 font-medium">Putri dari</p>
              <p className="text-xs text-[#132A22]/80">
                Bpk. {data.bride.fatherName || 'Ayah'} &amp; Ibu {data.bride.motherName || 'Ibu'}
              </p>
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section id="acara" className="py-14 px-6 text-center text-white" style={{ backgroundColor: '#1B4D3E' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block mb-2">
            JADWAL
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white mb-8">
            Rangkaian Acara
          </h2>

          <div className="space-y-6 max-w-sm mx-auto">
            {data.events.map((evt) => (
              <div
                key={evt.id}
                className="p-6 bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 text-center"
                style={{ borderRadius: '32px 32px 16px 16px' }}
              >
                <h3 className="font-serif text-xl text-[#D4AF37] font-medium mb-2">{evt.title}</h3>
                <div className="w-8 h-px bg-[#D4AF37]/50 mx-auto my-3"></div>
                <p className="text-xs uppercase tracking-wider text-white/90 mb-1">{evt.date}</p>
                <p className="text-xs text-white/80 mb-3">{evt.startTime} - {evt.endTime} {evt.timezone}</p>
                <p className="text-xs font-semibold text-white">{evt.locationName}</p>
                <p className="text-[11px] text-white/75 mt-0.5 mb-4">{evt.address}</p>
                {evt.mapsUrl && (
                  <a
                    href={evt.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#132A22] text-xs font-semibold hover:brightness-110 transition-all shadow"
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
        <section id="galeri" className="py-14 px-6 text-center" style={{ backgroundColor: '#F7FAF8' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#1B4D3E] font-semibold block mb-2">
            DOKUMENTASI
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#132A22] mb-8">
            Galeri Foto
          </h2>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {data.gallery.slice(0, 6).map((img, idx) => (
              <div
                key={img.id || idx}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm border border-[#D4AF37]/20"
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
        <section id="tanda-kasih" className="py-14 px-6 text-center text-white" style={{ backgroundColor: '#1B4D3E' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block mb-2">
            TANDA KASIH
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white mb-4">
            Kado Digital
          </h2>
          <p className="text-xs text-white/80 max-w-xs mx-auto mb-8">
            Doa restu Anda adalah berkah terindah bagi kami. Bagi keluarga dan sahabat yang ingin memberikan tanda kasih:
          </p>

          <div className="space-y-4 max-w-xs mx-auto">
            {data.bankAccounts.map((bank) => (
              <div
                key={bank.id}
                className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-[#D4AF37]/30 text-left"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase text-[#D4AF37]">{bank.bankName}</span>
                  <span className="text-[10px] text-white/60 uppercase">Rekening</span>
                </div>
                <p className="font-mono text-base font-semibold text-white tracking-wider mb-1">
                  {bank.accountNumber}
                </p>
                <p className="text-xs text-white/80 mb-3">a.n. {bank.accountHolder}</p>
                <button
                  onClick={() => handleCopyAccount(bank.accountNumber, bank.id)}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#D4AF37] text-[#132A22] text-xs font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer"
                >
                  {copiedBank === bank.id ? (
                    <>
                      <Check size={14} className="text-emerald-900" />
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

        {/* RSVP */}
        <section id="ucapan" className="py-14 px-6 text-center" style={{ backgroundColor: '#F0F5F2' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#1B4D3E] font-semibold block mb-2">
            DOA RESTU &amp; KEHADIRAN
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#132A22] mb-6">
            Buku Tamu
          </h2>

          <div className="max-w-sm mx-auto">
            {rsvpSubmitted ? (
              <div className="p-6 rounded-2xl bg-white border border-emerald-500/30 text-center mb-6 shadow-sm">
                <Check size={28} className="text-emerald-600 mx-auto mb-2" />
                <h4 className="font-medium text-sm text-[#132A22]">Jazakumullah Khairan!</h4>
                <p className="text-xs text-[#1B4D3E] mt-1">Konfirmasi dan doa restu Anda telah kami terima.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRSVP} className="p-6 rounded-2xl bg-white border border-[#D4AF37]/30 text-left shadow-sm mb-8 space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#132A22] block mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    required
                    placeholder="Nama Anda"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4AF37]/40 focus:border-[#1B4D3E] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#132A22] block mb-1">Konfirmasi Kehadiran</label>
                  <select
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4AF37]/40 focus:border-[#1B4D3E] outline-none bg-white"
                  >
                    <option value="hadir">Insya Allah Hadir</option>
                    <option value="tidak">Afwan Tidak Hadir</option>
                    <option value="ragu">Masih Ragu</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#132A22] block mb-1">Jumlah Hadir</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rsvpPax}
                    onChange={(e) => setRsvpPax(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4AF37]/40 focus:border-[#1B4D3E] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#132A22] block mb-1">Doa &amp; Ucapan</label>
                  <textarea
                    rows={3}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Tuliskan doa untuk mempelai..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4AF37]/40 focus:border-[#1B4D3E] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#1B4D3E] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#132A22] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send size={12} />
                  <span>Kirim Doa Restu</span>
                </button>
              </form>
            )}

            <div className="space-y-3 text-left">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1B4D3E]">
                Doa Dari Kerabat ({data.rsvpList.length})
              </h4>
              {data.rsvpList.slice(0, 5).map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-white border border-[#D4AF37]/20 shadow-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-[#132A22]">{item.guestName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] font-medium">
                      {item.attendance === 'hadir' ? 'Hadir' : item.attendance === 'tidak' ? 'Tidak Hadir' : 'Ragu'}
                    </span>
                  </div>
                  <p className="text-xs text-[#132A22]/80 mt-1">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <section id="terimakasih" className="py-16 px-6 text-center" style={{ backgroundColor: '#F7FAF8' }}>
          <p className="text-xs text-[#132A22]/75 leading-relaxed max-w-xs mx-auto mb-4">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
          </p>

          <p className="text-xs font-semibold text-[#1B4D3E] mb-1">
            Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="text-[11px] text-[#132A22]/60 mb-4">Kami yang berbahagia,</p>

          <h3 className="font-serif text-3xl sm:text-4xl text-[#132A22] mb-6">
            {data.groom.name} &amp; {data.bride.name}
          </h3>

          <p className="text-[10px] text-[#1B4D3E] uppercase tracking-widest">
            &copy; 2025 The Wedding of {data.groom.name} &amp; {data.bride.name}
          </p>
        </section>

        <BottomNavBar onScrollTo={handleScrollTo} isVisible={isNavVisible} />
      </div>
    </div>
  );
};
