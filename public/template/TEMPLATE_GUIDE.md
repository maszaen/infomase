# Panduan Standar Pembuatan Template Undangan Digital (`TEMPLATE_GUIDE.md`)

> **DEPRECATED — dokumen ini sudah digantikan.** Standar resmi terbaru dan terlengkap ada di **[`/TEMPLATE_GUIDE.md`](../../TEMPLATE_GUIDE.md)** (root repo). Selalu ikuti dokumen root tersebut; file ini hanya disimpan untuk arsip.

Dokumen ini adalah **Standar Operasional Prosedur (SOP) resmi** bagi developer template HTML/CSS/JS di proyek **Undangan Online (`backend-ci4`)**.

Tujuan dokumen ini adalah menyatukan kerjaan antara **Tim Desain Template (HTML/CSS/JS)** dan **Tim Sistem Backend & Template Studio (`template-bridge.js`)**, supaya setiap kali ada template baru (`undangan_9`, `undangan_10`, dst.), sistem **Template Studio** langsung otomatis mengenali:
1. Berapa jumlah & posisi **slot foto** di template tersebut (Sampul, Hero, Pengantin, Love Story, Galeri, Penutup).
2. Apakah sebuah foto butuh **PNG Transparan (Cutout)** atau **Foto Biasa (JPG/PNG)**.
3. Di elemen HTML mana teks (nama pengantin, orang tua, jadwal acara, kutipan, rekening) harus dimasukkan tanpa tebak-tebakan urutan tag HTML.

---

## 1. Struktur Folder Wajib per Template

Setiap template baru wajib ditaruh di dalam `backend-ci4/public/template/undangan_X/` dengan struktur minimal:

```text
backend-ci4/public/template/undangan_X/
├── index.html          <-- File utama template (berisi atribut data-slot)
├── template.json       <-- WAJIB: Manifest konfigurasi slot gambar & fitur template
├── asset/              <-- Aset gambar default/ornamen lokal
└── audio/              <-- Musik latar default (.mp3)
```

Dan di bagian paling bawah `index.html` (sebelum `</body>`), **wajib** memuat script `template-bridge.js`:

```html
<!-- AKAD.IN Template Data Bridge -->
<script>
(function () {
    var params = new URLSearchParams(window.location.search);
    var cdn = (params.get('cdn') || window.__CDN_BASE_URL__ || 'http://localhost:8200').replace(/\/+$/, '');
    var s = document.createElement('script');
    s.src = cdn + '/template-bridge.js?v=2';
    document.body.appendChild(s);
})();
</script>
```

---

## 2. File `template.json` (Manifest Slot Gambar & Fitur)

Karena tiap template punya desain yang beda-beda (ada yang Hero-nya tanpa foto, ada yang Hero-nya 2 foto, ada yang sampulnya pakai PNG pengantin tanpa background), **setiap template wajib mendefinisikan `template.json`**.

Template Studio akan membaca `template.json` ini untuk **merender form upload foto secara otomatis** sesuai kebutuhan template tersebut!

### Contoh Isi `template.json`:

```json
{
  "id": "modern-minimalist",
  "folderId": "undangan_2",
  "name": "Modern Minimalist",
  "gallery": {
    "min": 1,
    "max": 8,
    "recommended": 4,
    "aspect": "3:4"
  },
  "slots": [
    {
      "key": "cover.photo",
      "label": "Foto Sampul Pembuka (Gate Cover)",
      "section": "Sampul Pembuka",
      "aspect": "3:4",
      "cutout": true,
      "hint": "Desain asli menggunakan foto pengantin PNG transparan (tanpa background). Jika Anda mengunggah foto JPG biasa, sistem otomatis menampilkan bingkai arch yang rapi.",
      "default": "asset/img/couple_cutout.png"
    },
    {
      "key": "hero.photo",
      "label": "Foto Utama Beranda (Hero Arch)",
      "section": "Beranda (Hero)",
      "aspect": "4:5",
      "cutout": false,
      "hint": "Foto potret utama di halaman beranda setelah undangan dibuka.",
      "default": "asset/img/foto_editorial_hero.jpg"
    },
    {
      "key": "hero.secondaryPhoto",
      "label": "Foto Sekunder Beranda (Candid Frame)",
      "section": "Beranda (Hero)",
      "aspect": "1:1",
      "cutout": false,
      "hint": "Foto candid ukuran kecil di pojok kiri bawah foto utama Hero.",
      "default": "asset/img/foto_editorial_story.jpg"
    },
    {
      "key": "story.photo",
      "label": "Foto Banner Kisah Cinta",
      "section": "Kisah Cinta",
      "aspect": "16:10",
      "cutout": false,
      "hint": "Foto kebersamaan pada bagian atas seksi Perjalanan Cinta.",
      "default": "asset/img/foto_editorial_story.jpg"
    },
    {
      "key": "closing.photo",
      "label": "Foto Penutup (Terima Kasih)",
      "section": "Penutup",
      "aspect": "1:1",
      "cutout": false,
      "hint": "Foto lingkaran pada bagian ucapan terima kasih paling bawah.",
      "default": "asset/img/foto_editorial_hero.jpg"
    }
  ]
}
```

### Penjelasan Properti `slots[]` di `template.json`:
- `key` *(string, wajib)*: Kunci unik slot gambar. Gunakan nama standar berikut agar konsisten:
  - `cover.photo`: Foto pada sampul pembuka (Gate Cover).
  - `hero.photo`: Foto utama di bagian Hero/Beranda.
  - `hero.secondaryPhoto`: Foto kedua/candid di bagian Hero (jika ada).
  - `hero.tertiaryPhoto`: Foto ketiga di bagian Hero (misal triptych 3 arch seperti `undangan_7` & `undangan_8`).
  - `intro.photo`: Foto pembuka sebelum kutipan/ayat (jika terpisah dari Hero, misal `undangan_4`).
  - `story.photo`: Foto banner utama pada seksi Kisah Cinta (jika ada 1 foto utama).
  - `event.photo`: Foto gedung/venue pada seksi Acara.
  - `closing.photo`: Foto pada seksi Penutup / Terima Kasih.
- `label` *(string, wajib)*: Nama field yang muncul di form Template Studio.
- `section` *(string, opsional)*: Kategori posisi foto di undangan.
- `aspect` *(string, wajib)*: Rasio ideal foto (`1:1`, `3:4`, `4:5`, `16:9`, `16:10`) untuk ditampilkan sebagai badge panduan ke user.
- `cutout` *(boolean, opsional)*: Isi `true` **HANYA JIKA** desain asli menggunakan foto pengantin PNG transparan (crop badan tanpa background).
- `hint` *(string, opsional)*: Petunjuk singkat untuk pengguna di form Studio.
- `default` *(string, opsional)*: Path gambar bawaan template.

> **Catatan Penting:** Foto Mempelai Pria (`groom.photo`), Foto Mempelai Wanita (`bride.photo`), dan Galeri (`gallery`) adalah field inti yang selalu ada di Studio, sehingga **tidak perlu** ditulis ulang di dalam array `slots[]`.

---

## 3. Kamus Atribut HTML (`data-slot` & `data-*`)

Agar `template-bridge.js` bisa memasukkan data dengan akurat 100% tanpa tergantung urutan tag `<img>` atau `<p>`, tambahkan atribut berikut pada elemen HTML di `index.html`:

### A. Slot Gambar Khusus Template (`data-slot`)
Pasang atribut `data-slot="<key>"` sesuai `key` yang didaftarkan di `template.json`.
Bisa dipasang di tag `<img>` **maupun** di tag `<div>` yang memakai `style="background-image: url(...)"`!

```html
<!-- Contoh 1: Pada tag <img> biasa -->
<img src="asset/img/foto_editorial_hero.jpg" data-slot="hero.photo" alt="Hero Couple">

<!-- Contoh 2: Pada tag <img> yang desain aslinya PNG Transparan (Cutout) -->
<img src="asset/img/couple_cutout.png" data-slot="cover.photo" data-slot-cutout="true" alt="Couple Cutout">

<!-- Contoh 3: Pada <div> yang memakai CSS background-image -->
<div class="hero-slide" data-slot="hero.photo" style="background-image: url('asset/img/couple_1.jpg')"></div>
```

#### Aturan Khusus Foto PNG Transparan (`data-slot-cutout="true"`):
Jika kamu mendesain foto pengantin yang di-crop tanpa background (`cutout: true`), tambahkan `data-slot-cutout="true"` pada elemen `<img>` tersebut.
Mengapa? Karena mayoritas user tidak punya foto PNG transparan dan akan mengupload foto JPG persegi biasa.
Dengan `data-slot-cutout="true"`, `template-bridge.js` akan otomatis:
1. Mengecek apakah foto yang diupload user itu transparan atau JPG kotak biasa (atau membaca pengaturan bingkai dari Studio).
2. Jika foto user adalah JPG kotak biasa, bridge otomatis menambahkan class `.studio-cutout-framed` pada gambar supaya tampil rapi di dalam bingkai lengkung (arch/oval) dan tidak terlihat kaku/aneh!

### B. Slot Foto & Data Inti Mempelai
```html
<!-- Nama Panggilan Pasangan (misal: "Raka & Nadya") -->
<h1 data-couple-names>Raka &amp; Nadya</h1>

<!-- Nama Tamu Undangan -->
<p id="gateGuestName" data-guest-name>Tamu Undangan</p>

<!-- Mempelai Pria -->
<img src="asset/img/mempelai_pria.jpg" data-groom-photo alt="Mempelai Pria">
<h3 data-groom-fullname>Raka Pratama, S.T.</h3>
<p data-groom-parents>Putra dari Bpk. Hendra &amp; Ibu Susi</p>

<!-- Mempelai Wanita -->
<img src="asset/img/mempelai_wanita.jpg" data-bride-photo alt="Mempelai Wanita">
<h3 data-bride-fullname>Nadya Putri, S.Psi.</h3>
<p data-bride-parents>Putri dari Bpk. Surya &amp; Ibu Ani</p>
```

### C. Slot Kutipan / Ayat (`quote`)
```html
<p data-quote-text>"Dan di antara tanda-tanda (kebesaran)-Nya..."</p>
<span data-quote-source>QS. Ar-Rum: 21</span>
```

### D. Slot Galeri (`#galeri`)
Pastikan section galeri memiliki `id="galeri"` atau atribut `data-gallery-img` pada elemen `<img>` di dalamnya:
```html
<section id="galeri">
  <div class="gallery-item" onclick="openLightbox(this.querySelector('img').src, 'Momen Bahagia')">
    <img src="asset/img/galeri_1.jpg" data-gallery-img alt="Galeri 1">
  </div>
</section>
```
> **Tips Lightbox:** Jika menggunakan fungsi `onclick="openLightbox(...)"`, gunakan `this.querySelector('img').src` atau biarkan `template-bridge.js` memperbarui URL lightbox secara otomatis saat foto diganti oleh user.

---

## 4. Checklist Sebelum Serah Terima Template Baru

Sebelum menyerahkan folder `undangan_X` ke repository utama, pastikan:
- [ ] Sudah ada file `template.json` yang valid di dalam folder `undangan_X/`.
- [ ] Semua gambar utama (selain ornamen bunga/wayang/background statis) sudah diberi atribut `data-slot="..."`, `data-groom-photo`, `data-bride-photo`, atau `data-gallery-img`.
- [ ] Jika ada foto pengantin tanpa background (PNG transparan), sudah diberi `data-slot-cutout="true"` di HTML dan `"cutout": true` di `template.json`.
- [ ] Elemen pintu pembuka (Gate Cover) menggunakan salah satu ID standar: `#gateCover`, `#gate-cover`, atau `#sec`, dan fungsi pembukanya bernama `window.openGate()` atau `window.bukaUndangan()`.
- [ ] Elemen `<audio>` memiliki ID atau dapat diakses standar, dan tombol musik memakai `id="musicBtn"` atau `id="btn-music"`.
