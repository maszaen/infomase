# TEMPLATE_GUIDE.md — Standar Wajib Template Undangan Anvitation

**Status: WAJIB / MENGIKAT.** Ini adalah satu-satunya dokumen standar resmi (canonical) untuk pembuatan template undangan baru (`undangan_9`, `undangan_10`, dst.). Dokumen lama di `public/template/TEMPLATE_GUIDE.md` sudah digantikan oleh file ini.

Desain (warna, font, layout, ornamen, animasi) **bebas sebebas-bebasnya**. Yang tidak bebas adalah **kontrak teknis** di dokumen ini. Template yang tidak memenuhi kontrak ini akan ditolak saat serah terima, karena Studio, preview, dan halaman publik tidak akan bisa mengenali datanya.

---

## 1. Di Mana Template Hidup (PENTING — Jangan Salah Folder)

| Lokasi | Status | Boleh diedit? |
|---|---|---|
| `public/template/undangan_X/` (root repo ini) | **SOURCE OF TRUTH.** File yang benar-benar served ke browser. Ter-track di git root. | **YA — hanya di sini.** |
| `backend-ci4/public/template/` | Symlink/junction ke `public/template/` di root. CI4 serving lewat sini (`base_url('template/...')`). | Jangan edit lewat path ini — edit di root `public/template/`. |
| `undangan_X/` di root (tanpa `public/`) | Folder scratch desain lama. **Gitignored, TIDAK served.** | Jangan dipakai. Edit di sini tidak akan muncul di browser. |

**Aturan emas: semua pekerjaan template dilakukan di `public/template/undangan_X/` (root).**

---

## 2. Arsitektur & Alur Data

Sistem aktif: **Monolith CI4 (`backend-ci4`) + CDN Vault (`cdn-vault`)**. Template adalah file statis HTML/CSS/JS biasa — tidak ada build step, tidak ada framework.

### 2.1 Komponen

```
┌─────────────────────────────────────────────────────────────────┐
│ STUDIO (user console)          │ HALAMAN PUBLIK (/invite/{slug})  │
│ studio-engine.js (CDN)         │ invite.php (wrapper CI4)         │
│ form editor → postMessage      │ push data + nama tamu          │
└──────────────┬─────────────────┴──────────────┬───────────────────┘
               │ postMessage                    │ postMessage
               ▼                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ IFRAME: template/undangan_X/index.html                          │
│                                                                 │
│  js/script.js        → logika lokal template (gate, countdown,  │
│                        lightbox, musik, render ucapan lokal)    │
│  ../template-bridge.js (stub LOKAL) → memuat engine dari CDN,   │
│                        mem-buffer pesan sampai engine siap      │
│  template-bridge.js (CDN, PROTECTED) → inject data ke DOM       │
│                        lewat atribut data-*                     │
└─────────────────────────────────────────────────────────────────┘
               │ postMessage RSVP_SUBMIT (arah balik ke parent)
               ▼
┌─────────────────────────────────────────────────────────────────┐
│ invite.php → POST /api/v1/public/invitations/{slug}/rsvp → DB     │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Tiga mode render template

1. **Static/native** — dibuka langsung tanpa parent. Tampilan dummy bawaan. Harus tetap rapi tanpa error JS.
2. **Studio preview** — iframe dengan query `?studio=1&opened=1&cdn=...`. Bridge otomatis: membuka gate tanpa animasi, memaksa scroll bisa, memaksa semua elemen reveal terlihat, mematikan/menyembunyikan musik, lalu meng-inject data form secara live.
3. **Publik** — iframe di dalam `invite.php` dengan query `?to=NamaTamu&cdn=...`. Wrapper mengirim `INIT_INVITATION_DATA` (data undangan + nama tamu). Gate tetap tertutup sampai tamu klik buka.

### 2.3 Pesan postMessage (kontrak engine — jangan diubah)

| Arah | Type | Isi |
|---|---|---|
| parent → template | `INIT_INVITATION_DATA` | `{ data, guestName, defaultOpened, isStudio? }` |
| parent → template | `UPDATE_INVITATION_DATA` | `{ data, isStudio? }` (live edit di Studio) |
| parent → template | `TOGGLE_GATE_PREVIEW` | `{ showGate: true/false }` |
| template → parent | `RSVP_SUBMIT` | `{ payload: { guestName, attendance, message, totalPax } }` **WAJIB dikirim saat tamu submit RSVP/ucapan** |

### 2.4 Cache versioning

Engine CDN di-deploy dengan cache `max-age=3600`. Setiap perubahan engine, tim sistem menaikkan versi (`?v=`). Desainer **tidak boleh** mengubah angka versi sendiri — cukup salin snippet script tag di bagian 4 apa adanya.

---

## 3. Struktur Folder Wajib

```text
public/template/undangan_X/
├── index.html          ← file utama, semua atribut data-* di sini
├── template.json       ← WAJIB: manifest slot foto & galeri (bagian 5)
├── css/
│   └── style.css       ← CSS template (boleh Tailwind Play CDN, boleh murni)
├── js/
│   ├── script.js       ← logika lokal template
│   └── tailwind.config.js (opsional, jika pakai Tailwind Play CDN)
├── asset/              ← gambar default/ornamen LOKAL
└── audio/              ← musik latar default (.mp3)
```

- Semua gambar default **harus file lokal yang benar-benar ada** di folder template (atau URL remote yang memang dipakai di HTML). Path bohong = form Studio menampilkan preview rusak.
- Dilarang dependensi build (npm, webpack, Tailwind CLI). Tailwind yang dipakai adalah **Play CDN** (`https://cdn.tailwindcss.com`), seperti template 1–6. Template 7–8 memakai CSS murni — dua-duanya sah.

---

## 4. Script Wajib di `index.html`

Di paling bawah `index.html`, **tepat sebelum `</body>`**, wajib ada (salin apa adanya):

```html
  <!-- JavaScript Application Logic -->
  <script src="js/script.js"></script>
  <!-- Universal Anvitation Template Bridge — JANGAN DIHAPUS/DIUBAH -->
  <script src="../template-bridge.js?v=5"></script>
</body>
</html>
```

- Stub lokal ini memuat engine protected dari CDN Vault dan mem-buffer pesan parent sampai engine siap. Tanpa tag ini, template **mati total** di Studio dan halaman publik (data tidak pernah ter-inject).
- Jangan menaruh script template sendiri setelah tag bridge.

---

## 5. `template.json` — Manifest Wajib

Studio membaca manifest ini (via `ConsoleController`) untuk **merender form upload foto otomatis**. Tanpa file ini, form foto template kosong dan user tidak bisa ganti foto.

```json
{
  "id": "nama-template-id",
  "folderId": "undangan_X",
  "name": "Nama Template Tampil",
  "gallery": {
    "min": 1,
    "max": 8,
    "recommended": 6,
    "aspect": "3:4"
  },
  "slots": [
    {
      "key": "cover.photo",
      "label": "Foto Sampul Pembuka (Gate Cover)",
      "section": "Sampul Pembuka",
      "aspect": "3:4",
      "cutout": false,
      "hint": "Petunjuk singkat untuk user di form Studio.",
      "default": "asset/img/foto_sampul.jpg"
    }
  ]
}
```

### Aturan manifest

- `id` = id template di katalog (mis. `boho-botanical`), `folderId` = nama folder.
- `gallery.max` maksimal **8**; `recommended` = jumlah `<img>` galeri yang benar-benar ada di HTML.
- Setiap `slots[].key` **wajib** punya elemen ber-atribut `data-slot="<key>"` di `index.html`. Sebaliknya, setiap `data-slot` di HTML wajib terdaftar di manifest.
- `default` wajib path file yang **benar-benar ada** (relatif terhadap folder template).
- `cutout: true` **hanya** jika desain asli memakai foto PNG transparan (crop badan tanpa background). Wajib disertai `data-slot-cutout="true"` di elemen HTML-nya.

### Key standar slot (pakai ini, jangan bikin nama sendiri)

| Key | Posisi |
|---|---|
| `cover.photo` | Foto sampul pembuka (gate) |
| `hero.photo` | Foto utama beranda |
| `hero.secondaryPhoto` | Foto kedua/candid beranda |
| `hero.tertiaryPhoto` | Foto ketiga beranda (triptych) |
| `intro.photo` | Foto pembuka sebelum kutipan (jika terpisah dari hero) |
| `story.photo` | Foto banner kisah cinta |
| `event.photo` | Foto venue/acara |
| `closing.photo` | Foto penutup / terima kasih |

**Jangan daftarkan** `groom.photo`, `bride.photo`, dan `gallery` di `slots[]` — ketiganya field inti yang selalu ada di Studio.

---

## 6. Kamus Atribut `data-*` (Kontrak Binding)

Bridge meng-inject data user ke DOM **berdasarkan atribut ini**, bukan urutan tag. Atribut eksplisit selalu menang atas fallback heuristik. Pasang di elemen yang teks/gambarnya milik user.

### 6.1 Identitas pasangan & tamu

```html
<h1 data-couple-names>Raka &amp; Nadya</h1>          <!-- nama panggilan, SEMUA tempat (gate, hero, penutup) -->
<p data-guest-name>Tamu Undangan</p>                  <!-- nama tamu undangan -->
<p data-wedding-date>24 . 05 . 2025</p>               <!-- tanggal utama; wajib mengandung angka -->
```

- `data-couple-names` dipasang di **setiap** elemen yang menampilkan "Raka & Nadya" (gate, hero, penutup). Bridge menulis `textContent` = "Pria & Wanita".
- `data-wedding-date` hanya di-rewrite jika teks awalnya mengandung digit. Format hasil: `dd . mm . yyyy`.

### 6.2 Mempelai

```html
<img src="asset/img/pria.jpg" data-groom-photo alt="Mempelai Pria">
<h3 data-groom-fullname>Raka Pratama, S.T.</h3>
<p data-groom-parents>Putra dari Bpk. Hendra &amp; Ibu Susi</p>

<img src="asset/img/wanita.jpg" data-bride-photo alt="Mempelai Wanita">
<h3 data-bride-fullname>Nadya Putri, S.Psi.</h3>
<p data-bride-parents>Putri dari Bpk. Surya &amp; Ibu Ani</p>
```

- Teks orang tua ditulis otomatis dengan prefix `Putra dari ` / `Putri dari ` — **jangan** tulis prefix ganda di data.

### 6.3 Kutipan / ayat

```html
<p data-quote-text>Dan di antara tanda-tanda kebesaran-Nya...</p>
<span data-quote-source>QS. Ar-Rum: 21</span>
```

- Bridge otomatis mengapit teks dengan tanda kutip `"..."`. Jangan pasang atribut ini di elemen yang punya child element penting (lihat aturan 7).

### 6.4 Acara (maksimal 2 kartu: akad + resepsi)

```html
<div data-event-card>
  <h3 data-event-title>Akad Nikah</h3>
  <p data-event-date>Sabtu, 24 Mei 2025</p>
  <p data-event-time>08:00 - 10:00 WIB</p>
  <p data-event-venue>Gedung Serbaguna</p>
  <p data-event-address>Jl. Mawar No. 123, Bandung</p>
  <a href="https://maps.google.com/..." target="_blank">Lihat Maps</a>
</div>
```

- Kartu pertama = akad/pemberkatan, kartu kedua = resepsi. Bridge mencocokkan judul event user via keyword (`akad`, `pemberkatan`, `resepsi`, dst).
- `href` anchor maps di-update otomatis dari data user.
- Jika desain tidak punya elemen alamat, cukup jangan pasang `data-event-address` — jangan bikin elemen kosong.

### 6.5 Kisah cinta (timeline)

```html
<div data-story-item>
  <span data-story-year>2019</span>
  <h3 data-story-title>Pertama Bertemu</h3>
  <p data-story-description>Cerita singkat...</p>
</div>
```

- Jumlah item bebas; bridge mengisi berurutan dari data stories user. Item tanpa data dibiarkan apa adanya.

### 6.6 Galeri

```html
<section id="galeri">
  <div class="gallery-item" onclick="openLightbox(this.querySelector('img').src, 'Momen')">
    <img src="asset/img/galeri_1.jpg" data-gallery-img alt="Galeri 1">
  </div>
  <!-- ulangi sesuai gallery.recommended di manifest -->
</section>
```

- Wajib `data-gallery-img` di setiap `<img>` galeri (atau minimal section `id="galeri"`).
- URL lightbox di `onclick` parent ikut di-update otomatis oleh bridge — pola `openLightbox('url', ...)` dipertahankan.

### 6.7 Amplop digital & kado

```html
<div data-bank-card>
  <h4 data-bank-name>BCA</h4>
  <span data-account-number>1234567890</span>
  <p data-account-holder>a.n Raka Pratama</p>
  <button data-copy="1234567890" onclick="copyText('1234567890', this)">Salin</button>
</div>

<p data-gift-address>Raka Pratama (0812xxxx) — Jl. Mawar No. 123, Bandung</p>
```

- Nomor rekening: atribut `data-account-number` **hanya** di elemen nomornya. Jangan taruh class `font-mono` di label seperti "DIGITAL ACCESS" (fallback heuristik bisa salah sasaran).
- Tombol salin: pakai `data-copy` atau `data-copy-target` (atribut nilainya di-sync otomatis), atau `onclick="copyText('...', this)"` / `copyToClipboard`.
- Prefix `a.n ` ditulis otomatis — jangan dobel.

### 6.8 Slot foto khusus template

```html
<img src="asset/img/hero.jpg" data-slot="hero.photo" alt="Hero">
<img src="asset/img/couple_cutout.png" data-slot="cover.photo" data-slot-cutout="true" alt="Cutout">
<div data-slot="hero.photo" style="background-image: url('asset/img/bg.jpg')"></div>
```

- Bisa di `<img>` maupun elemen ber-`background-image`.
- Untuk slot cutout: jika user upload JPG kotak, bridge otomatis membingkai arch rapi (mode `auto`). User bisa memaksa `frame`/`cutout` dari Studio.

---

## 7. Aturan Binding (Sangat Penting)

1. **Bridge menulis `textContent`.** Semua child element di dalam elemen ber-atribut akan hancur. Jika ada elemen penting di dalamnya (ikon, `<cite>`, `<span>` warna), **bungkus teksnya saja** dengan span ber-atribut:
   ```html
   <!-- BENAR -->
   <blockquote><span data-quote-text>Teks ayat</span> <cite data-quote-source>QS. Ar-Rum: 21</cite></blockquote>
   <!-- SALAH — cite akan hilang saat data masuk -->
   <blockquote data-quote-text>Teks ayat <cite>QS. Ar-Rum: 21</cite></blockquote>
   ```
2. **Satu atribut = satu elemen teks murni.** Jangan pasang `data-couple-names` di `<h1>` yang berisi `<span>` dekoratif.
3. **Atribut eksplisit menang.** Jika `[data-*]` ada, fallback heuristik (h3/p/font-mono) tidak dipakai. Maka: pasang atribut di elemen yang benar, atau jangan pasang sama sekali.
4. **Jangan menghapus atribut `data-*`** yang sudah ada saat redesign — itu kontrak, bukan hiasan.

---

## 8. Gate / Sampul Pembuka

- Elemen gate wajib pakai salah satu id: **`#gateCover`**, `#gate-cover`, atau `#sec`.
- Fungsi pembuka wajib tersedia global sebagai **`window.openGate()`** atau `window.bukaUndangan()`.
- Scroll lock saat gate tertutup: pakai class standar di body (**`locked`** atau **`is-locked`**) atau inline `overflow:hidden` — bridge tahu cara melepasnya di Studio. Jangan pakai mekanisme lock custom yang tidak bisa dilepas dari luar.
- Konten utama sebaiknya punya id `mainContent` / `main-content`.
- Nama tamu di gate: `data-guest-name` (atau id standar `#gateGuestName`).
- Di Studio, gate otomatis dibuka **tanpa animasi dan tanpa reset scroll**. Jangan menulis logika yang melawan ini (mis. interval yang menutup gate lagi).

## 9. Scroll & Animasi Reveal

- Class animasi reveal **wajib mengandung kata `reveal`** (mis. `reveal`, `reveal-item`, `reveal-left`). Bridge memaksa semua `[class*="reveal"]` visible di Studio.
- **Dilarang scroll-jacking** (library yang membajak scroll, horizontal-scroll paksa, scroll-snap fullscreen antar section). Preview mini Studio harus bisa discroll normal.
- Animasi entrance boleh, tapi konten harus tetap terbaca jika JS gagal (progressive enhancement).
- Animasi hero: prefix class `hero-anim` agar ikut dinetralkan di Studio.

## 10. Countdown — Wajib Sinkron dari Data

Bridge men-set global **`window.__CUSTOM_WEDDING_DATE__`** (ISO datetime dari event pertama user). Countdown template baru **wajib** membacanya, dengan fallback ke tanggal dummy:

```js
function getWeddingTarget() {
  var custom = window.__CUSTOM_WEDDING_DATE__; // di-set bridge dari data user
  var parsed = custom ? new Date(custom) : null;
  return (parsed && !isNaN(parsed.getTime()))
    ? parsed
    : new Date('2025-12-31T08:00:00'); // fallback dummy lokal
}
```

Dilarang menjadikan tanggal hardcoded sebagai satu-satunya sumber countdown.

## 11. RSVP / Ucapan — Wajib Persist ke Server

Form boleh didesain bebas, tapi saat submit **wajib** mengirim postMessage ke parent (snippet ini boleh disalin mentah-mentah):

```js
// WAJIB dipanggil di handler submit RSVP/ucapan, setelah validasi nama & pesan.
try {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({
      type: 'RSVP_SUBMIT',
      payload: {
        guestName: name,                    // string, wajib
        attendance: status,                 // 'hadir' | 'ragu' | 'tidak' (lowercase)
        message: message,                   // string ucapan
        totalPax: status === 'tidak' ? 0 : 1
      }
    }, '*');
  }
} catch (err) { /* abaikan error cross-origin */ }
```

Aturan:
- Nilai attendance **lowercase**: `hadir`, `ragu`, `tidak`. Jika pakai `<select>`, `value` option harus persis itu.
- **Dilarang** memanggil API/fetch langsung dari template — template tidak tahu slug & base URL. Satu-satunya jalur persist adalah `RSVP_SUBMIT` ke parent (wrapper publik yang meneruskan ke server).
- UX lokal (prepend kartu ucapan, localStorage, toast) **boleh** tetap ada sebagai pelengkap, tapi bukan pengganti.
- Id form yang dikenali bridge untuk prefill nama tamu: `#rsvpForm` / `#rsvp-form` dengan `input[type="text"]` atau `input[name="name"]` di dalamnya. Disarankan pakai id `wishName` untuk input nama dan `wishMessage` untuk pesan, `attendanceSelect` untuk select.

## 12. Musik / Audio

- Pakai elemen `<audio>` standar (boleh dengan `<source>`). Bridge mengganti source dari data user.
- Tombol musik wajib pakai salah satu id: **`#musicBtn`**, `#btn-music`, `#musicToggleBtn`, `#music-toggle`, `#musicControlWrap`, atau atribut `data-music-control` — supaya otomatis disembunyikan di Studio.
- **Dilarang autoplay dengan suara** saat halaman load. Musik mulai setelah interaksi user (klik buka gate / tombol musik).
- Jika pakai embed YouTube: jangan `autoplay=1` (bridge mematikannya di studio, tapi desain harus tetap benar tanpa itu).

## 13. Styling & Aset

- Bebas: Tailwind Play CDN + `js/tailwind.config.js` (pola template 1–6) atau CSS murni (pola 7–8). **Tidak ada build step.**
- Ornamen statis (bunga, batik, wayang) tidak perlu atribut data-*.
- Semua aset lokal di dalam folder template. Jangan hotlink gambar random yang tidak stabil — default manifest harus file lokal.
- Font dari Google Fonts / CDN font lain diperbolehkan.

## 14. Larangan Keras

1. **DILARANG** mengedit/menimpa `../template-bridge.js` (stub), engine CDN (`template-bridge.js`, `studio-engine.js`, `console-core.*`), atau file apa pun di luar folder template sendiri.
2. **DILARANG** fetch API backend langsung dari template.
3. **DILARANG** menghapus/tidak memasang tag bridge, `template.json`, atau atribut data-* wajib.
4. **DILARANG** scroll-jacking dan mekanisme scroll-lock custom yang tidak standar.
5. **DILARANG** kerja di folder scratch `undangan_X/` root — itu tidak served.
6. **DILARANG** menaruh child element penting di dalam elemen ber-atribut binding (aturan 7).

## 15. Checklist Serah Terima Template Baru

- [ ] Folder di `public/template/undangan_X/` (root), bukan scratch.
- [ ] `template.json` valid; setiap `slots[].key` punya pasangan `data-slot` di HTML; semua `default` file-nya ada.
- [ ] Tag `<script src="../template-bridge.js?v=5"></script>` ada sebelum `</body>`.
- [ ] Semua binding bagian 6 terpasang (couple, guest, date, quote, mempelai, events, stories, gallery, bank/gift bila ada).
- [ ] Gate pakai id standar + `window.openGate()`/`bukaUndangan()`; lock pakai class standar.
- [ ] Class reveal mengandung kata `reveal`; tidak ada scroll-jacking.
- [ ] Countdown membaca `window.__CUSTOM_WEDDING_DATE__`.
- [ ] Submit RSVP mengirim `RSVP_SUBMIT` postMessage (attendance lowercase).
- [ ] Tombol musik pakai id standar; tidak ada autoplay suara.
- [ ] Test manual: buka `index.html?studio=1&opened=1` → gate terbuka, halaman bisa scroll, semua section terlihat, musik mati.
- [ ] Test manual: buka `index.html` polos → tampilan dummy rapi, tidak ada error console.

---

*Dokumen ini dikelola oleh tim sistem. Perubahan kontrak (atribut/pesan baru) hanya boleh dilakukan lewat perubahan engine di `cdn-vault` + update dokumen ini secara bersamaan.*