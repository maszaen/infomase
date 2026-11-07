'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CreditCard,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  Music4,
  QrCode,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { TEMPLATES, formatIDR } from '@/lib/templates';

/* ------------------------------------------------------------------ data */

const VALUE_COLUMNS = [
  {
    icon: Users,
    title: 'Undangan personal per tamu',
    body: 'Setiap tamu menerima tautan dengan namanya sendiri di cover, plus draf pesan WhatsApp yang siap kirim.',
  },
  {
    icon: MessageSquare,
    title: 'RSVP yang benar-benar dipakai',
    body: 'Konfirmasi kehadiran masuk real-time, lengkap dengan jumlah pax untuk menghitung porsi katering.',
  },
  {
    icon: QrCode,
    title: 'Amplop digital & QRIS',
    body: 'Nomor rekening dan QRIS tampil rapi di dalam undangan. Dana masuk langsung ke rekening Anda, tanpa potongan.',
  },
  {
    icon: MapPin,
    title: 'Lokasi yang tidak bikin nyasar',
    body: 'Tombol buka Google Maps dan simpan ke kalender di setiap acara — akad maupun resepsi.',
  },
  {
    icon: Music4,
    title: 'Musik, galeri, dan kisah cinta',
    body: 'Lagu latar, galeri lightbox, dan linimasa perjalanan Anda, semuanya bisa diganti sendiri.',
  },
  {
    icon: ShieldCheck,
    title: 'Editor langsung, tanpa antre admin',
    body: 'Ubah teks, foto, dan jadwal kapan saja. Perubahan tampil di preview seketika dan langsung tersimpan.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Pilih template',
    body: 'Lihat pratinjau asli di layar ponsel, bukan sekadar gambar statis. Tiap template punya harga sendiri.',
  },
  {
    step: '02',
    title: 'Bayar sekali',
    body: 'Satu pembayaran untuk satu template di satu acara. Tanpa langganan, tanpa perpanjangan otomatis.',
  },
  {
    step: '03',
    title: 'Isi & sebar',
    body: 'Lengkapi biodata, acara, dan galeri. Sebar tautan personal ke tamu lewat WhatsApp dari konsol yang sama.',
  },
];

const FAQS = [
  {
    q: 'Apakah ini langganan bulanan?',
    a: 'Bukan. Anda membeli satu template untuk satu acara, sekali bayar. Tidak ada tagihan berulang dan tidak ada masa aktif yang membuat undangan mati sendiri.',
  },
  {
    q: 'Berapa lama undangan saya tetap online?',
    a: 'Selama Anda tidak menghapusnya. Undangan yang sudah dibeli tidak pernah dinonaktifkan karena tanggal, karena yang Anda beli adalah lisensi permanen untuk acara tersebut.',
  },
  {
    q: 'Kalau saya ingin ganti desain di tengah jalan?',
    a: 'Lisensi terikat pada template dan undangan yang Anda beli. Kalau ingin pindah ke desain lain, Anda membeli template itu untuk undangan tersebut. Konten yang sudah Anda isi tetap aman dan tidak perlu diketik ulang.',
  },
  {
    q: 'Bisa membuat lebih dari satu undangan?',
    a: 'Bisa. Setiap undangan punya lisensinya sendiri, jadi Anda hanya membayar untuk undangan yang benar-benar dipakai. Cocok untuk acara keluarga yang berbeda.',
  },
  {
    q: 'Apakah amplop digital dipotong biaya admin?',
    a: 'Tidak. Tamu mentransfer atau memindai QRIS langsung ke rekening Anda. InfoMase tidak menahan dan tidak memotong dana tersebut.',
  },
  {
    q: 'Bagaimana kalau saya butuh bantuan?',
    a: 'Tim kami bisa dihubungi lewat WhatsApp pada jam kerja. Untuk pembelian, kami sertakan bukti pesanan dengan nomor referensi di konsol Anda.',
  },
];

/* --------------------------------------------------------------- sections */

function Hero() {
  const featured = TEMPLATES[0];
  return (
    <section className="section section-flush" style={{ paddingTop: 'var(--space-16)' }}>
      <div className="container">
        <div className="split" style={{ alignItems: 'center' }}>
          <div>
            <span className="eyebrow">
              <Sparkles size={13} /> Bayar per template, bukan per bulan
            </span>

            <h1 className="display" style={{ marginBottom: 'var(--space-4)' }}>
              Undangan pernikahan digital yang Anda <em style={{ fontStyle: 'normal', color: 'var(--brand)' }}>miliki</em>.
            </h1>

            <p className="lede" style={{ marginBottom: 'var(--space-6)' }}>
              Pilih satu desain, bayar sekali, dan undangan itu jadi milik Anda untuk acara tersebut.
              Lengkap dengan RSVP real-time, amplop digital, dan tautan personal untuk setiap tamu.
            </p>

            <div className="row cta-row" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              <Link href="/katalog" className="btn btn-lg btn-primary">
                Lihat katalog template <ArrowRight size={16} />
              </Link>
              <Link href={`/invite/${featured.demoSlug ?? 'raka-sinta'}`} className="btn btn-lg btn-secondary">
                Buka contoh undangan
              </Link>
            </div>

            <ul className="tick-list" style={{ gap: 'var(--space-1)' }}>
              <li>
                <Check size={15} /> Mulai dari {formatIDR(featured.price)} per template — sekali bayar
              </li>
              <li>
                <Check size={15} /> Tanpa langganan, tanpa masa aktif yang mengunci undangan
              </li>
              <li>
                <Check size={15} /> Siap dalam hitungan menit, bukan hitungan hari
              </li>
            </ul>
          </div>

          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

/** Static product still — a mini console + invitation, no fake KPI theatre. */
function HeroPreview() {
  return (
    <div style={{ position: 'relative' }}>
      <div className="panel" style={{ overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface-sunken)',
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--border-strong)' }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--border-strong)' }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--border-strong)' }} />
          <span
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 'var(--mock-base)',
              color: 'var(--ink-500)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            infomase.id/dashboard
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 168px', gap: 0 }}>
          <div style={{ padding: 'var(--space-4)', borderRight: '1px solid var(--border)' }}>
            <span className="label" style={{ fontSize: 'var(--mock-sm)' }}>
              Undangan
            </span>
            <div style={{ fontSize: 'var(--mock-xl)', fontWeight: 620, marginTop: 'var(--space-0-5)', letterSpacing: '-0.01em' }}>
              Raka &amp; Sinta
            </div>
            <div className="meta" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }}>
              /invite/raka-sinta
            </div>

            <div className="card" style={{ marginTop: 'var(--space-3)', padding: '10px 12px' }}>
              <div className="row-between" style={{ gap: 8 }}>
                <span className="label" style={{ fontSize: 'var(--mock-sm)' }}>
                  Terkonfirmasi
                </span>
                <span className="badge badge-success" style={{ fontSize: 'var(--mock-sm)' }}>
                  LIVE
                </span>
              </div>
              <div className="numeric" style={{ fontSize: 'var(--mock-2xl)', fontWeight: 700, marginTop: 'var(--space-0-5)' }}>
                186 <span style={{ fontSize: 'var(--mock-lg)', fontWeight: 500, color: 'var(--ink-500)' }}>tamu</span>
              </div>
              <div style={{ height: 4, borderRadius: 'var(--radius-pill)', background: 'var(--surface-sunken-2)', marginTop: 8 }}>
                <div style={{ width: '75%', height: '100%', borderRadius: 'var(--radius-pill)', background: 'var(--brand)' }} />
              </div>
            </div>

            <div className="stack-2" style={{ marginTop: 'var(--space-3)' }}>
              {[
                { name: 'Dinda Permata', msg: 'Insya Allah hadir, 2 orang', tone: 'success' },
                { name: 'Keluarga Bpk. Surya', msg: 'Hadir, 4 orang', tone: 'success' },
                { name: 'Tim Engineering', msg: 'Belum konfirmasi', tone: 'muted' },
              ].map((row) => (
                <div key={row.name} className="row-nowrap" style={{ gap: 8 }}>
                  <span
                    className={`status-dot ${row.tone === 'success' ? 'status-dot-live' : 'status-dot-draft'}`}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--mock-lg)', fontWeight: 560, color: 'var(--ink-900)' }}>{row.name}</div>
                    <div
                      style={{
                        fontSize: 'var(--mock-base)',
                        color: 'var(--ink-500)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.msg}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--artifact-paper)', padding: 'var(--space-4) var(--space-3)', textAlign: 'center' }}>
            <div
              style={{
                fontSize: 'var(--mock-xs)',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--artifact-accent)',
                fontWeight: 600,
              }}
            >
              The Wedding Of
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--mock-2xl)',
                lineHeight: 1.15,
                color: 'var(--artifact-ink)',
                marginTop: 4,
              }}
            >
              Raka &amp; Sinta
            </div>
            <div style={{ fontSize: 'var(--mock-sm)', color: 'var(--artifact-accent)', marginTop: 'var(--space-0-5)' }}>Sabtu, 12 Desember 2026</div>

            <div
              style={{
                height: 96,
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                margin: '12px auto',
                border: '1px solid var(--artifact-line)',
              }}
            >
              <img
                src="/template/undangan_1/img/foto_mempelai_dummy.jpg"
                alt=""
                width={144}
                height={96}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            <div
              style={{
                border: '1px solid var(--artifact-line)',
                borderRadius: 'var(--radius-xs)',
                padding: '6px 8px',
                fontSize: 'var(--mock-xs)',
                color: 'var(--artifact-accent)',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'block', fontSize: 'var(--mock-2xs)' }}>Kepada Yth.</span>
              <strong style={{ fontSize: 'var(--mock-md)', color: 'var(--artifact-ink)' }}>Budi Santoso</strong>
            </div>
          </div>
        </div>
      </div>

      <div
        className="panel"
        style={{
          position: 'absolute',
          right: -14,
          bottom: -22,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: 'var(--shadow-lg)',
          background: 'var(--surface)',
        }}
      >
        <CreditCard size={15} style={{ color: 'var(--brand)' }} />
        <div>
          <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 620, color: 'var(--ink-900)' }}>Lisensi permanen</div>
          <div style={{ fontSize: 'var(--mock-md)', color: 'var(--ink-500)' }}>1 template · 1 acara</div>
        </div>
      </div>
    </div>
  );
}

function TemplateShowcase() {
  const highlighted = TEMPLATES.filter((t) => t.isHighlighted !== false).slice(0, 6);
  return (
    <section id="template" className="section section-sunken">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow eyebrow-neutral">Pilihan Unggulan</span>
          <h2 className="section-title">Satu desain, satu harga, satu acara.</h2>
          <p className="section-subtitle">
            Setiap template dijual terpisah. Anda membayar hanya untuk desain yang Anda pakai — tidak ada
            paket bundel yang memaksa Anda mengambil fitur yang tidak dibutuhkan.
          </p>
        </div>

        <div
          className="grid-2"
          style={{
            gap: 'var(--space-5)',
          }}
        >
          {highlighted.map((tpl) => (
            <article key={tpl.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: 240, background: 'var(--surface-sunken)' }}>
                <img
                  src={tpl.previewImage}
                  alt={`Pratinjau template ${tpl.name}`}
                  width={560}
                  height={240}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <span
                  className="badge"
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--ink-700)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {tpl.category}
                </span>
                {tpl.badge && (
                  <span
                    className="badge"
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'var(--ink-900)',
                      color: 'var(--on-inverse)',
                      borderColor: 'var(--ink-900)',
                    }}
                  >
                    {tpl.badge}
                  </span>
                )}
              </div>

              <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1 }}>
                <div>
                  <div className="row-between" style={{ alignItems: 'flex-start', gap: 12 }}>
                    <h3 style={{ fontSize: 'var(--text-xl)' }}>{tpl.name}</h3>
                    <div className="price" style={{ flexShrink: 0, textAlign: 'right' }}>
                      {tpl.compareAt && tpl.compareAt > tpl.price && (
                        <span
                          style={{
                            display: 'block',
                            fontSize: 'var(--text-xs)',
                            color: 'var(--ink-400)',
                            textDecoration: 'line-through',
                          }}
                        >
                          {formatIDR(tpl.compareAt)}
                        </span>
                      )}
                      <span className="price-amount" style={{ fontSize: 'var(--text-xl)' }}>
                        {formatIDR(tpl.price)}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', marginTop: 4 }}>{tpl.tagline}</p>
                </div>

                <ul className="tick-list">
                  {tpl.includes.map((item) => (
                    <li key={item}>
                      <Check size={14} /> {item}
                    </li>
                  ))}
                </ul>

                <div className="row" style={{ marginTop: 'auto', gap: 'var(--space-2)' }}>
                  {tpl.demoSlug && (
                    <Link href={`/invite/${tpl.demoSlug}`} className="btn btn-secondary btn-block">
                      <ArrowUpRight size={14} /> Buka demo
                    </Link>
                  )}
                  <Link href={`/checkout?template=${tpl.id}`} className="btn btn-buy btn-block">
                    Beli {formatIDR(tpl.price)}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-8)' }}>
          <Link href="/katalog" className="btn btn-lg btn-primary">
            Lihat semua undangan ({TEMPLATES.length} desain) <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ValueProps() {
  return (
    <section id="fitur" className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow eyebrow-neutral">Isi undangan</span>
          <h2 className="section-title">Yang tamu Anda lihat, dan yang Anda kelola.</h2>
          <p className="section-subtitle">
            Bagian depan dibuat untuk tamu; bagian belakang dibuat untuk Anda. Keduanya berbagi data yang
            sama, jadi tidak ada rekap manual atau pesan WhatsApp yang tercecer.
          </p>
        </div>

        <div className="grid-3">
          {VALUE_COLUMNS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card" style={{ padding: 'var(--space-5)' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 34,
                    height: 34,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--brand-subtle)',
                    color: 'var(--brand)',
                    marginBottom: 'var(--space-3)',
                  }}
                >
                  <Icon size={17} />
                </span>
                <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 4 }}>{item.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>

        <div
          className="card"
          style={{
            marginTop: 'var(--space-8)',
            padding: 'var(--space-6)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-6)',
            background: 'var(--ink-900)',
            borderColor: 'var(--ink-900)',
          }}
        >
          {STEPS.map((step) => (
            <div key={step.step}>
              <span
                className="numeric"
                style={{ fontSize: 'var(--text-xs)', fontWeight: 620, color: 'rgba(255,255,255,0.45)' }}
              >
                {step.step}
              </span>
              <h3 style={{ fontSize: 'var(--text-md)', color: 'var(--on-inverse)', margin: '4px 0 6px' }}>{step.title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const starter = TEMPLATES[0];
  return (
    <section id="harga" className="section section-sunken">
      <div className="container">
        <div className="section-head section-head-center">
          <span className="eyebrow eyebrow-neutral">Harga</span>
          <h2 className="section-title">Sekali bayar per template. Titik.</h2>
          <p className="section-subtitle" style={{ marginInline: 'auto' }}>
            Tidak ada tingkatan paket yang perlu ditebak. Harga menempel pada desain yang Anda pilih, dan
            lisensi yang Anda dapat berlaku permanen untuk acara tersebut.
          </p>
        </div>

        <div className="grid-2" style={{ maxWidth: 880, marginInline: 'auto', alignItems: 'stretch' }}>
          <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <span className="label">Koleksi Modern &amp; Botanical</span>
              <h3 style={{ fontSize: 'var(--text-xl)', marginTop: 4 }}>Desain Populer</h3>
              <div className="price" style={{ marginTop: 'var(--space-3)' }}>
                <span className="price-amount">{formatIDR(starter.price)}</span>
                <span className="price-note">sekali bayar · permanen</span>
              </div>
            </div>
            <ul className="tick-list">
              {starter.includes.map((item) => (
                <li key={item}>
                  <Check size={14} /> {item}
                </li>
              ))}
            </ul>
            <Link href="/katalog" className="btn btn-secondary btn-block" style={{ marginTop: 'auto' }}>
              Jelajahi katalog
            </Link>
          </div>

          <div
            className="card"
            style={{
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              borderColor: 'var(--ink-900)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div>
              <span className="label" style={{ color: 'var(--brand)' }}>
                Koleksi Luxury &amp; Adat Nusantara
              </span>
              <h3 style={{ fontSize: 'var(--text-xl)', marginTop: 4 }}>Eksklusif &amp; Tradisional</h3>
              <div className="price" style={{ marginTop: 'var(--space-3)' }}>
                <span className="price-amount">Rp 79.000 – Rp 89.000</span>
                <span className="price-note">per acara</span>
              </div>
            </div>
            <ul className="tick-list">
              <li>
                <Check size={14} /> Lisensi permanen untuk 1 undangan
              </li>
              <li>
                <Check size={14} /> Semua fitur terbuka, tanpa paywall bertingkat
              </li>
              <li>
                <Check size={14} /> Tamu &amp; RSVP tanpa batas jumlah
              </li>
              <li>
                <Check size={14} /> Bukti pesanan dengan nomor referensi
              </li>
            </ul>
            <Link href="/katalog" className="btn btn-buy btn-block" style={{ marginTop: 'auto' }}>
              Pilih template <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <p className="meta" style={{ textAlign: 'center', marginTop: 'var(--space-5)' }}>
          Pembayaran diproses lewat QRIS, transfer bank, atau e-wallet. Invoice tersedia di konsol Anda.
        </p>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="section">
      <div className="container-narrow">
        <div className="section-head section-head-center">
          <span className="eyebrow eyebrow-neutral">Tanya jawab</span>
          <h2 className="section-title">Pertanyaan yang paling sering muncul.</h2>
        </div>

        <div className="stack-2">
          {FAQS.map((faq, index) => (
            <details key={faq.q} className="card" style={{ padding: 'var(--space-4) var(--space-5)' }} open={index === 0}>
              <summary
                style={{
                  cursor: 'pointer',
                  fontSize: 'var(--text-md)',
                  fontWeight: 600,
                  color: 'var(--ink-900)',
                  listStyle: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                {faq.q}
                <span aria-hidden style={{ color: 'var(--ink-400)', fontSize: 'var(--text-lg)', lineHeight: 1 }}>
                  +
                </span>
              </summary>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', marginTop: 'var(--space-3)' }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="section section-sunken">
      <div className="container-narrow" style={{ textAlign: 'center' }}>
        <h2 className="section-title">Pilih desain terbaik untuk hari bahagia Anda.</h2>
        <p className="section-subtitle" style={{ marginInline: 'auto' }}>
          Beli lisensi template pilihan Anda sekali saja, lengkapi detail acara, dan bagikan tautan personal
          kepada tamu undangan dalam hitungan menit.
        </p>
        <div className="row cta-row" style={{ justifyContent: 'center', marginTop: 'var(--space-5)', gap: 'var(--space-3)' }}>
          <Link href="/katalog" className="btn btn-lg btn-primary">
            Lihat semua undangan <ArrowRight size={16} />
          </Link>
          <Link href="/invite/raka-sinta" className="btn btn-lg btn-secondary">
            <ImageIcon size={15} /> Lihat contoh jadi
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <>
      <Hero />
      <TemplateShowcase />
      <ValueProps />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
