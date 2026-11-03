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

export const TemplatePawiwahanAgung: React.FC<TemplateProps> = ({
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
    data.music?.url || '/template/undangan_7/gamelan.mp3';

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
    '/template/undangan_7/cover-sepeda-onthel-batik.jpg';

  return (
    <div
      ref={containerRef}
      className="artifact template-pawiwahan-agung"
      style={{
        width: '100%',
        minHeight: '100%',
        position: 'relative',
        backgroundColor: '#1F130B',
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div
            className="relative w-full max-w-[430px] h-full flex flex-col items-center justify-between overflow-hidden shadow-2xl text-center px-6 py-12"
            style={{
              backgroundColor: '#2B1B10',
              backgroundImage: 'linear-gradient(rgba(31, 19, 11, 0.85), rgba(31, 19, 11, 0.92)), url("/template/undangan_7/bg-batik-pembuka.webp")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Gunungan Ornamen */}
            <div className="w-20 h-24 mx-auto opacity-90 mb-2">
              <img
                src="/template/undangan_7/ornamen-gunungan-batik.webp"
                alt="Gunungan"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="relative w-48 h-64 rounded-full overflow-hidden shadow-2xl border-2 border-[#C8984C] mx-auto my-auto p-1 bg-gradient-to-b from-[#C8984C] to-[#3E2818]">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src={heroPhoto} alt="Javanese Couple" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="mt-4 mb-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8984C] font-semibold block mb-1">
                SERAT ULEM DHAUPING PENGANTEN
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#FBF8F3] font-normal tracking-wide my-1">
                {data.groom.name} <span className="font-light italic text-[#C8984C]">&amp;</span> {data.bride.name}
              </h1>
              <p className="text-xs text-[#FBF8F3]/70 mt-1">{dateFormatted}</p>

              {guestName && (
                <div className="mt-4 py-2 px-6 rounded-full bg-white/10 border border-[#C8984C]/60 backdrop-blur-md inline-block shadow-lg">
                  <span className="text-[10px] text-[#C8984C] uppercase tracking-wider block">Katur Dhumateng:</span>
                  <span className="text-sm font-semibold text-[#FBF8F3]">{guestName}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleOpenInvitation}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#C8984C] to-[#DFB66E] text-[#1F130B] text-xs uppercase tracking-widest font-bold transition-all shadow-2xl hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <span>Bikak Serat Ulem</span>
              <Heart size={14} className="fill-current text-[#1F130B]" />
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
          backgroundColor: '#FDF9F3',
          minHeight: '100vh',
          boxShadow: '0 0 60px rgba(0, 0, 0, 0.45)',
          color: '#2C1D12',
          position: 'relative',
        }}
      >
        {/* HERO */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col justify-between px-6 pt-12 pb-16 text-center text-white"
          style={{
            backgroundColor: '#2B1B10',
            backgroundImage: 'linear-gradient(rgba(43, 27, 16, 0.88), rgba(43, 27, 16, 0.95)), url("/template/undangan_7/bg-batik-acara.webp")',
            backgroundSize: 'cover',
          }}
        >
          <div className="w-16 h-20 mx-auto opacity-90">
            <img
              src="/template/undangan_7/ornamen-gunungan-batik.webp"
              alt="Gunungan"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="my-auto py-8">
            <span className="text-[10px] uppercase tracking-[0.45em] text-[#C8984C] font-semibold mb-2 block">
              PAWIWAHAN AGUNG
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#FBF8F3] leading-tight mb-2">
              {data.groom.name}
              <span className="block font-light italic text-[#C8984C] text-3xl my-1">&amp;</span>
              {data.bride.name}
            </h1>
            <div className="flex items-center justify-center gap-2 my-4">
              <span className="w-10 h-px bg-[#C8984C]"></span>
              <span className="text-xs text-[#C8984C]">❖</span>
              <span className="w-10 h-px bg-[#C8984C]"></span>
            </div>
            <p className="text-xs uppercase tracking-widest text-[#FBF8F3]/80 font-medium">
              {dateFormatted}
            </p>
          </div>

          <div className="w-full max-w-[280px] mx-auto">
            <CountdownTimer targetDate={data.countdownDate} />
          </div>
        </section>

        {/* QUOTE */}
        <section id="prologue" className="py-12 px-6 text-center" style={{ backgroundColor: '#FDF9F3' }}>
          <div className="w-8 h-8 mx-auto text-[#C8984C] text-xl mb-2">✦</div>
          <p className="font-serif text-sm sm:text-base leading-relaxed italic max-w-sm mx-auto mb-4 text-[#2C1D12]">
            &ldquo;{data.quote.text}&rdquo;
          </p>
          <span className="text-xs text-[#8C531B] font-semibold uppercase tracking-widest">
            {data.quote.source}
          </span>
        </section>

        {/* MEMPELAI */}
        <section id="mempelai" className="py-14 px-6 text-center" style={{ backgroundColor: '#F3ECE0' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C531B] font-semibold block mb-2">
            PENGANTEN KEKALIH
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2C1D12] mb-8">
            Mempelai Penganten
          </h2>

          <div className="space-y-8 max-w-xs mx-auto">
            <div className="p-6 rounded-3xl bg-[#FDF9F3] shadow-md border border-[#C8984C]/30 text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow mb-4 border-2 border-[#C8984C]">
                <img
                  src={data.groom.photo || '/template/undangan_7/mempelai-pria-jawa.jpg'}
                  alt={data.groom.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#2C1D12]">{data.groom.fullName || data.groom.name}</h3>
              <p className="text-xs text-[#8C531B] mt-1 mb-2 font-medium">Putra Kakung saking</p>
              <p className="text-xs text-[#2C1D12]/80">
                Bpk. {data.groom.fatherName || 'Bapak'} &amp; Ibu {data.groom.motherName || 'Ibu'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FDF9F3] shadow-md border border-[#C8984C]/30 text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow mb-4 border-2 border-[#C8984C]">
                <img
                  src={data.bride.photo || '/template/undangan_7/mempelai-wanita-jawa.jpg'}
                  alt={data.bride.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#2C1D12]">{data.bride.fullName || data.bride.name}</h3>
              <p className="text-xs text-[#8C531B] mt-1 mb-2 font-medium">Putri Putri saking</p>
              <p className="text-xs text-[#2C1D12]/80">
                Bpk. {data.bride.fatherName || 'Bapak'} &amp; Ibu {data.bride.motherName || 'Ibu'}
              </p>
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section id="acara" className="py-14 px-6 text-center text-white" style={{ backgroundColor: '#2B1B10' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8984C] font-semibold block mb-2">
            TATACARA PAWIWAHAN
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FBF8F3] mb-8">
            Wekdal &amp; Papan Palenggahan
          </h2>

          <div className="space-y-6 max-w-sm mx-auto">
            {data.events.map((evt) => (
              <div
                key={evt.id}
                className="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-[#C8984C]/40 text-center"
              >
                <h3 className="font-serif text-xl text-[#C8984C] font-medium mb-2">{evt.title}</h3>
                <div className="w-8 h-px bg-[#C8984C]/40 mx-auto my-3"></div>
                <p className="text-xs uppercase tracking-wider text-[#FBF8F3]/90 mb-1">{evt.date}</p>
                <p className="text-xs text-[#FBF8F3]/80 mb-3">{evt.startTime} - {evt.endTime} {evt.timezone}</p>
                <p className="text-xs font-semibold text-[#FBF8F3]">{evt.locationName}</p>
                <p className="text-[11px] text-[#FBF8F3]/75 mt-0.5 mb-4">{evt.address}</p>
                {evt.mapsUrl && (
                  <a
                    href={evt.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C8984C] to-[#DFB66E] text-[#1F130B] text-xs font-bold hover:brightness-110 transition-all shadow"
                  >
                    <MapPin size={12} />
                    <span>Papan Palenggahan (Maps)</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section id="galeri" className="py-14 px-6 text-center" style={{ backgroundColor: '#FDF9F3' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C531B] font-semibold block mb-2">
            KENANGAN RESMI
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2C1D12] mb-8">
            Galeri Pawiwahan
          </h2>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {data.gallery.slice(0, 6).map((img, idx) => (
              <div
                key={img.id || idx}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm border border-[#C8984C]/30"
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
        <section id="tanda-kasih" className="py-14 px-6 text-center text-white" style={{ backgroundColor: '#2B1B10' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8984C] font-semibold block mb-2">
            TANDA TRESNA
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FBF8F3] mb-4">
            Kado Pawiwahan
          </h2>
          <p className="text-xs text-[#FBF8F3]/80 max-w-xs mx-auto mb-8">
            Donga pangestu panjenengan dados berkah ingkang utami tumrap gesang kula kekalih.
          </p>

          <div className="space-y-4 max-w-xs mx-auto">
            {data.bankAccounts.map((bank) => (
              <div
                key={bank.id}
                className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-[#C8984C]/40 text-left"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase text-[#C8984C]">{bank.bankName}</span>
                  <span className="text-[10px] text-white/60 uppercase">Rekening</span>
                </div>
                <p className="font-mono text-base font-semibold text-[#FBF8F3] tracking-wider mb-1">
                  {bank.accountNumber}
                </p>
                <p className="text-xs text-[#FBF8F3]/80 mb-3">a.n. {bank.accountHolder}</p>
                <button
                  onClick={() => handleCopyAccount(bank.accountNumber, bank.id)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C8984C] to-[#DFB66E] text-[#1F130B] text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer"
                >
                  {copiedBank === bank.id ? (
                    <>
                      <Check size={14} className="text-[#1F130B]" />
                      <span>Sampun Kasalin!</span>
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
        <section id="ucapan" className="py-14 px-6 text-center" style={{ backgroundColor: '#F3ECE0' }}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C531B] font-semibold block mb-2">
            RAWUH &amp; PANGESTU
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2C1D12] mb-6">
            Buku Tamu Pawiwahan
          </h2>

          <div className="max-w-sm mx-auto">
            {rsvpSubmitted ? (
              <div className="p-6 rounded-3xl bg-white border border-emerald-500/40 text-center mb-6 shadow-sm">
                <Check size={28} className="text-emerald-600 mx-auto mb-2" />
                <h4 className="font-medium text-sm text-[#2C1D12]">Matur Nuwun Sanget!</h4>
                <p className="text-xs text-[#8C531B] mt-1">Konfirmasi rawuh panjenengan sampun katampi.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRSVP} className="p-6 rounded-3xl bg-white border border-[#C8984C]/30 text-left shadow-md mb-8 space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#2C1D12] block mb-1">Asma Jangkep</label>
                  <input
                    type="text"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    required
                    placeholder="Asma Panjenengan"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#C8984C]/40 focus:border-[#8C531B] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#2C1D12] block mb-1">Konfirmasi Rawuh</label>
                  <select
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#C8984C]/40 focus:border-[#8C531B] outline-none bg-white"
                  >
                    <option value="hadir">Pasti Rawuh</option>
                    <option value="tidak">Mboten Saged Rawuh</option>
                    <option value="ragu">Taksih Rangu-rangu</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#2C1D12] block mb-1">Cacahing Tamu</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rsvpPax}
                    onChange={(e) => setRsvpPax(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#C8984C]/40 focus:border-[#8C531B] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#2C1D12] block mb-1">Donga &amp; Pangestu</label>
                  <textarea
                    rows={3}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Serat donga pangestu..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#C8984C]/40 focus:border-[#8C531B] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C8984C] to-[#DFB66E] text-[#1F130B] text-xs uppercase tracking-wider font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send size={12} />
                  <span>Kintun Donga Pangestu</span>
                </button>
              </form>
            )}

            <div className="space-y-3 text-left">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C531B]">
                Donga Pangestu Tamu ({data.rsvpList.length})
              </h4>
              {data.rsvpList.slice(0, 5).map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-white border border-[#C8984C]/20 shadow-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-[#2C1D12]">{item.guestName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8C531B]/15 text-[#8C531B] font-medium">
                      {item.attendance === 'hadir' ? 'Rawuh' : item.attendance === 'tidak' ? 'Mboten Rawuh' : 'Ragu'}
                    </span>
                  </div>
                  <p className="text-xs text-[#2C1D12]/80 mt-1">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <section id="terimakasih" className="py-16 px-6 text-center" style={{ backgroundColor: '#FDF9F3' }}>
          <p className="text-xs text-[#2C1D12]/75 leading-relaxed max-w-xs mx-auto mb-6">
            Matur nuwun sanget awit saking sih kawigatosan saha donga pangestu panjenengan sedaya.
          </p>

          <span className="text-[11px] uppercase tracking-widest text-[#8C531B] block mb-1">
            INGKANG HAMENGKU GATI
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#2C1D12] mb-6">
            {data.groom.name} &amp; {data.bride.name}
          </h3>

          <p className="text-[10px] text-[#8C531B] uppercase tracking-widest">
            &copy; 2025 Pawiwahan Agung · {data.groom.name} &amp; {data.bride.name}
          </p>
        </section>

        <BottomNavBar onScrollTo={handleScrollTo} isVisible={isNavVisible} />
      </div>
    </div>
  );
};
