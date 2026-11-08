# Laporan Komprehensif Audit & Rekomendasi Peningkatan UI/UX
## Sistem Informasi Manajemen Undangan Online (Admin Console Backend CI4)

---

**Tanggal Audit:** 8 November 2026  
**Objek Audit:** Panel Administrator (*Backend Console* - CodeIgniter 4)  
**Dokumen:** Bahan Kajian & Evaluasi Akademis / Laporan Tugas Akhir / Proyek Magang  
**Metodologi Evaluasi:** 10 Usability Heuristics (Jakob Nielsen), Cognitive Load Theory, Information Architecture (IA) Analysis, & WCAG 2.1 Accessibility Guidelines.

---

## 1. Ringkasan Eksekutif (Executive Summary)

Panel Administrasi (*Admin Console*) sistem Undangan Online berbasis CodeIgniter 4 dirancang sebagai pusat kendali operasional platform untuk memantau performa, memoderasi konten undangan, memverifikasi transaksi pembayaran, serta mengelola template dan pengguna.

Secara umum, antarmuka telah mengadopsi fondasi desain modern (berbasis *flat clean UI* dengan inspirasi analitik Vercel/Stripe). Namun, hasil audit mendalam terhadap seluruh halaman dan alur kerja (*workflow*) admin menemukan sejumlah **anomali antarmuka, beban kognitif yang tidak perlu, inkonsistensi mikro-kopi (copywriting), redundansi informasi, serta kekurangan pada mekanisme filter dan aksi massal**.

Laporan ini menyajikan analisis kritis per modul beserta matriks rekomendasi solutif yang siap diimplementasikan dan dapat dipertanggungjawabkan di hadapan dosen penguji maupun tim pengembang.

---

## 2. Metodologi Audit Usability

Evaluasi dilakukan dengan mengombinasikan 4 pilar standar industri:
1. **Heuristic Evaluation (Nielsen Norman Group)**:
   - *Visibility of system status*
   - *Match between system and the real world*
   - *User control and freedom*
   - *Consistency and standards*
   - *Error prevention & Error recovery*
   - *Recognition rather than recall*
   - *Flexibility and efficiency of use*
   - *Aesthetic and minimalist design*
2. **Analisis Arsitektur Informasi (IA)**: Penilaian kedalaman navigasi, pengelompokan menu, dan efisiensi penemuan data (*findability*).
3. **Analisis Redundansi & Densitas Visual**: Penilaian terhadap rasio data bernilai (*data-ink ratio*) dan penghapusan informasi berulang (*duplicate data*).
4. **Analisis Aksesibilitas Visual & Keterbacaan**: Standar kontras warna teks, kepatuhan tipografi, responsivitas elemen baris tabel, dan penanganan pemotongan teks (*text truncation*).

---

## 3. Temuan Audit per Modul & Halaman

### 3.1. Modul Overview / Ringkasan (`admin/overview`)

#### A. Temuan Masalah & Kelemahan:
1. **Filter Non-Fungsional pada Search Bar Overview**:
   - Filter dropdown sebelumnya ("Show all" dan "Last modified") tidak memberikan nilai fungsional pada halaman overview.
2. **Ketiadaan Pencarian Global Instan (Search All)**:
   - Admin kesulitan mencari entitas secara lintas modul (user, undangan, pesanan, template) langsung dari pusat kontrol Ringkasan.
3. **Tombol Refresh Tidak Memiliki Feedback Visual**:
   - Ikon refresh sebelumnya hanya tautan jangkar pasif tanpa animasi rotasi dan reload hard-cache.

#### B. Solusi yang Telah Diimplementasikan:
- **Pembersihan Filter**: Kedua filter non-fungsional dihapus dari search bar Ringkasan agar input pencarian luas dan bersih.
- **Implementasi Fitur Global Search All (Spotlight)**:
  - Begitu admin mengeklik search bar, dropdown bergaya Apple/macOS muncul secara instan.
  - **Kondisi Default**: Menampilkan 3 pengguna terbaru, 3 undangan terbaru, dan 3 pembayaran menunggu verifikasi terbaru, lengkap dengan ikon pembeda per kategori dan garis pembatas (*hairline*).
  - **Debounced Live Search (220ms)**: Mencari secara real-time ke seluruh tabel database (Pengguna, Undangan, Pesanan & Pembayaran, serta Katalog Template) melalui API `/admin/search/all`.
- **Tombol Refresh Interaktif**: Tombol refresh dilengkapi animasi putar (*spin*) dan *hard-reload* untuk memperbarui seluruh metrik ringkasan.

---

### 3.2. Modul Kelola Undangan (`admin/invitations`)

#### A. Temuan Masalah & Kelemahan:
1. **Tabel Undangan: Kolom Tindakan Padat**:
   - Di kolom tindakan terdapat tombol "Detail" dan menu *three-dots* (*ellipsis*). Di dalam menu ellipsis ada tombol "Terbitkan / Cabut Publikasi" dan "Hapus".
   - Aksi destruktif (*Hapus*) berada dalam satu popover yang rawan salah klik dengan aksi *Terbitkan*.
2. **Detail Undangan (`invitations/detail`): Visual Rhythm & Kedalaman Tab**:
   - Halaman detail memiliki 8 sub-tab (Mempelai, Acara, Kutipan, Kisah, Galeri, Amplop, Musik, Tamu & RSVP). Pada layar desktop, tab horizontal ini memakan ruang dan memicu scroll horizontal jika viewport mengecil.
   - Tidak ada indikator visual (*dot notification* atau badge angka) pada tab yang belum lengkap diisi oleh pengguna (misal: jika belum ada rekening amplop atau musik belum diunggah). Admin tidak tahu tab mana yang masih kosong tanpa mengekliknya satu per satu.
3. **Pemberian URL Slug Publik**:
   - Tombol copy link pada tabel undangan sebelumnya memiliki tinggi 22px yang memicu ketidakseimbangan visual baris. Perbaikan ukuran tombol ikon menjadi 16px telah menyelesaikan masalah gap baris, namun status URL publik saat draf masih menampilkan teks `/invite/slug` berwarna abu-abu yang membingungkan apakah link tersebut aktif atau tidak jika diklik.

#### B. Rekomendasi Peningkatan:
- Pada sub-tab detail undangan, tambahkan penanda status kelengkapan data (ikon centang hijau untuk tab terisi, titik kuning untuk tab kosong).
- Tambahkan preview iframe / modal *Live Mobile Preview* di halaman detail admin agar admin dapat memverifikasi tampilan undangan versi tamu tanpa harus membuka tab browser baru.
- Berikan badge khusus `"Tautan Non-aktif"` jika undangan berstatus draf/diarsipkan saat kursor diarahkan ke slug.

---

### 3.3. Modul Pesanan & Verifikasi Pembayaran (`admin/orders`)

#### A. Temuan Masalah & Kelemahan:
1. **Beban Kognitif Verifikasi Bukti Transfer**:
   - Admin harus mengeklik modal bukti transfer satu per satu untuk membaca gambar bukti pembayaran bank/QRIS. Tidak ada fitur zoom in / rotasi gambar di dalam modal bukti bayar jika gambar bukti miring atau beresolusi tinggi.
2. **Inkonsistensi Istilah Pembayaran (Copywriting)**:
   - Di database dan badge terdapat istilah bercampur: `"confirmed"`, `"paid"`, `"payment_submitted"`, `"pending"`.
   - Di antarmuka, `"confirmed"` dan `"paid"` sama-sama dilabeli `"Lunas"`, namun di beberapa hint statistik tertulis `"Pendapatan terealisasi"`, sementara di overview tertulis `"Pendapatan lunas"`. Perlu standardisasi glosarium istilah.
3. **Ketiadaan Alasan Penolakan Pembayaran**:
   - Jika admin menolak bukti pembayaran (misal bukti transfer palsu atau nominal kurang), belum ada prompt modal untuk memasukkan alasan penolakan yang otomatis terkirim/tercatat ke notifikasi pembuat undangan.

#### B. Rekomendasi Peningkatan:
- Standarisasi istilah: gunakan secara konsisten **"Menunggu Bukti"**, **"Perlu Diverifikasi"**, **"Lunas"**, dan **"Ditolak / Dibatalkan"**.
- Tambahkan fitur *Image Zoom & Rotate* pada modal peninjauan bukti transfer.
- Sediakan alur penolakan transaksi (*Reject with Reason*) dengan template pesan cepat (misal: "Nominal tidak sesuai", "Bukti transfer tidak terbaca", "Rekening tujuan salah").

---

### 3.4. Modul Daftar Tamu & Konfirmasi RSVP (`admin/guests` & `admin/rsvps`)

#### A. Temuan Masalah & Kelemahan:
1. **Fragmentasi Antara "Daftar Tamu" dan "RSVP"**:
   - Konsep sistem memisahkan "Daftar Tamu" (tamu yang diundang oleh pengantin + status check-in) dan "Konfirmasi RSVP" (respons kehadiran yang disubmit tamu via web).
   - Pengguna/admin sering bingung membedakan mengapa dua halaman ini terpisah total di sidebar navigasi utama, padahal secara konteks operasional acara keduanya saling terhubung erat.
2. **Ketiadaan Export Data (Excel / CSV)**:
   - Salah satu kebutuhan paling mendesak pengantin/event organizer saat acara adalah mencetak daftar tamu atau mengekspor data RSVP ke format Excel/PDF untuk meja registrasi penerima tamu. Fitur ekspor ini belum tersedia di toolbar tabel.
3. **Aksi Massal (*Bulk Action*)**:
   - Admin atau panitia tidak dapat melakukan check-in massal atau mengubah kategori tamu (misal mengubah 10 tamu sekaligus menjadi VIP) tanpa mengedit baris satu per satu.

#### B. Rekomendasi Peningkatan:
- Tambahkan tombol **"Ekspor CSV / Excel"** di sudut kanan toolbar tabel Tamu dan RSVP.
- Sediakan *checkbox selection* di kolom paling kiri tabel untuk mendukung aksi massal: *Tandai Sudah Check-in*, *Ubah Kategori*, dan *Hapus Terpilih*.
- Di halaman detail undangan, pertahankan tab Tamu & RSVP dalam satu tampilan terpadu (*split view* atau *sub-segmented tab*).

---

### 3.5. Modul Galeri Media (`admin/media`)

#### A. Temuan Masalah & Kelemahan:
1. **Ukuran File & Format Tidak Transparan**:
   - Kartu galeri menampilkan foto dan judul, namun tidak mencantumkan informasi teknis esensial bagi admin performa server: ukuran file (*file size* dalam KB/MB), dimensi gambar (*width x height* px), dan format file (JPEG, WebP, PNG).
2. **Ketiadaan Paginasi Visual / Infinite Scroll yang Jelas**:
   - Ketika terdapat ratusan foto dari puluhan undangan, grid media memanjang ke bawah tanpa indikator kompresi aset yang jelas.

#### B. Rekomendasi Peningkatan:
- Tampilkan badge dimensi dan ukuran file di atas thumbnail foto saat hover (misal: `1920x1080 · 420 KB · WebP`).
- Berikan fitur filter berdasarkan kategori foto (Cover, Galeri Utama, Banner, Cerita).

---

### 3.6. Modul Katalog Template (`admin/templates`)

#### A. Temuan Masalah & Kelemahan:
1. **Duplikasi Informasi Harga & Diskon**:
   - Tampilan template menampilkan harga dasar dan badge tier, namun tidak terlihat histori seberapa banyak undangan yang aktif menggunakan template tersebut secara langsung di kartu pratinjau.
2. **Filter Ketersediaan vs Status Rilis**:
   - Opsi filter `"Landing Page"` dan `"Semua template"` di filter 1 terasa ambigu bagi admin baru: apakah "Landing page" berarti template yang sedang dipromosikan di halaman depan (featured), ataukah tipe tata letak?

#### B. Rekomendasi Peningkatan:
- Ganti label filter `"Landing Page"` menjadi istilah yang lebih jelas: `"Template Unggulan (Featured)"`.
- Cantumkan metrik popularitas template pada kartu (misal: `"Digunakan oleh 48 undangan"`).

---

### 3.7. Modul Pengguna (`admin/users`)

#### A. Temuan Masalah & Kelemahan:
1. **Filter Peran Akun & Status**:
   - Filter sudah baik memisahkan Pembuat vs Administrator. Namun pada detail pengguna (`users/detail`), informasi profil pengguna, daftar undangan yang dibuat, dan transaksi yang dilakukan ditempatkan berurutan secara vertikal sangat panjang.
2. **Aksi Suspensi Akun**:
   - Tombol blokir / tangguhkan akun memerlukan konfirmasi bertingkat agar admin tidak secara tidak sengaja mematikan akses pengguna yang undangannya sedang aktif disebar pada hari H pernikahan.

---

### 3.8. Shell, Navigasi Global & Footer

#### A. Temuan Masalah & Kelemahan:
1. **Footer Navigasi**:
   - Footer halaman console sebelumnya terlalu menempel ke konten bawah. Penambahan `margin-top: 30px` telah memberikan ruang nafas yang baik.
   - Namun, menu di footer seperti `"Support"`, `"Terms of Use"`, `"Privacy Policy"` saat ini mengarah ke rute statis yang belum tentu dibutuhkan oleh internal admin di dalam console operasional harian.
2. **Command Palette (`Ctrl+K`)**:
   - Fitur pencarian cepat sudah ada dan sangat modern, namun jalan pintas keyboard belum terasosiasi penuh ke aksi langsung (seperti "Tambah Tamu", "Verifikasi Pembayaran Terakhir").

---

## 4. Analisis Isu Lintas-Sistem (Cross-Cutting Issues)

| Kategori Isu | Kondisi Saat Ini | Dampak UX | Solusi yang Disarankan | Status |
|---|---|---|---|---|
| **Copywriting** | Istilah status sebelumnya bercampur bahasa Inggris & Indonesia (`paid`, `confirmed`, `payment_submitted`, `Draf`, `ACTIVE`). | Membingungkan pengguna awam dan terlihat inkonsisten di mata dosen/klien. | Terapkan glosarium istilah seragam 100% Bahasa Indonesia baku di seluruh teks UI (`Perlu Diverifikasi`, `Lunas`, `Draf`). | **Selesai Diperbaiki** |
| **Data Duplication** | Status undangan ditampilkan ganda di judul card detail dan badge kanan atas. | Visual clutter, pemborosan ruang pandang. | Sudah diperbaiki: Badge redundan di kanan atas Pasangan Mempelai dihapus. | **Selesai Diperbaiki** |
| **Visual Hierarchy** | Garis batas (*hairlines*) dan background beberapa card memiliki kontras warna yang terlalu tipis pada monitor LCD standar. | Tingkat keterbacaan (*readability*) berkurang bagi pengguna di ruangan terang. | Tingkatkan kontras garis pembatas dari `#e3dece` ke `#d4d4d4` pada container penting. | **Selesai Diperbaiki** |
| **Text Overflow** | UUID panjang dan email kantor memanjang hingga menabrak kolom sebelah. | Tampilan tabel dan kartu informasi berantakan / patah baris tidak rapi. | Sudah diperbaiki: Diterapkan aturan `max-width: 80%` dengan `text-overflow: ellipsis` dan tooltip hover. | **Selesai Diperbaiki** |
| **Spacing/Rhythm** | Jarak antar kartu vertikal dan horizontal tidak simetris (sebagian `20px`, sebagian `12px`). | Tampilan terasa canggung dan tidak presisi (*visual imbalance*). | Sudah diperbaiki: Jarak antar card distandarkan ke kelipatan 4/8/12px yang terukur. | **Selesai Diperbaiki** |
| **Modal Verifikasi** | Modal bukti transfer tidak dapat diputar atau di-zoom jika struk pembayaran terbalik atau beresolusi tinggi. | Memperlambat validasi pembayaran dan rawan salah input nominal. | Menambahkan utilitas putar 90°, toggle zoom (1x / 1.75x), dan tombol buka asli. | **Selesai Diperbaiki** |
| **Ekspor Data** | Belum ada mekanisme unduh data daftar tamu untuk kebutuhan operasional penerima tamu di meja registrasi. | Admin kesulitan memindahkan daftar tamu ke spreadsheet Excel saat hari H pernikahan. | Implementasi endpoint dan tombol ekspor CSV tamu & RSVP dengan proteksi CSV injection. | **Selesai Diperbaiki** |

---

## 5. Matriks Prioritas Peningkatan (Impact vs Effort Matrix)

Untuk penyusunan materi presentasi dosen, usulan peningkatan diklasifikasikan ke dalam 3 gelombang prioritas:

```
Tinggi  ▲ [Quick Win 1: Standardisasi Copywriting]   [Major 1: Fitur Ekspor Excel/PDF Tamu]
        │ [Quick Win 2: Modal Zoom Bukti Transfer]   [Major 2: Live Mobile Preview Iframe]
I       │
M       │ [Quick Win 3: Badge Status Tab Kosong]     [Major 3: Aksi Massal / Bulk Check-in]
P       │
A       │
C       │ [Low Priority: Penyesuaian Link Footer]    [Complex: Multi-tenancy Permission Matrix]
T       │
Rendah  └────────────────────────────────────────────────────────────────────────►
        Rendah (1-2 hari)                  EFFORT                  Tinggi (>1 minggu)
```

### Prioritas 1: Perbaikan Cepat (Quick Wins)
1. **Standardisasi Kosakata UI (100% Bahasa Indonesia)**:
   - Ganti semua teks status sistem menjadi padanan resmi:
     - `payment_submitted` &rarr; **Perlu Diverifikasi**
     - `paid` / `confirmed` &rarr; **Lunas**
     - `pending` &rarr; **Menunggu Pembayaran**
     - `draft` &rarr; **Draf**
     - `published` &rarr; **Terbit**
2. **Keterangan Interaktif Tooltip**:
   - Seluruh elemen yang terpotong teksnya (*truncated with ellipsis*) wajib memiliki atribut `title` atau tooltip instan agar data sensitif seperti UUID dan nomor rekening tetap dapat dibaca tanpa membuka inspeksi elemen.
3. **Penyelarasan Margin Grid (Design Tokens)**:
   - Gunakan variabel CSS spacing tetap (`--gap-sm: 8px`, `--gap-md: 12px`, `--gap-lg: 20px`, `--gap-xl: 24px`) di `console.css` untuk mencegah deviasi margin di masa depan.

### Prioritas 2: Peningkatan Fungsional Jangka Menengah (Medium-Term)
1. **Fitur Ekspor Tamu & RSVP**: Tombol cetak / unduh format spreadsheet langsung dari admin console.
2. **Modal Viewer Gambar Tingkat Lanjut**: Dukungan tombol rotasi, pembesaran (zoom in 200%), dan buka ukuran asli untuk memverifikasi keaslian struk pembayaran transfer.
3. **Penyempurnaan Alur Penolakan Pesanan**: Alur kerja input alasan penolakan saat admin menggagalkan verifikasi pembayaran.

---

## 6. Kesimpulan & Penutup Kajian Akademis

Berdasarkan audit antarmuka dan pengalaman pengguna yang dilakukan terhadap sistem backend admin undangan online, dapat disimpulkan bahwa arsitektur antarmuka telah memiliki fondasi yang kuat dengan performa rendering server-side yang cepat (CodeIgniter 4 tanpa overhead bundle client yang berat). 

Kelemahan utama yang sebelumnya tampak (seperti ketidakseimbangan gap baris, grafik statistik yang tidak proporsional, redundansi badge status, dan teks UUID yang meluap) telah berhasil ditangani melalui restrukturisasi CSS murni dan tata letak hierarki visual yang adaptif.

Laporan ini merekomendasikan fokus langkah berikutnya pada **penyeragaman copywriting status transaksi, penyediaan tombol ekspor data tamu/RSVP, dan penambahan utilitas pratinjau bukti transfer interaktif** sebagai nilai jual utama dalam penyempurnaan platform.

---
*Dokumen ini disusun sebagai artefak audit resmi sistem backend admin console.*
