# Feature Inventory & Specification — Undangan Online (InfoMase)

Dokumen ini memuat inventaris lengkap seluruh fitur yang ditemukan pada codebase aktual frontend `undangan-online`. Setiap fitur diuraikan berdasarkan tujuan, interaksi pengguna, data input/output, persistensi, dependensi, aturan bisnis, relasi entitas, kebutuhan API, kebutuhan database, serta hak akses dan kepemilikan data.

---

## 1. Authentication & Account Management

### 1.1 Registrasi Akun Baru
- **Tujuan & Fungsi**: Memungkinkan calon pengguna baru mendaftar untuk membuat akun dan mengelola undangan digital.
- **User Interaction**: Pengguna mengisi formulir di `/register` (Nama Lengkap, Email, No. WhatsApp, Kata Sandi, Konfirmasi Kata Sandi) lalu menekan tombol "Buat Akun".
- **Input Data**: `name` (string), `email` (string), `phoneNumber` (string, opsional), `password` (string), `confirmPassword` (string).
- **Output Data**: Objek `user` (id, name, email, phoneNumber, role, createdAt) dan `token` (`accessToken`, `refreshToken`, `expiresIn`).
- **Data yang Disimpan**: Data pengguna baru pada tabel `users`, hash password, timestamp pembuatan akun.
- **Data Dependencies**: Belum ada dependensi.
- **Business Rules & Validation**:
  - Email harus berformat valid dan unik (belum terdaftar di sistem).
  - Kata sandi minimal 8 karakter.
  - Konfirmasi kata sandi harus persis sama dengan kata sandi.
  - Nomor telepon dinormalisasi ke format standar Indonesia (diawali `08` atau `628`).
  - Akun baru otomatis memiliki role `USER`.
- **Relasi Entitas**: 1 `User` memiliki 0..N `Invitations` dan 0..N `Orders`.
- **Kebutuhan API**: `POST /api/v1/auth/register`
- **Kebutuhan Database**: Tabel `users` (insert row baru).
- **Ownership & Permission**: Publik (tanpa autentikasi).

### 1.2 Login Akun
- **Tujuan & Fungsi**: Autentikasi pengguna terdaftar untuk memperoleh token akses ke konsol manajemen.
- **User Interaction**: Pengguna memasukkan Email dan Password di `/login`, lalu menekan tombol "Masuk".
- **Input Data**: `email` (string), `password` (string).
- **Output Data**: Objek profil pengguna dan pasangan JWT Bearer token (`accessToken`, `refreshToken`).
- **Data yang Disimpan**: Sesi token aktif, timestamp login terakhir (`last_login_at`).
- **Data Dependencies**: Keberadaan akun di tabel `users`.
- **Business Rules & Validation**:
  - Verifikasi hash kata sandi menggunakan algoritma `PASSWORD_BCRYPT` / `ARGON2ID`.
  - Rate limiting untuk mencegah *brute-force login* (maksimal 5 percobaan gagal per IP/email dalam 15 menit).
- **Relasi Entitas**: Entitas `users` berelasi dengan sesi/token.
- **Kebutuhan API**: `POST /api/v1/auth/login`
- **Kebutuhan Database**: Query lookup pada tabel `users` berdasarkan email, update `last_login_at`.
- **Ownership & Permission**: Publik.

### 1.3 Refresh Token & Sesi
- **Tujuan & Fungsi**: Memperbarui `accessToken` yang telah kedaluwarsa tanpa memaksa pengguna login ulang secara berkala.
- **User Interaction**: Berjalan otomatis di latar belakang (*silent refresh*) melalui HTTP interceptor client saat menerima respon 401.
- **Input Data**: `refreshToken` (string).
- **Output Data**: `accessToken` baru (string) dan masa aktifnya.
- **Data yang Disimpan**: Rotasi refresh token pada tabel `user_tokens`.
- **Data Dependencies**: `refreshToken` aktif dan belum dicabut (*revoked*).
- **Business Rules & Validation**: Refresh token sekali pakai (*token rotation*) untuk mencegah token hijacking.
- **Kebutuhan API**: `POST /api/v1/auth/refresh-token`
- **Kebutuhan Database**: Tabel `user_tokens`.
- **Ownership & Permission**: Pengguna terotentikasi pemilik refresh token.

### 1.4 Logout
- **Tujuan & Fungsi**: Mengakhiri sesi pengguna secara aman dan mencabut token aktif.
- **User Interaction**: Klik tombol "Keluar" pada menu navigasi konsol akun.
- **Input Data**: `accessToken` di header `Authorization: Bearer <token>`.
- **Output Data**: Status sukses dan pesan konfirmasi.
- **Data yang Disimpan**: Blacklist atau penghapusan token aktif dari database.
- **Kebutuhan API**: `POST /api/v1/auth/logout`
- **Kebutuhan Database**: Hapus row dari tabel `user_tokens` atau update flag `is_revoked = 1`.
- **Ownership & Permission**: Pemilik akun aktif.

---

## 2. User Profile Management

### 2.1 Get Current Profile (`/auth/me`)
- **Tujuan & Fungsi**: Mengambil data profil lengkap pemilik akun yang sedang login saat inisialisasi aplikasi.
- **User Interaction**: Terpanggil otomatis saat aplikasi web dimuat atau halaman konsol dibuka.
- **Input Data**: Bearer Token.
- **Output Data**: Detail pengguna: `id`, `name`, `email`, `phoneNumber`, `avatar`, `role`, `totalInvitations`, `createdAt`.
- **Data Dependencies**: Akun valid di database.
- **Kebutuhan API**: `GET /api/v1/auth/me`
- **Kebutuhan Database**: Tabel `users` join/agregat count tabel `invitations`.
- **Ownership & Permission**: Hanya pengguna pemilik token bersangkutan.

### 2.2 Update Profile & Avatar
- **Tujuan & Fungsi**: Memperbarui nama lengkap, nomor WhatsApp, atau foto avatar profil akun.
- **User Interaction**: Pengguna mengedit form pengaturan akun dan mengunggah avatar.
- **Input Data**: `name`, `phoneNumber`, file gambar avatar (`multipart/form-data`).
- **Output Data**: Profil terbaru dan URL publik avatar.
- **Kebutuhan API**: `PUT /api/v1/auth/profile`, `POST /api/v1/auth/avatar`
- **Kebutuhan Database**: Update row tabel `users`.
- **Ownership & Permission**: Pemilik akun.

---

## 3. Dashboard & Multi-Invitation Console

### 3.1 Overview Ringkasan Akun (`/dashboard`)
- **Tujuan & Fungsi**: Menampilkan ringkasan metrik global akun: total undangan, lisensi aktif, total estimasi tamu terdaftar, total konfirmasi hadir (pax), total nominal pembelian, dan kartu ringkasan undangan aktif.
- **User Interaction**: Melihat metrik statistik, beralih antar-undangan, menyalin tautan undangan publik, dan tombol cepat ganti status draf/tayang.
- **Input Data**: ID pengguna (dari token sesi).
- **Output Data**: Agregasi data: `totalInvitations`, `activeLicencesCount`, `totalGuestsAll`, `totalConfirmedPaxAll`, `totalSpent`, `recentInvitations[]`.
- **Data Dependencies**: Tabel `invitations`, `orders`, `template_licences`, `guests`, `rsvps`.
- **Kebutuhan API**: `GET /api/v1/dashboard/summary`
- **Kebutuhan Database**: Agregasi query relational berindeks `user_id`.
- **Ownership & Permission**: Hanya menampilkan data milik `user_id` aktif.

---

## 4. Invitation Management

### 4.1 Pembuatan Undangan Baru (Create Invitation)
- **Tujuan & Fungsi**: Membuat entitas undangan baru di bawah akun pengguna aktif.
- **User Interaction**: Klik tombol "+ Undangan Baru" di header/overview, mengisi form modal (Nama Panggilan Pria & Wanita, Tanggal Acara opsional, dan Desain Template awal), lalu submit.
- **Input Data**: `groomName` (string), `brideName` (string), `eventDate` (date string `YYYY-MM-DD`, opsional), `templateId` (string).
- **Output Data**: Objek `InvitationData` baru lengkap dengan ID, slug unik otomatis, status draf (`isPublished: false`), dan konten bawaan default.
- **Data yang Disimpan**: Row baru pada tabel `invitations` beserta data profil awal di tabel `invitation_couples` dan event awal di `invitation_events`.
- **Business Rules & Validation**:
  - `groomName` dan `brideName` wajib diisi.
  - Template yang dipilih harus aktif dan terdaftar di master tabel `templates`.
  - Slug dihasilkan otomatis dengan format `{groomName}-{brideName}` yang disanitasi URL-safe. Jika slug sudah ada di database, sistem menambahkan suffix numerik acak/berurutan (`-2`, `-3`).
  - Status awal wajib `DRAFT` / `isPublished = 0`.
- **Relasi Entitas**: 1 `User` memiliki N `Invitations`. 1 `Invitation` menjadi induk bagi seluruh child resources (couples, events, stories, gallery, accounts, guests, rsvps, dll).
- **Kebutuhan API**: `POST /api/v1/invitations`
- **Kebutuhan Database**: Insert ke `invitations`, `invitation_couples`, `invitation_events` dalam 1 transaksi database (ACID).
- **Ownership & Permission**: Pengguna terotentikasi. Undangan terikat permanen ke `user_id`.

### 4.2 Cek Ketersediaan Slug (Check Slug Availability)
- **Tujuan & Fungsi**: Memeriksa ketersediaan slug kustom secara real-time saat pengguna mengetik URL yang diinginkan.
- **User Interaction**: Pengguna mengetik nama slug di pengaturan umum atau modal buat undangan.
- **Input Data**: Query parameter `slug` (string).
- **Output Data**: `{ slug: string, available: boolean, previewUrl: string }`.
- **Business Rules & Validation**:
  - Slug hanya boleh memuat huruf kecil, angka, dan tanda hubung (`a-z0-9-`).
  - Kata-kata terlarang / reserved keyword sistem dilarang digunakan (`api`, `login`, `register`, `dashboard`, `admin`, `checkout`, `public`, `assets`).
- **Kebutuhan API**: `GET /api/v1/invitations/check-slug?slug=...`
- **Kebutuhan Database**: Query `SELECT id FROM invitations WHERE slug = ?`.
- **Ownership & Permission**: Pengguna terotentikasi.

### 4.3 Duplikasi Undangan (Duplicate Invitation)
- **Tujuan & Fungsi**: Menyalin seluruh konfigurasi konten undangan yang sudah ada untuk membuat variasi acara baru (misal: acara ngunduh mantu terpisah dari akad/resepsi).
- **User Interaction**: Klik menu aksi "Duplikasi Undangan".
- **Input Data**: `sourceInvitationId`.
- **Output Data**: Objek undangan baru hasil kloning dengan slug baru, judul berlabel `(salinan)`, dan status draf.
- **Business Rules**:
  - Seluruh konten desain, mempelai, acara, cerita, kutipan, amplop disalin.
  - **Data tamu (`guests`) dan data buku tamu/RSVP (`rsvpList`) TIDAK ikut disalin** karena tamu dan kehadiran bersifat unik per acara.
  - Status publikasi hasil duplikasi di-reset menjadi `DRAFT`.
  - Lisensi template **TIDAK terbawa** jika template berbayar (karena lisensi mengikat 1 template per 1 undangan).
- **Kebutuhan API**: `POST /api/v1/invitations/:id/duplicate`
- **Kebutuhan Database**: Multi-table clone query via DB Transaction.
- **Ownership & Permission**: Hanya pemilik undangan sumber.

### 4.4 Toggle Status Publikasi (Publish / Unpublish Guard)
- **Tujuan & Fungsi**: Mengaktifkan atau menonaktifkan visibilitas tautan publik undangan bagi tamu.
- **User Interaction**: Klik tombol "Tayangkan" atau "Jadikan Draf" pada header studio/overview.
- **Input Data**: `invitationId`.
- **Output Data**: Status publikasi terbaru `{ ok: boolean, isPublished: boolean }`.
- **Business Rules & Validation**:
  - **Subscription/Licence Guard**: Jika template yang dipakai berbayar (`price > 0`), sistem memvalidasi keberadaan lisensi aktif pada tabel `template_licences` untuk kombinasi `(invitation_id, template_id)`.
  - Jika belum memiliki lisensi berbayar, publikasi **DITOLAK** dengan kode error `licence-required`.
  - Jika template gratis (`price = 0`), publikasi diizinkan langsung.
  - Saat `isPublished = 1`, tautan `/invite/[slug]` dapat diakses publik. Saat `isPublished = 0`, akses publik menghasilkan 404/Private State, tetapi pemilik tetap dapat melihat preview di konsol.
- **Kebutuhan API**: `PATCH /api/v1/invitations/:id/publish`
- **Kebutuhan Database**: Update kolom `is_published` pada tabel `invitations`.
- **Ownership & Permission**: Pemilik undangan.

### 4.5 Penghapusan Undangan (Delete Invitation)
- **Tujuan & Fungsi**: Menghapus undangan dari konsol pengguna.
- **User Interaction**: Klik tombol "Hapus Undangan" pada pengaturan atau modal studio.
- **Input Data**: `invitationId`.
- **Output Data**: Pesan konfirmasi penghapusan.
- **Business Rules & Validation**:
  - Akun minimal harus memiliki 1 undangan tersisa (tidak boleh menghapus satu-satunya undangan aktif tanpa membuat yang baru).
  - Menggunakan mekanisme **Soft Delete** (`deleted_at` timestamp) agar riwayat transaksi dan audit integritas data keuangan tetap terjaga.
- **Kebutuhan API**: `DELETE /api/v1/invitations/:id`
- **Kebutuhan Database**: Soft delete pada tabel `invitations` (`UPDATE invitations SET deleted_at = NOW() WHERE id = ?`).
- **Ownership & Permission**: Pemilik undangan.

---

## 5. Invitation Customization (Studio Editor)

### 5.1 Informasi Mempelai (Couple Info)
- **Tujuan & Fungsi**: Mengelola informasi profil kedua mempelai (Pria & Wanita).
- **User Interaction**: Tab "Mempelai" di Studio Content (`/dashboard/undangan/[id]/content`).
- **Input Data**:
  - Mempelai Pria: `name`, `fullName`, `fatherName`, `motherName`, `photo`, `instagram`, `bio`.
  - Mempelai Wanita: `name`, `fullName`, `fatherName`, `motherName`, `photo`, `instagram`, `bio`.
- **Output Data**: Objek `groom` dan `bride` tersimpan.
- **Data yang Disimpan**: Tabel `invitation_couples`.
- **Kebutuhan API**: `PUT /api/v1/invitations/:id/couple`
- **Kebutuhan Database**: Update row di `invitation_couples`.
- **Ownership & Permission**: Pemilik undangan.

### 5.2 Kutipan & Teks Agama / Quote
- **Tujuan & Fungsi**: Menampilkan kutipan romantis atau ayat suci pernikahan (misal: Ar-Rum: 21, 1 Korintus 13, ungkapan sastra).
- **User Interaction**: Tab "Kutipan" di Studio Content.
- **Input Data**: `text` (teks kutipan), `source` (sumber ayat/tokoh), `translation` (terjemahan teks).
- **Data yang Disimpan**: Tabel `invitation_quotes`.
- **Kebutuhan API**: `PUT /api/v1/invitations/:id/quote`
- **Ownership & Permission**: Pemilik undangan.

### 5.3 Kisah Perjalanan Cinta (Love Story)
- **Tujuan & Fungsi**: Menampilkan linimasa perjalanan cinta pasangan (pertemuan pertama, komitmen, lamaran, hari pernikahan).
- **User Interaction**: Tab "Kisah" di Studio Content: menambah bab baru, mengunggah foto ilustrasi, mengedit tahun, judul, narasi, atau menghapus bab.
- **Input Data**: Array of story items: `year` (string/number), `title` (string), `description` (text), `image` (URL string).
- **Data yang Disimpan**: Tabel `invitation_stories` (1 undangan memiliki 0..N stories).
- **Kebutuhan API**: `PUT /api/v1/invitations/:id/stories` (bulk sync) atau `POST`/`PUT`/`DELETE` granular.
- **Ownership & Permission**: Pemilik undangan.

### 5.4 Galeri Foto & Album Kenangan
- **Tujuan & Fungsi**: Menampilkan album foto prewedding / momen bahagia pasangan dalam format grid/bento lightbox.
- **User Interaction**: Tab "Galeri" di Studio Content: upload single/batch foto, menambahkan caption foto, menyusun urutan tampilan, dan menghapus foto.
- **Input Data**: Array of gallery items: `url` (string URL file), `caption` (string opsional), `sortOrder` (integer).
- **Data yang Disimpan**: Tabel `invitation_galleries`.
- **Kebutuhan API**: `POST /api/v1/invitations/:id/upload/gallery-batch`, `PUT /api/v1/invitations/:id/gallery`, `DELETE /api/v1/invitations/:id/gallery/:photoId`.
- **Ownership & Permission**: Pemilik undangan.

### 5.5 Amplop Digital, QRIS & Kado Fisik
- **Tujuan & Fungsi**: Memfasilitasi tamu untuk mengirim tanda kasih tanpa uang tunai langsung ke rekening pasangan atau mengirim kado ke alamat rumah.
- **User Interaction**: Tab "Amplop" di Studio Content: menambah nomor rekening bank, mengunggah barcode QRIS, dan mengisi alamat tujuan kado fisik.
- **Input Data**:
  - Rekening Bank: `bankName` (BCA, Mandiri, BNI, BRI, dll), `accountNumber`, `accountHolder`, `qrisUrl` (opsional).
  - Alamat Fisik Kado: `recipientName`, `phone`, `fullAddress`.
- **Data yang Disimpan**: Tabel `invitation_bank_accounts` (1:N) dan tabel `invitation_gifts` (1:1).
- **Business Rules**: Dana amplop ditransfer langsung oleh tamu ke rekening pemilik tanpa perantara atau pemotongan fee dari aplikasi.
- **Kebutuhan API**: `PUT /api/v1/invitations/:id/bank-accounts`, `PUT /api/v1/invitations/:id/gift-address`.
- **Ownership & Permission**: Pemilik undangan.

### 5.6 Musik Latar (Background Music)
- **Tujuan & Fungsi**: Memutar lagu tema pernikahan saat tamu membuka undangan secara otomatis dan interaktif.
- **User Interaction**: Tab "Musik" di Studio Content: memilih lagu preset, mengunggah file MP3 kustom, mengatur judul, penyanyi, dan toggle autoplay.
- **Input Data**: `title` (string), `artist` (string), `url` (audio URL), `autoplay` (boolean).
- **Data yang Disimpan**: Tabel `invitation_musics`.
- **Kebutuhan API**: `PUT /api/v1/invitations/:id/music`, `POST /api/v1/invitations/:id/upload/audio`.
- **Ownership & Permission**: Pemilik undangan.

---

## 6. Invitation Templates & Catalog

### 6.1 Katalog Template Aktif
- **Tujuan & Fungsi**: Menyediakan etalase tema visual undangan yang dapat dipilih pengguna.
- **User Interaction**: Halaman `/dashboard/katalog` dan Tab `/design` di Studio Editor.
- **Showcase 8 Template Desain Aktual**:
  1. `boho-botanical` (Folder `undangan_1`): Aquarel hangat, dedaunan bergoyang, gate cover 3D (Gratis / Rp 0).
  2. `modern-minimalist` (Folder `undangan_2`): Editorial Kinfolk bersih, aksen sage olive (Rp 49.000).
  3. `tropical-beach` (Folder `undangan_3`): Nuansa pantai eksotis, dedaunan palem tropis, ocean teal (Rp 49.000).
  4. `luxury-islamic` (Folder `undangan_4`): Bingkai mihrab islami, kaligrafi basmalah, aksen emas (Rp 79.000).
  5. `misty-mountain` (Folder `undangan_5`): Kabut pegunungan pinus, alpine calming, pine emerald (Rp 49.000).
  6. `royal-maroon` (Folder `undangan_6`): Beludru maroon istana, lampu gantung chandelier kristal (Rp 79.000).
  7. `pawiwahan-agung` (Folder `undangan_7`): Adat Jawa Pendopo Kraton, batik Megamendung, wayang (Rp 89.000).
  8. `pawiwahan-pethak` (Folder `undangan_8`): Adat Jawa klasik putih pethak suci, ronce melati (Rp 89.000).
- **Data yang Disimpan**: Master data katalog pada tabel `templates` dan `template_categories`.
- **Kebutuhan API**: `GET /api/v1/templates`, `GET /api/v1/templates/:id`.
- **Ownership & Permission**: Master data sistem (publik/read-only).

### 6.2 Penggantian Template pada Undangan
- **Tujuan & Fungsi**: Mengganti template visual undangan kapan saja tanpa menghilangkan konten yang sudah diisi.
- **User Interaction**: Klik template pilihan di `/dashboard/undangan/[id]/design`.
- **Business Rules**:
  - Konten biodata, acara, galeri, dan cerita tidak dihapus saat template berganti.
  - Jika berganti ke template berbayar baru yang belum memiliki lisensi, sistem memicu notifikasi `Belum dibeli` dan tombol CTA Beli Lisensi.
- **Kebutuhan API**: `PATCH /api/v1/invitations/:id/template`
- **Kebutuhan Database**: Update `template_id` di tabel `invitations`.

---

## 7. Event & Day-of Schedule Management

### 7.1 Manajemen Multi-Acara (Akad, Resepsi, Pemberkatan, dll)
- **Tujuan & Fungsi**: Menampung informasi lebih dari satu rangkaian acara pernikahan dengan waktu dan lokasi yang berbeda.
- **User Interaction**: Tab "Acara" di Studio Konten (`/dashboard/undangan/[id]/content`, tab `events`): menambah acara baru, mengedit jadwal & lokasi, menghapus acara. *(Catatan: Route `/dashboard/undangan/[id]/day` didedikasikan untuk kalkulator katering dan check-in operasional, bukan konfigurasi jadwal).*
- **Input Data**:
  - `title` (misal: "Akad Nikah", "Resepsi Pernikahan", "Unduh Mantu").
  - `date` (`YYYY-MM-DD`).
  - `startTime` (`HH:mm`), `endTime` (`HH:mm`).
  - `timezone` (`WIB`, `WITA`, `WIT`).
  - `locationName` (Nama gedung, hotel, atau kediaman).
  - `address` (Alamat lengkap).
  - `mapsUrl` (Tautan Google Maps lokasi).
- **Data yang Disimpan**: Tabel `invitation_events`.
- **Business Rules**:
  - Satu undangan dapat memiliki 1 hingga N acara.
  - Tanggal acara pertama secara otomatis menjadi acuan hitung mundur (*countdownDate*).
- **Kebutuhan API**: `GET /api/v1/invitations/:id/events`, `POST /api/v1/invitations/:id/events`, `PUT /api/v1/invitations/:id/events/:eventId`, `DELETE /api/v1/invitations/:id/events/:eventId`.
- **Ownership & Permission**: Pemilik undangan.

### 7.2 Siaran Langsung & Pernikahan Virtual (Live Streaming) — [PROPOSED / UNSUPPORTED DI FRONTEND]
- **Status Verifikasi Codebase**: **UNSUPPORTED**. Fitur ini tidak ditemukan implementasinya pada frontend aktual (tidak ada UI, tidak ada field pada `InvitationData`, dan tidak ada handler pada `template-bridge.js`). Bagian ini dicatat sebagai usulan ekstensi fitur masa depan.
- **Tujuan & Fungsi**: Memungkinkan tamu jarak jauh menyaksikan momen sakral pernikahan secara daring melalui platform streaming video.
- **Rancangan Entitas**: Tabel `invitation_streamings` (1:1 dengan `invitations`).
- **Kebutuhan API (Masa Depan)**: `PUT /api/v1/invitations/:id/streaming`.

---

## 8. Guest Management & WhatsApp Automation

### 8.1 Manajemen Daftar Tamu (Guest Manager)
- **Tujuan & Fungsi**: Mendata daftar orang yang diundang beserta kategori pergaulan dan nomor telepon untuk personalisasi tautan undangan.
- **User Interaction**: Tab `/dashboard/undangan/[id]/guests`:
  - Input single tamu: form nama, kategori (`Keluarga`, `Sahabat`, `Teman Kantor`, `VIP`, `Umum`), nomor telepon (WhatsApp). *(Catatan: field kuota `maxPax` dan `catatan` hanya didukung pada level adapter `api.ts`, belum diekspos di formulir UI).*
  - Input bulk / banyak tamu: menempelkan daftar teks multi-baris (format: `Nama; NoWA` atau `Nama, NoWA`).
  - Filter tamu berdasarkan kategori (`Semua`, `Keluarga`, `Sahabat`, `Teman Kantor`, `VIP`, `Umum`).
  - Pencarian instan tamu berdasarkan nama.
  - Hapus tamu individual dengan konfirmasi dialog modal.
- **Input Data**: `name` (string), `category` (enum), `phoneNumber` (string opsional).
- **Output Data**: Daftar tamu dengan tautan personal instan: `/invite/[slug]?to=Nama+Tamu`.
- **Data yang Disimpan**: Tabel `invitation_guests`.
- **Business Rules**: Nomor telepon dinormalisasi menjadi format standar panggilan internasional (`628...`).
- **Kebutuhan API**:
  - `GET /api/v1/invitations/:id/guests` (dengan pagination & search)
  - `POST /api/v1/invitations/:id/guests`
  - `POST /api/v1/invitations/:id/guests/bulk`
  - `PUT /api/v1/invitations/:id/guests/:guestId`
  - `DELETE /api/v1/invitations/:id/guests/:guestId`
- **Ownership & Permission**: Pemilik undangan.

### 8.2 Template Pesan WhatsApp & Generator Link Direct Send
- **Tujuan & Fungsi**: Menghasilkan pesan undangan personal otomatis yang siap dikirimkan langsung ke nomor WhatsApp tamu melalui satu klik tombol.
- **User Interaction**: Mengatur format kalimat undangan pada sub-tab "Template WhatsApp", lalu menekan tombol hijau "Kirim WA" pada setiap baris tamu.
- **Input Data**: Template pesan dengan variabel dinamis: `{guestName}`, `{eventDate}`, `{eventTime}`, `{venueName}`, `{venueAddress}`, `{groomName}`, `{brideName}`, `{link}`.
- **Output Data**: URL deep-link WhatsApp: `https://api.whatsapp.com/send?phone=[628xxx]&text=[EncodedMessage]`.
- **Data yang Disimpan**: Tabel `invitation_wa_templates`.
- **Business Rules**: Pemetaan kategori tamu ke template spesifik (misal: tamu `VIP` otomatis memakai bahasa formal berjarak sopan; tamu `Sahabat` otomatis memakai bahasa akrab santai).
- **Kebutuhan API**: `GET /api/v1/invitations/:id/wa-templates`, `PUT /api/v1/invitations/:id/wa-templates`, `GET /api/v1/invitations/:id/guests/:guestId/wa-message`.
- **Ownership & Permission**: Pemilik undangan.

---

## 9. RSVP & Guestbook Management

### 9.1 Pengiriman RSVP & Buku Tamu Publik
- **Tujuan & Fungsi**: Memungkinkan tamu yang membuka undangan mengirimkan konfirmasi kehadiran, jumlah orang yang akan hadir (*pax*), serta ucapan selamat dan doa restu.
- **User Interaction**: Tamu mengisi form pada seksi "RSVP & Ucapan" di halaman publik `/invite/[slug]`: memasukkan nama tamu, memilih kehadiran (`Hadir`, `Ragu`, `Tidak Hadir`), memilih pax (1..5), dan mengetik pesan doa restu.
- **Input Data**: `guestName` (string), `attendance` (enum: `hadir`, `tidak`, `ragu`), `pax` (integer), `message` (text), `guestCode` (opsional jika berasal dari link personal).
- **Output Data**: Konfirmasi pengiriman sukses dan pembaruan instan pada linimasa ucapan tamu.
- **Data yang Disimpan**: Tabel `invitation_rsvps`.
- **Business Rules**:
  - Sanitasi teks pesan untuk mencegah serangan XSS (*Cross-Site Scripting*).
  - Rate limiting berbasis IP publik untuk mencegah spam bot submit formulir.
- **Kebutuhan API**: `POST /api/v1/public/invitations/:slug/rsvp`, `GET /api/v1/public/invitations/:slug/wishes`.
- **Ownership & Permission**: Publik (tanpa login).

### 9.2 Manajemen Konsol RSVP Pemilik Undangan
- **Tujuan & Fungsi**: Memantau daftar seluruh konfirmasi kehadiran, rekap total pax hadir, memfilter berdasarkan status kehadiran, menghapus pesan spam, dan mengunduh berkas laporan CSV.
- **User Interaction**: Halaman `/dashboard/undangan/[id]/rsvp`.
- **Metrik Statistik yang Ditampilkan**:
  - Total konfirmasi pasti hadir & total estimasi pax.
  - Total tamu berstatus ragu-ragu.
  - Total tamu berhalangan / tidak hadir.
  - Total ucapan doa restu masuk.
- **Ekspor CSV**: Mengunduh seluruh baris RSVP dalam format berkas spreadsheet CSV (`rekap-rsvp-[slug].csv`).
- **Kebutuhan API**: `GET /api/v1/invitations/:id/rsvps`, `DELETE /api/v1/invitations/:id/rsvps/:rsvpId`, `GET /api/v1/invitations/:id/rsvps/export`.
- **Ownership & Permission**: Pemilik undangan.

---

## 10. Gallery & Media Management

### 10.1 Upload Foto Individual (Groom, Bride, Cover, QRIS)
- **Tujuan & Fungsi**: Mengunggah file foto tunggal untuk foto profil mempelai, foto cover undangan, og:image media sosial, atau barcode QRIS bank.
- **Input Data**: File gambar (`image/jpeg`, `image/png`, `image/webp`, max 5MB), parameter `category` / `type`.
- **Output Data**: URL publik gambar yang tersimpan, ukuran dimensi width/height, nama file.
- **Kebutuhan API**: `POST /api/v1/invitations/:id/upload/photo` (`multipart/form-data`).
- **Kebutuhan Database**: Metadata media disimpan atau di-assign ke kolom entitas terkait.
- **Ownership & Permission**: Pemilik undangan.

### 10.2 Upload Galeri Batch
- **Tujuan & Fungsi**: Mengunggah banyak foto kenangan sekaligus untuk album galeri foto prewedding.
- **Input Data**: Array file gambar `photos[]` (`multipart/form-data`).
- **Output Data**: Array objek media galeri tersimpan.
- **Kebutuhan API**: `POST /api/v1/invitations/:id/upload/gallery-batch`.
- **Ownership & Permission**: Pemilik undangan.

### 10.3 Upload Audio Musik Latar
- **Tujuan & Fungsi**: Mengunggah berkas lagu kustom (`audio/mpeg`, `audio/mp3`, max 10MB) untuk musik latar undangan.
- **Input Data**: File audio, judul lagu, nama musisi/artis.
- **Output Data**: URL berkas audio, durasi detik, nama berkas.
- **Kebutuhan API**: `POST /api/v1/invitations/:id/upload/audio`.
- **Ownership & Permission**: Pemilik undangan.

---

## 11. Digital Gift & Bank Account Management

### 11.1 Salin Nomor Rekening (Copy-to-Clipboard)
- **Tujuan & Fungsi**: Memudahkan tamu menyalin nomor rekening bank pengantin tanpa risiko salah ketik.
- **User Interaction**: Tamu menekan tombol "Salin Nomor" pada kartu bank di undangan publik.
- **Data Dependencies**: `invitation_bank_accounts`.
- **Behavior**: Interaksi sisi klien (`navigator.clipboard.writeText`) dengan fallback non-blocking jika API clipboard browser diblokir.

### 11.2 Penampil Gambar Barcode QRIS
- **Tujuan & Fungsi**: Menampilkan kode QRIS resmi pasangan agar tamu dapat memindai dari aplikasi e-wallet / mobile banking apa pun di Indonesia.
- **User Interaction**: Tampil dalam modal pembesar barcode atau kartu amplop.

---

## 12. Public Invitation Page & Interactive Cover

### 12.1 Dynamic Metadata & OpenGraph WhatsApp
- **Tujuan & Fungsi**: Menghasilkan cuplikan pratinjau yang indah saat tautan undangan dibagikan di chat WhatsApp, Telegram, atau Instagram (judul nama mempelai, deskripsi acara, dan gambar thumbnail cover).
- **User Interaction**: Saat tautan `/invite/[slug]` dikirimkan ke aplikasi perpesanan.
- **Kebutuhan Backend**: Menyediakan meta tag OG teroptimasi (`og:title`, `og:description`, `og:image`, `og:url`, `robots: noindex, nofollow` untuk privasi).

### 12.2 Sampul Amplop & Gerbang Interaktif (Gate Cover)
- **Tujuan & Fungsi**: Memberikan pengalaman pertama yang megah menyerupai membuka amplop surat fisik asli.
- **User Interaction**: Tamu membaca sapaan personal namanya ("Kepada Yth. Budi Santoso & Keluarga"), menekan tombol "Buka Undangan", animasi pintu/buku terbuka, dan musik mulai berputar.

### 12.3 Navigasi Terapung Bawah (Bottom Navigation Bar)
- **Tujuan & Fungsi**: Memudahkan tamu melompat langsung ke seksi yang diinginkan pada undangan panjang di ponsel.
- **Menu Bar**: Home (Cover), Mempelai (Couple), Acara (Jadwal & Lokasi), Galeri, RSVP / Ucapan, Hadiah (Amplop).

---

## 13. Day-of Reception & Catering Calculator

### 13.1 Meja Resepsionis / Check-in Tamu
- **Tujuan & Fungsi**: Alat operasional panitia pada hari-H untuk mencatat tamu yang telah tiba di lokasi secara cepat.
- **User Interaction**: Petugas resepsionis membuka `/dashboard/undangan/[id]/day`, mencari nama tamu di kolom pencarian, lalu menekan tombol toggle "Tandai hadir" / "Batalkan".
- **Data yang Disimpan**: Pada frontend saat ini, status check-in dikelola secara lokal pada state komponen React (`const [checkedIn, setCheckedIn] = useState<Record<string, boolean>>({})`) tanpa persistensi permanen. Untuk backend CI4, direkomendasikan dipersistensikan pada kolom `is_checked_in = 1, checked_in_at = NOW()` di tabel `invitation_guests`.
- **Kebutuhan API (Backend Baru)**: `PATCH /api/v1/invitations/:id/guests/:guestId/check-in`.
- **Ownership & Permission**: Pemilik undangan atau staf resepsi terotorisasi.

### 13.2 Kalkulator Estimasi Katering
- **Tujuan & Fungsi**: Menghitung kebutuhan porsi makanan katering secara akurat berdasarkan total pax dari konfirmasi hadir RSVP ditambah faktor keamanan (*safety buffer*).
- **Formula Bisnis yang Digunakan**:
  - `Total Pax Hadir` = $\sum \text{pax tamu berstatus HADIR}$
  - `Porsi Rekomendasi` = $\text{Total Pax Hadir} \times \text{Buffer (1.00, 1.10, 1.15, atau 1.25)}$
  - `Porsi Prasmanan (Buffet 60%)` = $\text{Porsi Rekomendasi} \times 0.60$
  - `Porsi Gubukan / Food Stall (40%)` = $\text{Porsi Rekomendasi} \times 0.40$
- **Kebutuhan Database**: Diturunkan (*derived*) dari query agregasi tabel `invitation_rsvps`.

---

## 14. Monetization, Orders & Perpetual Licences

### 14.1 Model Bisnis Beli-per-Template (Purchase-per-Template)
- **Prinsip Utama**:
  - Pengguna membayar **satu kali per template untuk satu undangan**.
  - Lisensi yang diterbitkan bersifat **permanen / seumur hidup (perpetual)** untuk undangan tersebut.
  - **TIDAK ada masa aktif kedaluwarsa (no expiry date)**, tidak ada tagihan bulanan berulang, dan tidak ada penguncian publikasi karena berlalunya tanggal acara.
- **Master Harga Template**:
  - `boho-botanical` : Rp 0 (Free selamanya)
  - `modern-minimalist` : Rp 49.000
  - `tropical-beach` : Rp 49.000
  - `luxury-islamic` : Rp 79.000
  - `misty-mountain` : Rp 49.000
  - `royal-maroon` : Rp 79.000
  - `pawiwahan-agung` : Rp 89.000
  - `pawiwahan-pethak` : Rp 89.000

### 14.2 Alur Checkout & Aktivasi Lisensi
- **User Interaction**: Dari Studio Desain atau Katalog, pengguna memilih template berbayar, diarahkan ke `/checkout?template=[id]&undangan=[invId]`, memilih metode pembayaran (`qris`, `bank-transfer`, `ewallet`), dan menekan tombol Bayar. Frontend mensimulasikan penyelesaian gateway instan (delay 900ms) dan menerbitkan lisensi permanen secara langsung. *(Catatan: Pada frontend saat ini tidak ada formulir unggah bukti transfer `proofFile`; transaksi langsung berstatus `paid`).*
- **Input Data**: `templateId`, `invitationId`, `method`, `amount`.
- **Output Data**: Objek pesanan (`Order`) dengan status `paid`, kode referensi nota unik `IM-XXXX-XXXX`, dan penerbitan `TemplateLicence` berstatus `perpetual`.
- **Skenario Penggantian Template (Template Switching Matrix)**:
  1. *Free -> Free*: Pengguna bebas berganti antar-template gratis tanpa biaya dan langsung siap tayang.
  2. *Free -> Paid*: Status undangan menjadi "Belum Dibeli", publikasi diblokir sampai lisensi template berbayar dibeli.
  3. *Paid -> Free*: Pengguna bebas beralih ke template gratis; catatan lisensi berbayar sebelumnya tetap aman tersimpan di database.
  4. *Paid -> different Paid*: Berganti ke template berbayar lain yang belum pernah dibeli mewajibkan pembelian lisensi baru untuk template tersebut.
  5. *Kembali ke Paid yang Sudah Pernah Dibeli*: Sistem mendeteksi `template_licences` yang sudah ada untuk kombinasi `(invitation_id, template_id)`, dan undangan langsung aktif/siap tayang tanpa perlu membayar ulang!
- **Data yang Disimpan**:
  - Row baru pada tabel `orders` (`id`, `user_id`, `invitation_id`, `template_id`, `amount`, `status`, `reference`, `method`, `paid_at`).
  - Row baru pada tabel `template_licences` (`id`, `invitation_id`, `template_id`, `order_id`, `kind: perpetual`, `issued_at`).
- **Kebutuhan API**:
  - `POST /api/v1/orders/checkout` (membuat pesanan dan memproses lisensi)
  - `GET /api/v1/orders` (riwayat pesanan pengguna)
  - `GET /api/v1/orders/:id` (detail pesanan)
  - `GET /api/v1/licences` (daftar lisensi aktif)
- **Ownership & Permission**: Pemilik akun.

### 14.3 Halaman Pesanan & Lisensi (`/dashboard/orders`)
- **Tujuan & Fungsi**: Menampilkan riwayat transaksi lengkap, status pembayaran (`Menunggu Pembayaran`, `Menunggu Verifikasi`, `Lunas`), nomor referensi bukti transaksi, dan kartu rekap total pengeluaran belanja akun.
- **User Interaction**: Halaman `/dashboard/orders`.
- **Kebutuhan API**: `GET /api/v1/orders`.
- **Ownership & Permission**: Pemilik akun.

---

## 15. Analytics & Statistics

### 15.1 Statistik Undangan & Pengunjung
- **Tujuan & Fungsi**: Memberikan wawasan performa kepada pemilik undangan mengenai interaksi tamu.
- **Metrik**: Total kunjungan halaman (*page views*), pengunjung unik (*unique visitors*), rasio konfirmasi kehadiran (*attendance rate*), rincian perangkat (*device breakdown*: mobile vs desktop), dan sisa hari menuju acara.
- **Data yang Disimpan**: Tabel `invitation_visitor_logs` dan tabel agregat harian `invitation_stats_daily`.
- **Kebutuhan API**: `GET /api/v1/invitations/:id/stats`.
- **Ownership & Permission**: Pemilik undangan.

---

## 16. Matriks Ringkasan Fitur & Hak Akses

| Fitur | Kategori Entitas | Level Kepemilikan | Endpoint Utama | Autentikasi |
|---|---|---|---|---|
| Register / Login | Identitas Akun | Global / User | `POST /auth/register`, `POST /auth/login` | Publik |
| Sesi Akun (`/auth/me`) | Akun Pribadi | User-owned | `GET /auth/me` | Bearer Token |
| Ringkasan Konsol | Dashboard | User-owned | `GET /dashboard/summary` | Bearer Token |
| Buat Undangan | Undangan | User-owned | `POST /invitations` | Bearer Token |
| Toggle Publish | Undangan | User-owned | `PATCH /invitations/:id/publish` | Bearer Token + Licence Guard |
| Edit Konten (7 Tab) | Konten Undangan | Invitation-owned | `PUT /invitations/:id/[section]` | Bearer Token + Owner Guard |
| Jadwal Acara (Tab Acara) | Rangkaian Acara | Invitation-owned | `POST/PUT/DELETE /invitations/:id/events` | Bearer Token + Owner Guard |
| Live Streaming [Proposed] | Siaran Langsung | Invitation-owned | `PUT /invitations/:id/streaming` (Opsional/Masa Depan) | Bearer Token + Owner Guard |
| Upload Media | Aset File | Invitation-owned | `POST /invitations/:id/upload/[type]`| Bearer Token + Owner Guard |
| Daftar Tamu & WA | Tamu | Invitation-owned | `GET/POST /invitations/:id/guests` | Bearer Token + Owner Guard |
| Rekap RSVP & Ekspor | Kehadiran | Invitation-owned | `GET /invitations/:id/rsvps`, `GET /export` | Bearer Token + Owner Guard |
| Checkout & Lisensi | Transaksi | User & Invitation | `POST /orders/checkout` | Bearer Token |
| Buka Undangan Tamu | Tampilan Publik | Public / Read-Only | `GET /public/invitations/:slug` | Publik (Rate Limited) |
| Baca Doa/Ucapan Tamu | Tampilan Publik | Public / Read-Only | `GET /public/invitations/:slug/wishes` | Publik (Rate Limited) |
| Kirim RSVP Publik | Kehadiran | Public submission | `POST /public/invitations/:slug/rsvp`| Publik (Rate Limited) |
| Check-in Hari-H | Operasional | Invitation-owned | `PATCH /invitations/:id/guests/:id/check-in` (Local state di FE) | Bearer Token + Owner Guard |

