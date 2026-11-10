# MIGRATION_GUIDE.md — Runbook Migrasi Template Lama ke Standar Anvitation

**Untuk: tim desain (magang) + AI coding assistant masing-masing.**
Dokumen ini adalah langkah kerja migrasi SATU template lama ke sistem Anvitation. Hasil akhir migrasi = template lulus checklist di [`TEMPLATE_GUIDE.md`](TEMPLATE_GUIDE.md) bagian 15.

> **WAJIB BACA DULU: [`TEMPLATE_GUIDE.md`](TEMPLATE_GUIDE.md).** Runbook ini tidak mengulang kontraknya — semua atribut, manifest, dan perilaku wajib mengacu ke sana. Baca juga `AGENTS.md` repo dan patuhi aturannya (termasuk aturan terminal).

**Cara pakai yang disarankan:** buka repo ini di AI assistant kalian, lalu perintahkan: *"Migrasikan template `<nama/folder template lama>` mengikuti MIGRATION_GUIDE.md, kerjakan hanya di folder `public/template/undangan_X/` yang ditentukan."* Satu template per sesi kerja. Jangan migrasi banyak template sekaligus dalam satu sesi.

---

## Batas Keras (AI agent WAJIB patuh)

1. **Scope edit HANYA folder template sendiri**: `public/template/undangan_X/`. Dilarang menyentuh `cdn-vault/`, `backend-ci4/`, template lain, stub `public/template/template-bridge.js`, atau file root mana pun.
2. **Jangan mengubah angka versi** `?v=5` pada tag bridge — salin apa adanya.
3. **Jangan redesign.** Migrasi = normalisasi markup + perbaikan behavior, BUKAN mengubah tampilan. Kelas CSS, warna, layout, animasi existing dipertahankan.
4. Jangan menjalankan perintah terminal tanpa instruksi eksplisit (aturan repo).
5. Jika menemukan bug di engine/backend (bukan di template), **stop dan laporkan** — jangan diperbaiki sendiri.

---

## Step 0 — Persiapan Folder

1. Tentukan `folderId` berikutnya yang belum dipakai (lihat daftar folder di `public/template/`; saat dokumen ini ditulis sudah terpakai `undangan_1`–`undangan_8`). Konfirmasikan penomoran ke maszaen sebelum mulai.
2. Salin folder template lama ke **`public/template/undangan_X/`** (root repo). JANGAN ke `undangan_X/` root tanpa `public/` — itu scratch gitignored, tidak served.
3. Pastikan struktur sesuai TEMPLATE_GUIDE.md bagian 3: `index.html`, `css/`, `js/`, `asset/`, `audio/`. Rapikan yang tidak pada tempatnya.
4. Tentukan metadata: `id` (slug katalog, mis. `royal-maroon`), `name` (nama tampil), dan **tier**:
   - **Tier mahal**: ada galeri foto (section `#galeri` dengan beberapa `<img>`).
   - **Tier murah**: TANPA galeri. Bridge mendukung penuh — jangan mengarang section galeri palsu.

## Step 1 — Audit Inventaris (read-only, belum edit)

Baca `index.html` dan `js/script.js` template, buat catatan internal:

**A. Inventaris seksi** — ada/tidak: gate/sampul, hero, nama pasangan (semua lokasi!), nama tamu, tanggal, kutipan/ayat, profil mempelai (nama lengkap, orang tua, foto), acara (berapa kartu?), kisah cinta (berapa item?), galeri (berapa img?), amplop digital (berapa rekening?), alamat kado, form RSVP/ucapan, countdown, musik.

**B. Inventaris calon slot foto khusus** — setiap `<img>` atau `div[background-image]` yang fotonya milik user (bukan ornamen statis): posisi, rasio, apakah PNG cutout.

**C. Deteksi bug pattern** (semua ini pernah ditemukan di 8 template pertama — periksa satu per satu):

| Bug pattern | Cara deteksi |
|---|---|
| RSVP/ucapan hanya lokal | Handler submit tidak punya `postMessage` — cuma DOM/localStorage/alert |
| Id input tidak cocok dengan script | Script baca `getElementById('wishName')` tapi HTML id-nya `guestName` (atau sejenis) → TypeError saat submit |
| Tag HTML malformed | Cari `<img` yang tidak tertutup benar, atribut stray `/`, kutip tidak balance |
| Scroll lock custom | Body pakai class/inline selain `locked`/`is-locked`/`overflow:hidden` untuk mengunci scroll |
| Reveal tidak standar | Class animasi masuk tidak mengandung kata `reveal` |
| Countdown hardcoded total | Script tidak membaca `window.__CUSTOM_WEDDING_DATE__` |
| Autoplay suara | `audio autoplay`, atau YouTube embed `autoplay=1` |
| Elemen binding berisi child penting | Elemen yang akan diikat `textContent` punya `<span>`/`<cite>`/ikon di dalamnya |
| Class heuristik di label | Label seperti "DIGITAL ACCESS" memakai `font-mono` (bisa tertimpa nomor rekening) |
| Aset default tidak ada | Path gambar di HTML menunjuk file yang tidak ada di folder |

## Step 2 — Pasang Struktur Wajib

1. Tambahkan sebelum `</body>` (salin persis, jangan ubah versi):
   ```html
     <script src="js/script.js"></script>
     <script src="../template-bridge.js?v=5"></script>
   </body>
   ```
   (Jika template lama punya tag bridge versi lama, ganti ke `?v=5`.)
2. Perbaiki tag malformed yang ditemukan di Step 1C.
3. Pastikan semua aset yang direferensikan HTML benar-benar ada di folder; salin yang kurang dari template lama.

## Step 3 — Normalisasi Atribut `data-*`

Pasang atribut sesuai kamus TEMPLATE_GUIDE.md bagian 6. **Pemetaan cepat:**

| Elemen desain lama | Atribut wajib |
|---|---|
| Semua teks "NamaPria & NamaWanita" (gate, hero, penutup) | `data-couple-names` |
| Teks nama tamu di gate | `data-guest-name` |
| Teks tanggal utama (yang mengandung angka) | `data-wedding-date` |
| Teks kutipan/ayat | `data-quote-text` (bungkus span jika ada child!) |
| Sumber kutipan | `data-quote-source` |
| Foto/nama lengkap/orang tua pria | `data-groom-photo` / `data-groom-fullname` / `data-groom-parents` |
| Foto/nama lengkap/orang tua wanita | `data-bride-photo` / `data-bride-fullname` / `data-bride-parents` |
| Kartu acara (urut: akad lalu resepsi) | `data-event-card` + inner: `data-event-title`, `data-event-date`, `data-event-time`, `data-event-venue`, `data-event-address` |
| Item timeline kisah | `data-story-item` + inner: `data-story-year`, `data-story-title`, `data-story-description` |
| Setiap img galeri (tier mahal) | `data-gallery-img` |
| Kartu rekening | `data-bank-card` + inner: `data-bank-name`, `data-account-number`, `data-account-holder` |
| Tombol salin rekening | `data-copy="<nomor>"` (atau `data-copy-target`) |
| Teks alamat kado | `data-gift-address` |
| Foto user non-inti (sampul/hero/story/closing) | `data-slot="<key standar>"` (+ `data-slot-cutout="true"` jika PNG transparan) |

Aturan pengerjaan:
- **Atribut saja.** Jangan mengubah class/id/layout yang sudah ada, kecuali id yang konflik dengan kontrak standar (gate, musik, form RSVP).
- Elemen yang akan diikat tapi punya child penting → **bungkus teksnya dengan `<span data-...>`**, jangan ikat parent-nya.
- Tidak punya elemen untuk suatu data (mis. tidak ada alamat di kartu acara)? **Lewati atributnya** — jangan bikin elemen kosong.
- Jumlah kartu acara yang di-inject maksimal 2 (akad + resepsi). Jika desain punya lebih, beri atribut hanya pada 2 utama.

## Step 4 — Buat `template.json`

1. Inventaris slot dari Step 1B → daftarkan hanya yang benar-benar ada di HTML, pakai key standar (TEMPLATE_GUIDE.md bagian 5).
2. Setiap `default` = path file lokal yang NYATA ada. Verifikasi satu per satu.
3. Tier mahal: `gallery.max` maks 8, `recommended` = jumlah img galeri di HTML.
4. **Tier murah (tanpa galeri):** tulis `"gallery": { "min": 0, "max": 0, "recommended": 0 }` dan `"slots": [...]` sesuai slot yang ada (boleh `[]` jika memang tidak ada slot foto khusus).
5. `cutout: true` hanya untuk slot PNG transparan, dan elemennya wajib punya `data-slot-cutout="true"`.

## Step 5 — Perbaikan Behavior

1. **Gate**: id elemen → `#gateCover` (atau `#gate-cover`/`#sec`); fungsi buka → expose `window.openGate` atau `window.bukaUndangan`; scroll lock pakai class `locked`/`is-locked` di body atau inline `overflow:hidden`.
2. **Reveal**: pastikan class animasi entrance mengandung kata `reveal`. Jangan tambah scroll-jacking; hapus jika ada.
3. **Countdown**: ganti sumber tanggal hardcoded dengan pola wajib:
   ```js
   var custom = window.__CUSTOM_WEDDING_DATE__;
   var parsed = custom ? new Date(custom) : null;
   var target = (parsed && !isNaN(parsed.getTime())) ? parsed : new Date('<tanggal-dummy-lama>');
   ```
4. **RSVP/ucapan**: setelah validasi nama & pesan di handler submit, sisipkan snippet `RSVP_SUBMIT` dari TEMPLATE_GUIDE.md bagian 11 (salin mentah, sesuaikan nama variabel). Pastikan nilai attendance lowercase `hadir`/`ragu`/`tidak` — perbaiki `value` option select jika perlu. UX lokal yang sudah ada boleh tetap dipertahankan.
5. **Musik**: tombol → id standar (`#musicBtn` dst.); hapus autoplay bersuara; YouTube `autoplay=1` → `autoplay=0` atau hapus param.
6. **Form RSVP**: usahakan input nama ber-id `wishName`, pesan `wishMessage`, select `attendanceSelect`, di dalam form `#rsvpForm`/`#rsvp-form` — perbaiki id HTML atau script agar KONSISTEN (bug pattern Step 1C).

## Step 6 — Verifikasi Mandiri (sebelum lapor)

Lakukan lewat tool baca/search editor (bukan terminal):

- [ ] Setiap `slots[].key` di manifest punya pasangan `data-slot=` di HTML, dan sebaliknya.
- [ ] Setiap `default` manifest menunjuk file yang ada.
- [ ] `RSVP_SUBMIT` ditemukan di `js/script.js`.
- [ ] `__CUSTOM_WEDDING_DATE__` ditemukan di `js/script.js`.
- [ ] Tag bridge `?v=5` ada sebelum `</body>`; tidak ada script template setelahnya.
- [ ] Tidak ada id ganda yang diperkenalkan oleh editmu.
- [ ] Semua item checklist TEMPLATE_GUIDE.md bagian 15 terpenuhi.

Test visual (oleh designer, di browser — server lokal tim harus jalan):
- Buka via server backend lokal: `/template/undangan_X/index.html?studio=1&opened=1` → gate terbuka, scroll lancar, semua section terlihat, musik mati, tidak ada error console. (CDN lokal harus jalan agar bridge termuat.)
- Buka tanpa query → tampilan dummy rapi, gate berfungsi normal, submit ucapan memunculkan UX lokal tanpa error.
- (Opsional, bila sudah diregistrasi) buka Studio undangan sungguhan → ketik nama panggilan di form → nama di preview ikut berubah live.

## Step 7 — Laporan Serah Terima ke maszaen

Kirim ringkasan dengan format ini (registrasi katalog ke DB/admin adalah pekerjaan maszaen, BUKAN scope migrasi):

```text
MIGRASI SELESAI: <Nama Template>
folderId   : undangan_X
id katalog : <slug-id>
tier       : mahal / murah
slots      : <daftar key, atau "tidak ada">
galeri     : <jumlah img> / tanpa galeri
perubahan  : <ringkasan bug yang diperbaiki>
caveat     : <hal yang sengaja tidak disentuh / perlu keputusan maszaen>
```

---

## Referensi Implementasi Nyata

Jangan menebak — contohkan dari template yang sudah lulus migrasi:

| Pola | Contoh terbaik |
|---|---|
| Manifest + slot cutout | `public/template/undangan_2/template.json` + `index.html` |
| Manifest triptych (3 foto hero) | `public/template/undangan_7/template.json` |
| RSVP postMessage di handler form | `public/template/undangan_5/js/script.js` (`submitWish`) |
| RSVP postMessage dengan presence pills | `public/template/undangan_4/js/script.js` (`btn-send-rsvp`) |
| Quote dibungkus span (ada child cite) | `public/template/undangan_7/index.html` (seksi quote) |
| Tombol salin `data-copy-target` | `public/template/undangan_4/index.html` (seksi amplop) |

## Estimasi

Migrasi 8 template pertama selesai ±30 menit oleh 2 AI agent paralel (4 template each), termasuk verifikasi. Per template realistis **15–30 menit** termasuk test visual. Untuk 17 template: bagi rata per orang, target selesai dalam 1 hari kerja santai. Kualitas > kecepatan — template yang lolos checklist tidak akan perlu disentuh lagi.