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

export const TemplatePawiwahanPethak: React.FC<TemplateProps> = ({
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
    data.music?.url || '/template/undangan_8/gamelan.mp3';

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
    '/template/undangan_8/cover-jawa-putih.jpg';

  return (
    <div
      ref={containerRef}
      className="artifact template-pawiwahan-pethak"
      style={{
        width: '100%',
        minHeight: '100%',
        position: 'relative',
        backgroundColor: '#EAE5DB',
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
              backgroundColor: '#FAF9F6',
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.88), rgba(250, 249, 246, 0.94)), url("/template/undangan_8/bg-batik-putih-halus.jpg")',
              backgroundSize: 'cover',
            }}
          >
            {/* White Gunungan */}
            <div className="w-16 h-20 mx-auto opacity-90 mb-2">
              <img
                src="/template/undangan_8/ornamen-gunungan-putih.svg"
                alt="Gunungan Pethak"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="relative w-48 h-64 rounded-full overflow-hidden shadow-2xl border-4 border-white mx-auto my-auto p-1 bg-gradient-to-b from-[#BC9144] to-[#FAF9F6]">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src={heroPhoto} alt="Javanese Bride & Groom" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="mt-4 mb-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#BC9144] font-semibold block mb-1">
                PAWIWAHAN PETHAK
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#2B2218] font-normal tracking-wide my-1">
                {data.groom.name} <span className="font-light italic text-[#BC9144]">&amp;</span> {data.bride.name}
              </h1>
              <p className="text-xs text-[#2B2218]/70 mt-1">{dateFormatted}</p>

              {guestName && (
                <div className="mt-4 py-2 px-6 rounded-full bg-white/90 border border-[#BC9144]/40 backdrop-blur-sm inline-block shadow-sm">
                  <span className="text-[10px] text-[#BC9144] uppercase tracking-wider block">Katur Dhumateng:</span>
                  <span className="text-sm font-semibold text-[#2B2218]">{guestName}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleOpenInvitation}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#BC9144] to-[#D7B46F] text-white text-xs uppercase tracking-widest font-bold transition-all shadow-xl hover:brightness-105 active:scale-95 cursor-pointer"
            >
              <span>Bikak Serat Ulem</span>
              <Heart size={14} className="fill-current text-white" />
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
          backgroundColor: '#FAF9F6',
          minHeight: '100vh',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.25)',
          color: '#2B2218',
          position: 'relative',
        }}
      >
        {/* HERO */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col justify-between px-6 pt-12 pb-16 text-center"
          style={{
            backgroundImage: 'linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(250, 249, 246, 0.85) 60%, #FAF9F6 100%), url("/template/undangan_8/bg-batik-putih-halus.jpg")',
            backgroundSize: 'cover',
          }}
        >
          <div className="w-14 h-16 mx-auto opacity-80">
            <img
              src="/template/undangan_8/ornamen-gunungan-putih.svg"
              alt="Gunungan"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="my-auto py-8">
            <span className="text-[10px] uppercase tracking-[0.45em] text-[#BC9144] font-semibold mb-2 block">
              SERAT DHAUPING PENGANTEN
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#2B2218] leading-tight mb-2">
              {data.groom.name}
              <span className="block font-light italic text-[#BC9144] text-3xl my-1">&amp;</span>
              {data.bride.name}
            </h1>
            <div className="flex items-center justify-center gap-2 my-4">
              <span className="w-10 h-px bg-[#BC9144]"></span>
              <span className="text-xs text-[#BC9144]">✦</span>
              <span className="w-10 h-px bg-[#BC9144]"></span>
            </div>
            <p className="text-xs uppercase tracking-widest text-[#2B2218]/80 font-medium">
              {dateFormatted}
            </p>
          </div>

          <div className="w-full max-w-[280px] mx-auto">
            <CountdownTimer targetDate={data.countdownDate} />
          </div>
        </section>

        {/* QUOTE */}
        <section id="prologue" className="py-12 px-6 text-center" style={{ backgroundColor: '#FAF9F6' }}>
          <p className="font-serif text-sm sm:text-base leading-relaxed italic max-w-sm mx-auto mb-4 text-[#2B2218]">
            &ldquo;{data.quote.text}&rdquo;
          </p>
          <span className="text-xs text-[#BC9144] font-semibold uppercase tracking-widest">
            {data.quote.source}
          </span>
        </section>

        {/* MEMPELAI */}
        <section id="mempelai" className="py-14 px-6 text-center" style={{ backgroundColor: '#F4EFE6' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#BC9144] font-semibold block mb-2">
            PENGANTEN KEKALIH
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2B2218] mb-8">
            Pasangan Mempelai
          </h2>

          <div className="space-y-8 max-w-xs mx-auto">
            <div className="p-6 rounded-3xl bg-white shadow-sm border border-[#BC9144]/25 text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow mb-4 border-2 border-[#BC9144]">
                <img
                  src={data.groom.photo || '/template/undangan_8/mempelai-pria-putih.jpg'}
                  alt={data.groom.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#2B2218]">{data.groom.fullName || data.groom.name}</h3>
              <p className="text-xs text-[#BC9144] mt-1 mb-2 font-medium">Putra Kakung saking</p>
              <p className="text-xs text-[#2B2218]/80">
                Bpk. {data.groom.fatherName || 'Bapak'} &amp; Ibu {data.groom.motherName || 'Ibu'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white shadow-sm border border-[#BC9144]/25 text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow mb-4 border-2 border-[#BC9144]">
                <img
                  src={data.bride.photo || '/template/undangan_8/mempelai-wanita-putih.jpg'}
                  alt={data.bride.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#2B2218]">{data.bride.fullName || data.bride.name}</h3>
              <p className="text-xs text-[#BC9144] mt-1 mb-2 font-medium">Putri Putri saking</p>
              <p className="text-xs text-[#2B2218]/80">
                Bpk. {data.bride.fatherName || 'Bapak'} &amp; Ibu {data.bride.motherName || 'Ibu'}
              </p>
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section id="acara" className="py-14 px-6 text-center" style={{ backgroundColor: '#FAF9F6' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#BC9144] font-semibold block mb-2">
            RANGKAIAN PAWIWAHAN
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2B2218] mb-8">
            Wekdal Acara
          </h2>

          <div className="space-y-6 max-w-sm mx-auto">
            {data.events.map((evt) => (
              <div
                key={evt.id}
                className="p-6 rounded-3xl bg-[#F4EFE6] border border-[#BC9144]/30 text-center shadow-xs"
              >
                <h3 className="font-serif text-xl text-[#BC9144] font-medium mb-2">{evt.title}</h3>
                <div className="w-8 h-px bg-[#BC9144]/40 mx-auto my-3"></div>
                <p className="text-xs uppercase tracking-wider text-[#2B2218]/90 mb-1">{evt.date}</p>
                <p className="text-xs text-[#2B2218]/80 mb-3">{evt.startTime} - {evt.endTime} {evt.timezone}</p>
                <p className="text-xs font-semibold text-[#2B2218]">{evt.locationName}</p>
                <p className="text-[11px] text-[#2B2218]/75 mt-0.5 mb-4">{evt.address}</p>
                {evt.mapsUrl && (
                  <a
                    href={evt.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#BC9144] to-[#D7B46F] text-white text-xs font-bold hover:brightness-105 transition-all shadow"
                  >
                    <MapPin size={12} />
                    <span>Petunjuk Lokasi (Maps)</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section id="galeri" className="py-14 px-6 text-center" style={{ backgroundColor: '#F4EFE6' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#BC9144] font-semibold block mb-2">
            KENANGAN
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2B2218] mb-8">
            Galeri Foto
          </h2>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {data.gallery.slice(0, 6).map((img, idx) => (
              <div
                key={img.id || idx}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm border border-[#BC9144]/25"
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
        <section id="tanda-kasih" className="py-14 px-6 text-center" style={{ backgroundColor: '#FAF9F6' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#BC9144] font-semibold block mb-2">
            TANDA TRESNA
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2B2218] mb-4">
            Kado Digital
          </h2>
          <p className="text-xs text-[#2B2218]/80 max-w-xs mx-auto mb-8">
            Donga pangestu panjenengan dados berkah ingkang langkung utami tumrap gesang kula kekalih.
          </p>

          <div className="space-y-4 max-w-xs mx-auto">
            {data.bankAccounts.map((bank) => (
              <div
                key={bank.id}
                className="p-5 rounded-2xl bg-[#F4EFE6] border border-[#BC9144]/30 text-left shadow-xs"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase text-[#BC9144]">{bank.bankName}</span>
                  <span className="text-[10px] text-[#2B2218]/60 uppercase">Rekening</span>
                </div>
                <p className="font-mono text-base font-semibold text-[#2B2218] tracking-wider mb-1">
                  {bank.accountNumber}
                </p>
                <p className="text-xs text-[#2B2218]/80 mb-3">a.n. {bank.accountHolder}</p>
                <button
                  onClick={() => handleCopyAccount(bank.accountNumber, bank.id)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#BC9144] to-[#D7B46F] text-white text-xs font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all cursor-pointer"
                >
                  {copiedBank === bank.id ? (
                    <>
                      <Check size={14} className="text-white" />
                      <span>Sampun Kasalin!</span>
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
        <section id="ucapan" className="py-14 px-6 text-center" style={{ backgroundColor: '#F4EFE6' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#BC9144] font-semibold block mb-2">
            RAWUH &amp; PANGESTU
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2B2218] mb-6">
            Buku Tamu Pawiwahan
          </h2>

          <div className="max-w-sm mx-auto">
            {rsvpSubmitted ? (
              <div className="p-6 rounded-3xl bg-white border border-emerald-500/40 text-center mb-6 shadow-sm">
                <Check size={28} className="text-emerald-600 mx-auto mb-2" />
                <h4 className="font-medium text-sm text-[#2B2218]">Matur Nuwun Sanget!</h4>
                <p className="text-xs text-[#BC9144] mt-1">Konfirmasi rawuh panjenengan sampun katampi.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRSVP} className="p-6 rounded-3xl bg-white border border-[#BC9144]/30 text-left shadow-sm mb-8 space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#2B2218] block mb-1">Asma Jangkep</label>
                  <input
                    type="text"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    required
                    placeholder="Asma Panjenengan"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#BC9144]/40 focus:border-[#BC9144] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#2B2218] block mb-1">Konfirmasi Rawuh</label>
                  <select
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#BC9144]/40 focus:border-[#BC9144] outline-none bg-white"
                  >
                    <option value="hadir">Pasti Rawuh</option>
                    <option value="tidak">Mboten Saged Rawuh</option>
                    <option value="ragu">Taksih Rangu-rangu</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#2B2218] block mb-1">Cacahing Tamu</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rsvpPax}
                    onChange={(e) => setRsvpPax(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#BC9144]/40 focus:border-[#BC9144] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#2B2218] block mb-1">Donga Pangestu</label>
                  <textarea
                    rows={3}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Serat donga pangestu..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#BC9144]/40 focus:border-[#BC9144] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#BC9144] to-[#D7B46F] text-white text-xs uppercase tracking-wider font-bold hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send size={12} />
                  <span>Kintun Donga Pangestu</span>
                </button>
              </form>
            )}

            <div className="space-y-3 text-left">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#BC9144]">
                Donga Pangestu Tamu ({data.rsvpList.length})
              </h4>
              {data.rsvpList.slice(0, 5).map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-white border border-[#BC9144]/20 shadow-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-[#2B2218]">{item.guestName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#BC9144]/15 text-[#BC9144] font-medium">
                      {item.attendance === 'hadir' ? 'Rawuh' : item.attendance === 'tidak' ? 'Mboten Rawuh' : 'Ragu'}
                    </span>
                  </div>
                  <p className="text-xs text-[#2B2218]/80 mt-1">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <section id="terimakasih" className="py-16 px-6 text-center" style={{ backgroundColor: '#FAF9F6' }}>
          <p className="text-xs text-[#2B2218]/75 leading-relaxed max-w-xs mx-auto mb-6">
            Matur nuwun sanget awit saking sih kawigatosan saha donga pangestu panjenengan sedaya.
          </p>

          <span className="text-[11px] uppercase tracking-widest text-[#BC9144] block mb-1">
            INGKANG HAMENGKU GATI
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#2B2218] mb-6">
            {data.groom.name} &amp; {data.bride.name}
          </h3>

          <p className="text-[10px] text-[#BC9144] uppercase tracking-widest">
            &copy; 2025 Pawiwahan Pethak · {data.groom.name} &amp; {data.bride.name}
          </p>
        </section>

        <BottomNavBar onScrollTo={handleScrollTo} isVisible={isNavVisible} />
      </div>
    </div>
  );
};
