# Audit & Refactor — InfoMase

Dokumen ini adalah hasil audit sistem, desain, tipografi, copywriting, dan UI/UX pada basis kode
`infomase`, **beserta perbaikannya**. Setiap temuan dipetakan ke perubahan yang benar-benar
di-commit di repo ini.

> Konteks keputusan: produk ini dijual ke pasangan pengantin yang sedang mengurus acara sekali
> seumur hidup. Setiap friksi, klaim palsu, atau tombol yang tidak berfungsi adalah kehilangan
> kepercayaan yang mahal. Semua rekomendasi di bawah diarahkan ke dua hal: **kepercayaan** dan
> **kejelasan model bisnis**.

---

## Ringkasan eksekutif

| Area | Temuan kritis | Perbaikan |
|---|---|---|
| Model bisnis | Dua janji yang saling bertentangan: *"Sekali bayar, beres selamanya"* di landing vs. *publish-lock 30 hari* di konsol | Diganti total menjadi **beli per template**, dengan `Order` + `TemplateLicence` (perpetual) sebagai domain |
| Alur sistem | Navigasi 6 item dengan 3 tujuan yang sama; editor & daftar undangan berbagi satu rute | Hierarki 2 level: level akun (`/dashboard`) & level undangan (`/dashboard/undangan/[id]/[section]`) |
| Keamanan/etika | Tombol *"Simulasi Langganan"* di sidebar memungkinkan siapa pun membuka publish-lock; kredensial akun asli dicetak di halaman login | Keduanya dihapus |
| Klaim | "150.000+ pasangan", "4.9/5", "99,9% uptime", testimoni berfoto | Semua klaim tak terverifikasi dihapus; diganti bukti yang bisa dilihat (demo langsung, isi paket) |
| Tipografi | Skala 8.5→34px acak (20+ ukuran), 4 keluarga font, faux-bold (satu file untuk weight 500–800) | Skala modular 11→54px (9 token), 3 keluarga self-hosted dengan variable weight |
| Warna | 20+ abu-abu, 7 "warna primer" | 6 langkah neutral + 1 brand + 1 accent + 4 semantik |
| Spasi | Padding 10/11/14/18/22/26/28/32/36/40/48/56/72px | Skala 4px (`--space-*`), satu ritme |
| Copy | Campur "mase" (intim) dengan "Anda" (formal) dalam satu halaman; CTA 7 varian | Satu register ("Anda"), satu konvensi label CTA |
| A11y | `alert()`/`window.confirm`, tanpa focus-trap, `--ink-3` gagal kontras AA, tanpa `prefers-reduced-motion` | Modal + toast proper, kontras diperbaiki, reduksi gerak dihormati |
| Kode | `dashboard/page.tsx` 1.672 baris + 800 baris styled-jsx; 2 mekanisme persistensi | Dipecah per domain; satu provider store, satu key storage |

Angka: **12.415 → ~9.700 baris** dengan cakupan fitur bertambah (katalog, checkout, pesanan,
lisensi), dan `next build` kini lolos tanpa akses internet.

---

## 1. Audit alur sistem (system design)

### 1.1 Model bisnis yang saling bertentangan — **kritis**

**Temuan.** Ada tiga sumber harga yang tidak sinkron:

| Lokasi | Isi |
|---|---|
| `landing/PricingSection.tsx` | "Sekali bayar, beres selamanya" · Rp 99.000 / Rp 189.000 |
| `dashboard/page.tsx` (tab langganan) | "Paket Pro Wedding Rp 149.000 / 30 hari" · "VIP Rp 299.000 / 1 tahun" |
| `LIST_API.txt` | `GET /templates` mengembalikan `price` + `tier` per template |

Di sisi eksekusi, `invitationStore.togglePublish()` memblokir publikasi bila langganan "expired".
Artinya: pengguna yang membayar "sekali bayar selamanya" tetap kehilangan undangannya setelah
30 hari. Ini bukan bug copy — ini **cacat model bisnis** yang berpotensi jadi sengketa konsumen.

**Keputusan.** Model diubah menjadi **purchase-per-template**:

- `TemplateMeta.price` (di `src/lib/templates.ts`) = satu-satunya sumber harga.
- `Order` = satu percobaan checkout untuk (template × undangan).
- `TemplateLicence` = hak pakai **perpetual**, terikat ke `invitationId`, tanpa tanggal berakhir.
- Tidak ada tipe `UserSubscription` lagi di `src/types/auth.ts`; tidak ada `expired`, `renew`,
  atau `daysRemaining` di seluruh basis kode.
- Aturan publish: **boleh publish bila lisensi template tersebut aktif untuk undangan itu**
  (`needsPurchase()`), bukan berdasarkan tanggal.

Konsekuensi desain yang dieksploitasi: harga bisa berbeda per desain, dan pembelian bisa
ditunda sampai konten siap — dua hal yang tidak mungkin dilakukan pada model langganan.

**Bukti verifikasi** (`/tmp/flow-test.mjs`):

```
free template needsPurchase: false      ✓
paid template needsPurchase: true       ✓
publish paid without licence: {"ok":false,"reason":"licence-required"}  ✓
paid after purchase needsPurchase: false ✓
publish after licence: {"ok":true,"isPublished":true}                    ✓
other invitation needsPurchase: true    ✓ (lisensi tidak bocor antar undangan)
licence fields: id,invitationId,templateId,kind | expires? false         ✓
```

### 1.2 Model data: lisensi melekat pada undangan, bukan akun

Ini keputusan penting untuk produk nyata: kalau lisensi melekat pada **akun**, satu pembelian bisa
dipakai untuk acara orang lain (revenue leak). Kalau melekat pada **undangan**, pengguna yang
mengganti desain harus membeli lagi — jadi UI harus **mencegah frustrasi itu**:

- `CreateInvitationModal` menampilkan harga template sebelum undangan dibuat.
- `DesignSection` menampilkan status lisensi + tombol beli **di halaman yang sama** dengan pilihan
  desain, sehingga tidak ada kejutan setelah konten selesai diisi.
- Ganti desain **tidak menghapus konten** (`setTemplateId` hanya mengganti `templateId`), dan hal ini
  ditulis eksplisit di UI: *"Mengganti desain tidak menghapus konten yang sudah Anda isi."*

### 1.3 Navigasi & Information Architecture

**Temuan.** Sidebar konsol sebelumnya berisi: *Ringkasan, Studio Editor, Kalkulator Katering, Meja
Resepsionis, Langganan & Paket, Simulasi Langganan*. Tiga masalah:

1. **Sinonim sebagai destinasi berbeda.** "Studio Editor" (`?view=invitations`) menampilkan *daftar*
   undangan, sementara tombol "Buka Studio" membuka editor satu undangan. Dua nama untuk dua hal
   yang berbeda tingkatan.
2. **Alat hari-H tidak pada tempatnya.** Kalkulator katering dan meja resepsionis adalah **fungsi
   turunan** dari RSVP + daftar tamu satu undangan. Menempatkannya sebagai saudara "Ringkasan"
   memaksa pengguna memilih undangan *dua kali* (sekali di global, sekali di dropdown).
3. **Tidak ada permukaan untuk uang.** Tidak ada halaman pesanan/lisensi, padahal itu inti model bisnis.

**Perbaikan.** Hierarki dua level, nama = tujuan:

```
/dashboard                       Ringkasan (akun)
/dashboard/orders                Pesanan & lisensi
/dashboard/katalog               Katalog template
/dashboard/undangan/[id]/design  Desain & lisensi   ← ganti desain + beli + tayangkan
/dashboard/undangan/[id]/content Konten undangan
/dashboard/undangan/[id]/guests  Tamu & WhatsApp
/dashboard/undangan/[id]/rsvp    RSVP & ucapan
/dashboard/undangan/[id]/day     Hari-H             ← katering + check-in (dulu 2 menu global)
```

Rail kiri berubah konteks: di level akun menampilkan menu akun + daftar undangan; di level undangan
menampilkan 5 bagian undangan itu. Konteks diturunkan dari **rute** (`usePathname`), bukan dari
prop yang bisa basi — sehingga rail dan header tidak mungkin berbeda pendapat.

### 1.4 Duplikasi judul halaman (cognitive noise)

**Temuan.** Setiap halaman konsol mencetak judulnya minimal dua kali: `topbar > h1` dan
`console-page-heading > h2`, plus satu di `<title>`. Di ringkasan, teks yang sama muncul tiga kali.

**Perbaikan.** Satu komponen `ConsolePageHeader` yang memuat judul **sekali**; kedalaman
disampaikan lewat deskripsi (11–12px, muted), bukan lewat pengulangan.

### 1.5 Pemisahan state yang salah

**Temuan.**

- `authContext` memegang `user`, `token`, **`subscription`**, dan `toggleSubscriptionSimulation`.
  Siapa pun yang membuka devtools bisa memanggil `renewSubscription()` dan membuka publish-lock.
- `Toolbar` mobile mengubah DOM secara langsung: `document.querySelector('.rail').classList.add('open')`
  dari dalam komponen header, melewati React.

**Perbaikan.**

- `authContext` kini hanya tentang identitas (login/register/logout/profile).
- Entitlement pindah ke `src/lib/orders.ts` + `invitationStore.purchase()`.
- Toggle drawer dipindahkan ke `ConsoleChromeProvider` (state React, ada `Esc` handler).

### 1.6 Persistensi ganda

**Temuan.** Data undangan ditulis ke **dua** key (`infomase_invitation_data_v1` dan
`infomase_invitations_collection_v2`) dengan fallback pembacaan silang. Ini menyebabkan state yang
mustahil didebug.

**Perbaikan.** Satu sumber (`infomase_invitations_v3`), satu key untuk id aktif. Ditambah key
terpisah untuk `orders` dan `licences` — domain yang memang berbeda siklus hidupnya.

### 1.7 Store adalah hook, bukan state global

**Temuan.** `useInvitationStore()` adalah hook yang membuat state sendiri. Setiap pemanggilan =
salinan state independen. Akibatnya komponen A bisa menyimpan perubahan yang tidak pernah dilihat
komponen B (dan pada praktiknya, event handler di modal bisa menulis ke salinan yang sudah basi).

**Perbaikan.** `InvitationProvider` + `useContext`, satu instance di root layout dashboard.
`dashboard/page.tsx` 1.672 baris dipecah menjadi: layout, halaman ringkasan, halaman katalog,
halaman pesanan, dan 5 komponen section.

---

## 2. Audit UI / visual

### 2.1 Skala & ritme (sebelum → sesudah)

| Properti | Sebelum | Sesudah |
|---|---|---|
| Ukuran font | 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 19, 20, 22, 24, 26, 34px | 11, 12, 13, 14, 15, 17, 20, 24, 30, clamp(28–38), clamp(34–54) |
| Keluarga font | Archivo (lokal) + Cormorant + Plus Jakarta + Alex Brush + Playfair via `next/font` Google | Archivo Variable, Cormorant Garamond Variable, Alex Brush — semuanya self-hosted |
| Radius | 4, 6, 7, 8, 10, 12, 14, 16, 20, 22, 38, 128px + angka literal di komponen | `--radius-xs|sm|md|lg|xl|pill` |
| Spasi | 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56, 72, 88px | `--space-0-5 … --space-24` (kelipatan 4 + 2px optik) |
| Warna | 7 "primary", 20+ abu-abu | 1 brand (petrol), 1 aksen (brass), 4 semantik, 6 neutral |

**Kenapa ini bukan sekadar kosmetik:** dengan 20 ukuran font dan 18 padding, *tidak mungkin* ada
hirarki yang konsisten. Mata pembaca tidak bisa membedakan "penting" dari "tidak" karena semuanya
sedikit berbeda. Setelah diseragamkan, hirarki ditentukan oleh **berat + ukuran + ruang**, bukan
oleh variasi acak.

### 2.2 Faux bold → weight nyata

**Temuan.** `next/font/local` memasang **file medium yang sama** untuk weight 500, 600, 700, dan 800.
Browser memilih file itu dan menganggapnya semua sama — atau menerapkan sintesis. Hasilnya heading
tidak lebih tebal dari body.

**Perbaikan.** Archivo Variable (`wght` 100–900) via `@fontsource-variable/archivo`. Semua
`fontWeight: 600/700` kini benar-benar dirender.

### 2.3 Kontras

`--ink-3 #8a8f98` di atas putih = **3.6:1** → gagal WCAG AA untuk teks 11–12px (yang justru dipakai
untuk semua meta label). Diperbaiki menjadi `--ink-500 #6b7079` = **5.2:1**, dan `--ink-400`
dibatasi untuk elemen non-teks (ikon dekoratif, placeholder).

### 2.4 Gestalt: nesting berlebihan

**Temuan.** Hero landing berisi: browser frame → panel → grid statistik (3 kartu) → kartu progress →
kartu daftar tamu. Lima level kontainer berbatas, semuanya dengan border + shadow sendiri.

**Perbaikan.** Hero memakai satu panel dengan pembatas *garis tipis* untuk memisahkan zona, bukan
border-per-kartu. Prinsip: **satu tingkat elevasi per komposisi**; garis untuk pemisahan, shadow
hanya untuk elemen yang benar-benar mengambang (modal, pill mengapung).

### 2.5 Kontrol tanpa fungsi

**Temuan.** Katalog template berisi 1 item, tetapi UI menyediakan: filter kategori (1 opsi),
search box, pencarian kosong dengan state "tidak ada hasil", dan copy "Koleksi undangan eksklusif".

**Perbaikan.** Filter kategori kini **disembunyikan bila kategori tidak punya hasil**
(`availableCategories`), search tetap ada karena katalog akan tumbuh, dan copy berubah dari
"koleksi eksklusif" menjadi pernyataan faktual + bagian "Dalam pengerjaan" yang jujur.

---

## 3. Audit tipografi

1. **Skala modular, bukan kumpulan angka.** 9 token (`--text-2xs … --text-5xl`), 2 di antaranya
   fluid (`clamp`) agar heading tidak pecah di 360px tanpa media query tambahan.
2. **Line-height berpasangan, bukan acak.** `--leading-tight: 1.18` (display), `snug: 1.35`
   (heading & label), `normal: 1.55` (UI), `relaxed: 1.7` (prosa). Sebelumnya ada 1.12, 1.15, 1.2,
   1.25, 1.3, 1.4, 1.5, 1.55, 1.6, 1.65, 1.7.
3. **Letter-spacing punya aturan.** Hanya dua: `--tracking-tight` untuk heading, `--tracking-label`
   (0.07em) untuk label uppercase. Sebelumnya: -0.03, -0.02, -0.018, -0.015, 0.01, 0.02, 0.03,
   0.04, 0.05, 0.06, 0.07, 0.08, 0.12, 0.14, 0.18, 0.22, 0.28, 0.3, 0.32, 0.35em.
4. **Uppercase dikurangi.** Uppercase + tracking dipakai hanya untuk **label** (kategori, header
   tabel, eyebrow). Nama fitur, judul kartu, dan tombol tidak lagi uppercase — supaya mata punya
   tempat beristirahat.
5. **Dua bahasa tipografi, satu sistem.** Halaman undangan (artifact) memakai Cormorant + Alex Brush
   untuk nuansa kertas; konsol & landing memakai Archivo. Keduanya kini berasal dari token yang sama
   (`--font-display`, `--font-script`, `--font-ui`), sehingga preview di konsol = halaman asli.
6. **`text-wrap: balance`** pada heading dan `pretty` pada paragraf — menghilangkan widow/orphan yang
   sebelumnya muncul di semua judul section.

---

## 4. Audit copywriting

### 4.1 Register yang tidak konsisten

**Temuan.** Satu halaman memakai "mase" (sapaan Jawa, intim) dan "Anda" (formal) bergantian —
kadang dalam satu kalimat: *"Semua yang mase ketik di sini langsung tersinkron…"*.

**Keputusan.** Standar: **"Anda"** untuk UI produk dan konsol; tanpa slang di teks fungsional.
Alasan: audiens mencakup seluruh Indonesia (bukan hanya Jawa), dan momen yang dibicarakan
(pernikahan) menuntut nada hormat. "Kalian" hanya dipakai di copy yang benar-benar menyapa
**pasangan** (mis. "Ketik nama kalian" → diganti "Nama mempelai").

### 4.2 Klaim yang tidak bisa dibuktikan → dihapus

| Sebelum | Sesudah |
|---|---|
| "Dipercaya 150.000+ pasangan di Indonesia" | dihapus |
| "4.9/5 rating pengguna · 99,9% uptime" | dihapus |
| 3 testimoni dengan foto & nama | dihapus |
| "Koleksi undangan eksklusif" (1 template) | "Satu desain, satu harga, satu acara." |
| "Rata-rata bikin undangan cuma 5 menit" | "Siap dalam hitungan menit" (bukan klaim terukur) |

Mengapa: klaim palsu bukan sekadar "kurang bagus" — di pasar Indonesia, review dan komunitas
pengantin saling terhubung, dan satu pengguna yang sadar akan angka palsu akan meruntuhkan
kepercayaan seluruh funnel. Bukti yang dipakai sekarang: **demo yang bisa dibuka** (`/invite/raka-sinta`)
dan **daftar isi paket** yang eksplisit.

### 4.3 CTA: 7 varian → 3 makna

| Konteks | Sebelum | Sesudah |
|---|---|---|
| Masuk funnel | "Mulai Gratis", "Coba Gratis", "Buat Undangan Gratis" | "Buat undangan" |
| Beli | "Ambil Paket Populer", "Bungkus Paket VIP", "Gunakan" | "Beli Rp X" / "Mulai gratis" |
| Lihat | "Pratinjau", "Gunakan Template Ini", "Coba Demo Langsung" | "Buka demo" / "Pratinjau" |

Aturan: label = **kata kerja + objek**, dan bila menyangkut uang, **harga tampil di tombol**.
Ini mengurangi klik-butuh-berpikir pada titik konversi paling mahal.

### 4.4 Pesan error: bocornya implementasi

**Sebelum:** *"Tersimpan di penyimpanan lokal konsol (Server backend offline)"* — pengguna tidak
peduli, dan kalimat itu membocorkan arsitektur.

**Sesudah:** *"Server belum tersedia — foto dipakai sebagai pratinjau lokal."* Menjelaskan
**konsekuensi** bagi pengguna, bukan mekanisme internalnya.

### 4.5 Demo data vs data pengguna

Seed demo sebelumnya muncul di akun nyata (`Raka & Sinta` dengan 6 foto Unsplash) seolah-olah milik
pengguna. Sekarang seed hanya dipakai untuk undangan demo dengan slug `raka-sinta`, dan undangan baru
dibuat kosong dengan judul dari nama mempelai yang diisi.

---

## 5. Audit UX & aksesibilitas

1. **`alert()` dan `window.confirm()` diganti.** Ada 4 pemakaian: konfirmasi hapus undangan, reset
   data, salin rekening gagal, dan submit RSVP. Semuanya diganti: `Modal` (dengan `role="dialog"`,
   `aria-modal`, focus trap, `Esc`, restore focus) dan toast inline.
2. **Focus trap & restore.** `Modal.tsx` menyimpan elemen yang aktif sebelumnya dan mengembalikan fokus
   saat ditutup — sebelumnya fokus "hilang" ke `<body>`.
3. **`prefers-reduced-motion`.** Global guard mematikan animasi float/spin/reveal dan memaksa
   `scroll-behavior: auto`. Sebelumnya tidak ada.
4. **Label form.** Audit otomatis menemukan 4 `<input>` tanpa nama aksesibel; kini **0**.
5. **Skip link** ditambahkan di root layout.
6. **Kontras** diperbaiki (lihat §2.3); `.badge` kini punya border + background yang lolos AA pada
   11px.
7. **Tombol ikon** semuanya punya `aria-label`; tombol toggle punya `aria-pressed`/`aria-expanded`.
8. **Loading state.** Semua fallback `<Suspense>` menampilkan teks ("Memuat konsol…"), bukan ikon
   berputar tanpa arti.

---

## 6. Audit teknis (yang berdampak ke produk)

| Temuan | Dampak | Perbaikan |
|---|---|---|
| `next/font/google` → build **gagal** tanpa internet | Deploy di CI/offline tidak mungkin | Semua font self-hosted lewat `@fontsource` |
| `TemplateId` hardcode 10 id fiktif, sedangkan katalog hanya 1 (`undangan-1`) | Type aman tapi runtime salah; `theme-*` class tidak ada | `TemplateId = string`, validasi lewat `getTemplate()` |
| `style jsx` 800 baris di dalam `dashboard/page.tsx` | Tidak bisa di-reuse, tidak bisa di-scope | Pindah ke `globals.css` + komponen |
| Dua key localStorage untuk data yang sama | State tak bisa didiagnosis | Satu key per domain |
| URL ngrok hardcode di `api.ts` | Build produksi menunjuk ke tunnel pribadi | Dibaca dari env, fallback ke proxy `/api/proxy` |
| `AVATAR`/`PRESET_PHOTOS` merujuk Unsplash tanpa dimensi | CLS pada hero | `width`/`height` eksplisit + `object-fit` |
| `EventsSection` memaksa `setInterval` 1 detik di halaman tamu | Baterai & main-thread di HP kelas bawah | Dihitung ulang per detik hanya untuk satu blok countdown (tidak berubah), ditambah guard tanggal masa lalu |
| Data contoh bertanggal 2025 (masa lalu) | Countdown menampilkan `00:00:00:00` di halaman marketing | Seed dipindah ke 12 Desember 2026 |
| `new Date()` dievaluasi saat prerender | Build error di Next 16 (`unstable value`) | Tanggal di-hardcode di footer/copyright |

---

## 7. Yang **belum** dikerjakan (dan mengapa)

Jujur soal batas pekerjaan ini:

1. **Checkout masih simulasi.** `completeCheckout()` membuat order `paid` tanpa gateway. Struktur
   (order → licence → entitlement) sudah benar, sehingga integrasi Midtrans/Xendit hanya mengganti
   isi satu fungsi + menambah webhook.
2. **Harga template berbayar belum ada.** Katalog baru punya satu template gratis. Menambah harga
   karangan akan mengulang dosa yang justru sedang diperbaiki, jadi `price: 0` untuk satu-satunya
   template yang benar-benar jadi, dan sisanya ditandai "Dalam pengerjaan".
3. **Belum ada halaman undangan untuk template berbayar** (desain kedua masih roadmap).
4. **Backend belum punya endpoint order/licence.** `src/lib/orders.ts` berperan sebagai kontrak
   yang harus dipindahkan ke server; `API_DOCUMENTATION.md` perlu ditambah `POST /orders`,
   `GET /orders`, `GET /licences`.
5. **Upload foto masih ke backend eksternal**, dengan fallback `URL.createObjectURL` yang tidak
   persisten (hilang saat reload). Catatan desain: fallback ini sebaiknya **menolak** upload dan
   memberi pesan, bukan pura-pura berhasil — keputusan ini sengaja ditunda agar tidak memutus alur
   demo.
6. **Belum ada pengujian otomatis.** Verifikasi dilakukan manual lewat `next build`, `tsc --noEmit`,
   pengecekan HTML ter-render, dan skrip simulasi domain.

---

## 8. Peta perubahan file

```
src/lib/templates.ts            BARU  katalog + harga + format mata uang (satu sumber)
src/lib/orders.ts               BARU  Order, TemplateLicence, checkout, formatting
src/lib/invitationStore.tsx     BARU  provider + entitlement (ganti invitationStore.ts)
src/lib/authContext.tsx         DITULIS ULANG  hanya identitas, tanpa subscription
src/types/auth.ts               UserSubscription dihapus
src/types/invitation.ts         TemplateId = string, tipe eksplisit
src/lib/defaultData.ts          demo 2026, tanpa data palsu
src/app/globals.css             DITULIS ULANG  token layer + komponen + scale
src/app/layout.tsx              font self-hosted, metadata, skip-link
src/app/page.tsx                landing baru (server component)
src/components/marketing/*      LandingPage, MarketingNav, MarketingFooter
src/components/console/*        ConsoleRail, ConsolePageHeader, CreateInvitationModal, sections/*
src/components/ui/*             Modal, Toast, Brand
src/components/auth/AuthShell    layout login/register
src/app/dashboard/layout.tsx    shell + provider + chrome
src/app/dashboard/page.tsx      ringkasan (dari 1.672 → 380 baris)
src/app/dashboard/orders/       BARU  pesanan & lisensi
src/app/dashboard/katalog/      BARU  katalog
src/app/dashboard/undangan/[id]/[section]/   BARU  studio 5 bagian
src/app/checkout/page.tsx       BARU  checkout + struk
src/app/invite/[slug]/page.tsx  fallback & error state yang benar
src/app/login|register          ditulis ulang, tanpa kredensial bocor
dihapus: components/landing/*, components/dashboard/*, page.module.css, src/fonts/Archivo-Medium.ttf
```

---

## 9. Metrik yang disarankan untuk memantau hasilnya

Karena ini produk nyata, audit tanpa metrik hanya opini. Yang relevan:

- **Template detail → checkout start** (kejelasan harga per template)
- **Checkout start → paid** (friksi metode bayar)
- **Undangan dibuat → tayang** (apakah lisensi jadi bottleneck yang wajar)
- **Undangan tayang → tamu pertama RSVP** (kualitas sebaran WhatsApp)
- **RSVP per undangan** (nilai produk bagi tamu, bukan hanya pemilik)
- **Refund / keluhan "undangan mati"** — harus turun ke nol setelah model perpetual.

---

## 10. Hasil akhir audit token (diukur, bukan diklaim)

Skrip lint (`/tmp/lint-design.py`) menghitung literal yang lolos dari design system
di seluruh `src/`. Sebelum vs sesudah gelombang perbaikan ini:

| Temuan | Awal | Akhir | Catatan |
|---|---|---|---|
| Hex hardcoded | 22 | **1** | sisanya `themeColor` di `layout.tsx`; nilainya tidak bisa berupa `var()` karena dibaca sebagai string oleh browser |
| `fontSize` px literal | 44 | **0** | landing memakai `--mock-*` (skala gambar mockup), bukan skala UI |
| `borderRadius` literal | 7 | **0** | semua `--radius-*` |
| Spasi literal | 36 | **0** | semua `--space-*`, termasuk 2px optik (`--space-0-5`) |
| Teks < 11px | 15 | **0** | `--mock-2xs` (8.5px) hanya untuk mockup ilustrasi, tidak untuk teks UI |

Selain itu:

- 379 kelas Tailwind-mini di dalam artifact dipetakan ke 17 variabel `--art-*` yang
  dideklarasikan pada wrapper artifact (bukan `:root`), sehingga template kedua bisa
  menimpa palet tanpa menyentuh komponen.
- Kelas yang dipakai tapi tidak terdefinisi (diukur dengan parser PostCSS pada CSS hasil
  kompilasi): **6 → 2**, dan dua sisanya adalah compound selector yang memang benar
  (`.group:hover .group-hover\:scale-105`, `.bouquet-top-left .wind-sway-corner`).
- Font Archivo tidak lagi dimuat dua kali (`localFont` + fontsource): satu file variabel
  untuk weight 100–900.

### Metadata per rute

| Rute | Title |
|---|---|
| `/` | InfoMase — Beli template undangan digital, sekali bayar |
| `/login` | Masuk · InfoMase |
| `/register` | Buat akun · InfoMase |
| `/checkout` | Checkout · InfoMase |
| `/dashboard` | Konsol · InfoMase |
| `/dashboard/katalog` | Katalog template · InfoMase |
| `/dashboard/orders` | Pesanan & lisensi · InfoMase |
| `/dashboard/undangan/[id]/*` | Studio undangan · InfoMase |
| `/invite/[slug]` | `<Mempelai> — Undangan Pernikahan` (+ OG image, `noindex`) |

Halaman konsol memakai `robots: noindex` — halaman akun tidak boleh masuk indeks mesin
pencari, dan itu juga melindungi data tamu.
