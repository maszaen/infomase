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

export const TemplateRoyalMaroon: React.FC<TemplateProps> = ({
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
    data.music?.url || '/template/undangan_6/music/Coral Island Overture.mp3';

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
    '/template/undangan_6/img/mempelai/mempelai_maroon_royal.jpg';

  return (
    <div
      ref={containerRef}
      className="artifact template-royal-maroon"
      style={{
        width: '100%',
        minHeight: '100%',
        position: 'relative',
        backgroundColor: '#21100F',
        backgroundImage: 'radial-gradient(circle at 50% 30%, #5A1018 0%, #3B080D 50%, #21100F 100%)',
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div
            className="relative w-full max-w-[430px] h-full flex flex-col items-center justify-between overflow-hidden shadow-2xl text-center px-6 py-12"
            style={{
              backgroundColor: '#3B080D',
              backgroundImage: 'radial-gradient(ellipse at 50% 35%, #5A1018 0%, #3B080D 60%, #21100F 100%)',
            }}
          >
            {/* Chandelier & Crown */}
            <div className="w-16 h-16 opacity-90 mb-2">
              <span className="text-3xl text-[#C49A55]">👑</span>
            </div>

            <div className="relative w-48 h-64 rounded-full overflow-hidden shadow-2xl border-4 border-[#C49A55] mx-auto my-auto p-1 bg-gradient-to-b from-[#C49A55] to-[#790F25]">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src={heroPhoto} alt="Royal Couple" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="mt-4 mb-6">
              <span className="text-[10px] uppercase tracking-[0.45em] text-[#C49A55] font-semibold block mb-1">
                ROYAL WEDDING INVITATION
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#F5E8D8] font-normal tracking-wide my-1">
                {data.groom.name} <span className="font-light italic text-[#C49A55]">&amp;</span> {data.bride.name}
              </h1>
              <p className="text-xs text-[#F5E8D8]/70 mt-1">{dateFormatted}</p>

              {guestName && (
                <div className="mt-4 py-2 px-6 rounded-full bg-white/10 border border-[#C49A55]/60 backdrop-blur-md inline-block shadow-lg">
                  <span className="text-[10px] text-[#C49A55] uppercase tracking-wider block">Yth. Tamu Kehormatan</span>
                  <span className="text-sm font-semibold text-[#F5E8D8]">{guestName}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleOpenInvitation}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#C49A55] via-[#E8C995] to-[#C49A55] text-[#3B080D] text-xs uppercase tracking-widest font-bold transition-all shadow-2xl hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <span>Buka Undangan</span>
              <Heart size={14} className="fill-current text-[#3B080D]" />
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
          backgroundColor: '#2A060E',
          minHeight: '100vh',
          boxShadow: '0 0 80px rgba(33, 16, 15, 0.75)',
          color: '#F5E8D8',
          position: 'relative',
        }}
      >
        {/* HERO */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col justify-between px-6 pt-12 pb-16 text-center text-[#F5E8D8]"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 50% 25%, #5A1018 0%, #3B080D 55%, #2A060E 100%)',
          }}
        >
          <div className="w-12 h-12 mx-auto flex items-center justify-center text-2xl text-[#C49A55]">
            <span>👑</span>
          </div>

          <div className="my-auto py-8">
            <span className="text-[10px] uppercase tracking-[0.45em] text-[#C49A55] font-semibold mb-2 block">
              THE ROYAL CELEBRATION
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#F5E8D8] leading-tight mb-2">
              {data.groom.name}
              <span className="block font-light italic text-[#C49A55] text-3xl my-1">&amp;</span>
              {data.bride.name}
            </h1>
            <div className="flex items-center justify-center gap-2 my-4">
              <span className="w-10 h-px bg-[#C49A55]"></span>
              <span className="text-xs text-[#C49A55]">⚜</span>
              <span className="w-10 h-px bg-[#C49A55]"></span>
            </div>
            <p className="text-xs uppercase tracking-widest text-[#F5E8D8]/80 font-medium">
              {dateFormatted}
            </p>
          </div>

          <div className="w-full max-w-[280px] mx-auto">
            <CountdownTimer targetDate={data.countdownDate} />
          </div>
        </section>

        {/* QUOTE */}
        <section id="prologue" className="py-12 px-6 text-center text-white" style={{ backgroundColor: '#3B080D' }}>
          <div className="w-8 h-8 mx-auto text-[#C49A55] text-xl mb-2">⚜</div>
          <p className="font-serif text-sm sm:text-base leading-relaxed italic max-w-sm mx-auto mb-4 text-[#F5E8D8]">
            &ldquo;{data.quote.text}&rdquo;
          </p>
          <span className="text-xs text-[#C49A55] font-semibold uppercase tracking-widest">
            {data.quote.source}
          </span>
        </section>

        {/* MEMPELAI */}
        <section id="mempelai" className="py-14 px-6 text-center" style={{ backgroundColor: '#2A060E' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C49A55] font-semibold block mb-2">
            PASANGAN MEMPELAI
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F5E8D8] mb-8">
            The Royal Couple
          </h2>

          <div className="space-y-8 max-w-xs mx-auto">
            <div className="p-6 rounded-3xl bg-[#3B080D] shadow-xl border border-[#C49A55]/40 text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow mb-4 border-2 border-[#C49A55]">
                <img
                  src={data.groom.photo || '/template/undangan_6/img/mempelai/foto_editorial_groom.jpg'}
                  alt={data.groom.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#F5E8D8]">{data.groom.fullName || data.groom.name}</h3>
              <p className="text-xs text-[#C49A55] mt-1 mb-2 font-medium">Putra tercinta dari</p>
              <p className="text-xs text-[#F5E8D8]/80">
                Bpk. {data.groom.fatherName || 'Ayah'} &amp; Ibu {data.groom.motherName || 'Ibu'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#3B080D] shadow-xl border border-[#C49A55]/40 text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow mb-4 border-2 border-[#C49A55]">
                <img
                  src={data.bride.photo || '/template/undangan_6/img/mempelai/foto_editorial_bride.jpg'}
                  alt={data.bride.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#F5E8D8]">{data.bride.fullName || data.bride.name}</h3>
              <p className="text-xs text-[#C49A55] mt-1 mb-2 font-medium">Putri tercinta dari</p>
              <p className="text-xs text-[#F5E8D8]/80">
                Bpk. {data.bride.fatherName || 'Ayah'} &amp; Ibu {data.bride.motherName || 'Ibu'}
              </p>
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section id="acara" className="py-14 px-6 text-center text-white" style={{ backgroundColor: '#3B080D' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C49A55] font-semibold block mb-2">
            RANGKAIAN ACARA
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F5E8D8] mb-8">
            Agenda Perhelatan
          </h2>

          <div className="space-y-6 max-w-sm mx-auto">
            {data.events.map((evt) => (
              <div
                key={evt.id}
                className="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-[#C49A55]/40 text-center"
              >
                <h3 className="font-serif text-xl text-[#C49A55] font-medium mb-2">{evt.title}</h3>
                <div className="w-8 h-px bg-[#C49A55]/40 mx-auto my-3"></div>
                <p className="text-xs uppercase tracking-wider text-[#F5E8D8]/90 mb-1">{evt.date}</p>
                <p className="text-xs text-[#F5E8D8]/80 mb-3">{evt.startTime} - {evt.endTime} {evt.timezone}</p>
                <p className="text-xs font-semibold text-[#F5E8D8]">{evt.locationName}</p>
                <p className="text-[11px] text-[#F5E8D8]/75 mt-0.5 mb-4">{evt.address}</p>
                {evt.mapsUrl && (
                  <a
                    href={evt.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C49A55] to-[#E8C995] text-[#3B080D] text-xs font-bold hover:brightness-110 transition-all shadow"
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
        <section id="galeri" className="py-14 px-6 text-center" style={{ backgroundColor: '#2A060E' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C49A55] font-semibold block mb-2">
            MOMEN INDAH
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F5E8D8] mb-8">
            Galeri Foto
          </h2>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {data.gallery.slice(0, 6).map((img, idx) => (
              <div
                key={img.id || idx}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-[#C49A55]/30"
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
        <section id="tanda-kasih" className="py-14 px-6 text-center text-white" style={{ backgroundColor: '#3B080D' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C49A55] font-semibold block mb-2">
            TANDA KASIH
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F5E8D8] mb-4">
            Kado Pernikahan
          </h2>
          <p className="text-xs text-[#F5E8D8]/80 max-w-xs mx-auto mb-8">
            Doa restu Anda adalah karunia terindah bagi kami. Bagi yang berkenan memberikan tanda kasih:
          </p>

          <div className="space-y-4 max-w-xs mx-auto">
            {data.bankAccounts.map((bank) => (
              <div
                key={bank.id}
                className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-[#C49A55]/40 text-left"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase text-[#C49A55]">{bank.bankName}</span>
                  <span className="text-[10px] text-white/60 uppercase">Rekening</span>
                </div>
                <p className="font-mono text-base font-semibold text-[#F5E8D8] tracking-wider mb-1">
                  {bank.accountNumber}
                </p>
                <p className="text-xs text-[#F5E8D8]/80 mb-3">a.n. {bank.accountHolder}</p>
                <button
                  onClick={() => handleCopyAccount(bank.accountNumber, bank.id)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C49A55] to-[#E8C995] text-[#3B080D] text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer"
                >
                  {copiedBank === bank.id ? (
                    <>
                      <Check size={14} className="text-[#3B080D]" />
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
        <section id="ucapan" className="py-14 px-6 text-center" style={{ backgroundColor: '#2A060E' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C49A55] font-semibold block mb-2">
            KONFIRMASI KEHADIRAN
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F5E8D8] mb-6">
            Buku Tamu Kehormatan
          </h2>

          <div className="max-w-sm mx-auto">
            {rsvpSubmitted ? (
              <div className="p-6 rounded-3xl bg-[#3B080D] border border-emerald-500/40 text-center mb-6 shadow-md">
                <Check size={28} className="text-emerald-400 mx-auto mb-2" />
                <h4 className="font-medium text-sm text-[#F5E8D8]">Terima Kasih!</h4>
                <p className="text-xs text-[#C49A55] mt-1">Konfirmasi dan ucapan Anda telah kami terima.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRSVP} className="p-6 rounded-3xl bg-[#3B080D] border border-[#C49A55]/30 text-left shadow-lg mb-8 space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#F5E8D8] block mb-1">Nama Tamu</label>
                  <input
                    type="text"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    required
                    placeholder="Nama Anda"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/20 border border-[#C49A55]/40 text-[#F5E8D8] focus:border-[#C49A55] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#F5E8D8] block mb-1">Konfirmasi</label>
                  <select
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#3B080D] border border-[#C49A55]/40 text-[#F5E8D8] focus:border-[#C49A55] outline-none"
                  >
                    <option value="hadir">Berkenan Hadir</option>
                    <option value="tidak">Mohon Maaf Tidak Hadir</option>
                    <option value="ragu">Masih Ragu</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#F5E8D8] block mb-1">Jumlah Tamu</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rsvpPax}
                    onChange={(e) => setRsvpPax(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/20 border border-[#C49A55]/40 text-[#F5E8D8] focus:border-[#C49A55] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#F5E8D8] block mb-1">Ucapan &amp; Doa Restu</label>
                  <textarea
                    rows={3}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Tuliskan ucapan selamat..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/20 border border-[#C49A55]/40 text-[#F5E8D8] focus:border-[#C49A55] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C49A55] to-[#E8C995] text-[#3B080D] text-xs uppercase tracking-wider font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send size={12} />
                  <span>Kirim Konfirmasi</span>
                </button>
              </form>
            )}

            <div className="space-y-3 text-left">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C49A55]">
                Doa Tamu Undangan ({data.rsvpList.length})
              </h4>
              {data.rsvpList.slice(0, 5).map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#3B080D] border border-[#C49A55]/20 shadow-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-[#F5E8D8]">{item.guestName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C49A55]/20 text-[#C49A55] font-medium">
                      {item.attendance === 'hadir' ? 'Hadir' : item.attendance === 'tidak' ? 'Tidak Hadir' : 'Ragu'}
                    </span>
                  </div>
                  <p className="text-xs text-[#F5E8D8]/80 mt-1">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <section id="terimakasih" className="py-16 px-6 text-center" style={{ backgroundColor: '#21100F' }}>
          <p className="text-xs text-[#F5E8D8]/75 leading-relaxed max-w-xs mx-auto mb-6">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
          </p>

          <span className="text-[11px] uppercase tracking-widest text-[#C49A55] block mb-1">
            KAMI YANG BERBAHAGIA
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#F5E8D8] mb-6">
            {data.groom.name} &amp; {data.bride.name}
          </h3>

          <p className="text-[10px] text-[#C49A55] uppercase tracking-widest">
            &copy; 2025 The Royal Wedding · {data.groom.name} &amp; {data.bride.name}
          </p>
        </section>

        <BottomNavBar onScrollTo={handleScrollTo} isVisible={isNavVisible} />
      </div>
    </div>
  );
};
