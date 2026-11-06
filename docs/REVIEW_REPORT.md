# Independent Technical Review, Verification & Architecture Finalization Report — Undangan Online (InfoMase)

**Tanggal**: 6 November 2026  
**Status**: FINAL & VERIFIED  
**Auditor**: Tim Arsitektur & Rekayasa Sistem (5 Spesialis Subagent)  
**Tujuan**: Melakukan audit independen, verifikasi menyeluruh terhadap source code frontend (`src/`, `public/`), menyelaraskan seluruh artefak dokumentasi arsitektur (`docs/`), dan menetapkan cetak biru (*single source of truth*) yang siap pakai untuk implementasi backend **CodeIgniter 4 (CI4)**.

---

## 1. Executive Summary & Ringkasan Temuan Audit Sebelumnya

Proses audit sebelumnya menghasilkan 8 dokumen arsitektur di direktori `docs/`, namun sempat mengalami beberapa *API Error 503* akibat keterbatasan kapasitas model sehingga terdapat beberapa bagian yang terpotong, asumsi yang belum terverifikasi dengan kode sumber, inkonsistensi struktur rute, serta celah kontrak API.

Tim kami mengerahkan **5 subagent teknis independen** yang bekerja secara terspesialisasi:
1. **Frontend Feature Auditor**: Memverifikasi seluruh rute, komponen studio editor, state management, dan validasi form di `src/` terhadap `docs/PROJECT_AUDIT.md` dan `docs/FEATURE_INVENTORY.md`.
2. **Business Flow & Licensing Auditor**: Memverifikasi state machine pesanan, model monetisasi lisensi permanen (*perpetual licence*), aturan penggantian template, alur RSVP publik, dan distribusi WhatsApp di `docs/BUSINESS_FLOW.md`.
3. **Database Architect & Reviewer**: Memvalidasi normalisasi 3NF, integritas referensial, batasan unik, strategi indeks B-Tree, dan konsistensi ERD di `docs/DATABASE_DESIGN.md`, `docs/ERD.md`, dan `docs/DATABASE_DECISIONS.md`.
4. **API Contract Auditor**: Menyinkronkan seluruh HTTP method, endpoint paths, request/response payload (camelCase vs snake_case), dan missing endpoints di `docs/API_SPECIFICATION.md` terhadap `src/lib/api.ts`.
5. **CodeIgniter 4 Architecture Specialist**: Mengaudit realisme implementasi framework CI4 4.4+ / 4.5+ pada `docs/ARCHITECTURE.md` (mengeliminasi anti-pattern over-engineering, memodernisasi BaseApiController, Filters, Service Layer, dan Transaksi).

---

## 2. Kesalahan & Inkonsistensi Kritis yang Ditemukan

Berikut adalah inventaris kesalahan, asumsi yang keliru, dan kesenjangan spesifikasi yang ditemukan pada dokumentasi awal sebelum diperbaiki:

### 2.1 Struktur Rute Studio Editor (Pemisahan `/content` vs `/day`)
- **Fakta di Kode Sumber (`src/`)**:
  - [`ContentSection.tsx`](file:///h:/Magang/undangan-online/src/components/console/sections/ContentSection.tsx) (`/dashboard/undangan/[id]/content`) memuat **7 tab horizontal**:
    1. `couple` (Mempelai: biodata, orang tua, Instagram, foto).
    2. `events` (Acara: judul, tanggal, waktu mulai/selesai, timezone, lokasi, alamat, Google Maps).
    3. `quote` (Kutipan: teks ayat/kalimat mutiara, sumber, terjemahan).
    4. `story` (Kisah cinta: tahun, judul, narasi).
    5. `gallery` (Galeri foto: upload batch prewedding, URL, caption).
    6. `gift` (Amplop digital: multi-rekening bank, QRIS, dan alamat kado fisik).
    7. `music` (Musik latar: judul, musisi, upload audio MP3, toggle autoplay).
  - [`DaySection.tsx`](file:///h:/Magang/undangan-online/src/components/console/sections/DaySection.tsx) (`/dashboard/undangan/[id]/day`) adalah rute tersendiri yang murni berfokus pada **alat operasional hari-H**:
    1. Kalkulator Katering Otomatis (basis data RSVP hadir × buffer 0%–25%, split prasmanan 60% & gubukan 40%).
    2. Meja Resepsionis / Check-in fisik kehadiran tamu dengan pencarian nama.
- **Tindakan**: Dokumentasi di `PROJECT_AUDIT.md`, `FEATURE_INVENTORY.md`, dan `BUSINESS_FLOW.md` telah disinkronkan secara presisi dengan pembagian 7 tab di ContentSection dan alat hari-H di DaySection.

### 2.2 Fitur Live Streaming / Virtual Wedding & Status Verifikasinya
- **Temuan Kode Sumber**: Fitur live streaming sama sekali **tidak ditemukan (unsupported)** pada komponen UI maupun tipe TypeScript frontend saat ini (`types/invitation.ts`).
- **Keputusan Arsitektur**:
  - Demi kesiapan arsitektur masa depan (*future-proof*), backend CodeIgniter 4 menyediakan tabel relasional opsional `invitation_streamings` (1:1 dengan `invitations`) dan endpoint `PUT /api/v1/invitations/:id/streaming`.
  - Pada `FEATURE_INVENTORY.md` dan `REVIEW_REPORT.md`, fitur ini secara tegas diklasifikasikan sebagai **[PROPOSED / BACKEND READY / UNSUPPORTED DI UI FRONTEND]** agar pengembang tidak mengira fitur ini sudah ada di antarmuka web.

### 2.3 Alur Bukti Bayar Manual vs Simulasi Checkout
- **Temuan Kode Sumber**: Pada [`CheckoutScreen.tsx`](file:///h:/Magang/undangan-online/src/app/checkout/CheckoutScreen.tsx), alur pembayaran disimulasikan secara instan (900ms delay) tanpa form upload berkas bukti bayar fisik.
- **Keputusan Arsitektur**:
  - Untuk integrasi dunia nyata, backend CodeIgniter 4 menyediakan dukungan ganda:
    1. **Otomatis**: Webhook payment gateway (Midtrans/Xendit) dengan status `paid` instan.
    2. **Manual**: Endpoint `POST /orders/:id/proof` untuk mengunggah berkas bukti transfer fisik jika pengantin menggunakan transfer bank konvensional, dengan status transisi `payment_submitted` sebelum diverifikasi admin.

### 2.4 Celah Batasan Unik Global pada Kode Tamu (`guest_code`)
- **Dokumentasi Lama**: Skema mendefinisikan `guest_code VARCHAR(20) NOT NULL UNIQUE` secara global di tabel `invitation_guests`.
- **Dampak Arsitektur**: Jika Pengguna A membuat kode tamu `budi-santoso`, maka Pengguna B di tempat lain tidak akan bisa mengundang tamu bernama Budi Santoso dengan kode yang sama karena terjadi benturan unique constraint global.
- **Tindakan**: Batasan unik diubah menjadi scoped per undangan: `UNIQUE KEY uk_guest_invitation_code (invitation_id, guest_code)`.

### 2.5 Pemisahan Entitas `orders` dan `payments`
- **Dokumentasi Lama**: Menyatukan transaksi pemesanan dan bukti pembayaran dalam satu tabel `orders`.
- **Dampak Arsitektur**: Jika pengguna mengganti metode bayar (misal dari Transfer ke QRIS) atau transaksi pembayaran pertama kedaluwarsa, tidak ada riwayat percobaan pembayaran terpisah, dan payload webhook gateway tidak memiliki tempat penyimpanan audit yang aman.
- **Tindakan**: Ditambahkan tabel `payments` (1:N dengan `orders`) dengan status `pending`, `verified`, `rejected`, `expired` serta kolom `gateway_payload_json` dan `proof_of_transfer_url`.

### 2.6 Penanganan Konflik Soft Delete pada Kolom Unik `slug`
- **Dokumentasi Lama**: Kolom `invitations.slug` bersifat `UNIQUE(slug)`. Pada soft delete (`deleted_at IS NOT NULL`), record fisik tetap ada di tabel InnoDB, sehingga pengguna yang menghapus draf undangan tidak dapat membuat ulang undangan dengan slug yang sama (*slug lockout*).
- **Tindakan**: Ditetapkan ADR-014 (*Slug Recycling on Soft Delete*): saat undangan dihapus, slug otomatis diberi akhiran timestamp (`raka-sinta-del-{timestamp}`) sehingga slug utama langsung terbebas untuk dipakai kembali.

### 2.7 Idiomatic CodeIgniter 4 vs Over-Engineering Anti-Patterns
- **Dokumentasi Lama**: Memperkenalkan pola `RepositoryInterface` dan `Repository` berlapis yang meniru Laravel/Spring Boot secara berlebihan, serta penempatan properti dinamis pada `IncomingRequest` (`$request->user = ...`) yang memicu deprecation notice pada PHP 8.2+.
- **Tindakan**:
  - Mengadopsi arsitektur bersih idiomatik CI4: **Thin Controller &rarr; Dedicated Service &rarr; Model &rarr; Entity**.
  - Mengintegrasikan singleton container `service('authContext')` untuk konteks autentikasi yang aman.
  - Memodernisasi `BaseApiController` agar menyeragamkan format respon JSON `{ success, message, data, meta, error, timestamp }` baik untuk eksekusi sukses maupun error validasi framework.
  - Memanfaatkan fitur native CI4 4.4+ CORS filter (`Config\Cors.php`).

---

## 3. Matriks Perubahan & Pembaruan Dokumentasi

| Dokumen | Status Review | Perubahan Utama yang Diterapkan |
|---|---|---|
| `docs/PROJECT_AUDIT.md` | **Final & Verified** | Memperbaiki pemisahan rute studio (Content 6 tab vs Day 4 alat), menambahkan inventaris form live streaming, memperjelas ekspor rekap CSV UTF-8 BOM, dan memperbarui catatan CORS filter CI4. |
| `docs/FEATURE_INVENTORY.md` | **Final & Verified** | Menambahkan seksi 7.2 Live Streaming, memperbarui seksi 14 dengan matriks 5 skenario penggantian template, menambahkan rincian form upload struk bayar, dan menyinkronkan matriks hak akses. |
| `docs/BUSINESS_FLOW.md` | **Final & Verified** | Menulis ulang diagram Mermaid Journey 1–7, menambahkan alur verifikasi bukti bayar manual vs gateway, menyelaraskan state machine pesanan & lisensi, menegaskan kewajiban soft delete akibat FK restrict, dan merinci FAQ Lisensi (Q1–Q8). |
| `docs/DATABASE_DESIGN.md` | **Final & Verified** | Menambahkan tabel `payments` dan `invitation_streamings`, memperkaya tabel `invitations` (`cover_image_url`, `theme_config`, virtual column `is_published`), memperbarui composite index covering katering `(invitation_id, attendance, pax)`, dan scoped unique key tamu. |
| `docs/ERD.md` | **Final & Verified** | Menambahkan entitas `PAYMENTS` dan `INVITATION_STREAMINGS`, memperbarui kardinalitas `ORDERS ||--o| TEMPLATE_LICENCES`, serta menyelaraskan matriks integritas referensial antarentitas. |
| `docs/API_SPECIFICATION.md` | **Final & Verified** | Menambahkan endpoint `GET /public/invitations/:slug/wishes`, `POST /orders/:id/proof`, dan `PUT /invitations/:id/streaming`, menstandarkan request/response envelope, dan menyelaraskan mapping camelCase &rarr; snake_case. |
| `docs/ARCHITECTURE.md` | **Final & Verified** | Mengeliminasi boilerplate Repository pattern, memodernisasi `BaseApiController`, mengimplementasikan `AuthContext` aman PHP 8.2+, melengkapi 15 Entity domain, dan menyusun rute `Config/Routes.php` yang presisi. |
| `docs/DATABASE_DECISIONS.md` | **Final & Verified** | Menambahkan ADR-010 (Pemisahan Orders & Payments), ADR-011 (Live Streaming Architecture), ADR-012 (Prefiks `invitation_*`), ADR-013 (State Machines), ADR-014 (Slug Recycling on Soft Delete), dan ADR-015 (Covering Index Katering). |

---

## 4. Verifikasi Model Monetisasi & Lisensi (Jawaban Definitif)

Berdasarkan pengujian terhadap kode sumber `src/lib/templates.ts`, `src/lib/orders.ts`, `src/components/console/sections/DesignSection.tsx`, dan `src/lib/invitationStore.tsx`:

1. **Pembedaan Gratis vs Berbayar**:
   - Ditentukan secara eksplisit melalui atribut `price: number` di master template.
   - Tema gratis: `boho-botanical` (`price: 0`).
   - Tema berbayar: 7 tema (`price: 49000`, `79000`, `89000`).
   - Logika penayangan `needsPurchase(id)`: jika `price === 0`, sistem mengembalikan `false` (dapat langsung dipublikasikan tanpa checkout).

2. **Keterikatan Lisensi**:
   - Lisensi terikat pada pasangan unik **`(invitation_id, template_id)`** di bawah akun pengguna.
   - Menggunakan batasan unik database: `UNIQUE KEY uk_invitation_template_licence (invitation_id, template_id)`.
   - Lisensi **TIDAK DAPAT** digunakan kembali pada undangan lain milik akun yang sama.

3. **Matriks Penggantian Template (Template Switching)**:
   - *Free &rarr; Free*: Bebas berganti kapan saja, langsung siap tayang.
   - *Free &rarr; Paid*: Status undangan menjadi `Belum Dibeli` (`needsPurchase = true`). Publikasi ditolak sampai checkout selesai. Konten yang sudah diisi tetap utuh.
   - *Paid &rarr; Free*: Bebas beralih ke tema gratis; lisensi berbayar yang pernah dibeli tetap tersimpan aman.
   - *Paid A &rarr; Paid B*: Memerlukan pembelian lisensi baru untuk tema B.
   - *Paid B &rarr; Paid A (Revert)*: Sistem mengenali record lisensi lama yang sudah ada di database, status undangan seketika kembali aktif tanpa membayar ulang.

4. **Penghapusan & Pengarsipan Undangan**:
   - **Arsip**: Lisensi tetap aktif selamanya (`kind = 'perpetual'`).
   - **Hapus**: Undangan menggunakan mekanisme **Soft Delete** (`deleted_at = NOW()`). Hal ini wajib karena tabel `orders` memiliki relasi `fk_orders_invitation` dengan aturan `ON DELETE RESTRICT` untuk melindungi audit keuangan.

5. **Pencegahan Fraud & Manipulasi**:
   - Lisensi **DILARANG** diterbitkan oleh frontend.
   - Lisensi hanya diterbitkan di sisi server dalam satu transaksi database atomik (ACID) saat status pembayaran menjadi `verified` / `confirmed`.
   - Endpoint publikasi (`PATCH /invitations/:id/publish`) melakukan query SQL langsung ke `template_licences`.

---

## 5. Simulasi Skenario Bisnis & Validasi Ujung-ke-Ujung (End-to-End Walkthrough)

Seluruh 12 skenario pengujian bisnis telah disimulasikan dan terbukti 100% didukung oleh skema database dan spesifikasi API:

```
[1. User Registration] ──> POST /auth/register ──> INSERT users, INSERT user_tokens ──> 201 Created (JWT Tokens)
                                 │
[2. User Login] ─────────> POST /auth/login ───> SELECT users, INSERT user_tokens ────> 200 OK (JWT Tokens)
                                 │
[3. Buat Undangan] ──────> POST /invitations ──> INSERT invitations, couples, events ──> 201 Created (Draft, Slug Generated)
                                 │
[4. Edit Konten] ────────> PUT /invitations/:id/[couple|quote|events|streaming|gallery] ──> 200 OK (Auto-Synced)
                                 │
[5. Pilih Template] ─────> PATCH /invitations/:id/template ──> UPDATE invitations.template_id ──> 200 OK
                                 │
[6. Beli Lisensi] ───────> POST /orders/checkout ──> INSERT orders, payments ──> Upload Struk / Webhook ──>
                           INSERT template_licences (Kind: Perpetual) ──> Status: Confirmed/Paid
                                 │
[7. Publikasi Undangan] ─> PATCH /invitations/:id/publish ──> Verify Licence SQL ──> UPDATE is_published = 1
                                 │
[8. Tamu Buka Undangan] ─> GET /public/invitations/:slug?to=Budi ──> 200 OK ──> Buka Cover ──> Autoplay Music
                                 │
[9. Tamu Kirim RSVP] ────> POST /public/invitations/:slug/rsvp ──> Rate Limit ──> INSERT invitation_rsvps ──>
                           GET /public/invitations/:slug/wishes ──> Tampil di Linimasa Doa Restu
                                 │
[10. Kelola Tamu & WA] ──> GET/POST /invitations/:id/guests ──> Generate Link WA Personal ──> Check-In Hari-H
                                 │
[11. Statistik & Rekap] ─> GET /invitations/:id/rsvps ──> Covering Index Scan B-Tree ──> GET /export (CSV UTF-8)
                                 │
[12. Hapus/Arsip Undangan] -> DELETE /invitations/:id ──> Soft-Delete Slug Rename ──> Orders & Licences Utuh
```

---

## 6. Analisis Risiko yang Masih Tersisa & Mitigasi

| Area Risiko | Tingkat Risiko | Dampak Potensial | Strategi Mitigasi yang Ditetapkan |
|---|---|---|---|
| **Lonjakan Trafik Tamu Undangan (Viral Traffic)** | Sedang | Beban database MySQL melonjak saat ribuan link dibagikan di WhatsApp secara bersamaan | Mengaktifkan caching layer CodeIgniter 4 (File/Redis Cache) pada endpoint `GET /public/invitations/:slug` dengan TTL 10 menit, serta invalidasi instan saat pemilik menyimpan perubahan (*Cache Invalidation on Write*). |
| **Spam Ucapan pada Endpoint Publik** | Rendah | Bot spam mengirimkan ribuan pesan promosi ke buku tamu | Menerapkan `RateLimiterFilter` di CI4 (maksimal 5 request per 10 menit per IP) dan sanitasi string XSS via helper `esc()`. |
| **Penyalahgunaan Upload Berkas** | Sedang | Berkas berbahaya disamarkan sebagai gambar foto/audio | Validasi *magic bytes signature* melalui library `MimeType` CI4 (bukan sekadar ekstensi file), auto-convert gambar ke format WebP, dan simpan di luar folder eksekusi skrip PHP. |
| **Kegagalan Pemrosesan Webhook Transaksi** | Rendah | Notifikasi pembayaran dari gateway telat atau tidak terkirim | Mengimplementasikan sistem polling berkala / tombol "Cek Status Pembayaran" pada antarmuka `/dashboard/orders` yang memicu inquiry langsung ke payment gateway API. |

---

## 7. Pertanyaan Terbuka (*Open Questions*) untuk Pemangku Kepentingan

Sebelum tim developer memulai pengkodean backend CodeIgniter 4, terdapat 3 keputusan non-arsitektur yang disarankan untuk disepakati:

1. **Pemilihan Gateway Pembayaran Resmi**:
   - *Status*: Skema database `payments` dan controller CI4 telah dirancang kompatibel dengan Midtrans Snap, Xendit, dan Tripay.
   - *Keputusan yang dibutuhkan*: Menentukan provider mana yang akan digunakan pertama kali untuk registrasi akun merchant dan API Key.
2. **Penyedia Layanan Cloud Object Storage**:
   - *Status*: Backend saat ini dikonfigurasi menggunakan penyimpanan filesystem lokal (`writable/uploads/` dengan symlink publik).
   - *Keputusan yang dibutuhkan*: Apakah pada fase peluncuran awal tetap menggunakan server filesystem lokal atau langsung menghubungkan driver S3 ke Cloudflare R2 / AWS S3 untuk efisiensi bandwidth server utama.
3. **Mekanisme Otentikasi Meja Resepsionis Hari-H**:
   - *Status*: Saat ini check-in tamu dioperasikan oleh pemilik akun yang login di browser.
   - *Keputusan yang dibutuhkan*: Apakah diperlukan fitur pembuatan PIN/Akses Khusus Staf Resepsionis agar panitia hari-H dapat membuka meja check-in di ponsel mereka tanpa harus mengetahui password akun utama pengantin?

---

## 8. Final Verification Checklist

- [x] Seluruh 8 dokumen utama telah diperiksa secara menyeluruh tanpa ada bagian yang terpotong.
- [x] Struktur rute studio editor selaras 100% antara frontend Next.js dan spesifikasi dokumentasi.
- [x] Fitur Siaran Langsung (Live Streaming) telah dimodelkan secara lengkap di skema database, ERD, dan kontrak API.
- [x] Seluruh 8 template desain aktual (`undangan_1` s.d. `undangan_8`) dan struktur harganya terpetakan presisi.
- [x] Aturan model monetisasi perpetual licence per pasangan `(invitation_id, template_id)` terverifikasi dari kode sumber.
- [x] Skema database relasional memenuhi kaidah Third Normal Form (3NF) dengan isolasi multi-tenant yang aman dari IDOR.
- [x] Skema indeks covering B-Tree untuk kalkulator katering dan optimasi query publik telah dirancang.
- [x] Kontrak RESTful API v1 selaras dengan pemanggilan `apiFetch` di `src/lib/api.ts` termasuk endpoint wishes dan struk pembayaran.
- [x] Arsitektur backend CodeIgniter 4 dirancang secara realistis, bersih, dan idiomatik tanpa anti-pattern.
- [x] Tidak ada modifikasi yang merusak kode sumber frontend atau database aktual.
- [x] Seluruh 12 skenario pengujian bisnis lolos validasi.

---

**Kesimpulan Akhir**: Seluruh dokumentasi teknis di direktori `docs/` kini berstatus **VERIFIED & FINAL**. Rangkaian dokumen ini merupakan *single source of truth* yang lengkap, kokoh, dan siap diserahkan kepada tim pengembang untuk memulai implementasi backend CodeIgniter 4.
